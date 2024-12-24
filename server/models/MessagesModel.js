import mongoose from "mongoose";

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
        enum: ["text","file"],
        required: true,
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text"
        },
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file"
        }
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model("Messages", messageSchema);
export default Message;

// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// const messageSchema = new mongoose.Schema({
//     sender: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
//     recipient: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: false,
//     },
//     messageType: {
//         type: String,
//         enum: ["text", "file"],
//         required: true,
//     },
//     content: {
//         type: String,
//         required: function () {
//             return this.messageType === "text";
//         },
//     },
//     fileUrl: {
//         type: String,
//         required: function () {
//             return this.messageType === "file";
//         },
//         validate: {
//             validator: function (v) {
//                 return this.messageType !== "file" || /^(ftp|http|https):\/\/[^ "\n]+$/.test(v);
//             },
//             message: "Invalid URL format for file!",
//         },
//     },    
//     timestamp: {
//         type: Date,
//         default: Date.now,
//     },
// }, {
//     toJSON: { getters: true },
// });

// const Message = mongoose.model("Messages", messageSchema);

// export default Message;
