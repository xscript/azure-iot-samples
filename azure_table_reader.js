'use strict';

var azure = require('azure-storage');
var tableService = azure.createTableService();

var timestamp = new Date().getTime();

function readNewMessage() {
    var date = new Date();
    var currentDate = '' + date.getFullYear() + date.getUTCMonth() + date.getUTCDate();
    var condition = 'PartitionKey eq ? and RowKey gt ? ';
    //console.log('Query Condition: ' + condition);
    var query = new azure.TableQuery().where(condition, currentDate, timestamp + '');

    tableService.queryEntities('mytable', query, null, function(error, result, response) {
        timestamp = new Date().getTime();
        setTimeout(readNewMessage, 1);
        if (error) {
            console.log('Fail to read messages: ' + error);
            return;
        }
        // result.entries contains entities matching the query
        if (result.entries.length == 0) {
            console.log('No New Message.');
            return;
        }
        console.log('New Messages:\n');
        console.log('RowKey: ' + timestamp);
        for(var i = 0; i < result.entries.length; i++){
            console.log(result.entries[i].message['_']);
            console.log('RowKey: ' + JSON.stringify(result.entries[i].RowKey['_']));
        }
    });
}

readNewMessage();