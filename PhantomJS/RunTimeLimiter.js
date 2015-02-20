/*jslint devel:true */
/*global phantom */

/**
 * A tool to limit total runtime of the Phantom script in minutes
 * @param construction_minutes
 * @constructor
 */
function RunTimeLimiter(construction_minutes) {
    "use strict";

    var $public = {},
        $private = {};

    $private.timeout_handle = null;

    $public.disable = function () {
        if ($private.timeout_handle !== null) {
            clearTimeout($private.timeout_handle);
            $private.timeout_handle = null;
        }
    };

    $public.reset = function (minutes) {
        $public.disable();
        $private.set(minutes);
    };

    $private.set = function (minutes) {
        $private.timeout_handle = setTimeout(function () {
            console.log('Max run time exceeded');
            phantom.exit();
        }, Math.ceil(1000 * 60 * minutes)); // 5 minutes
    };

    $private.set(construction_minutes);
    
    return $public;
}
