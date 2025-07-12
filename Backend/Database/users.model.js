const client = require("../service/db");
const { v4: uuidv4 } = require('uuid');

const getUser = async (email) => {
    const query = `SELECT 
                    user_id,
                    email AS user_email,
                    name AS user_name,
                    password AS user_password
                FROM users WHERE email = $1
            `;
    try {
        const { rows } = await client.query(query, [email]);
        return rows;
    } catch (error) {
        throw new Error(error.message);
    }
}
const getUserById = async (id) => {
    const query = `SELECT 
                    user_id,
                    email AS user_email,
                    name AS user_name,
                    password AS user_password
                FROM users WHERE user_id = $1
            `;
    try {
        const { rows } = await client.query(query, [id]);
        return rows;
    } catch (error) {
        throw new Error(error.message);
    }
}

const insertUser = async ({ name, email, password }) => {
    const user_id = uuidv4();
    const query = `
        INSERT INTO users (user_id, name, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, email AS user_email, name AS user_name
    `;
    try {
        const { rows } = await client.query(query, [user_id, name, email, password]);
        return rows;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { getUser, insertUser, getUserById }