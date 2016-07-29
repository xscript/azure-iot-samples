'use strict';

var config = require("./config.json");
var fs = require("fs");

function saveConfigToFile() {
    fs.writeFile("./config.json", JSON.stringify(config, null, 4), function(error) {
        if (error) {
            throw new Error(error);
        }
    });
}

exports.addIotHub = function (host, accessKeyName, accessKey) {
    if (host && accessKeyName && accessKey) {
        config["iot-hub-host"] = host;
        config["iot-hub-access-key-name"] = accessKeyName;
        config["iot-hub-access-key"] = accessKey;
        saveConfigToFile();
        return;
    }
    throw new Error("Invalid IoT Hub information");
}

exports.getIoTHubConnectionString = function () {
    var host = config["iot-hub-host"];
    var accessKeyName = config["iot-hub-access-key-name"];
    var accessKey = config["iot-hub-access-key"];
    if (host && accessKeyName && accessKey) {
        return "HostName=" + host + ";SharedAccessKeyName=" + accessKeyName + ";SharedAccessKey=" + accessKey;
    }
    throw new Error("Invalid IoT Hub configuration in config.json");
}

exports.addDevice = function (deviceId, deviceKey) {
    var devices = config["devices"] || {};
    if (devices[deviceId]) {
        if (devices[deviceId] !== deviceKey) {
            throw new Error("Device with the same Id is already in the device list: " + deviceId);
        } 
        console.info("Device is already in the device list. No action taken.");
        return;
    }
    devices[deviceId] = deviceKey;
    saveConfigToFile();
}

exports.getDefaultDeviceId = function () {
    var devices = config["devices"];
    var firstDeviceId = Object.keys(devices)[0];
    if (firstDeviceId) {
        return firstDeviceId;
    }
    throw new Error("No device not found");
}

exports.getDeviceConnectionString = function (deviceId) {
    var host = config["iot-hub-host"];
    var devices = config["devices"];
    if (devices[deviceId]) {
        return "HostName=" + host + ";DeviceId=" + deviceId + ";SharedAccessKey=" + devices[deviceId];
    }
    throw new Error("Device not found: " + deviceId);
}

