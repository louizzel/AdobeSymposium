'use strict';

/* Directives */

angular.module('symposiumApp.directives', [])
.directive('scrollable', function() {

	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			angular.element(element).scrollbar();
		}
	};

})
.directive('tabbed', function() {

	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			var el = $(element);
			el.find('.tabs .tab').on('click', function(){

				$(this).addClass('active')
					   .siblings('.active').removeClass('active');

				el.find('.targets > .target').hide();
				$($(this).attr('data-target')).fadeIn();
			});

			el.find('.tabs .tab:first-child').click();

		}
	}

});