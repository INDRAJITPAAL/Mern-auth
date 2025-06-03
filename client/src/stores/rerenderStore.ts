import axios from 'axios';
import { create } from 'zustand';

const BackendUrl = import.meta.env.VITE_BACKEND_URL;

interface AppContextType {
    isSignup: string;
    setIsSignup: (value: string) => void;
    name: string;
    setName: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    userInfo: object;
    setUserInfo: (value: object) => void;
    register: (value: object) => Promise<any>;
    login: (value: object) => Promise<any>;
}

export const useRerenderStore = create<AppContextType>((set) => ({
    isSignup: "Sign Up",
    setIsSignup: (value) => set({ isSignup: value }),
    name: "",
    setName: (value) => set({ name: value }),
    email: "",
    setEmail: (value) => set({ email: value }),
    password: "",
    setPassword: (value) => set({ password: value }),
    isLoggedIn: false,
    setIsLoggedIn: (value) => set({ isLoggedIn: value }),
    userInfo: {},
    setUserInfo: (value) => set({ userInfo: value }),

    register: async (value) => {
        try {
            const { data } = await axios.post(`${BackendUrl}/api/v1/auth/register`, value, { withCredentials: true });
            return data;
        } catch (error) {
            console.error("Error during registration:", error);
            throw error;
        }
    },

    login: async (value) => {
        try {
            const { data } = await axios.post(`${BackendUrl}/api/v1/auth/login`, value, { withCredentials: true });
            return data;
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    }
}));