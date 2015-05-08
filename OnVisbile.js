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
        $private.trace('$private.construct');
        $private.dom = document.querySelector(selector);
        document.addEventListener('scroll', $private.listener);
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
        $private.trace('$private.isLocked');

        if ($private.lock || $private.lock_handle !== null) {
            $private.trace('$private.isLocked::1', [$private.lock, $private.lock_handle]);
            return true;
        }

        $private.lock = true;
        $private.lock_handle = setTimeout($private.liftLock, $private.timeout_interval);
        $private.trace('$private.isLocked::0');

        return false;
    };

    $private.liftLock = function () {
        $private.trace('$private.liftLock');
        $private.lock = false;
        clearTimeout($private.lock_handle);
        $private.lock_handle = null;
    };

    /** @param {HTMLElement|Node} el */
    $private.defaultOnVisible = function (el) {
        $private.trace('$private.defaultOnVisible', [el]);
        el.classList.remove($private.visible_class);
    };

    /** @param {HTMLElement|Node} el */
    $private.defaultOnNotVisible = function (el) {
        $private.trace('$private.defaultOnNotVisible', [el]);
        el.classList.add($private.visible_class);
    };

    $private.onVisible = $private.defaultOnVisible;
    $private.onNotVisible = $private.defaultOnNotVisible;

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

    $private.listener = function () {
        $private.trace('$private.listener');

        if ($private.isLocked()) {
            $private.trace('$private.listener:: is locked');
            return;
        }

        if ($private.isVisible($private.dom)) {
            $private.whenVisible($private.dom);
        } else {
            $private.whenNotVisible($private.dom);
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

    /**
     * @param {Function} f
     * @returns {OnVisbile}
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
     * @returns {OnVisbile}
     */
    $public.setOnNotVisible = function (f) {
        if (typeof f !== "function") {
            throw $private.errors.function_required;
        }

        $private.onNotVisible = f;

        return $public;
    };

    /**
     * @param {boolean} mode
     * @returns {OnVisbile}
     */
    $public.setDebug = function (mode) {
        $private.debug = !!mode;

        return $public;
    };

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
