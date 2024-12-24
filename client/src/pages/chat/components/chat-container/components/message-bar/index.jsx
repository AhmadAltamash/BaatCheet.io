import { useSocket } from '@/context/SocketContext'
import { useAppStore } from '@/store'
import EmojiPicker from 'emoji-picker-react'
import React, { useEffect, useRef, useState } from 'react'
import {GrAttachment} from 'react-icons/gr'
import { IoSend } from 'react-icons/io5'
import { RiEmojiStickerLine } from 'react-icons/ri'
const MessageBar = () => {
  
  const emojiRef = useRef("");
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
  const socket = useSocket();
  const [message, setMessage] = useState("")
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

  useEffect(() => {
    function handleClickOutside(event) {
      if(emojiRef.current && !emojiRef.current.contains(event.target)){
        setEmojiPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [emojiRef])

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  }

  const handleSendMessage = async () => {
    if(selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      })
    }
    setMessage("");
  }

  return (
    <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6'>
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input type='text' className='flex-1 p-5 bg-transparent focus:border-none focus:outline-none'
        placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)}/>
        <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
          <GrAttachment className='text-2xl'/>
        </button>
        {/* <input type='file'/> */}
        <div className="relative">
          <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={() => setEmojiPickerOpen(true)}>
            <RiEmojiStickerLine className='text-2xl'/>
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme='dark'
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button className='bg-[#8417ff] focus:border-none focus:outline-none focus:text-white duration-300 transition-all rounded-md flex items-center justify-center p-[1.20rem] hover:bg-[#741bda] focus:bg-[#741bda]' onClick={handleSendMessage}>
          <IoSend className='text-2xl'/>
        </button>
    </div>
  )
}

export default MessageBar
// import { useSocket } from '@/context/SocketContext';
// import { useAppStore } from '@/store';
// import EmojiPicker from 'emoji-picker-react';
// import React, { useEffect, useRef, useState } from 'react';
// import { GrAttachment } from 'react-icons/gr';
// import { IoSend } from 'react-icons/io5';
// import { RiEmojiStickerLine } from 'react-icons/ri';
// import CryptoJS from 'crypto-js';

// const MessageBar = () => {
//   const emojiRef = useRef("");
//   const { selectedChatType, selectedChatData, userInfo } = useAppStore();
//   const socket = useSocket();
//   const [message, setMessage] = useState("");
//   const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (emojiRef.current && !emojiRef.current.contains(event.target)) {
//         setEmojiPickerOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [emojiRef]);

//   const encryptMessage = (text) => {
//     const key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_SECRET_KEY);
//     const iv = CryptoJS.lib.WordArray.random(16);

//     const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key, {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7,
//     });
//     console.log("Encrypted Message:", encrypted);
//     return JSON.stringify({
//       iv: CryptoJS.enc.Hex.stringify(iv),
//       ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
//     });
//   };

//   const handleAddEmoji = (emoji) => {
//     setMessage((msg) => msg + emoji.emoji);
//     setEmojiPickerOpen(false);
//   };

//   const handleSendMessage = async () => {
//     if (selectedChatType === "contact") {
//       const encryptedMessage = encryptMessage(message);

//       console.log("Sending Encrypted Message:", encryptedMessage);

//       socket.emit("sendMessage", {
//         sender: userInfo.id,
//         content: encryptedMessage,
//         recipient: selectedChatData._id,
//         messageType: "text",
//         fileUrl: undefined,
//       });

//       setMessage("");
//     }
//   };

//   return (
//     <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
//       <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
//         <input
//           type="text"
//           className="flex-1 p-5 bg-transparent focus:border-none focus:outline-none"
//           placeholder="Type a message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
//           <GrAttachment className="text-2xl" />
//         </button>
//         <div className="relative">
//           <button
//             className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
//             onClick={() => setEmojiPickerOpen(true)}
//           >
//             <RiEmojiStickerLine className="text-2xl" />
//           </button>
//           <div className="absolute bottom-16 right-0" ref={emojiRef}>
//             <EmojiPicker
//               theme="dark"
//               open={emojiPickerOpen}
//               onEmojiClick={handleAddEmoji}
//               autoFocusSearch={false}
//             />
//           </div>
//         </div>
//       </div>
//       <button
//         className="bg-[#8417ff] focus:border-none focus:outline-none focus:text-white duration-300 transition-all rounded-md flex items-center justify-center p-[1.20rem] hover:bg-[#741bda] focus:bg-[#741bda]"
//         onClick={handleSendMessage}
//       >
//         <IoSend className="text-2xl" />
//       </button>
//     </div>
//   );
// };

// export default MessageBar;
