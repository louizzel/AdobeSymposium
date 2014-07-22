/* LinkedIn JavaScript API Start */
function onLinkedInLoad() {
    IN.Event.on(IN, 'auth', onLinkedInAuth);
    $('a[id*=li_ui_li_gen_]').css({ marginBottom: '20px' }).addClass('icon1').html('<img src="/Images/linkedin.png" height="96" width="99" border="0" />');
}

function onLinkedInAuth() {
    IN.API.Profile('me').fields("id", "headline", "firstName", "lastName", "industry", "pictureUrl", "siteStandardProfileRequest").result(retrieveProfile);
}

function retrieveProfile(profile) {

    //UNCOMMENT ME AFTER TESTING TO POST ON YOUR WALL!
    IN.API.Raw("/people/~/current-status").method("PUT")
    .body(JSON.stringify("This is just a test using my LinkedIn profile. Sorry for any inconvenience. "))
    .result(function (result) {
    }).error(function (error) { 
        //console.log("Unable to post in your LinkedIn profile."); 
    });
    
    members = profile;
    member = profile.values[0];
    console.log(member.firstName);
    //alert(member.industry.replace('and', '&') + "\n" + member.siteStandardProfileRequest.url);
    localStorage["socialMedia"] = "L";
    localStorage["firstName"] = member.firstName;
    localStorage["headline"] = member.headline;
    localStorage["lastName"] = member.lastName;
    localStorage["pictureUrl"] = member.pictureUrl;
    localStorage["industryName"] = member.industry.replace('and', '&');
    localStorage["linkedIn"] = member.siteStandardProfileRequest.url;
    location.href = "/#/register";
}
/* LinkedIn JavaScript API End */

/* ngFacebook Start */
function statusChangeCallback(response) {
    //console.log('statusChangeCallback  *connect.js');
    //console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();

    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        //console.log('Please log into this app. *connect.js');
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        //console.log('Please log into Facebook. *connect.js');
    }
}

function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '303989436445285',
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

function testAPI() {
    FB.api('/me/feed', 'post', { message: "This is just a test using my Facebook profile. Sorry for any inconvenience. Time posted: " + new Date()/*"I'm at the Adobe Symposium. #AdobeSymp"*/ }, function (result) {
        console.log(result);
        FB.api('/me', function (response) {
            localStorage["socialMedia"] = "F";
            localStorage["firstName"] = response.first_name;
            localStorage["lastName"] = response.last_name;
            localStorage["facebook"] = response.link;
        });
        FB.api('/me/picture', function (response) {
            localStorage["pictureUrl"] = response.data.url;
        },{scope: 'publish_actions'});

        location.href = "/#/register";
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

/* Executed when the APIs finish loading */
function render() {

    // Additional params including the callback, the rest of the params will
    // come from the page-level configuration.
    var additionalParams = {
        'callback': signinCallback
    };

    // Attach a click listener to a button to trigger the flow.
    var signinButton = document.getElementById('signinButton');
    signinButton.addEventListener('click', function () {
        gapi.auth.signIn(additionalParams); // Will use page level configuration
    });
}

function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
        // Update the app to reflect a signed in user
        // Hide the sign-in button now that the user is authorized, for example:
        document.getElementById('signinButton').setAttribute('style', 'display: none');
        gapi.client.load('plus', 'v1', function () {
            var request = gapi.client.plus.people.get({
                'userId': 'me'
            });
            request.execute(function (response) {

                console.log(response);
                localStorage["socialMedia"] = "G";
                localStorage["firstName"] = response.name.givenName;
                localStorage["lastName"] = response.name.familyName;
                localStorage["gPlus"] = response.url;
                localStorage["pictureUrl"] = response.image.url.replace('sz=50', 'sz=100');
                location.href = "/#/register";
            });
        });
    } else {
        // Update the app to reflect a signed out user
        // Possible error values:
        //   "user_signed_out" - User is signed-out
        //   "access_denied" - User denied access to your app
        //   "immediate_failed" - Could not automatically log in the user
        console.log('Sign-in state: ' + authResult['error']);
    }
}


(function () {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();
/* Google Plus End */

//$('document').ready(function() {
//    setTimeout(function () {
//        if (($('span.IN-widget').length <= 0) && ($('span._4z_f').length <= 0)) {
//            location.reload();
//        }
//    }, 3000);
//});
