import { useAppStore } from '@/store'
import moment from 'moment';
import React, { useEffect } from 'react'

const MessageContainer = () => {

  const scrollRef = useRef();
  const { selectedChatData, selectedChatType, userInfo, selectedChatMessages } = useAppStore()

  useEffect(() => {
    if(scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedChatMessages])

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message)=>{
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id} >
          {showDate && <div className='text-center text-gray-500 my-2'>{moment(message.timestamp).format("LL")}</div>}
          {
            selectedChatType === ""
          }
        </div>
      )
    })
  }

  return (
    <div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:[80vw] w-full'>
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  )
}

export default MessageContainer