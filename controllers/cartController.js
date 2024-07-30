import userModel from '../models/userModel.js'

const addToCart = async(req, res) => {
    try{
        const userData = await userModel.findById(req.body.userId) //userModel.findOne({_id:req.body.userId})
        const cartData = userData.cartData
        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId] = 1
        }
        else{
            cartData[req.body.itemId] += 1
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData})
        res.json({success:true, message:"Item is added to cart"})
    }
    catch(err){
        res.json({success:false, message:err.message})
    }
}

const removeFromCart = async(req, res) => {
    try{
        const userData = await userModel.findById(req.body.userId) //userModel.findOne({_id:req.body.userId})
        const cartData = userData.cartData

        if(cartData[req.body.itemId] > 0){
            cartData[req.body.itemId] -= 1
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData})
        res.json({success:true, message:"Item is removed from cart"})
    }
    catch(err){
        res.json({success:false, message:err.message})
    }
}

const getCart = async(req, res) => {
    try{
        const userData = await userModel.findById(req.body.userId) //userModel.findOne({_id:req.body.userId})
        const cartData = userData.cartData
        res.json({success:true, data:cartData})
    }
    catch(err){
        res.json({success:false, message:err.message})
    }
}

export {addToCart, removeFromCart, getCart}