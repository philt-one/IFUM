import React, { useState } from "react";
import axios from "axios";

// Intercept requests and add the token stored in the localStorage in
// the header
const ifumAxios = axios.create();
ifumAxios.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

const AuthContext = React.createContext();

export const AuthContextProvider = ({children}) => {
    const [ user, setUser ] = useState(JSON.parse(localStorage.getItem("user")) || {});
    const [ token, setToken ] = useState(localStorage.getItem("token") || "");
    
    const signup = async (userInfo) => {
        const response = await ifumAxios.post("/auth/signup", userInfo);
        const { user, token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setToken(token);
        return response;
    }

    const login = async (credentials) => {
        const response = await ifumAxios.post("/auth/login", credentials);
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setToken(token);
        return response;
    }

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser({});
        setToken("");
    }

    return ( 
        <AuthContext.Provider value={{ user,
                                    setUser,
                                    token,
                                    setToken,
                                    login,
                                    logout,
                                    signup }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;