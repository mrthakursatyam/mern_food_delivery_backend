import foodModel  from "../models/foodModel.js"
import fs from 'fs'

//add food item
const addFood = async(req, res) => {
    const img_filename = `${req.file.filename}` || `${req.file}`

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: img_filename,
    })

    try{
        await food.save()
        res.json({success: true, message: "Food Added"})
    }
    catch(error){
        console.log(error)
        res.json({success: true, message: "Error"})
    }
}

const listFood = async(req, res) => {
    try{
        const foods = await foodModel.find()
        res.json({success: true, data: foods})
    }
    catch(error)
    {
        res.json({success: false, data: error})
    }
}

const removeFood = async(req, res) => {
    const id = req.query.id || req.params.id
    console.log("backend id:-"+id);
    try{
        const food = await foodModel.findById(id)
        fs.unlink(`uploads/${food.image}`, () => { console.log("Image Deleted")})
        await foodModel.findByIdAndDelete(id)
        res.json({success: true, message: 'Food Item Deleted'})
    }
    catch(error)
    {
        console.log(error);
        res.json({success: false, message: 'Error'})
    }
}

export {addFood, listFood, removeFood}