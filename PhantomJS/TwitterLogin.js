/*jslint */
/*global phantom, require, RunTimeLimiter, Waiter, $ */

phantom.injectJs('lib/RunTimeLimiter.js');
phantom.injectJs('lib/Waiter.js');

(new RunTimeLimiter(2));

var page = require('webpage').create(null),
    system = require('system');

function TwitterLogin(email, pass) {
    "use strict";
    var $private = {},
        $public = {};

    $private.main_url = 'https://twitter.com/';

    $private.test_message = '<div>Test</div><div><b>Message</b></div>';

    $private.construct = function () {
        page.open($private.main_url, $private.login);
    };

    $private.login = function (status) {
        if (status !== 'success') {
            $private.reportFail('login');
            return;
        }

        (new Waiter(
            page, 
            $private.hasLoginForm, 
            $private.doLogin
        ));
    };

    $private.hasLoginForm = function () {
        return (document.querySelector('form.signin') !== null);
    };

    $private.doLogin = function () {
        page.evaluate(function (em, pa) {
            var e = document.getElementById('signin-email'),
                p = document.getElementById('signin-password');
            e.value = em;
            p.value = pa;
            $('button[type="submit"].primary-btn').click();
        }, email, pass);

        $private.handleTweet();
    };

    $private.handleTweet = function () {
        (new Waiter(
            page,
            $private.profileIsLoaded,
            $private.writeTestMessage,
            $private.buildError('handleTweet:: failed to load')
        ));
    };

    $private.buildError = function (message) {
        return function () {
            $private.reportFail(message);
        };
    };

    $private.profileIsLoaded = function () {
        return (document.querySelector('.DashboardProfileCard-content') !== null &&
                document.querySelector('#tweet-box-mini-home-profile') !== null);
    };

    $private.writeTestMessage = function () {
        console.log('Profile has loaded!');
        (new Waiter(
            page, 
            $private.jQueryIsLoaded, 
            $private.postTweet, 
            $private.buildError('Failed to load jQuery?')
        ));
    };

    $private.jQueryIsLoaded = function () {
        return (typeof window['$'] === "function");
    };

    $private.postTweet = function () {
        page.evaluate(function (message) {
            var field = $('#tweet-box-mini-home-profile'),
                //button = $('tweet-button button.primary-btn'),
                press = jQuery.Event("keypress");
                
            press.ctrlKey = false;
            press.which = 64;
            
            field.focus().click();
            $('.tweet-content .rich-normalizer').html(message);
            field.html(message);            
            field.trigger('keydown').trigger(press).trigger('keyup').trigger('paste');
            field.focus().click();
            
        }, $private.test_message);
        
        (new Waiter(
            page, 
            $private.tweetButtonIsEnabled, 
            $private.clickTweetButton,
            $private.forceEnableButton
        ));                
    };
    
    $private.forceEnableButton = function () {
        buildError('Button can\'t be enabled?');
        var classList = page.evaluate(function () {
            
        });
    };
    
    $private.tweetButtonIsEnabled = function () {
        return (!$('.timeline-tweet-box .tweet-button button.primary-btn').hasClass('disabled'));
    };
    
    $private.clickTweetButton = function () {
        page.evaluate(function () {
            $('.timeline-tweet-box .tweet-button button.primary-btn').focus().trigger('mouseover').trigger('mousedown').trigger('mousedown').click();
            $('.timeline-tweet-box form.t1-form.tweet-form').submit();
        });
        
        (new Waiter(
            page,
            $private.tweetWasPosted,
            $private.EndAndRender,
            $private.buildError('Posting never happened?')
        ));
    };
    
    $private.tweetWasPosted = function () {
        return $('.message').is(':visible');
    };
    
    $private.EndAndRender = function () {
        page.render(['screens/profile_click_tweet.png'].join(''));
        console.log('tweet posted!');
        phantom.exit();
    };

    $private.reportFail = function (arg) {
        var msg = JSON.stringify(arg);
        console.log('Error:', msg);
        page.render(['screens/', btoa(msg).substring(2, 8),'.png'].join(''));
        phantom.exit();
    };

    //CLASS END
    $private.construct();
    return $public;
}

(new TwitterLogin(system.args[1], system.args[2]));
