'use strict';

/* Services */

angular.module('symposiumApp.services', [])
	.factory('Context', function ($http) {

        // Private Variables
        var User       = {};
        var Filters    = {};
        var Leads      = [];
        var Lead       = { id: null };

        // Public getter functions
        function getUser() { return User; }
        function getFilters() { return Filters; }
        function getLeads() { return Leads; }
        function getLead() { return Lead; }


        function init() {

            //get the roles and industries
            $http.get('/api/services?id=' + localStorage["user_id"]).then(function (json) {
                User = json.data.user;
                console.log(User);
                var _filters = json.data.filters;

                _filters.roles.forEach(function(filter) {
                   filter.isSelected = (User.role == filter.id) ? true : false;                    
                });

                _filters.industries.forEach(function(filter) {
                   filter.isSelected = (User.industry == filter.id) ? true : false;
                });

                Filters = _filters;

                findLeads();
            });
        }

        function findLeads() {

        	var selectedRoles = 'r=';
        	var selectedIndustries = 'i=';

        	for (var i=0; i < Filters.roles.length; i++) {
        		if(Filters.roles[i].isSelected) selectedRoles += (Filters.roles[i].id + ',');
        	}

        	for (var i=0; i < Filters.industries.length; i++) {
        		if(Filters.industries[i].isSelected) selectedIndustries += (Filters.industries[i].id + ',');
        	}

        	if (selectedRoles.slice(selectedRoles.length - 1, selectedRoles.length) == ",") selectedRoles = selectedRoles.slice(0, selectedRoles.length - 1);
        	if (selectedIndustries.slice(selectedIndustries.length - 1, selectedIndustries.length) == ",") selectedIndustries = selectedIndustries.slice(0, selectedIndustries.length - 1);

        	$http.get('/api/services?' + selectedRoles + "&" + selectedIndustries + "&userId=" + localStorage["user_id"]).then(onLeadsReceived);
        }

        function onLeadsReceived( json ) {

            if (json.data) {
                if (json.data.length > 0) {
                    var tempLeads = json.data.map(function(node) {
                        //node.radius = Math.random() * 50 + 4;
                        node.radius = 30;
                        return node;
                    });

                    Leads = tempLeads;
                } else {

                }
            }
        }

        function findLead(id) {
            $http.get('/api/services?id=' + id + "&userId=" + localStorage["user_id"])
                 .then( onLeadReceived );
        }

        function onLeadReceived( json ) {

            for (var x = 0; x < Filters.roles.length; x++) {
                if (Filters.roles[x].id == json.data.role) {
                    var tempLead = json.data;
                    tempLead.role = Filters.roles[x].name;
                    Lead = tempLead;
                    break;
                }
            }
        }        


        init();

		return {
            getUser     : getUser,
            getFilters  : getFilters,
            getLeads    : getLeads,
            getLead     : getLead,
            findLeads   : findLeads,
            findLead    : findLead,
        };

	});
