import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store'
import { DELETE_FILE_ROUTE, DELETE_MESSAGE_ROUTE, GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES_ROUTES, HOST } from '@/utils/constants';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { MdFolderZip } from 'react-icons/md'
import { IoMdArrowRoundDown } from 'react-icons/io'
import { IoCloseSharp } from 'react-icons/io5';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import CryptoJS from 'crypto-js';

const MessageContainer = () => {

  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  const renderContextMenu = () => {
    if (!contextMenu.visible) return null; // Hide menu if not visible
  
    return (
      <div
        className="cursor-pointer absolute bg-purple-800/10 shadow-lg border-purple-800 border-[2px] rounded-md z-50 text-purple-300 "
        style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
      >
        <ul className="py-2">
          <li
            className="px-4 py-2 hover:bg-purple-800/40 cursor-pointer"
            onClick={handleDeleteMessage}
          >
            Delete Message
          </li>
          {selectedMessage?.messageType === "file" && (
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={handleDeleteFile}
            >
              Delete File
            </li>
          )}
        </ul>
      </div>
    );
  };
  
  const handleDeleteMessage = async () => {
    try {
      await apiClient.delete(`${DELETE_MESSAGE_ROUTE}/${selectedMessage._id}`);
      setContextMenu({ visible: false, x: 0, y: 0 }); // Close context menu
      fetchMessages(); // Refresh message list
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };
  
  const handleDeleteFile = async () => {
    try {
      await apiClient.delete(`${DELETE_FILE_ROUTE}/${selectedMessage._id}`);
      setContextMenu({ visible: false, x: 0, y: 0 }); // Close context menu
      fetchMessages(); // Refresh message list
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };
  
  const handleRightClick = (e, message) => {
    e.preventDefault(); // Prevent the default context menu
    setSelectedMessage(message); // Set the message to be acted upon
    console.log(message)
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
    });
  };

  const scrollRef = useRef();
  const { selectedChatData, selectedChatType, userInfo, selectedChatMessages, setSelectedChatMessages, setFileDownloadProgress,
  setIsDownloading
   } = useAppStore()

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null)

  const decryptMessage = (encryptedMessage) => {
    try {
        const { iv, ciphertext } = JSON.parse(encryptedMessage);

        const key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_SECRET_KEY);

        const decryptedBytes = CryptoJS.AES.decrypt(
            { ciphertext: CryptoJS.enc.Base64.parse(ciphertext) },
            key,
            {
                iv: CryptoJS.enc.Hex.parse(iv), 
                mode: CryptoJS.mode.CBC,      
                padding: CryptoJS.pad.Pkcs7, 
            }
        );

        return decryptedBytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption error:", error);
        return null; 
    }
};


  useEffect(() => {

    const getMessages = async () => {
      try {
          const response = await apiClient.post(
              GET_ALL_MESSAGES_ROUTE,
              { id: selectedChatData._id },
              { withCredentials: true }
          );
  
          if (response.data.messages) {
              const decryptedMessages = response.data.messages.map((msg) => ({
                  ...msg,
                  content: msg.messageType === 'text'
                      ? decryptMessage(msg.content) 
                      : msg.content,              
              }));
              setSelectedChatMessages(decryptedMessages);
          }
      } catch (error) {
          console.log(error);
      }
  };
  
  const getChannelMessages = async () => {
      try {
          const response = await apiClient.get(
              `${GET_CHANNEL_MESSAGES_ROUTES}/${selectedChatData._id}`,
              { withCredentials: true }
          );
  
          if (response.data.messages) {
              const decryptedMessages = response.data.messages.map((msg) => ({
                  ...msg,
                  content: msg.messageType === 'text'
                      ? decryptMessage(msg.content) 
                      : msg.content,              
              }));
              setSelectedChatMessages(decryptedMessages);
          }
      } catch (error) {
          console.log({ error });
      }
  };
  
    if(selectedChatData._id) {
      if(selectedChatType === "contact") getMessages();
      else if(selectedChatType === "channel") getChannelMessages();
    }

    const handleClickOutside = () => setContextMenu({ visible: false, x: 0, y: 0 });
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);

  },[selectedChatData, selectedChatType,setSelectedChatMessages])

  useEffect(() => {
    if(scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedChatMessages])

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|webp|svg|ico|heic|heif)$/i;

    return imageRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    try {
      const response = await axios.get(`/proxy-file?url=${encodeURIComponent(url)}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          setFileDownloadProgress(percentCompleted);
        },
      });
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", url.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsDownloading(false);
      setFileDownloadProgress(0);
    }
  };
  
  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      
      return (
        <div key={index} onContextMenu={(e) => handleRightClick(e, message)}>
          {showDate && <div className='text-center text-gray-500 my-2'>{moment(message.timestamp).format("LL")}</div>}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => (
    <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`} onContextMenu={(e) => handleRightClick(e, message)} >
      {message.messageType === "text" && (
          <div className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "} border inline-block p-4 rounded my-1 max-w-[50%] break-words cursor-pointer`}>{message.content}</div>
        )}
        {
          message.messageType === "file" && (
            <div className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>{checkIfImage(message.fileUrl) ? (
              <div className='cursor-pointer' onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }} >
                <img
                  src={`${message.fileUrl}`}
                  alt="file"
                  height={100}
                  width={100}
                />
              </div>
            ) : (
              <div className='flex items-center justify-center gap-4'>
                <span className='text-white/80 text-3xl bg-black/20 rounded-full p-3'>
                  <MdFolderZip/>
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 ' onClick={() => downloadFile(message.fileUrl)} ><IoMdArrowRoundDown/></span>
              </div>
            )} </div>
          )
        }
      <div className='text-xs text-gray-600'>{moment(message.timestamp).format("LT")}</div>
    </div>
  )

  const renderChannelMessages = (message) => {
    return (
      <div className={`mt-5 ${message.sender._id !== userInfo.id ? "text-left" : "text-right"}`} onContextMenu={(e) => handleRightClick(e, message)} >
        {message.messageType === "text" && (
          <div className={`${message.sender._id === userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "} border inline-block p-4 rounded my-1 max-w-[50%] break-words cursor-pointer`}>{message.content}
          </div>
        )}

        {
          message.messageType === "file" && (
            <div className={`${message.sender._id !== userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>{checkIfImage(message.fileUrl) ? (
              <div className='cursor-pointer' onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }} >
                <img
                  src={`${message.fileUrl}`}
                  alt="file"
                  height={100}
                  width={100}
                />
              </div>
            ) : (
              <div className='flex items-center justify-center gap-4'>
                <span className='text-white/80 text-3xl bg-black/20 rounded-full p-3'>
                  <MdFolderZip/>
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 ' onClick={() => downloadFile(message.fileUrl)} ><IoMdArrowRoundDown/></span>
              </div>
            )} </div>
          )
        }

        {
          message.sender._id !== userInfo.id ? (
            <div className='flex items-center justify-start gap-3'>
               <Avatar className="w-8 h-8 rounded-full overflow-hidden">
                {message.sender?.image && (
                  <AvatarImage
                    src={`${message.sender.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.png";
                }}/>
                  )}
                    <AvatarFallback
                        className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(
                            message.sender?.color
                        )}`}
                    >
                    {message.sender?.firstname ? message.sender.firstname[0].toUpperCase() : selectedChatData?.email?.[0]?.toUpperCase() || "N"}
                    </AvatarFallback>
                </Avatar>
                <span className='text-sm text-white/60 '>{`${message.sender.firstname} ${message.sender.lastname}`}</span>
                <span className='text-xs text-white/60'>{moment(message.timestamp).format("LT")}</span>
            </div>
          ) : (
            <div className='text-xs text-white/60 mt-1'>{moment(message.timestamp).format("LT")}</div>
          )
        }
      </div>
    )
  }

  return (
    <div className='flex-1 overflow-y-auto scrollbar-hide p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:[80vw] w-full'>
      {renderMessages()}
      <div ref={scrollRef} />
      {renderContextMenu()}
      {
        showImage && (
          <div className='fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col'>
            <div>
              <img
                src={`${imageUrl}`}
                className='h-[80vh] w-full bg-cover'
              /> 
            </div>
            <div className='flex gap-5 fixed top-0 mt-5'>
              <button className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-200' onClick={() => downloadFile(imageUrl)} >
                <IoMdArrowRoundDown/>
              </button>

              <button className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-200' onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}>
                <IoCloseSharp/>
              </button>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default MessageContainer