const client = require("../service/db")

const getAllSkills = async () => {
    const result = await client.query(`SELECT id, name FROM skills ORDER BY name`);
    return result.rows;
};

module.exports = { getAllSkills };