/*jslint devel:true */
/*global window, getComputedStyle*/

/**
 * A not too resource intensive library for handling event when an element is visible in
 * the screen. Does not depend on any other library.
 *
 * @constructor
 * @param {string} selector
 * @param {HTMLDocument} document
 * @return {Object|OnVisbile}
 */
function OnVisbile(selector, document) {
    "use strict";

    var $public = this,
        $private = {};

    if ($public === window || $public === undefined) {
        $public = {};
    }

    $private.construct = function () {
        $private.trace('$private.construct', null);
        $private.dom = document.querySelector(selector);

        if ($private.dom === null) {
            console.log("Could not find element", selector);

            return;
        }

        document.addEventListener('scroll', $private.listener);
        window.addEventListener('resize', $private.listener);
    };

    // Variables

    $private.debug = false;
    $private.dom = null;
    $private.lock = false;
    $private.lock_handle = null;
    $private.timeout_interval = 100;
    $private.visible_class = 'elementIsNotVisbile';
    $private.errors = {
        "function_required": 'The callback must be a function with one argument (element)'
    };

    // Methods

    $private.isLocked = function () {
        $private.trace('$private.isLocked', null);

        if ($private.lock || $private.lock_handle !== null) {
            $private.trace('$private.isLocked::1', [$private.lock, $private.lock_handle]);
            return true;
        }

        $private.lock = true;
        $private.lock_handle = setTimeout($private.liftLock, $private.timeout_interval);
        $private.trace('$private.isLocked::0', null);

        return false;
    };

    $private.liftLock = function () {
        $private.trace('$private.liftLock', null);
        $private.lock = false;
        clearTimeout($private.lock_handle);
        $private.lock_handle = null;
    };

    /** @param {HTMLElement|Node|Object} el */
    $private.defaultOnVisible = function (el) {
        $private.trace('$private.defaultOnVisible', [el]);
        el.classList.remove($private.visible_class);
    };

    /** @param {HTMLElement|Node|Object} el */
    $private.defaultOnNotVisible = function (el) {
        $private.trace('$private.defaultOnNotVisible', [el]);
        el.classList.add($private.visible_class);
    };

    $private.doNull = function () {
        return null;
    };

    $private.onVisible = $private.defaultOnVisible;
    $private.onNotVisible = $private.defaultOnNotVisible;
    $private.onAbove = $private.doNull;
    $private.onBelow = $private.doNull;

    /** @param {HTMLElement|Node|Object} el */
    $private.whenVisible = function (el) {
        $private.trace('$private.whenVisible', [el]);
        $private.onVisible(el);
    };

    /** @param {HTMLElement|Node|Object} el */
    $private.whenNotVisible = function (el) {
        $private.trace('$private.whenNotVisible', [el]);
        $private.onNotVisible(el);
    };

    /** @param {HTMLElement|Node|Object} el */
    $private.whenAbove = function (el) {
        $private.trace('$private.whenAbove', [el]);
        $private.onAbove(el);
    };

    /** @param {HTMLElement|Node|Object} el */
    $private.whenBelow = function (el) {
        $private.trace('$private.whenBelow', [el]);
        $private.onBelow(el);
    };

    $private.listener = function () {
        $private.trace('$private.listener', null);

        if ($private.isLocked()) {
            $private.trace('$private.listener:: is locked', null);
            return;
        }

        if ($private.isVisible($private.dom)) {
            $private.whenVisible($private.dom);
        } else {
            $private.whenNotVisible($private.dom);

            if ($private.isBelow($private.dom)) {
                $private.whenBelow($private.dom);
            } else {
                $private.whenAbove($private.dom);
            }
        }
    };

    /** @param {HTMLElement|Node|Object} el
     * @return {boolean} */
    $private.isVisible = function (el) {
        var rec = el.getBoundingClientRect(),
            tViz = rec.top >= 0 && rec.top <=  window.innerHeight,
            lViz = rec.left >= 0 && rec.left <=  window.innerWidth;

        $private.trace('$private.isVisible', [(tViz && lViz)]);

        return (tViz && lViz);
    };

    /** @param {HTMLElement|Node|Object} el
     * @return {boolean} */
    $private.isBelow = function (el) {
        var rec = el.getBoundingClientRect(),
            tViz = rec.top <=  window.innerHeight;

        $private.trace('$private.isBelow', [tViz]);

        return tViz;
    };

    /**
     * @param {Function} f
     * @returns {OnVisbile|Object}
     */
    $public.setOnVisible = function (f) {
        if (typeof f !== "function") {
            throw $private.errors.function_required;
        }

        $private.onVisible = f;

        return $public;
    };

    /**
     * @param {Function} f
     * @returns {OnVisbile|Object}
     */
    $public.setOnNotVisible = function (f) {
        if (typeof f !== "function") {
            throw $private.errors.function_required;
        }

        $private.onNotVisible = f;

        return $public;
    };

    /**
     * @param {Function} f
     * @returns {OnVisbile|Object}
     */
    $public.setOnAbove = function (f) {
        if (typeof f !== "function") {
            throw $private.errors.function_required;
        }

        $private.onAbove = f;

        return $public;
    };

    /**
     * @param {Function} f
     * @returns {OnVisbile|Object}
     */
    $public.setOnBelow = function (f) {
        if (typeof f !== "function") {
            throw $private.errors.function_required;
        }

        $private.onBelow = f;

        return $public;
    };

    /**
     * @param {boolean} mode
     * @returns {OnVisbile|Object}
     */
    $public.setDebug = function (mode) {
        $private.debug = !!mode;

        return $public;
    };

    /*
    // For Google closure compiler advanced
    $public['setOnVisible'] = $public.setOnVisible;
    $public['setOnNotVisible'] = $public.setOnNotVisible;
    $public['setOnAbove'] = $public.setOnAbove;
    $public['setOnBelow'] = $public.setOnBelow;
    $public['setDebug'] = $public.setDebug;
    */

    /**
     * @param message
     * @param [args]
     */
    $private.trace = function (message, args) {
        if (!$private.debug) {
            return;
        }

        console.log(message, args);
    };

    // END
    $private.construct();
    return $public;
}

/*
// For Google closure compiler advanced
window['OnVisbile'] = OnVisbile;
*/
