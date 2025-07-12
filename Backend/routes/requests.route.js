const express = require('express');
const router = express.Router();
const Requests = require('../controllers/requests.controller');

router.get('/', Requests.getAllRequests);
router.get('/:userId', Requests.getRequestsByUserId);
router.post('/', Requests.createRequest);
router.delete('/:id', Requests.deleteRequest);

module.exports = router;