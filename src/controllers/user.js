import User from '*/models/User'
import Post from "*/models/Post";
import CryptoJS from "crypto-js";

import { env } from '*/configs/environment'

export const getUserById = async (req,res) => {
    const userId = req.params.id
    try {
        const user = await User.findById(userId).where('_destroy').equals(false)

        const {password, _destroy, ...info} = user._doc

        res.status(200).json(info)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const getAllUser = async (req, res) => {
    try {
        const users = await User.find()

        if (users.length !== 0) {
            const newUsers = []

            users.map((value) => {
                const { password, ...user } = value._doc
                newUsers.push(user)
            })

            res.status(200).json(newUsers)
        } else {
            res.status(200).json(users)
        }

    } catch (err) {
        res.status(500).json(err)
    }
}

export const updatedUser = async (req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(req.body.password, env.SECRET_KEY).toString()
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(req.body.userId, {
                $set: {...req.body, profilePic: req.body.profilePic ? `${env.IMAGE_URL}` + req.body.profilePic : req.body.profilePic}
            }, { new: true })

            res.status(200).json(updatedUser)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(401).json("You can update only your account!")
    }
}

export const deletedUser = async (req, res) => {
    if (req.body.userId === req.params.id) {

        try {
            const user = await User.findById(req.body.userId)

            if (user._destroy) {
                res.status(404).json("User not found!")
            } else {
                try {
                    await Post.updateMany({username: user.username}, {_destroy: true})
                    await User.findByIdAndUpdate(req.body.userId, {
                        $set: {
                            _destroy: true
                        }
                    }, { new: true })

                    res.status(200).json("User has been deleted")
                } catch (err) {
                    res.status(500).json(err)
                }
            }
        } catch (err) {
            res.status(404).json("User not found!")
        }
    } else {
        res.status(401).json("You can delete only your account!")
    }
}