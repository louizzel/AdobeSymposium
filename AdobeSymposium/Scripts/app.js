//var hash = CryptoJS.SHA1("Message"); 

//linkedIn Details:
//var client_id = "75dscar65crn9h";
//var client_secret = "wTIOLLcELj5w3vaG";

var app = angular.module('symposiumApp', ['ngRoute', 'ngFacebook']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', { controller: 'ProfileController', templateUrl: '/Markups/Index.html' })
        .when('/connect', { controller: 'ConnectController', templateUrl: '/Markups/Connect.html' })
        .when('/register', { controller: 'RegistrationController', templateUrl: '/Markups/Register.html' })
        .when('/test/', { controller: 'TestController', templateUrl: '/Markups/Test.html' })
        //.when('/login', { /*controller: 'PageController',*/ templateUrl: '/Markups/Login.html' })
        .otherwise({ redirectTo: '/' });
}])

/* ngFacebook Start */
app.config(function ($facebookProvider) {
    $facebookProvider.setAppId(303989436445285);
}).run(function ($rootScope) {
    // This is called with the results from from FB.getLoginStatus().
    function statusChangeCallback(response) {
        console.log('statusChangeCallback');
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

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    function checkLoginState() {
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });
    }

    window.fbAsyncInit = function () {
        FB.init({
            appId: '303989436445285',
            cookie: true,  // enable cookies to allow the server to access the session
            xfbml: true,  // parse social plugins on this page
            version: 'v2.0' // use version 2.0
        });

        // Now that we've initialized the JavaScript SDK, we call 
        // FB.getLoginStatus().  This function gets the state of the
        // person visiting this page and can return one of three states to
        // the callback you provide.  They can be:
        //
        // 1. Logged into your app ('connected')
        // 2. Logged into Facebook, but not your app ('not_authorized')
        // 3. Not logged into Facebook and can't tell if they are logged into
        //    your app or not.
        //
        // These three cases are handled in the callback function.

        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });

    };

    // Load the SDK asynchronously
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.0";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    function testAPI() {
        console.log('Welcome! Fetching your information.... ');
        FB.api('/me', function (response) {
            console.log('Successful login for: ' + response.name);
            console.log('Thanks for logging in, ' + response.name + '!');
        });
    }
});

app.controller('TestController', function ($scope, $http, $facebook) {
    function refresh() {
        $facebook.api('/me').then(
            function (response) {
                $scope.welcomeMsg = 'Welcome to the Adobe Symposium App ' + response.name;
            },
            function (err) {
                $scope.welcomeMsg = "Please log in";
            });
    }
});

/* ngFacebook End */

