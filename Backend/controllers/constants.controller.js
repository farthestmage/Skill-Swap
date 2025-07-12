const constants = require('../Database/constants.model');

const getAllSkills = async (req, res) => {
    try {
        const skills = await constants.getAllSkills();
        res.json(skills);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllSkills };