const express = require("express");
const router = express.Router();

const { getDevicesList, addNewDevice, deleteDevice } = require("../controllers/devices.controller");

router.route("/")
    .get(getDevicesList)
    .post(addNewDevice)
    .delete(deleteDevice)


module.exports = router;