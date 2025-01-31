export const HOST = import.meta.env.VITE_SERVER_URL;
const BASE_URL = "https://baatcheet-io-5ao2.onrender.com/api";

// Auth Routes
export const AUTH_ROUTES = 'api/auth';
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

// Contacts Routes
export const CONTACTS_ROUTES = 'api/contacts';
export const SEARCH_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/search`;
export const GET_DM_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/get-contacts-for-dm`;
export const GET_ALL_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/get-all-contacts`;

// Messages Routes
export const MESSAGES_ROUTES = `${BASE_URL}/messages`;
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/upload-file`;
export const DOWNLOAD_FILE_ROUTE = `${BASE_URL}/proxy-file`;
export const DELETE_FILE_ROUTE = `${MESSAGES_ROUTES}/delete-file`;
export const DELETE_MESSAGE_ROUTE = `${MESSAGES_ROUTES}/delete-message`;

// Channels Routes
export const CHANNELS_ROUTES = 'api/channels';
export const CREATE_CHANNEL_ROUTE = `${CHANNELS_ROUTES}/create-channel`;
export const GET_USER_CHANNELS_ROUTE = `${CHANNELS_ROUTES}/get-user-channels`;
export const GET_CHANNEL_MESSAGES_ROUTES = `${CHANNELS_ROUTES}/get-channel-messages`;

// Cloudinary Configuration
export const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

