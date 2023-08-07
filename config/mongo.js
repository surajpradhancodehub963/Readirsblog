const mongoose=require("mongoose");
require('dotenv').config();

const connectDatabase=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
    }catch(error){
        console.log(error);
    }
}

const subscriberSchema=new mongoose.Schema({
    fullname:String,
    email:String
});

const Subscriber=mongoose.model("Subscriber",subscriberSchema);

const blogSchema=new mongoose.Schema({
    fullname:String,
    email:String,
    blogTittle:String,
    blogtext:String,
    blogPhoto:String
});

const Blog=mongoose.model("Blog",blogSchema)

module.exports={
    connectDatabase:connectDatabase,
    Subscriber:Subscriber,
    Blog:Blog
}