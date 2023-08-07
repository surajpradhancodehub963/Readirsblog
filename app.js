const express=require('express');
const bodyParser = require('body-parser');

const app=express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));

app.get("/",(req,res)=>{
    res.status(200).render("index")
});

app.get("/allblogs",(req,res)=>{
    res.status(200).render("allblogs");
});

app.get("/addblog",(req,res)=>{
    res.status(200).render("createblog");
});

app.get("/single/:blogno",(req,res)=>{
    res.status(200).render("singleblog");
})

const port=process.env.PORT || 4004;

app.listen(port,()=>{
    console.log("The app is running at http://localhost:4004");
});
