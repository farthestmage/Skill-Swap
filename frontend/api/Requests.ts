import axios from 'axios';

export const createRequest = async (payload: {
    user_id: number;
    offered_skills: number[];
    wanted_skills: number[];
    message: string;
}) => {
    const { data } = await axios.post('/api/request', payload);
    return data;
};