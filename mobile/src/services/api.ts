import axios from 'axios';

// Replace with your local machine IP for Android emulator to work
// Use '10.0.2.2' for standard Android emulator or your local LAN IP for physical device
const API_URL = 'http://10.0.2.2:4000';

export const api = axios.create({
    baseURL: API_URL,
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
