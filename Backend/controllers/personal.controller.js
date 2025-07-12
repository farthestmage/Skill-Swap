const Personal = require('../Database/personal.model');

const getAllPersonals = async (req, res) => {
    try {
        const personals = await Personal.getAllPersonals();
        res.status(200).json(personals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPersonalsBySenderId = async (req, res) => {
    try {
        const personals = await Personal.getPersonalsBySenderId(req.params.userId);
        res.status(200).json(personals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPersonalsByReceiverId = async (req, res) => {
    try {
        const personals = await Personal.getPersonalsByReceiverId(req.params.userId);
        res.status(200).json(personals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPersonal = async (req, res) => {
    try {
        const newPersonal = await Personal.createPersonal(req.body);
        res.status(201).json(newPersonal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePersonalStatus = async (req, res) => {
    try {
        const updatedRequest = await Personal.updatePersonalStatus(req.params.id, req.body.status);
        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePersonal = async (req, res) => {
    try {
        await Personal.deletePersonal(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllPersonals,
    getPersonalsBySenderId,
    getPersonalsByReceiverId,
    createPersonal,
    updatePersonalStatus,
    deletePersonal,
};