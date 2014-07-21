'use strict';

/* Controllers */

var symposiumApp = angular.module('symposiumApp.controllers', []);

// Main Controller
// responsible for exposing details 
// of current user and app state
symposiumApp.controller('mainController', ['$scope', 'Context',

	function($scope, Context) {
		
		$scope.isFiltering = false;
		$scope.isViewing = false;
		$scope.isLoading = false;

		$scope.toggleState = function (stateName, stateValue) {
			switch(stateName) {
				case 'filtering': 	$scope.isFiltering = stateValue; break;
				case 'viewing': 	$scope.isViewing = stateValue; break;
				case 'loading': 	$scope.isLoading = stateValue; break;
				case 'all': 		$scope.isFiltering = false; $scope.isViewing = false; break;
			}
		};

	}
]);

symposiumApp.controller('sceneController', ['$scope', 'Context',

	function($scope, Context) {

		var color,	// color scale for the nodes
			force,	// d3 force layout to apply to scene
			scene,	// svg to hold the scene
			nodes,	// collection of lead objects
			node;	// individual g in scene


		// On controller init, initialize variables
		// and set up force layout and attched to svg
		function init() {

			color = d3.scale.category10();
			
			nodes = [];
			force = d3.layout.force()
					  .gravity(0.1)
					  .charge(function(d, i) { return i ? 0 : -5000; })
					  .nodes(nodes)
					  .on('tick', onTick);

			scene = d3.select('#scene').append('svg')
					  .call(d3.behavior.zoom().scaleExtent([0.1, 8]).on("zoom", onZoom));
			node = scene.selectAll('circle');

			setFieldSize();
			
		}
		
		// Handles population of nodes when Context.Leads collection changes
		// (remove old nodes, add new ones to the collection, refresh in between)
		function populateNodes() {

			while(nodes.length > 0) { nodes.pop(); }
			paintScene();
			nodes.push({ radius: 0 }); //me

			var leads = Context.getLeads();
			for (var x=0; x<leads.length; x++) { nodes.push(leads[x]); }
			paintScene();

		}

		// Handles repainting of 
		// scene when nodes have changed
		function paintScene() {

			node = node.data(nodes);

			node.enter()
				.append('circle')
				.attr('r', function(d) { return d.radius / 1.5; })
				.style('fill', function(d,i) { return color(i % 3); })
				.on('click', onNodeClick)
				.call(force.drag);

			node.exit().remove();

			force.start();

		}

		
		// Handles tick event
		// of the force layout
		function onTick() {

			var q = d3.geom.quadtree(nodes),
				i = 0,
				n = nodes.length;

			while (++i < n) q.visit(collide(nodes[i]));

			scene.selectAll('circle')
			   .attr('cx', function(d) { return d.x; })
			   .attr('cy', function(d) { return d.y; });
			
			// force.resume();

		}

		// Collision-detection 
		// function for the nodes
		function collide (node) {
			var r = node.radius + 16,
				nx1 = node.x - r,
				nx2 = node.x + r,
				ny1 = node.y - r,
				ny2 = node.y + r;

			return function(quad, x1, y1, x2, y2) {
				if (quad.point && (quad.point !== node)) {
					var x = node.x - quad.point.x,
						y = node.y - quad.point.y,
						l = Math.sqrt(x*x + y*y),
						r = node.radius + quad.point.radius;

					if (l < r) {
						l = (l - r) / l * 0.5;
						node.x -= x *= l;
						node.y -= y *= l;
						quad.point.x += x;
						quad.point.y += y;
					}
				}

				return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
			};
		}

		function onNodeClick(node) {
			Context.findLead(node.id);		
		}

		function onZoom() {
			scene.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		}

		window.onresize = function(event){ setFieldSize(); };
		function setFieldSize() {
			var stage = document.getElementById('scene');
			var x = stage.offsetWidth;
			var y = stage.offsetHeight;

			force.size([x, y]);
		}		

		$scope.$watch( Context.getLeads,
			function( newValue, oldValue ) {
				populateNodes();
				$scope.toggleState('filtering', false);
			}
		);

		init();
	}
]);

symposiumApp.controller('filterController', ['$scope', 'Context',

	function($scope, Context) {
		
		$scope.filters = Context.getFilters;
		$scope.findLeads = Context.findLeads;

	}
]);

symposiumApp.controller('profileController', ['$scope', 'Context',

	function($scope, Context) {

		$scope.lead = Context.getLead;
		
		$scope.$watch( Context.getLead,
			function( newValue, oldValue ) {
				if (newValue.id !== null) {$scope.toggleState('viewing', true);}
			}
		);

	}
]);