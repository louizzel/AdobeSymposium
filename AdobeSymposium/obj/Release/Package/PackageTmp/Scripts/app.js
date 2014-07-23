//var app = angular.module('symposiumApp', ['ngRoute', 'ngFacebook']);
var app = angular.module('symposiumApp', ['ngRoute', 'ngFacebook', 'symposiumApp.services', 'symposiumApp.directives', 'symposiumApp.controllers']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', { controller: 'IndexController', templateUrl: '/Markups/Index.html' })
        .when('/signup', { controller: 'ConnectController', templateUrl: '/Markups/Connect.html' })
        .when('/register', { controller: 'RegistrationController', templateUrl: '/Markups/Register.html' })
        .when('/event', { controller: 'EventController', templateUrl: '/Markups/Event.html' })
        .when('/profile', { controller: 'mainController', templateUrl: '/Markups/Profile.html' })
        //.when('/profile', { controller: 'ProfileController', templateUrl: '/Markups/Profile.html' })
        .otherwise({ redirectTo: '/' });
}
]);

/* ngFacebook Start */
app.config(function ($facebookProvider) {
    $facebookProvider.setAppId(1458113911107457); //1458113911107457 - liveKey, 303989436445285 - testKey
});
/* ngFacebook End */

app.directive('ngUnique', ['$http', function (async) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            elem.on('blur', function (evt) {
                scope.$apply(function () {
                    var val = elem[0].value;
                    var req = { "email": val, "dbField": attrs.ngUnique }
                    var ajaxConfiguration = { method: 'GET', url: '/api/registration', params: { email: val } };

                    async(ajaxConfiguration).success(function (data, status, headers, config) {
                        if (data == 0) ctrl.$setValidity('unique', true);
                        else ctrl.$setValidity('unique', false);
                    });
                });
            });
        }
    }
}
]);

app.directive('ngFocus', [function () {
    var FOCUS_CLASS = "ng-focused";
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$focused = false;
            element.bind('focus', function (evt) {
                element.addClass(FOCUS_CLASS);
                scope.$apply(function () { ctrl.$focused = true; });
            }).bind('blur', function (evt) {
                element.removeClass(FOCUS_CLASS);
                scope.$apply(function () { ctrl.$focused = false; });
            });
        }
    }
}]);

app.controller('EventController', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/people').success(function (result) {
        $scope.users = result;
        $scope.lastUserId = result[result.length - 1].Id;
    }).error(function () {
        $scope.users = {};
    });

    setInterval(function () {
        console.log($scope.lastUserId);
        $http({
            method: 'PUT',
            url: '/api/people',
            params: {
                lastId: $scope.lastUserId
            }
        }).success(function (result) {
            if (result.length > 0) {
                $scope.users.push(result);
                $scope.lastUserId = result[result.length - 1].Id;
            }
        }).error(function (err) {
            console.log('Error encountered. Please check your internet connection. ' + err.Message);
        });
    }, 30000);


}]);

app.controller('IndexController', function ($scope, $http) {
    $scope.active = false;

    $scope.loginUser = function () {
        if ($scope.login.email != undefined || $scope.login.password != undefined) {
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
                    location.href = '/#/profile';
                    window.location = '/#/profile';
                } else {
                    $scope.login.error = result;
                }
            }).error(function () {
            });
        } else {
            $scope.login.error = "The email or password you entered is incorrect.";
        }
    };

    $scope.userRegister = function () {
        localStorage["firstLoad"] = 0;
        location.href = '/#/signup';
        window.location = '/#/signup';
    };
});

app.controller('ProfileController', function ($scope, $http) {
    if (localStorage["user_id"] != null) {
        $scope.active = true;
        $scope.user = {};

        $scope.getProfileOfConnection = function (id) {
            $http({
                method: 'GET',
                url: '/api/people',
                params: {
                    id: id,
                    user: 'user'
                }
            }).success(function (result) {
                $scope.user.selectedUser = result;
            }).error(function (err) {
                console.log('Error encountered while retrieving the user\'s profile. ' + err);
            });
        };

        //$http({
        //    method: 'GET',
        //    url: '/api/profile',
        //    params: { id: localStorage["user_id"] }
        //}).success(function (data) {
        //    $scope.roles = data.Roles;
        //    $scope.industries = data.Industries;
        //    $scope.init(data.UserProfile, data.People);
        //}).error(function (err) {
        //    console.log("An error occured while retrieving the user's profile. " + err);
        //});

        $scope.init = function (data, people) {
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
            $scope.user.selectedRoles = [];
            $scope.user.selectedIndustries = [];
            $scope.user.users = people;
            $scope.user.selectedUser = {};
        };

        $scope.toggleSelectionIndustry = function (id) {
            for (var ctr = 0; ctr < $scope.industries.length; ctr++) {
                if ($scope.industries[ctr].industryId == id.industryId) {
                    $scope.industries[ctr].visible = !$scope.industries[ctr].visible;
                }
            }
            ////source: http://stackoverflow.com/questions/14514461/how-can-angularjs-bind-to-list-of-checkbox-values
        };

        $scope.toggleSelectionRole = function (id) {
            for (var ctr = 0; ctr < $scope.roles.length; ctr++) {
                if ($scope.roles[ctr].roleId == id.roleId) {
                    $scope.roles[ctr].visible = !$scope.roles[ctr].visible;
                    break;
                }
            }
        };

        $scope.findInRoles = function (id) {
            for (var ctr = 0; ctr < $scope.roles.length; ctr++) {
                if ($scope.roles[ctr].roleId == id && $scope.roles[ctr].visible)
                    return true;
            }
            return false;
        };

        $scope.findInIndustries = function (id) {
            for (var ctr = 0; ctr < $scope.industries.length; ctr++) {
                if ($scope.industries[ctr].industryId == id && $scope.industries[ctr].visible)
                    return true;
            }
            return false;
        };
    }

    $scope.UserLogout = function () {
        localStorage.clear();

        IN.User.logout($scope.UserLogout2, window);

        gapi.auth.signOut();

        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                FB.logout(function (res) {
                    console.log(res);
                });
            }
        });

        $scope.active = false;
        location.href = '/#/';
        window.location = '/#/';
    };
});

