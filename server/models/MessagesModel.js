import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

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
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file";
        },
        validate: {
            validator: function (v) {
                return this.messageType !== "file" || /^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|tiff|webp|svg|ico|heic|heif|pdf|mp4|zip|mp3)$/.test(v);
            },
            message: "Invalid URL format for file!",
        },
    },
    fileType: {
        type: String,
        required: function () {
            return this.messageType === "file";
        }
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, {
    toJSON: { getters: true },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
