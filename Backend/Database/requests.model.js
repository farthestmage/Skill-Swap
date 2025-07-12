const client = require('../service/db');

const getAllRequests = async () => {
    const result = await client.query('SELECT * FROM user_requests');
    return result.rows;
};

const getRequestsByUserId = async (userId) => {
    const result = await client.query('SELECT * FROM user_requests WHERE user_id = $1', [userId]);
    return result.rows;
};

const createRequest = async (request) => {
    const { user_id, offered_skills, wanted_skills, message } = request;
    const result = await client.query(
        'INSERT INTO user_requests (user_id, offered_skills, wanted_skills, message) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, offered_skills, wanted_skills, message]
    );
    return result.rows[0];
};

const deleteRequest = async (id) => {
    await client.query('DELETE FROM user_requests WHERE id = $1', [id]);
};

module.exports = {
    getAllRequests,
    getRequestsByUserId,
    createRequest,
    deleteRequest,
};