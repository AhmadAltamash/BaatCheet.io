import pkg from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Update profile details
export const updateProfile = async (req, res) => {
    try {
        const { userId } = req;
        const { firstname, lastname, color } = req.body;

        if (!firstname || !lastname) {
            return res.status(400).json({ message: "First name and last name are required." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstname, lastname, color, profileSetup: true },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            email: updatedUser.email,
            id: updatedUser.id,
            firstname: updatedUser.firstname,
            lastname: updatedUser.lastname,
            image: updatedUser.image,
            profileSetup: updatedUser.profileSetup,
            color: updatedUser.color
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

// Add profile image
export const addProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File is required." });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "chat-app/profiles",
        });

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { image: result.secure_url },
            { new: true, runValidators: true }
        );

        res.status(200).json({ image: updatedUser.image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding profile image", error: error.message });
    }
};

// Remove profile image
export const removeProfileImage = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.image) {
            const publicId = user.image.split("/").pop().split(".")[0]; // Extract Cloudinary public_id
            await cloudinary.uploader.destroy(`chat-app/profiles/${publicId}`);
        }

        user.image = null;
        await user.save();

        res.status(200).json({ message: "Profile image removed successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing profile image", error: error.message });
    }
};


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
            httpOnly: true,                   
            secure: process.env.NODE_ENV === "production", 
            sameSite: 'None',          
            maxAge: maxAge           
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
