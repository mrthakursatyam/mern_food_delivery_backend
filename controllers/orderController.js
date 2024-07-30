import Razorpay from 'razorpay';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
const BASE_URL = process.env.BASE_URL

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const placeOrder = async (req, res) => {
  const frontend_url = BASE_URL;

  try {
    const { userId, items = [] , amount, address } = req.body;

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });
    await newOrder.save();

    // Clear the user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay accepts amount in paise
      currency: 'INR',
      receipt: newOrder._id.toString(),
      payment_capture: 1, // Auto capture
    };

    const order = await razorpay.orders.create(options);

    // Send back the Razorpay order ID
    res.json({
      success: true,
      orderId: order.id,
      frontend_url: `${frontend_url}/verify?orderId=${newOrder._id}`, // URL to redirect after payment
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//this not a perfect way of verification, use webhooks
const verifyOrder = async(req, res) => {
  const {orderId, success} = req.body

  try{
    if(success == 'true'){
      await orderModel.findByIdAndUpdate(orderId, {payment: true})
      res.json({success:true, message:"paid"})
    }
    else{
      await orderModel.findByIdAndDelete(orderId)
      res.json({success:false, message:"Not paid"})
    }
  }
  catch(error){
    console.log(error.message);
    res.json({success:false, message:error.message})
  }
}

//A particular user order
const userOrders = async(req, res) => {
  try{
    const orders = await orderModel.find({userId: req.body.userId})
    res.json({success:true, data:orders}) 
  }
  catch(error){
    res.json({success:false, message:error.message})
  }
}

//list all user orders
const listOrders = async(req, res) => {
  try{
    const orders = await orderModel.find({})
    res.json({success:true, data:orders})
  }
  catch(error){
    res.json({success:false, message:error.message})
  }
}

//order status update
const updateStatus = async(req, res) => {
  try{
    const response = await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status})
    res.json({success:true, message:"status updated"})
  }
  catch(error){
    res.json({success:false, message:error.message})
  }
}

export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus};


