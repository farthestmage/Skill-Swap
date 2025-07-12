const pool = require('../service/db');

const getAllPersonals = async () => {
    const result = await pool.query('SELECT * FROM personal_requests');
    return result.rows;
};

const getPersonalsBySenderId = async (userId) => {
    const result = await pool.query('SELECT * FROM personal_requests WHERE sender_user_id = $1', [userId]);
    return result.rows;
};

const getPersonalsByReceiverId = async (userId) => {
    const result = await pool.query('SELECT * FROM personal_requests WHERE receiver_user_id = $1', [userId]);
    return result.rows;
};

const createPersonal = async (request) => {
    const { sender_user_id, receiver_user_id, offered_skills, wanted_skills, message } = request;
    const result = await pool.query(
        'INSERT INTO personal_requests (sender_user_id, receiver_user_id, offered_skills, wanted_skills, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [sender_user_id, receiver_user_id, offered_skills, wanted_skills, message]
    );
    return result.rows[0];
};

const updatePersonalStatus = async (id, status) => {
    const result = await pool.query(
        'UPDATE personal_requests SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
    );
    return result.rows[0];
};

const deletePersonal = async (id) => {
    await pool.query('DELETE FROM personal_requests WHERE id = $1', [id]);
};

module.exports = {
    getAllPersonals,
    getPersonalsBySenderId,
    getPersonalsByReceiverId,
    createPersonal,
    updatePersonalStatus,
    deletePersonal,
};