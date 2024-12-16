import pkg from "jsonwebtoken";
import User from "../models/UserModel.js";

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
        return response.status(201).json({ user: {
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