export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    closeChat: ()=> set({ selectedChatData: undefined, selectedChatType: undefined, selectedChatMessages: [],
    }),
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;
        
        set({
            selectedChatMessages: [
                ...selectedChatMessages, {
                    ...message,
                    recipient: selectedChatType === "channel" ? message.recipient : message.recipient._id,
                    sender: selectedChatType === "channel" ? message.sender : message.sender._id,
                }
            ]            
        })
    }
})
// import CryptoJS from 'crypto-js';

// export const createChatSlice = (set, get) => ({
//     selectedChatType: undefined,
//     selectedChatData: undefined,
//     selectedChatMessages: [],
//     setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
//     setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
//     setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
//     closeChat: () => set({
//         selectedChatData: undefined,
//         selectedChatType: undefined,
//         selectedChatMessages: [],
//     }),
//     addMessage: (message) => {
//         const selectedChatMessages = get().selectedChatMessages;
//         const selectedChatType = get().selectedChatType;
//         const decryptMessage = (encryptedMessage) => {
//             try {
//                 const { iv, ciphertext } = encryptedMessage;
//                 const key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_SECRET_KEY);
//                 const decodedIv = CryptoJS.enc.Hex.parse(iv);
//                 const decodedCiphertext = CryptoJS.enc.Base64.parse(ciphertext);
    
//                 const decrypted = CryptoJS.AES.decrypt(
//                     { ciphertext: decodedCiphertext },
//                     key,
//                     {
//                         iv: decodedIv,
//                         mode: CryptoJS.mode.CBC,
//                         padding: CryptoJS.pad.Pkcs7,
//                     }
//                 );
    
//                 return decrypted.toString(CryptoJS.enc.Utf8);
//             } catch (error) {
//                 console.error("Decryption error:", error);
//                 return null;
//             }
//         };
//         const decryptedContent = decryptMessage(message.content);
//         set({
//             selectedChatMessages: [
//                 ...selectedChatMessages, 
//                 {
//                     ...message,
//                     content: decryptedContent,
//                     recipient: selectedChatType === "channel" ? message.recipient : message.recipient._id,
//                     sender: selectedChatType === "channel" ? message.sender : message.sender._id,
//                 }
//             ]
//         });
//     }
// });
