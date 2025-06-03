import { createContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import  toast  from "react-hot-toast";
// Create the provider component
interface AppProviderProps {
    children: ReactNode;

}


interface AppContextType {
    BACKEND_URL: string;
    user: object,
    setUser: (value: object) => void,
    getUser: () => Promise<void>;
}

// Create the context with a default value or undefined
export const AppContext = createContext<AppContextType | undefined>(undefined);


export const AppContextProvider = ({ children }: AppProviderProps) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

    const [user, setUser] = useState<object>({});

    const getUser = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/user/userdata`, { withCredentials: true });
            console.log(response.data);
            response.data.status === "success" ? setUser(response.data) : toast.error("Failed to fetch user data");
        } catch (error) {
            console.error("Error fetching user data:", error);
            //@ts-ignore
            toast.error(error?.response?.data?.message || "An error occurred while fetching user data");
        }
    };





    useEffect(() => {
        const fetchUser = async () => {
            if (Object.keys(user).length === 0) {
                await getUser();
            }
        };
        fetchUser();
    }, [user, BACKEND_URL, setUser]);




    const value: AppContextType = {
        BACKEND_URL,
        user,
        setUser,
        getUser,
    };
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};



export default AppContextProvider;
