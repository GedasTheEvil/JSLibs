/**
 * Converts an unsigned int (base 10) to a (base 64) string and vice versa. This is a numeric conversion and to to be confused with
 * string (base 64) conversions such as atob, btoa.
 *
 * @param {number} integer
 * @constructor
 */
function Base64UInt(integer) {
    "use strict";
    var $public = {},
        $private = {};

    $private.number = 0;
    $private.values = '0123456789abcdefghijklmnopqrstuvwxyz_-ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $private.string = '0';

    $private.construct = function () {
        if (typeof initial_value === 'number') {
            initial_value = parseInt(initial_value, 10);
            if (!isNaN(initial_value)) {
                $private.number = initial_value;
            }
            $private.string = $private.encode($private.number);
        } else if (typeof initial_value === 'string') {
            $private.string = initial_value;
            $private.number = $private.decode(initial_value);
        }        
    };

    /**
     * @param {number|int} number
     *
     * @return {string}
     */
    $private.encode = function (number) {
        var remainder,
            base = parseInt(number, 10),
            string = [];

        while (base >= $private.values.length) {
            remainder = base % $private.values.length;
            base = Math.floor(base / $private.values.length);
            string.push($private.values[remainder]);
        }

        if (base > 0) {
            string.push($private.values[base]);
        }

        return string.reverse().join('');
    };

    /**
     * @param {string} string
     *
     * @return {number}
     */
    $private.decode = function (string) {
        var base = string.split(''),
            key,
            number = 0,
            temp,
            power;

        for (key = base.length - 1; key >= 0; key--) {
            temp = $private.values.indexOf(base[key]);

            if (temp !== -1) {
                power = base.length - 1 - key;
                number += temp * Math.pow($private.values.length, power);
            } else {
                throw ["Invalid char detected", base[key]].join(": ");
            }

        }

        return number;
    };

    /**
     * @param {string|number|int} number
     * @returns {string}
     */
    $public.numberToString = function (number) {
        number = parseInt(number, 10);

        if (isNaN(number)) {
            throw "The argument must be an Integer!";
        }

        return $private.encode(number);
    };

    $public.stringToNumber = function (string) {
        if (typeof string !== 'string') {
            throw "The argument must be a String!";
        }

        return $private.decode(string);
    };

    $public.valueOf = function () {
        return $private.number;
    };

    $public.toString = function () {
        return $private.string;
    };

    $public.destruct = function () {
        $private = null;
        $public = null;
    };

    // Declaration ends
    $private.construct();
    
    return $public;
}
