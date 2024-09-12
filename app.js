const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express();
const connectDb = require('./db/db')
const userRouter = require('./routes/router')
const blogRouter = require('./routes/blog.routes')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const session = require('express-session')
const MongoStore = require('connect-mongo')

connectDb()

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false
})



app.use(limiter)
app.use(helmet())

app.use(express.json())

app.use(
    session({
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7
        },
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET
    })
)

app.use('/api/v2/user', userRouter)
app.use('/api/v2/blog', blogRouter)

app.all('*', (req, res) => {
    return res
    .status(404)
    .json({ message: `The resource with the url ::: ${req.originalUrl} does not exist`})
})


const port = process.env.PORT

app.listen(port, () => console.log(`Listening for requests on port ${port}`))

//jboy@gmail.com
//kakana99a