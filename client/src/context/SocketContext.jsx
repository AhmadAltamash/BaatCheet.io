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
        const { iv, ciphertext } = JSON.parse(encryptedMessage);  
        const key = import.meta.env.VITE_SECRET_KEY; 
    
        const decryptedBytes = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(ciphertext), iv: CryptoJS.enc.Base64.parse(iv) }, key);
        const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
        return decryptedText;
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
            console.log({message})
            if (selectedChatType !== undefined && 
                (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
                
                addMessage(message);  

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

// useEffect(() => {
//     if (userInfo) {
//         socket.current = io(HOST, {
//             withCredentials: true,
//             query: { userId: userInfo.id }
//         });

//         socket.current.on("connect", () => {
//             console.log("Connected to socket server");
//         });

//         const handleRecieveMessage = (message) => {
//             const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();
//             console.log({message})
//             if (selectedChatType !== undefined && 
//                 (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
                    
//                 const decryptedContent = decryptMessage(message.content);  
//                 console.log(decryptedContent); 
        
//                 addMessage({ ...message, content: decryptedContent });  
//             } else {
//                 console.log("Message does not match selected chat");
//             }
//         };

//         socket.current.on("recieveMessage", (payload) => {
//             console.log("payload is here",payload);
//             handleRecieveMessage(payload)
//         });

//         return () => {
//             socket.current.disconnect();
//         }
//     }
// }, [userInfo]);