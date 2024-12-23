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

    const decryptMessage = (encryptedMessage) => {
        try {
            console.log("Encrypted Message:", encryptedMessage);  // Log the message before decryption

            const { iv, ciphertext } = JSON.parse(encryptedMessage);  
            const key = import.meta.env.SECRET_KEY; 
           
            if (key) {
            console.error("SECRET_KEY is not defined.");
            }
        
            // Decrypt using AES
            const decryptedBytes = CryptoJS.AES.decrypt(
                { ciphertext: CryptoJS.enc.Base64.parse(ciphertext), iv: CryptoJS.enc.Base64.parse(iv) },
                key
            );
            const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
        
            return decryptedText;
        } catch (error) {
            console.error("Error decrypting message:", error);
            return null;  // Return null if decryption fails
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
