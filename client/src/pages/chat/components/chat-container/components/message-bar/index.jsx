import React, { useRef, useState } from 'react'
import {GrAttachment} from 'react-icons/gr'
import { IoSend } from 'react-icons/io5'
import { RiEmojiStickerLine } from 'react-icons/ri'
const MessageBar = () => {
  
  const emojiRef = useRef("")
  const [message, setMessage] = useState("")

  const handleSendMessage = async () => {

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
          <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
            <RiEmojiStickerLine className='text-2xl'/>
          </button>
          <div className="absolute bottom-16 right-0"></div>
        </div>
      </div>
      <button className='bg-[#8417ff] focus:border-none focus:outline-none focus:text-white duration-300 transition-all rounded-md flex items-center justify-center p-[1.20rem] hover:bg-[#741bda] focus:bg-[#741bda]' onClick={handleSendMessage}>
          <IoSend className='text-2xl'/>
        </button>
    </div>
  )
}

export default MessageBar