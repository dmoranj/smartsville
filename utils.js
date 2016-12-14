
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

function withFrequency(fn, fq) {
    var counter = new Number(fq);
    
    return function stepper() {
        if (counter == 0) {
            fn();
            counter = new Number(fq);
        } else {
            counter--;
        }
    }
}

exports.withFrequency = withFrequency;
