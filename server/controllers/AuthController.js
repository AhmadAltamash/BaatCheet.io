import pkg from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from 'fs'

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
            httpOnly: true,                  
            secure: process.env.NODE_ENV === "production", 
            sameSite: 'None',                 
            maxAge: maxAge                 
        });
                  
        return res.status(201).json({ user: {
            email: user.email,
            id: user.id,
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
            httpOnly: true,                   // Prevent access via JavaScript
            secure: process.env.NODE_ENV === "production", // Use Secure flag only in production
            sameSite: 'None',                 // Allow cross-origin cookies
            maxAge: maxAge                    // Cookie expiration
        });
        
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

export const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req;
        const { firstname, lastname, color } = req.body;

        if (!firstname || !lastname) {
            return res.status(400).json({ message: "First name, last name, and color are required." });
        }

        const userData = await User.findByIdAndUpdate(userId, {
            firstname, lastname, color, profileSetup: true
        }, { new: true, runValidators: true });

        return res.status(200).json({
            email: userData.email,
            id: userData.id,
            firstname: userData.firstname,
            lastname: userData.lastname,
            image: userData.image,
            profileSetup: userData.profileSetup,
            color: userData.color
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};
export const addProfileImage = async (req, res, next) => {
    try {
        if(!req.file) {
            return res.status(400).json({ message: "File is required" });
        }

        const date = Date.now();
        let fileName = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path, fileName)

        const updatedUser = await User.findByIdAndUpdate(req.userId, {image: fileName}, { new: true, runValidators: true })

        return res.status(200).json({
            image: updatedUser.image,
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};


export const removeProfileImage = async (req, res, next) => {
    try {
        const { userId } = req;
        
        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).send("User not Found");
        }

        if(user.image) {
            unlinkSync(user.image)
        }

        user.image = null;

        await user.save();

        return res.status(200).send("Profile image removed successfully")
    } catch (error) {
        console.log({ error });
        return res.status(500).json({ message: "Error removing profile", error: error.message });
    }
};

export const logout = async (req, res, next) => {
    try {
        res.cookie("jwt", "invalid-token", { 
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'None',
            maxAge: 1 
        });
        return res.status(200).send("Log out Successfull")
    } catch (error) {
        console.log({ error });
        return res.status(500).json({ message: "Could Not Log out", error: error.message });
    }
};
