const express = require("express");
const bodyParser = require("body-parser");
const path = require("node:path");
const { connectDatabase, Subscriber, Blog } = require("./config/mongo");
const multer = require("multer");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// creating multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Connecting to the Database
connectDatabase();

// Setting multer storage
const upload = multer({ storage: storage });

// Home Route Handling
app.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.status(200).render("index", {
      data: blogs.slice(0,8)
    });
  } catch (error) {
    console.log(error);
  }
});
app.get("/sucessfullsubmit", (req, res) => {
  res.status(200).render("sucessfullsubmit");
});
app.post("/subscribe", async (req, res) => {
  try {
    const subscriber = new Subscriber({
      fullname: req.body.fullname,
      email: req.body.email,
    });

    await subscriber.save();
    res.redirect("/sucessfullsubmit");
  } catch (err) {
    console.log(error);
  }
});

// allblogposts Route
app.get("/allblogs", async (req, res) => {
    try{
        const allblogs=await Blog.find({});
        res.status(200).render("allblogs",{
            data:allblogs
        });
    }catch(error){
        console.log(error);
    }
});

// addblogs Route handling
app.get("/addblog", (req, res) => {
  res.status(200).render("createblog");
});
app.post("/addblog", upload.single("blogPhoto"), async (req, res) => {
  try {
    let blog = new Blog({
      fullname: req.body.fullname,
      email: req.body.email,
      blogTittle: req.body.blogTittle,
      blogtext: req.body.blogtext,
      blogPhoto: req.file.filename,
    });

    await blog.save();
    res.redirect("/sucessfullsubmit");
  } catch (error) {
    console.log(error);
  }
});

// Singleblog Route handling
app.get("/single/:blogid", async (req, res) => {
  let blogId = req.params.blogid;
  const blog = await Blog.findById(blogId).exec();
  res.status(200).render("singleblog", {
    writer: blog.fullname,
    tittle: blog.blogTittle,
    blogtext: blog.blogtext,
    photo: blog.blogPhoto,
  });
});

const port = process.env.PORT || 4004;

app.listen(port, () => {
  console.log("The app is running at http://localhost:4004");
});
