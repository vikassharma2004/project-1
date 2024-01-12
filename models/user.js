

const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const passportlocalmoongoose=require("passport-local-mongoose")

const userSchema=new Schema({
 email:{
    type:String,
    required:true
 }
})
userSchema.plugin(passportlocalmoongoose)

module.exports=mongoose.model("User",userSchema  );