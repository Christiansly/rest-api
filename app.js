const express = require("express");
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const app = express();
const authRoutes = require("./routes/auth");
const statusRoutes = require("./routes/status");
const { Socket } = require("socket.io");
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers')
const auth = require('./middleware/is-auth')

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }
  next();
});
app.use(auth)
app.put('/post-image', (req, res, next) => {
  if(!req.isAuth) {
    throw new Error('Not authenticated')
  }
  if(!req.file) {
    return res.status(200).json({message: "No file provided!"})
  }
  if(req.body.oldPath) {
    clearImage(req.body.oldPath)
  }
  console.log("file path",req.file.path)
  return res.status(200).json({message: "File Stored successfully", filePath: req.file.path})
})

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
  formatError(err) {
    if (!err.originalError) {
      return err;
    }
    const data = err.originalError.data
    const message = err.message || 'An error occured'
    const code = err.originalError.code || 500
    return {message: message, status: code, data: data}
  }
}))
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.use("/status", statusRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});
mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.qfbbp.mongodb.net/feed?retryWrites=true&w=majority"
  )
  .then(() => {
   app.listen(8080);
    console.log('Connected')
  })
  .catch((err) => console.log(err));
// app.listen(8090)
