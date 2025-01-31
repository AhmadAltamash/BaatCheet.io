import { useSocket } from '@/context/SocketContext'
import { apiClient } from '@/lib/api-client'
import { useAppStore } from '@/store'
import { UPLOAD_FILE_ROUTE } from '@/utils/constants'
import EmojiPicker from 'emoji-picker-react'
import React, { useEffect, useRef, useState } from 'react'
import {GrAttachment} from 'react-icons/gr'
import { IoSend } from 'react-icons/io5'
import { RiEmojiStickerLine } from 'react-icons/ri'
import CryptoJS from 'crypto-js';
const MessageBar = () => {
  
  const emojiRef = useRef("");
  const fileInputRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress } = useAppStore();
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

  //with encryption
  const encryptMessage = (text) => {
    const key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_SECRET_KEY);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return JSON.stringify({
        iv: CryptoJS.enc.Hex.stringify(iv),
        ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
    });
  };
  
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
    setEmojiPickerOpen(false);
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      const encryptedMessage = encryptMessage(message);


      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: encryptedMessage,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    } else if(selectedChatType === "channel"){
      const encryptedMessage = encryptMessage(message);

        socket.emit("send-channel-message", {
          sender: userInfo.id,
          content: encryptedMessage,
          messageType: "text",
          fileUrl: undefined,
          channelId: selectedChatData._id,
      })
    }
      setMessage("");
  };

  const handleAttachmentClick = () => {
    if(fileInputRef.current){
      fileInputRef.current.click()
    }
  }

  const handleAttachmentChange = async (e) => {
    try {
        const file = e.target.files[0];
        if (file) {
            // Validate MIME types
            const allowedFileTypes = [
                "image/jpeg", "image/png", "image/gif", "application/pdf",
                "video/mp4", "application/zip", 
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "text/plain"
            ];
            if (!allowedFileTypes.includes(file.type)) {
                alert("Unsupported file type!");
                return;
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("id", selectedChatData._id);
            setIsUploading(true);
            const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
              withCredentials: true,
              headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: (data) => {
                  setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
              },
            });

            if(response.status === 200 && response.data) {
                setIsUploading(false);
                if(selectedChatType === "contact"){
                    socket.emit("sendMessage", {
                        sender: userInfo.id,
                        content: undefined,
                        recipient: selectedChatData._id,
                        messageType: "file",
                        fileUrl: response.data.filePath,
                    });
                } else if(selectedChatType === "channel") {
                    socket.emit("send-channel-message", {
                        sender: userInfo.id,
                        content: undefined,
                        messageType: "file",
                        fileUrl: response.data.filePath,
                        channelId: selectedChatData._id,
                    });
                }
            } 
        }
    } catch (error) {
        setIsUploading(false);
    }
};


  return (
    <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-20 sm:px-8 mb-6 gap-2 sm:gap-6'>
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-2 sm:gap-5 pr-2 sm:pr-5 w-[300px] h-[75%]">
        <input type='text' className='flex-1 p-2 sm:p-5 bg-transparent focus:border-none focus:outline-none w-[75%]'
        placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)}/>
        <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={handleAttachmentClick} >
          <GrAttachment className='text-2xl'/>
        </button>
        <input type='file' className='hidden' ref={fileInputRef} onChange={handleAttachmentChange}/>
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
      <button className='bg-[#8417ff] focus:border-none focus:outline-none focus:text-white duration-300 transition-all rounded-md flex items-center justify-center p-[1.20rem] hover:bg-[#741bda] focus:bg-[#741bda] h-[50px] w-[50px] sm:h-[55px] sm:w-[55px]' onClick={handleSendMessage}>
          <IoSend className='text-2xl'/>
        </button>
    </div>
  )
}

export default MessageBar