app.controller('ConnectController', function ($scope, $http) {
    if (localStorage["firstLoad"] == 0) {
        localStorage["firstLoad"] = 1;
        location.reload();
    }

    $scope.skipThisStep = function() {
        localStorage["firstLoad"] = 0;
        location.href = '/#/register';
        window.location = '/#/register';
    }

    $scope.toTwitter = function() {
        window.location = '/twitter';
        location.href = '/twitter';
    }
});

app.controller('RegistrationController', function ($scope, $http) {

    if (localStorage["firstLoad"] == 0) {
        localStorage["firstLoad"] = 1;
        location.reload();
    }

    $scope.user = {};
    $scope.industryList = [];
    $scope.emailCheck = true;


    $scope.getDropdownList = function () {
        $http({
            method: 'GET',
            url: '/api/dropdown'
        }).success(function (values) {
            $scope.industryList = values.Industries;
            $scope.roleList = values.Roles;
            $scope.init();
        }).error(function () {
            console.error('Error retrieving list');
        });
    };

    $scope.getDropdownList();

    $scope.init = function () {
        if (localStorage['socialMedia'] == 'L') {
            $scope.user = {
                firstName: localStorage['firstName'],
                lastName: localStorage["lastName"],
                profilePicture: localStorage["pictureUrl"],
                company: localStorage["headline"].split("at ")[1],
                role: localStorage["headline"].split("at ")[0].trim(),
                linkedIn: localStorage["linkedIn"],
                industry: 1,
                ranOne: Math.floor((Math.random() * 10) + 1),
                ranTwo: Math.floor((Math.random() * 10) + 1)
            };
        } else if (localStorage['socialMedia'] == 'F') {
            $scope.user = {
                firstName: localStorage['firstName'],
                lastName: localStorage["lastName"],
                profilePicture: localStorage["pictureUrl"],
                industry: 1,
                facebook: localStorage["facebook"],
                ranOne: Math.floor((Math.random() * 10) + 1),
                ranTwo: Math.floor((Math.random() * 10) + 1)
            };
        } else if (localStorage['socialMedia'] == 'G') {
            $scope.user = {
                firstName: localStorage['firstName'],
                lastName: localStorage["lastName"],
                profilePicture: localStorage["pictureUrl"],
                industry: 1,
                gPlus: localStorage["gPlus"],
                ranOne: Math.floor((Math.random() * 10) + 1),
                ranTwo: Math.floor((Math.random() * 10) + 1)
            };
        } else if (localStorage['socialMedia'] == 'T') {
            $scope.user = {
                firstName: localStorage['firstName'],
                lastName: localStorage["lastName"],
                profilePicture: localStorage["pictureUrl"],
                industry: 1,
                twitter: localStorage["twitter"],
                ranOne: Math.floor((Math.random() * 10) + 1),
                ranTwo: Math.floor((Math.random() * 10) + 1)
            };
        } else {
            $scope.user = {
                profilePicture: '/Images/default.png',
                industry: 1,
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
                    $scope.emailCheck = true; //email is unique
                else
                    $scope.emailCheck = false; //email is not unique
                console.log($scope.emailCheck);
            }).error(function (err) {
                console.log('Error occurred. ' + err);
            });
        }
    };

    $scope.registerUser = function (isValid) {
        //var isUnique = $scope.emailChecker();
        if (isValid) {
            //if (isUnique) {
                if ($scope.user.ranAns == ($scope.user.ranOne + $scope.user.ranTwo)) {
                    if ($scope.user.password === $scope.user.confirmPassword) {
                        $scope.user.passwordHash = CryptoJS.SHA1($scope.user.confirmPassword).toString();

                        $scope.user.linkedIn = $scope.user.linkedIn == undefined ? localStorage["linkedIn"] : $scope.user.linkedIn;
                        $scope.user.facebook = $scope.user.linkedIn == undefined ? localStorage["facebook"] : $scope.user.facebook;
                        $scope.user.twitter = $scope.user.twitter == undefined ? localStorage["twitter"] : $scope.user.twitter;
                        $scope.user.gPlus = $scope.user.gPlus == undefined ? localStorage["gPlus"] : $scope.user.gPlus;
                        
                        $http.post('/api/registration', $scope.user).success(function (feedback) {
                            if (feedback > 0) {
                                localStorage["user_id"] = feedback;
                                location.href = '/#/profile';
                                window.location = '/#/profile';
                            }
                        }).error(function (err) {
                            console.log('Error occurred during form submission. ' + err);
                        });
                    }
                //}
            } else {
                $scope.emailCheck = false;
            }
        }
    };

    $scope.spamChecker = function () {
        if ($scope.user.ranAns != ($scope.user.ranOne + $scope.user.ranTwo)) {
            $scope.user.ranOne = Math.floor((Math.random() * 10) + 1);
            $scope.user.ranTwo = Math.floor((Math.random() * 10) + 1);
            $scope.spamError = true;
        } else {
            $scope.spamError = false;
        }
    };
});