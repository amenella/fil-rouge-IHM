angular.module('starter.services', [])

.factory('ChoixParcoursService', function($http) {
	var parcoursActif = 0;
	var parcours;
	return { 
		getParcours: function ($scope) {
			$http.get('data/parcours.json')
			//$http.get('http://dev.local/FootAsieService/rest/footasieservice/equipes/')
			.success(function(data) {
				parcours = data.parcours;
				$scope.$emit('getParcoursOK', data);
			})
			.error(function(err) {
				$scope.$emit('getParcoursKO', err);
			});
		}
	};
})
.factory('LoadingService', function($ionicLoading) {
	return {
		show: function() {
			$ionicLoading.show({
				template: 'Chargement...',
				duration: '3000'
			});
		},
		hide: function(){
			$ionicLoading.hide();
  		}
	};
});