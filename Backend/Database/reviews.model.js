const db = require('../service/db');

class Reviews {
    static async create({ reviewer_user_id, reviewed_user_id, rating, message, request_id, request_type }) {
        const query = 'INSERT INTO reviews (reviewer_user_id, reviewed_user_id, rating, message, request_id, request_type) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [reviewer_user_id, reviewed_user_id, rating, message, request_id, request_type]);
        return result.insertId;
    }

    static async delete(reviewId) {
        const query = 'DELETE FROM reviews WHERE id = ?';
        const [result] = await db.query(query, [reviewId]);
        return result.affectedRows > 0;
    }

    static async getGivenByUserId(userId) {
        const query = 'SELECT * FROM reviews WHERE reviewer_user_id = ?';
        const [rows] = await db.query(query, [userId]);
        return rows;
    }

    static async getReceivedByUserId(userId) {
        const query = 'SELECT * FROM reviews WHERE reviewed_user_id = ?';
        const [rows] = await db.query(query, [userId]);
        return rows;
    }
}

module.exports = Reviews;