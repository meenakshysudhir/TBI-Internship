const Device = require("../Models/device");

const checkDeviceExists = async (req, res) => {
  const { serialNumber } = req.body;
  if (!serialNumber) {
    res.status(400).json({ message: "Incomplete Data" });
  }
  try {
    const device = await Device.findOne({ serialNumber });
    if (device) {
      // res.status(200).json({ message: "Device Exists" });
      if (!device.location) {
        res.status(400).json({ message: "No location" });
      } else {
        res.status(200).json({ message: "Device found" });
      }
    } else {
      res.status(400).json({ message: "Device not found" });
    }
  } catch (error) {
    res.status(400).json({ message: err });
  }
};

const deviceRegisterNotExisting = async (req, res) => {
  try {
    const { status, capacity, serialNumber, serviceDate } = req.body;

    if (!(status && capacity && serialNumber && serviceDate)) {
      res.status(400).json({ message: "Incomplete data" });
    }
    const formattedDate = new Date(serviceDate);
    const device = await Device.create({
      status,
      serialNumber,
      capacity,
      serviceDate: formattedDate,
    });
    res.status(200).json({ message: "Device registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

const deviceRegisterExisting = async (req, res) => {
  const { username, DeviceName, serialNumber, location } = req.body;

  if (!username && !serialNumber && !DeviceName) {
    return res
      .status(400)
      .json({ message: "Username and serial number  and name are required." });
  }

  try {
    const device = await Device.findOne({ serialNumber });
    if (!device) {
      res.status(400).json({ message: "Device does not exist" });
    }
    const updateResult = await Device.updateOne(
      { serialNumber },
      { $addToSet: { username: username }, $set: { DeviceName: DeviceName } }
    );
    if (location) {
      const updateLocation = await Device.updateOne(
        { serialNumber },
        { $set: { location: location } }
      );
    }
    if (updateResult.nModified === 0) {
      return res.status(400).json({
        message: "No changes made. Username might already be present.",
      });
    }
    res.status(200).json({ message: "User added to device successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllDevices = async (req, res) => {
  const { username } = req.params;
  if (!username) {
    res.status(400).json({ message: "Incomplete Data" });
  }
  try {
    const devices = await Device.find({ username });
    if (devices.length === 0) {
      return res
        .status(404)
        .json({ message: "User does not have any devices" });
    }
    res.status(200).json({ devices });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateLevel = async (req, res) => {
  const { waterLevel, serialNumber } = req.body;
  if (serialNumber == null || waterLevel == null) {
    res.status(400).json({ message: "Incomplete Data" });
  }
  try {
    const device = await Device.findOne({ serialNumber });
    if (!device) {
      res.status(400).json({ message: "Device does not exist" });
    }
    const newLevel = device.level + waterLevel;
    const updatedDevice = await Device.updateOne(
      { serialNumber },
      { level: newLevel }
    );
    if (updatedDevice.nModified === 0) {
      res.status(400).json({ message: "Error updating the level" });
    }
    res.status(200).json({ message: "Level Updated" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

const removeDevice = async (req, res) => {
  const { serialNumber } = req.body;
  try {
    const deviceExists = await Device.findOne({ serialNumber });
    if (!deviceExists) {
      res.status(400).json({ message: "Device not registered" });
    }

    const device = await Device.deleteOne({ serialNumber });
    if (device.deletedCount === 0) {
      res.status(404).json({ message: "Device not found." });
    }
    // console.log(serialNumber);
    res.status(200).json({ message: "Device deleted successfully." });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

const addServiceDate = async (req, res) => {
  const { serviceDate, serialNumber } = req.body;
  try {
    const deviceExist = await Device.findOne({ serialNumber });
    if (!deviceExist) {
      res.status(400).json({ message: "Device does not exist" });
    }
    const updateDate = await Device.updateOne(
      { serialNumber },
      {
        $addToSet: { serviceDate: serviceDate },
        $set: { level: 0 },
      }
    );
    if (updateDate.nModified === 0) {
      return res.status(400).json({
        message: "Date not added",
      });
    }
    res.status(200).json({ message: "Service date added" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

module.exports = {
  deviceRegisterNotExisting,
  getAllDevices,
  checkDeviceExists,
  deviceRegisterExisting,
  updateLevel,
  removeDevice,
  addServiceDate,
};
