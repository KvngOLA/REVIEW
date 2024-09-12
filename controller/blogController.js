const dotenv = require('dotenv')
dotenv.config();

const blogModel = require('../model/blog');



const createBlog = async(req, res) => {
    const { title, content } = req.body;
    const token = req.cookies['token']
    try{
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        if(!decodeToken) { 
            return res.status(401).json({ message: 'Please sign in'})
        }
        const newBlog = await blogModel.create({
            title,
            content,
            author: decodeToken.id
        })
        res.status(200).json({ message: newBlog})

    }catch(err) {
        console.log(err)
        res.status(404).json({ err: err.message })
    }
    
}

const viewBlog = async(req, res) => {
    try{
        const token = req.cookies['token']
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
            if(!decodeToken) {
                return res.status(401).json({ message: 'Please sign in'})
            }
            const decodedId = decodeToken.id
            const blogs = await blogModel.findOne({ author: decodedId })
            .populate({
                path: 'author',
                select: 'name'
            })
            return res.status(200).json({ message: 'Here are your blogs', blogs})
    }catch(err){
        console.log(err)
        res.status(404).json({ err: err.message })
    }
}

module.exports = {
    createBlog,
    viewBlog
}