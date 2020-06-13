import axios from 'axios';

export const login = async (credentials) => {
    const response = await axios.post("/auth/login", credentials);
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response;
};

export const signup = async (userInfo) => {
    const response = await axios.post("/auth/signup", userInfo);
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response;
};

export const logout = () => {
    localStorage.removeItem("token");
};