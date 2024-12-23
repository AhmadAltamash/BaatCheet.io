import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { createContext, useContext, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import CryptoJS from 'crypto-js';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo } = useAppStore();

    const decryptMessage = (encryptedText) => {
        try {
            if(!encryptedText){
                console.log(encryptedText);
            }
          const key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_SECRET_KEY); // Parse the secret key
          const data = JSON.parse(encryptedText); // Parse the input JSON
      
          const iv = CryptoJS.enc.Hex.parse(data.iv); // Parse IV from Hex
          const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: CryptoJS.enc.Base64.parse(data.ciphertext) }, // Parse ciphertext from Base64
            key,
            {
              iv: iv,
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7,
            }
          );
      
          return CryptoJS.enc.Utf8.stringify(decrypted); // Convert decrypted bytes back to string
        } catch (error) {
          console.error("Decryption error:", error); // Log errors if decryption fails
          return null;
        }
      };
      

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id }
            });

            socket.current.on("connect", () => {
                console.log("Connected to socket server");
            });

            const handleRecieveMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();
            
                if (selectedChatType !== undefined && 
                    (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient.id)) {
            
                    const decryptedContent = decryptMessage(message.content);  // Decrypt the content
                    
                    if (decryptedContent !== null) {
                        console.log(decryptedContent);  // Log the decrypted content
                        addMessage({ ...message, content: decryptedContent });  // Save the decrypted message
                    } else {
                        console.log("Failed to decrypt the message content.");
                    }
            
                } else {
                    console.log("Message does not match selected chat");
                }
            };

            socket.current.on("recieveMessage", handleRecieveMessage);

            return () => {
                socket.current.disconnect();
            }
        }
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};
