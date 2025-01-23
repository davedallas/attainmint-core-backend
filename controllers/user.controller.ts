const User = require("./../models/user.model")
import { errorHandler } from "../utils/errorHandler"
import dotenv from "dotenv"
import { Request , Response , NextFunction } from "express";
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken");

dotenv.config()

export const signup = async (req:Request, res:Response, next:NextFunction) =>{
    const {email, name, password} = req.body
    if(!email || !name || !password){
        next(errorHandler(400 , "unAuthorized"))
    }
    if(name.length > 45){
        next(errorHandler(400 , "Name is too long")) 
    }
    if(email.length > 45){
        next(errorHandler(400 , "Email is too long"))
    }


    const hashedPassword = bcryptjs.hashSync(password, 10);
    const user = new User({name, email, password: hashedPassword});

    try {
        await user.save()
        res.json("User signed up successfully")
    } catch(err : any) {
        next(err)
    }    
}

export const login = async (req:Request, res:Response, next:NextFunction) =>{
    const {email, password} = req.body
    if(!email || !password){
        return next(errorHandler(401 , "unAuthorized"))
    }
    try {
        const validUser = await User.findOne({email})
        if(!validUser){
            return next(errorHandler(401 , "User not found"))
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword){
            return next(errorHandler(401 , "Invalid Password"))
        }

        console.log("validPassword----->",validPassword)

        const {password:_ , ...rest} = validUser.toObject()
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET!)
        res
            .status(200)
            .cookie("access_token", token , {httpOnly: true })
            .json({rest})
    } catch(err){
        next(err)
    }
};

export const google = async (req:Request, res:Response, next:NextFunction) =>{

}