import axios, { AxiosError } from 'axios';

export interface NewUserParams {
    name: string;
    email: string;
    password: string;
}

export interface NewUserResponse {
    accessToken: string;
}

export const newUser = async (
    userData: NewUserParams
): Promise<NewUserResponse> => {
    try {
        const { data } = await axios.post<NewUserResponse>(
            `${import.meta.env.VITE_BASE_URL}/auth/signup`,
            userData,
            { withCredentials: true }
        );
        return data;
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;

        const message =
            err.response?.data?.message || 'Internal Server Error during Signup';
        throw new Error(message);
    }
};