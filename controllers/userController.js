import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'


const loginUser = async(req, res) => {
    const {email, password} = req.body

    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false, message:"Account not exist! first create an account"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success:false, message:"Wrong password!"})
        }

        const token = createToken(user._id)
        res.json({success:true, token})
    }
    catch(err){
        console.log(err)
        res.json({success:false, message: err.message})
    }
}

const createToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET)
}

const registerUser = async(req, res) => {
    const {name, email, password} = req.body

    try{
        // checking is user already exist
        const exists = await userModel.findOne({email})

        if(exists){
            return res.json({success:false, message:"user account already exists"})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false, message:"please enter a valid email"})
        }

        if(password.length < 8){
            return res.json({success:false, message:"please enter a strong password"})
        }


        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true, token})
    }
    catch(err){
        res.json({success:false, messsage: err.message })
    }
}

export {loginUser, registerUser}