// import { genSalt, hash } from "bcrypt";
// import mongoose from "mongoose";
// import { type } from "server/reply";

// const messageSchema = new mongoose.Schema({
//     sender: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Users",
//         required: true,
//     },
//     recipient: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Users",
//         required: false,
//     },
//     messageType: {
//         type: String,
//         enum: ["text","file"],
//         required: true,
//     },
//     content: {
//         type: String,
//         required: function () {
//             return this.messageType === "text"
//         },
//     },
//     fileUrl: {
//         type: String,
//         required: function () {
//             return this.messageType === "file"
//         }
//     },
//     timestamp: {
//         type: Date,
//         default: Date.now,
//     },
// });

// messageSchema.pre("save", async function(next){
//     const salt = await genSalt();
//     this.messageType = await hash(this.messageType, salt);
//     next();
// });

// const Message = mongoose.model("Messages", messageSchema);


import mongoose from "mongoose";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  console.error("SECRET_KEY is not defined.");
}

function encrypt(text) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return JSON.stringify({
        iv: iv.toString(CryptoJS.enc.Hex),
        ciphertext: encrypted.toString(),
    });
}

function decrypt(encryptedText) {
    try {
        const data = JSON.parse(encryptedText);
        const iv = CryptoJS.enc.Hex.parse(data.iv);
        const decrypted = CryptoJS.AES.decrypt(data.ciphertext, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption error:", error);
        return null; 
    }
}


const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true,
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text";
        },
        get: decrypt,
        set: encrypt,
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file";
        },
        validate: {
            validator: function (v) {
                return this.messageType !== "file" || /^(ftp|http|https):\/\/[^ "\n]+$/.test(v);
            },
            message: "Invalid URL format for file!",
        },
        get: decrypt,
        set: encrypt,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, {
    toJSON: { getters: true },
});

const Message = mongoose.model("Messages", messageSchema);

export default Message;
