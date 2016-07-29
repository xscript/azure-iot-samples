'use strict';

var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
var configProvider = require('./config_provider.js');
var connectionString = configProvider.getIoTHubConnectionString();;
var targetDevice = configProvider.getDefaultDeviceId();;

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

function receiveFeedback(err, receiver){
  receiver.on('message', function (msg) {
    console.log('Feedback message:')
    console.log(msg.getData().toString('utf-8'));
  });
}


var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var serviceClient = Client.fromConnectionString(connectionString);
serviceClient.open(function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Service client connected');
    serviceClient.getFeedbackReceiver(receiveFeedback);

    rl.write("\nEnter message to send to device: \n");
    rl.on('line', function (input) {
      var message = new Message(input);
      message.ack = 'full';
      message.messageId = "Message@" + Date.now;
      console.log('Sending message: ' + message.getData());
      serviceClient.send(targetDevice, message, printResultFor('send'));
      rl.write("\nEnter message to send to device: \n");
    });
  }
});
