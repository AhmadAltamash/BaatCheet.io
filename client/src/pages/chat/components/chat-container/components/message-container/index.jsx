import React from 'react'


const renderMessages = () => {
  
}

const MessageContainer = () => {
  return (
    <div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:[80vw] w-full'>
      {renderMessages()}
    </div>
  )
}

export default MessageContainer