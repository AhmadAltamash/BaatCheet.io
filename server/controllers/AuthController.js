import pkg from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";

const { sign } = pkg
const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email,userId) => {
    return sign({email,userId}, process.env.JWT_KEY, { expiresIn: maxAge })
}

export const signup = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Email and password are required."});
        }

        const user = await User.create({email, password});

        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None"
        })
        return res.status(201).json({ user: {
            email: user.email,
            id: user.id,
            // firstName: user.firstname,
            // lastName: user.lastname,
            // image: user.image,
            profileSetup: user.profileSetup
        }})
    } catch (error) {
        console.log({error});
        return res.status(500).json({message: "Error signing up user", error: error.message})
    }
}

export const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Email and password are required."});
        }

        const user = await User.findOne({ email });

        if(!user){
            return res.status(401).json({message: "Email not found. Please signup."});
        }

        const auth = await compare(password, user.password)
        if(!auth){
            return res.status(401).json({message: "Invalid password."});
        }

        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None"
        })
        return res.status(200).json({ user: {
            email: user.email,
            id: user.id,
            firstName: user.firstname,
            lastName: user.lastname,
            image: user.image,
            profileSetup: user.profileSetup,
            color: user.color
        }})
    } catch (error) {
        console.log({error});
        return res.status(500).json({message: "Error signing up user", error: error.message})
    }
}

export const getUserInfo = async (req, res, next) => {
    try {
        const userData = await User.findById(req.userId);
        if(!userData) {
            return res.status(404).json({message: "User not found."});
        }
        return res.status(200).json({
            email: userData.email,
            id: userData.id,
            firstName: userData.firstname,
            lastName: userData.lastname,
            image: userData.image,
            profileSetup: userData.profileSetup,
            color: userData.color
        })
    } catch (error) {
        console.log({error});
        return res.status(500).json({message: "Error signing up user", error: error.message})
    }
}