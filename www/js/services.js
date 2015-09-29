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
})

//GOOGLE MAPS
.factory('GoogleMapService', function($cordovaGeolocation) {
	return {
		handleMap: function($scope) 
		{
			
			//-------- GOOGLE MAP CENTREE SUR NOTRE POSIION
			var options = {timeout: 10000, enableHighAccuracy: true};

			$cordovaGeolocation.getCurrentPosition(options).then(function(position)
			{
		 
				var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

				var mapOptions = 
				{
					center: latLng,
					zoom: 15,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};

				$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

				//-------- MARQUEUR
				//Wait until the map is loaded
				google.maps.event.addListenerOnce($scope.map, 'idle', function()
				{
					var marker = new google.maps.Marker(
					{
						map: $scope.map,
						animation: google.maps.Animation.DROP,
						position: latLng
					});      
				});
			}, 
			function(error)
			{
				console.log("Could not get location");
			});
		}
	};
});