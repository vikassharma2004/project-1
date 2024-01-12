const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const review=require("./reviews.js")
// creating schema 

const listingSchema=new Schema({
    title:{
        type:String,
    required:true,
},
    description:String,
    image:
    {
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});


listingSchema.post("findOneAndDelete",async(listing)=>{
if(listing){
  await review.deleteMany({_id: {$in:listing.reviews}});     // agr listing dlete krte hai toh find kro agr ye id listing .reviews ke array me hai oth un sb ko dlete kr do
}
});
// model creationn OR WE CAN SAY TABLES IN SQL

const Listing=mongoose.model("listing",listingSchema);

// exporting Schema

module.exports=Listing;