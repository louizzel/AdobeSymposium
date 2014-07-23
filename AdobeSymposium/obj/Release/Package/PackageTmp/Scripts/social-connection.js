/* LinkedIn JavaScript API Start */
function onLinkedInLoad() {
    IN.Event.on(IN, 'auth', onLinkedInAuth);
    $('a[id*=li_ui_li_gen_]').css({ marginBottom: '20px' }).html('<img src="/Images/linkedin_sm.png" height="50" width="50" border="0" />');
}

function onLinkedInAuth() {
    IN.API.Profile('me').fields("id", "headline", "firstName", "lastName", "industry", "pictureUrl", "siteStandardProfileRequest").result(retrieveProfile);
}

function retrieveProfile(profile) {
    IN.API.Raw("/people/~/current-status").method("PUT")
    .body(JSON.stringify("This is just a test using my LinkedIn profile. Sorry for any inconvenience. "))
    .result(function (result) {}).error(function (error) {});

    localStorage["linkedIn"] = profile.values[0].siteStandardProfileRequest.url;
}
/* LinkedIn JavaScript API End */

/* ngFacebook Start */
function statusChangeCallback(response) {
    if (response.status === 'connected') {
        collectData();
    }
}

function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '303989436445285', // 1458113911107457 - liveKey, 303989436445285 - testKey
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true, // parse social plugins on this page
        version: 'v2.0' // use version 2.0
    });

    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.0";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function collectData() {
    FB.api('/me/feed', 'post', { message: "This is just a test using my Facebook profile. Sorry for any inconvenience. Time posted: " + new Date()/*"I'm at the Adobe Symposium. #AdobeSymp"*/ }, function (result) {
        FB.api('/me', function (response) {
            localStorage["facebook"] = response.link;
        });
    });
}
/* ngFacebook End */

/* Google Plus Start */
(function () {
    var po = document.createElement('script');
    po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
})();

function render() {
    var additionalParams = {
        'callback': signinCallback
    };

    var signinButton = document.getElementById('signinButton');
    signinButton.addEventListener('click', function () {
        gapi.auth.signIn(additionalParams);
    });
}

function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
        document.getElementById('signinButton').setAttribute('style', 'display: none');
        gapi.client.load('plus', 'v1', function () {
            var request = gapi.client.plus.people.get({
                'userId': 'me'
            });
            request.execute(function (response) {
                localStorage["gPlus"] = response.url;
            });
        });
    } else {
        console.log('Sign-in state: ' + authResult['error']);
    }
}

(function () {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();
/* Google Plus End */