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
    if (userInfo) {
        socket.current = io(HOST, {
            withCredentials: true,
            query: { userId: userInfo.id }
        });

        socket.current.on("connect", () => {
            console.log("Connected to socket server");
        });

        const handleRecieveMessage = (message) => {
            console.log(message)
            const { selectedChatData, selectedChatType, addMessage, addContactsInDMContacts } = useAppStore.getState();
            if (
                selectedChatType !== undefined &&
                (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)
            ) {
                const decryptedContent = decryptMessage(message.content);
                addMessage({ ...message, content: decryptedContent });
                console.log(decryptedContent);
            }
            addContactsInDMContacts(message)
        };

        const handleRecieveChannelMessage = async (message) => {
            const { selectedChatData, selectedChatType, addMessage, addChannelInChannelList } = useAppStore.getState();
        
            if (message.messageType === "text") {
                message.content = decryptMessage(message.content);
            }
        
            if (selectedChatType !== undefined && selectedChatData._id === message.channelId) {
                addMessage(message);
            }
            addChannelInChannelList(message);
        };
        

        socket.current.on("recieveMessage", handleRecieveMessage);
        socket.current.on("recieve-channel-message", handleRecieveChannelMessage)


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
