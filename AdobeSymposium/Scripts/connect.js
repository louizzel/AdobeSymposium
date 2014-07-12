
$(document).ready(function () {
    setTimeout(function () {
        if (($('span.IN-widget').length <= 0) && ($('span._4z_f').length <= 0)) {
            location.reload();
        }
    }, 5000);
});

/* LinkedIn JavaScript API Start */
function onLinkedInLoad() {
    IN.Event.on(IN, 'auth', onLinkedInAuth);
}

function onLinkedInAuth() {
    IN.API.Profile('me').fields("id", "headline", "firstName", "lastName", "industry", "pictureUrl", "siteStandardProfileRequest").result(retrieveProfile);
}

function retrieveProfile(profile) {

    IN.API.Raw("/people/~/current-status").method("PUT")
    .body(JSON.stringify("This is just a test using my LinkedIn profile. Sorry for any inconvenience. Time posted: " + new Date()))
    .result(function (result) {
    }).error(function (error) { console.log("Unable to post in your LinkedIn profile.") });

    members = profile;
    member = profile.values[0];
    console.log(member.firstName);
    localStorage["socialMedia"] = "L";
    localStorage["firstName"] = member.firstName;
    localStorage["headline"] = member.headline;
    localStorage["lastName"] = member.lastName;
    localStorage["pictureUrl"] = member.pictureUrl;
    localStorage["industry"] = member.industry;
    localStorage["linkedIn"] = member.siteStandardProfileRequest.url;
    window.location = "/#/register";
}
/* LinkedIn JavaScript API End */

/* ngFacebook Start */
function statusChangeCallback(response) {
    console.log('statusChangeCallback Connect.html');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        console.log('Please log into this app.');
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        console.log('Please log into Facebook.');
    }
}

function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

function testAPI() {
    FB.api('/me/feed', 'post', { message: "This is just a test using my Facebook profile. Sorry for any inconvenience. Time posted: " + new Date()/*"I'm at the Adobe Symposium. #AdobeSymp"*/ }, function (result) {
        FB.api('/me', function (response) {
            localStorage["socialMedia"] = "F";
            localStorage["firstName"] = response.first_name;
            localStorage["lastName"] = response.last_name;
            localStorage["facebook"] = response.link;
        });
        FB.api('/me/picture', function (response) {
            console.log(response);
            console.log(response.data);
            console.log(response.data.url);
            localStorage["pictureUrl"] = response.data.url;
        });

        window.location = "/#/register";
    });
}
/* ngFacebook End */
