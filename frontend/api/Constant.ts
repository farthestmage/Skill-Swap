import axios from 'axios';

export const getAllSkills = async () => {
    const { data } = await axios.get('/api/constants/skills');
    return data;
};