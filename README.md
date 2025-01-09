# BAAT-CHEET - Secure & Feature-Rich Chat Application 🚀  

**BAAT-CHEET** is a modern, secure, and feature-packed chat application built with the MERN stack and Socket.IO. It ensures end-to-end encryption for safe communication and supports various functionalities like file sharing, custom user experiences, and profile management.  

![Baat-Cheet Preview]()  

---

## ✨ Features  

- **End-to-End Encryption**  
  Messages are encrypted during transmission and stored securely in the database.  

- **Real-Time Messaging**  
  Experience fast and seamless communication powered by Socket.IO.  

- **File Sharing**  
  Upload and download files of any type securely with a user-friendly interface.  

- **Profile Management**  
  Update profile pictures effortlessly and maintain a personalized experience.  

- **Custom Context Menu**  
  A unique right-click menu for enhanced usability and message management.  

- **Message and File Management**  
  Delete messages or files easily.  

---

## 🛠️ Tech Stack  

- **Frontend**: React.js, TailwindCSS  
- **Backend**: Node.js, Express.js, Socket.IO  
- **Database**: MongoDB  
- **File Management**: Cloudinary for secure storage  

---

## 📦 Features Breakdown  

1. **Authentication**  
   - Secure login and user validation.  

2. **Messaging**  
   - Real-time message exchange with encrypted storage.  

3. **File Upload/Download**  
   - Support for uploading and downloading images, documents, and other file types.  

4. **Profile Picture Management**  
   - Upload, edit, or remove profile pictures.  

5. **Custom Right-Click Menu**  
   - Enhance user experience with advanced context-menu options.  

---

## 🚀 Deployment  

- **Backend**: [BAAT-CHEET Backend](https://baatcheet-io-76lz.onrender.com)  
- **Frontend**: [BAAT-CHEET Frontend](https://baat-cheet-io.vercel.app/)  

---

## 🛠️ Local Development  

### Prerequisites  
- Node.js  
- MongoDB  

### Setup  

1. Clone the repository:  
    ```bash  
    git clone https://github.com/your-username/baat-cheet.git  
    cd baat-cheet  
    ```
2. Install dependencies in both server and client side:
    ```bash
    npm install
    ```
3. Configure environment variables in client:
    ```bash 
    VITE_SERVER_URL=your-server-url
    VITE_SECRET_KEY=your-secret-key
    VITE_CLOUDINARY_URL=your-cloudinary-url
    VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
    ```
4. Configure environment variables in server:
    ```bash 
    PORT=8080
    JWT_KEY=your-key
    ORIGIN=your-client-origin
    DATABASE_URL=your-mongoDB-url
    CLOUD_NAME=your-cloud-name
    CLOUD_API_KEY=-your-cloud-api-key
    CLOUD_API_SECRET=your-cloud-secret-key
    ```
5. Start the server:
    ```bash
    cd server
    npm run dev
    ```
6. Start the client:
    ```bash
    cd client
    npm run dev
    ```


## 🤝 Contributing
Contributions are welcome! Fork this repository, create a new branch, and submit a pull request.

## 📝 License
This project is licensed under the MIT License. See the LICENSE file for details.
