const mongoose=require("mongoose")
const newdata=require("./data.js");
const Listing=require("../models/listing.js")

main()
.then(()=>{
    console.log("connection sucess")
}).catch(err => console.log(err));
async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB=async ()=>{
    await Listing.deleteMany({});
  newdata.data=newdata.data.map((obj)=>({...obj,owner:"65956c3b56f397dccc9be62d"}));
    await Listing.insertMany(newdata.data);

    console.log("dta was initilized")
}


initDB();