app.controller('ProfileController', function ($scope, $http) {
    $scope.active = false;
    var profile = {};
    if (localStorage["user_id"] != null) {
        $scope.active = true;
        $scope.user = {};

        $http({
            method: 'GET',
            url: '/api/profile',
            params: { id: localStorage["user_id"] }
        }).success(function (data) {
            $scope.init(data);
        }).error(function (err) {
            console.log("An error occured while retrieving the user's profile. " + err);
        });

        $scope.init = function (data) {
            $scope.user.Id = data.Id;
            $scope.user.FirstName = data.FirstName;
            $scope.user.LastName = data.LastName;
            $scope.user.Company = data.Company;
            $scope.user.Email = data.Email;
            $scope.user.ContactNumber = data.ContactNumber;
            $scope.user.Industry = data.Industry;
            $scope.user.Role = data.Role;
            $scope.user.ProfilePicture = data.ProfilePicture;
            $scope.user.LinkedIn = data.LinkedIn;
            $scope.user.Twitter = data.Twitter;
            $scope.user.GPlus = data.GPlus;
        };

        $scope.getIndustry = function (id) {

        };

        $scope.getRole = function (id) {

        };
    }
    $scope.loginUser = function () {
        $http({
            method: 'GET',
            url: '/api/login',
            params: {
                email: $scope.login.email,
                password: CryptoJS.SHA1($scope.login.password).toString()
            }
        }).success(function (result) {
            result = result.replace(/"/g, '');
            $scope.login.error = "";
            if (result.indexOf("Ok.") > -1) {
                var temp = result.split(".");
                localStorage["user_id"] = temp[1];
                window.location = '/';
            } else {
                $scope.login.error = result;
            }
        }).error(function () {
        });

    };

    $scope.UserLogout = function () {
        localStorage.clear();
        IN.User.logout($scope.UserLogout2, window);
    };

    $scope.UserLogout2 = function () {
        $scope.active = false;
        window.location = '/';
    };

    $scope.UserRegister = function () {
        window.location.href = '/#/connect';
    };
});

app.controller('ConnectController', function ($scope, $http) {
});

app.controller('RegistrationController', function ($scope, $http) {

    $scope.user = {};
    $scope.industryList = [];

    $scope.getIndustryList = function () {
        $http.get('/api/industry').success(function (values) {
            $scope.industryList = values;
            $http({ method: 'GET', url: '/api/industry', params: { industry: localStorage["industry"] } }).success(function (id) {
                if (id > 0)
                    localStorage["industry"] = id;
                else
                    localStorage["industry"] = 1;
                $scope.init();
            }).error(function () {
                localStorage["industry"] = 1;
            });
        }).error(function () {
            console.error('Error retrieving list');
        });
    };

    $scope.getIndustryList();

    $scope.init = function () {
        if (localStorage['socialMedia'] == 'L') {
            $scope.user = {
                firstName: localStorage['firstName'],
                lastName: localStorage["lastName"],
                profilePicture: localStorage["pictureUrl"],
                company: localStorage["headline"].split("at")[1],
                role: localStorage["headline"].split("at")[0],
                industry: localStorage["industry"],
                linkedIn: localStorage["linkedIn"],
                ranOne: Math.floor((Math.random() * 10) + 1),
                ranTwo: Math.floor((Math.random() * 10) + 1)
            };
        } else if (localStorage['socialMedia'] == 'F') {
            $scope.user = {
                firstName: localStorage['firstName'],
                lastName: localStorage["lastName"],
                profilePicture: localStorage["pictureUrl"],
                //company: localStorage["headline"].split("at")[1],
                //role: localStorage["headline"].split("at")[0],
                //industry: localStorage["industry"],
                //linkedIn: localStorage["linkedIn"],
                facebook: localStorage["facebook"],
                ranOne: Math.floor((Math.random() * 10) + 1),
                ranTwo: Math.floor((Math.random() * 10) + 1)
            };
        } else {
            $scope.user = {
                ranOne: Math.floor((Math.random() * 10) + 1),
                ranTwo: Math.floor((Math.random() * 10) + 1)
            };
        }

        $scope.emailCheck = true;
    }

    $scope.emailChecker = function () {
        if ($scope.user.email) {
            console.log($scope.user.email);
            $http({
                method: 'GET', url: '/api/registration', params: { email: $scope.user.email }
            }).success(function (feedback) {
                if (feedback == 0)
                    $scope.emailCheck = true;
                else
                    $scope.emailCheck = false;
                console.log($scope.emailCheck);
            }).error(function (err) {
                console.log('Error occurred. ' + err);
            });
        }
    };

    $scope.registerUser = function (isValid) {
        $scope.formSubmitted = true;
        //if (isValid) {
        if ($scope.user.ranAns == ($scope.user.ranOne + $scope.user.ranTwo)) {
            if ($scope.user.password === $scope.user.confirmPassword) {
                var x = CryptoJS.SHA1($scope.user.confirmPassword);
                $scope.user.password = CryptoJS.SHA1($scope.user.confirmPassword).toString();
                $scope.user.confirmPassword = null;
                console.log($scope.user.password);
                $http.post('/api/registration', $scope.user).success(function (feedback) {
                    if (feedback > 0) {
                        //From linkedIn API for posting a status
                        //IN.UI.Share().params({
                        //    url: 'http://localhost:2438'
                        //}).place();
                        localStorage["user_id"] = feedback;
                        window.location = '/#/';
                    }
                }).error(function (err) {
                    console.log('Error occurred during form submission. ' + err);
                });
            }
        }
        //}
    };

    $scope.client_id = "75dscar65crn9h";
    $scope.client_secret = "wTIOLLcELj5w3vaG";
    $scope.redirect_uri = 'http://localhost:2438/home/retrieve';
    //$http({
    //    method: 'POST',
    //    url: 'https://www.linkedin.com/uas/oauth2/accessToken?grant_type=authorization_code&code=' + getQueryVariable("code") + '&client_id=' + $scope.client_id + '&client_secret=' + $scope.client_secret + '&redirect_uri=' + $scope.redirect_uri
    //    , headers: {
    //        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
    //        'Access-Control-Allow-Origin': '*',
    //        'Authorization': 'Basic ' + getQueryVariable("code")
    //    }
    //}).success(function (data, status, headers, config) {
    //    console.log('success');
    //}).error(function (data, status, headers, config) {
    //    console.log('error');
    //});

    //function getQueryVariable(variable) {
    //    var query = window.location.href.substring(window.location.href.indexOf("?") + 1);
    //    var vars = query.split("&");
    //    for (var i = 0; i < vars.length; i++) {
    //        var pair = vars[i].split("=");
    //        if (pair[0] == variable) { return pair[1]; }
    //    }
    //    return (false);
    //}
});