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

var mraa = require("mraa"),
    withFrequency = require('./utils').withFrequency,
    RED = new mraa.Gpio(2),
    GREEN = new mraa.Gpio(3),
    FLOOR1 = new mraa.Gpio(8),
    FLOOR2 = new mraa.Gpio(9),
    PARKING1 = new mraa.Aio(0),
    PARKING2 = new mraa.Aio(1),
    LUMINOSITY = new mraa.Aio(2),
    config = {
        limitIr: 300,
        limitLum: 500,
        semaphoreTime: 20
    },
    data = {},
    redStatus = true,
    semaphoreHandler;

function setLed(led, status) {
    led.write(status?1:0);
}

function manageParking() {
    data.park1 = PARKING1.read() > config.limitIr;
    data.park2 = PARKING2.read() > config.limitIr;
}


function manageLighting() {
    var value = LUMINOSITY.read();

    if (value < config.limitLum) {
        setLed(FLOOR1, 1);
        setLed(FLOOR2, 1);        
    } else {
        setLed(FLOOR1, 0);
        setLed(FLOOR2, 0);        
    }
    
    data.lum = value;
}

function manageSemaphores() {
    redStatus = !redStatus; 
    setLed(RED, redStatus);
    setLed(GREEN, !redStatus);    
}

function step() {
    semaphoreHandler();
    manageParking();
    manageLighting();
}

function get(attribute) {
    return data[attribute];
}

function reloadConfig() {
    semaphoreHandler = withFrequency(manageSemaphores, config.semaphoreTime);    
}

function set(attribute, value) {
    config[attribute] = value;
    reloadConfig();
}

function getAll() {
    return data;
}

function init() {
    reloadConfig();
    RED.dir(mraa.DIR_OUT);
    GREEN.dir(mraa.DIR_OUT);
    FLOOR1.dir(mraa.DIR_OUT);
    FLOOR2.dir(mraa.DIR_OUT);
}

exports.init = init;
exports.step = step;
exports.set = set;
exports.get = get;
exports.getAll = getAll;
