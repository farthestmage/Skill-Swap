const userModel = require('../Database/users.model');

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        await userModel.deleteUser(userId);

        res.json({ message: 'User deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const profileData = req.body;
        await userModel.updateUser(userId, profileData);
        res.json({ message: 'Profile updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser
};