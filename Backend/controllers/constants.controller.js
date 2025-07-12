const { Get_Units_Query, Get_Widgets_Query } = require("../Database/constants.model")
const getUnits = async (req, res) => {
    try {
        const units = await Get_Units_Query();
        return res.status(200).json(units)
    }
    catch (error) {
        console.error(`[${new Date().toLocaleString("en-GB")}] Error fetching units: ${error.message}`);
        return res.status(500).json({ message: error.message });
    }
};
const getWidgets = async (req, res) => {
    try {
        const units = await Get_Widgets_Query();
        return res.status(200).json(units)
    }
    catch (error) {
        console.error(`[${new Date().toLocaleString("en-GB")}] Error fetching widgtes: ${error.message}`);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { getUnits, getWidgets }