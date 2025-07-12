const express = require('express');
const router = express.Router();
const Personal = require('../controllers/personal.controller');

router.get('/', Personal.getAllPersonals);
router.get('/sent/:userId', Personal.getPersonalsBySenderId);
router.get('/received/:userId', Personal.getPersonalsByReceiverId);
router.post('/', Personal.createPersonal);
router.patch('/:id', Personal.updatePersonalStatus);
router.delete('/:id', Personal.deletePersonal);

module.exports = router;