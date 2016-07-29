'use strict';

var configProvider = require('./config_provider.js');
var iothub = require('azure-iothub');
var connectionString = configProvider.getIoTHubConnectionString();
var registry = iothub.Registry.fromConnectionString(connectionString);

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Give a name to your new device: ', function (answer) {
  createNewDevice(answer);
  rl.close();
});

function createNewDevice(deviceId) {
  var device = new iothub.Device(null);
  device.deviceId = deviceId;
  registry.create(device, function(err, deviceInfo, res) {
    if (err) {
      registry.get(device.deviceId, printDeviceInfo);
    }
    if (deviceInfo) {
      printDeviceInfo(err, deviceInfo, res);
      configProvider.addDevice(deviceInfo.deviceId, deviceInfo.authentication.SymmetricKey.primaryKey);
    }
  });
}

function printDeviceInfo(err, deviceInfo, res) {
  if (deviceInfo) {
    console.log('Device id: ' + deviceInfo.deviceId);
    console.log('Device key: ' + deviceInfo.authentication.SymmetricKey.primaryKey);
  }
}