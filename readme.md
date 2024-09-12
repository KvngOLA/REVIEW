## How to create NodeJs Application using Session, ExpresJS, Connect-Mongo, Mongoose and Mongodb

### Step 1: Create a new NodeJs Application
```bash
npm init -y
```

### Step 2: Install ExpressJS and other dependencies
```bash
npm i express express-session connect-mongo mongoose
```

### Step 3: Create a new file named `app.js` and add the following code
```javascript
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const session = require("express-session");
const connectdb = require("../db/db");
const MongoStore = require("connect-mongo");
const userRouter = require("../routes/user");

const app = express();

// body parser
app.use(express.json());

//session middleware
app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  })
);

// mongodb connection
connectdb();

// mounted routes
app.use(userRouter);

// declared our port
const port = process.env.PORT || 8989;

// listen to a port and run our server
app.listen(port, () => console.log("server running on port " + port));

```

### Step 4: Create a new file named `db.js` and add the following code
```javascript
const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectdb;
```

### Step 5: Create a new file named `routes/user.js` and add the following code
```javascript
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../model/user.model");
const sessionModel = require("../model/session.model");

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userExist = await userModel.findOne({ email });
    if (userExist) return res.sendStatus(409); /// conflct status code

    const newUser = new userModel({
      email,
      password: await bcrypt.hash(password, 12),
      name,
    });

    const savedUser = await newUser.save();
    // delete savedUser.password;
    res.send(savedUser);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExist = await userModel.findOne({ email });
    if (!userExist) return res.sendStatus(404);

    const passwordValid = await bcrypt.compare(password, userExist.password);
    if (!passwordValid) return res.sendStatus(400);

    //delete existing session -> reverse engineering
    await sessionModel.deleteOne({ "session.user.id": userExist._id.toString() });

    req.session.user = {
      id: userExist._id.toString(), // ObjectId("98765432345678")  ===> "98765432345678"
      name: userExist.name,
      email: userExist.email,
    };

    return res.status(200).json({ message: "logged in", userExist });
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get("/me", async (req, res) => {
  //me or profiles
  try {
    const userSession = req.session.user;

    if (!userSession || userSession == "")
      return res.status(401).json({ message: "please login to continue" });

    const userExist = await userModel.findById({ _id: userSession.id });
    return res.status(200).json({ message: "logged in", userExist });
  } catch (error) {
    console.log({ error });
    return res.sendStatus(500);
  }
});

router.get("/logout", async (req, res) => {
  //me or profiles
  try {
    const destroySession = req.session.destroy();
    console.log({ destroySession });
    if (!destroySession)
      return res.status(400).json({ message: "something bad happened" });
    res.clearCookie("connect.sid"); // Clear the session cookie
    return res.send({ message: "user loggged out" });
  } catch (error) {
    console.log({ error });
    return res.sendStatus(500);
  }
});

module.exports = router;
```

### Step 6: Create a new file named `model/user.model.js` and add the following code
```javascript
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;


const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema(
  {
    expires: { type: Date },
    session: {type: Object},
  },
  {
    timestamps: true,
  }
);

const sessionModel = mongoose.model("session", sessionSchema);
module.exports = sessionModel;

```

### Step 7: Create a new file named `.env` and add the following code
```bash
MONGO_URI=mongodb://localhost:27017/session
SESSION_SECRET=kjyhgreghjkhgfdsfghjk
PORT=8989
```

### Step 8: Configure your package.json file
```json
{
  "name": "session",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "connect-mongo": "^4.4.1",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "express-session": "^1.17.2",
    "mongoose": "^6.0.7"
  }
}
```

### Step 9: Run your application
```bash
npm run dev
```

### Step 10: Test your application using Postman
```bash
POST: http://localhost:8989/signup
{
    "email": "a@c.com",
    "password": "123456",
    "name": "A"
}
```