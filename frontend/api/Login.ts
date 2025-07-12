import axios from 'axios';

export const userLogin = async ({ password, email }) => {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, { password, email }, { withCredentials: true });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Internal server error duirng login!");
    }
};