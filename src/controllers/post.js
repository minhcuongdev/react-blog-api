import Post from "../models/Post";
import { env } from "../configs/environment";

export const getPostById =  async (req,res) => {
    const postId = req.params.id
    try {
        const post = await Post.findById(postId).where('_destroy').equals(false)

        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const getPosts = async (req,res) => {
    const userName = req.query.user;
    const categoryName = req.query.category;

    try {
        let posts;

        if(userName) 
        {
            posts = await Post.find({username: userName}).where("_destroy").equals(false)
        } else if(categoryName) {
            posts = await Post.find({categories: {
                $in: [categoryName]
            }}).where("_destroy").equals(false)
        } else 
        {
            posts = await Post.find().where("_destroy").equals(false)
        }

        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const createdPost = async (req, res) => {

    try {
        const newPost = new Post({
            title: req.body.title,
            desc: req.body.desc,
            photo: req.body.photo ?  `${env.IMAGE_URL}` + req.body.photo : req.body.photo,
            username: req.body.username
        })

        const post = await newPost.save()
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const updatedPost = async (req, res) => {
    const postId = req.params.id
    try {
        const post = await Post.findById(postId).where("_destroy").equals(false)

        if (!post)
            res.status(404).json("Post not exist")
        else {
            if (post.username === req.body.username) {
                try {
                    const updatedPost = await Post.findByIdAndUpdate(postId, {
                        $set: {
                            title: req.body.title,
                            desc: req.body.desc,
                            photo: req.body.photo ?  `${env.IMAGE_URL}` + req.body.photo : req.body.photo
                        }
                    }, {new: true})
                    res.status(200).json(updatedPost)
                } catch (err) {
                    res.status(500).json(err)
                }
            } else res.status(401).json("You only update your post")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

export const deletePost = async (req, res) => {
    const postId = req.params.id
    try {
        const post = await Post.findById(postId).where("_destroy").equals(false)

        if (!post)
            res.status(404).json("Post not exist")
        else {
            console.log(req.body)
            if (post.username === req.body.username) {
                try {
                    await Post.findByIdAndUpdate(postId, {
                        $set: {
                            _destroy: true
                        }
                    }, {new: true})
                    res.status(200).json("Your post has been delete....")
                } catch (err) {
                    res.status(500).json(err)
                }
            } else res.status(401).json("You only delete your post")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}
