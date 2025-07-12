import axios, { AxiosError } from 'axios';

export interface UserLoginParams {
    email: string;
    password: string;
}

export interface UserLoginResponse {
    accessToken: string;
}

export const userLogin = async ({
    email,
    password,
}: UserLoginParams): Promise<UserLoginResponse> => {
    try {
        const { data } = await axios.post<UserLoginResponse>(
            `${import.meta.env.VITE_BASE_URL}/auth/login`,
            { email, password },
            { withCredentials: true }
        );
        return data;
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        throw new Error(
            err.response?.data?.message || 'Internal server error during login!'
        );
    }
};
