import axios from 'axios';

export const fetchUnits = async () => {
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/constants/units`);
        data.forEach(field => {
            field.field_name = field.field_name
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch units");
    }
};

export const fetchWidgets = async () => {
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/constants/widgets`);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch widgtes");
    }
};