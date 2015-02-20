/*jslint devel:true */

/**
 * Runs the answer function when the condition is met. Runs failure when this fails. Has debugging options
 * @param page
 * @param {function} condition
 * @param {function} success
 * @param {function} failure
 * @param {*} condition_valid_when [optional]
 *
 * @constructor
 */

function Waiter(page, condition, success, failure, condition_valid_when) {
    "use strict";
    var $private = {},
        $public = {};

    if (condition_valid_when === undefined) {
        condition_valid_when = true;
    }

    $private.period = 250; //ms
    $private.max_wait_time = 3000; //ms
    $private.finished = false;
    $private.failed = false;
    $private.answer = null;

    $private.dummy_factory = function (name) {
        return function () {
            throw ["Dummy function was called", name].join(': ');
        };
    };

    if (typeof condition !== "function") {
        condition = $private.dummy_factory('condition');
    }
    if (typeof success !== "function") {
        success = $private.dummy_factory('success');
    }
    if (typeof failure !== "function") {
        failure = $private.dummy_factory('failure');
    }

    $private.time = function () {
        return new Date().getTime();
    };

    $private.start = $private.time();

    $private.time_exceeded = function () {
        return ($private.time() - $private.start >= $private.max_wait_time);
    };

    $private.interval_handle = setInterval(function () {
        var condition_is_met = page.evaluate(condition);

        if (condition_is_met === condition_valid_when) {
            clearInterval($private.interval_handle);
            $private.finished = true;
            console.log('Waiter success!');
            $private.answer = success();
        } else if ($private.time_exceeded()) {
            clearInterval($private.interval_handle);
            $private.finished = true;
            $private.failed = true;
            console.log('Waiter failure!');
            failure();
        }
    }, $private.period);

    $public.is_finished = function () {
        return $private.finished;
    };

    $public.has_failed = function () {
        if (!$private.finished) {
            throw "The waiting is not complete!";
        }

        return $private.failed;
    };

    $public.get_answer = function () {
        if ($public.has_failed()) {
            throw "Timeout has been reached!";
        }

        return $private.answer;
    };
    
    return $public;
}
