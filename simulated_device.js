'use strict';

var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
var configProvider = require('./config_provider.js');
var deviceId = configProvider.getDefaultDeviceId();
var deviceConnectionString = configProvider.getDeviceConnectionString(deviceId);

var connectCallback = function (err) {
  if (err) {
    console.log('Could not connect: ' + err);
  } else {
    console.log('Client connected');

    client.on('message', function (msg) {
      console.log('Id: ' + msg.data.messageId + ' Body: ' + msg.data.data);
      client.complete(msg, printResultFor('completed'));
    });

    // Create a message and send it to the IoT Hub every second
    setInterval(function(){
        var windSpeed = 10 + (Math.random() * 4);
        var data = JSON.stringify({ deviceId: deviceId, windSpeed: windSpeed });
        var message = new Message(data);
        console.log("Sending message: " + message.getData());
        client.sendEvent(message, printResultFor('send'));
    }, 1000);
  }
};

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

var client = clientFromConnectionString(deviceConnectionString);
client.open(connectCallback);