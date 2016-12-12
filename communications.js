/*
 * Copyright 2016 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of smartsville
 *
 * smartsville is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * smartsville is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with smartsville.
 * If not, seehttp://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License
 * please contact with::[iot_support@tid.es]
 */
/* jslint node:true */
/* jshint unused:true */

"use strict" ;

var request = require('request'),
    smartcity = require('./smartcity'),
    withFrequency = require('./utils').withFrequency,
    config = {
        iotahost: '192.168.2.2',
        iotaport: 7896,
        frequency: 30
    },
    attributeMap = {
        semaphoreFreq: 'semaphoreTime',
        luminosityLimit: 'limitLum'
    };

function extractCommands(body) {
    var commands = body.split('|'),
        key,
        result = {};
    
    if (commands.length % 2 == 0) {        
        for (var i=1; i < commands.length; i+= 2) {
            key = commands[i-1].substr(commands[i-1].indexOf('@') + 1)
            result[key] = commands[i];
        }
    } else {
        console.log('Error processing body');
    }
    
    return result;
}

function processCommand(body) {
    var commands = extractCommands(body),
        keys = Object.keys(commands);
    
    console.log('Processing commands:\n%s', JSON.stringify(commands, null, 4));
    
    for (var i=0; i < keys.length; i++) {
        smartcity.set(attributeMap[keys[i]], commands[keys[i]]);
    }
}

function sendData(payload) {
    var requestObj = {
        url: 'http://' + config.iotahost + ':' + config.iotaport + '/iot/d',
        method: 'POST',
        body: payload,
        qs: {
            k: '1234567890',
            i: 'smartsville',
            getCmd: 1
        },
        headers: {
            'content-type': 'text/plain'
        }
    };
        
    request(requestObj, function(error, response, body) {
        if (error) {
            console.log('Error trying to send data: %s', error);
        } else if (response.statusCode == 200) {
            console.log('Data sent: %s. Data received: %s', payload, body);
            
            if (body !== '') {
                processCommand(body);
            }
        } else {
            console.log('Wrong status code sending data: %s', response.statusCode);
        }
    }); 
}

function createPayload(values) {
    var keys = Object.keys(values),
        resultList = [];
    
    for (var i = 0; i < keys.length; i++) {
        resultList.push(keys[i]);
        resultList.push(values[keys[i]]);
    }
    
    return resultList.join('|');
}

function processData() {
    var values = smartcity.getAll(),
        payload = createPayload(values);
    
    sendData(payload);
}

exports.step = withFrequency(processData, config.frequency);