import axios from 'axios';

export const newUser = async ({ name, email, password }) => {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup`, { name, email, password }, { withCredentials: true });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Internal Servor error during Signup");
    }
};