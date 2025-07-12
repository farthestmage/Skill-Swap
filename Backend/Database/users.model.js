const client = require('../service/db');

const getAllUsers = async () => {
    const result = await client.query(`
    SELECT
        u.id,
        u.email,
        u.name,
        up.profile_picture,
        up.bio,
        up.location,
        up.availability,
        up.is_visible,
        COALESCE(
            ARRAY(
                SELECT s.name
                FROM unnest(up.skills_offered) skill_id
                JOIN skills s ON s.id = skill_id
            ),
            '{}'
        ) AS skills_offered,
        COALESCE(
            ARRAY(
                SELECT s.name
                FROM unnest(up.skills_wanted) skill_id
                JOIN skills s ON s.id = skill_id
            ),
            '{}'
        ) AS skills_wanted
    FROM users u
    LEFT JOIN user_profiles up ON u.id = up.user_id
`);
    return result.rows;
};

const getUserById = async (userId) => {
    const result = await client.query(`
    SELECT
        u.id,
        u.email,
        u.name,
        up.profile_picture,
        up.bio,
        up.location,
        up.availability,
        up.is_visible,
        COALESCE(
        ARRAY(
            SELECT s.name
            FROM unnest(up.skills_offered) skill_id
            JOIN skills s ON s.id = skill_id
        ),
        '{}'
        ) AS skills_offered,
        COALESCE(
        ARRAY(
            SELECT s.name
            FROM unnest(up.skills_wanted) skill_id
            JOIN skills s ON s.id = skill_id
        ),
        '{}'
        ) AS skills_wanted
    FROM users u
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE u.id = $1
`, [userId]);
    return result.rows[0];
};

const getUserByEmail = async (userEmail) => {
    const result = await client.query(`
    SELECT u.id,
    FROM users u
    WHERE u.email = $1
`, [userEmail]);
    return result.rows[0];
};

const createUser = async (email, name, password) => {
    const userResult = await client.query(
        `INSERT INTO users (email, name, password)
        VALUES ($1, $2, $3)
        RETURNING id;`,
        [email, name, password]
    );
    const userId = userResult.rows[0].id;

    await client.query(
        `INSERT INTO user_profiles (
        user_id, profile_picture, bio, location,
        availability, is_visible,
        skills_offered, skills_wanted
    )
    VALUES (
        $1, NULL, '', '', 'BOTH', TRUE, '{}', '{}'
    )`,
        [userId]
    );
    return userId;
};

const deleteUser = async (userId) => {
    await client.query(
        `DELETE FROM users WHERE id = $1`,
        [userId]
    );
};

const updateUser = async (userId, profileData) => {
    const query = `
    UPDATE user_profiles
    SET
        profile_picture = $1,
        bio = $2,
        location = $3,
        availability = $4,
        is_visible = $5,
        skills_offered = $6,
        skills_wanted = $7
    WHERE user_id = $8
`;

    const values = [
        profileData.profile_picture || null,
        profileData.bio || '',
        profileData.location || '',
        profileData.availability || 'BOTH',
        profileData.is_visible !== undefined ? profileData.is_visible : true,
        profileData.skills_offered || [],
        profileData.skills_wanted || [],
        userId
    ];

    await client.query(query, values);
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    deleteUser,
    updateUser
};