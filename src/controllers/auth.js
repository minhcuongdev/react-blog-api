import User from '*/models/User.js'
import CryptoJS from 'crypto-js';
import { env } from '*/configs/environment';
import jwt from 'jsonwebtoken';
import RefreshToken from '*/models/RefreshToken';

export const register = async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, env.SECRET_KEY).toString()
        })

        const user = await newUser.save();

        const { password, ...info } = user._doc

        res.status(201).json(info)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) return res.status(401).json("Wrong credentials !")
        if (user._destroy) return res.status(400).json("Account dose not exist")

        const bytes = CryptoJS.AES.decrypt(user.password, env.SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.password && res.status(401).json("Wrong credentials !")

        const { password, ...info } = user._doc;

        const accessToken = jwt.sign(info, env.SECRET_JWT_TOKEN, { expiresIn: '3d' });
        const refreshToken = jwt.sign(info, env.SECRET_REFRESH_JWT_TOKEN);

        const savedRefreshToken = new RefreshToken({ refreshToken })
        await savedRefreshToken.save()

        res.status(200).json({ ...info, accessToken, refreshToken })
    } catch (err) {
        res.status(500).json(err)
    }
}

export const logout = async (req, res) => {
    const refreshToken = req.body.refreshToken;

    try {
        const verifyRefreshToken = await RefreshToken.findOne({ refreshToken });

        if (verifyRefreshToken) {
            await RefreshToken.findByIdAndDelete(verifyRefreshToken.id)
            res.status(200).json("logout")
        } else {
            res.status(403).json("Refresh Token is not valid!")
        }
    } catch (error) {
        res.status(500).json(error)
    }

}

export const refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) return res.status(401).json("You are not authenticated!")

    try {
        const verifyRefreshToken = await RefreshToken.findOne({ refreshToken });

        if (verifyRefreshToken) {
            jwt.verify(refreshToken, env.SECRET_REFRESH_JWT_TOKEN, async (err, data) => {
                if (err) return res.status(403).json("Refresh Token is not valid!")

                const { iat, ...info } = data;

                const newAccessToken = jwt.sign(info, env.SECRET_JWT_TOKEN, { expiresIn: '3d' });
                const newRefreshToken = jwt.sign(info, env.SECRET_REFRESH_JWT_TOKEN);
                
                try {
                    await RefreshToken.findByIdAndDelete(verifyRefreshToken.id)
                    
                    const savedRefreshToken = new RefreshToken({ refreshToken: newRefreshToken })
                    await savedRefreshToken.save()

                    res.status(200).json({
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken
                    });
                } catch (error) {
                    res.status(500).json(error)
                }
            })
        } else {
            res.status(403).json("Refresh Token is not valid!")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}