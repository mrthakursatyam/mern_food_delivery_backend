import mongoose from 'mongoose';

const Connection = async() => {
    await mongoose.connect("mongodb+srv://mrthakursm:Mongodb%40123@cluster0.wv68kwj.mongodb.net/food_delivery_website?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {console.log("Database Connected");})
}

export default Connection