const Requests = require('../Database/requests.model');

const getAllRequests = async (req, res) => {
    try {
        const Requests = await Requests.getAllRequests();
        res.status(200).json(Requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRequestsByUserId = async (req, res) => {
    try {
        const Requests = await Requests.getRequestsByUserId(req.params.userId);
        res.status(200).json(Requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createRequest = async (req, res) => {
    try {
        const newRequest = await Requests.createRequest(req.body);
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRequest = async (req, res) => {
    try {
        await Requests.deleteRequest(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllRequests,
    getRequestsByUserId,
    createRequest,
    deleteRequest,
};