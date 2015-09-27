angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
 
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

//---------------------------------------------------------------Controleur IHM avec criteres
.controller('CourirCtrl', function($scope, $rootScope) {
  $scope.parcoursData = {};
  $rootScope.parcoursData = $scope.parcoursData;
})


//--------------------------------------------------------------Controleur IHM affichage des parcours possibles
.controller('ChoixParcoursCtrl', function($scope, $rootScope, $ionicLoading, LoadingService, ChoixParcoursService) {
  /*$scope.depart = $rootScope.parcoursData.depart;
  $scope.arrivee = $rootScope.parcoursData.arrivee;
  $scope.distance = $rootScope.parcoursData.distance;*/
  LoadingService.show();
  ChoixParcoursService.getParcours($scope);

  //Initialisation avec le premier parcours de la liste
  $scope.$on('getParcoursOK', function(event, data) {
    $scope.parcoursListe = data;
    $scope.parcoursId = 0;
    $scope.parcoursDepart = $scope.parcoursListe.parcours[0].depart;
    $scope.parcoursArrivee = $scope.parcoursListe.parcours[0].arrivee;
    $scope.parcoursDistance = $scope.parcoursListe.parcours[0].distance;

    //Test pour faire l'IHM 3, sera a placer dans le swap qui modifie les valeurs
    $rootScope.parcoursDepart = $scope.parcoursDepart;
    $rootScope.parcoursArrivee = $scope.parcoursArrivee;
    $rootScope.parcoursDistance = $scope.parcoursDistance;
  });

  $scope.$on('getParcoursKO', function(event, data) {
    console.log("Erreur : ChoixParcoursCtrl");
  });

  $scope.parcoursSuivant = function() {
    $scope.parcoursId++;
    $scope.parcoursId = $scope.parcoursId%$scope.parcoursListe.parcours.length;
    
    for (var i=0; i<$scope.parcoursListe.parcours.length; i++) {
      if ($scope.parcoursId == $scope.parcoursListe.parcours[i].id) {
        $scope.parcoursDepart = $scope.parcoursListe.parcours[i].depart;
        $scope.parcoursArrivee = $scope.parcoursListe.parcours[i].arrivee;
        $scope.parcoursDistance = $scope.parcoursListe.parcours[i].distance;

      }
    }
  };

  $scope.parcoursPrecedent = function() {
    $scope.parcoursId--;
    if ($scope.parcoursId == -1)
      $scope.parcoursId = $scope.parcoursListe.parcours.length-1;

    for (var i=0; i<$scope.parcoursListe.parcours.length; i++) {
      if ($scope.parcoursId == $scope.parcoursListe.parcours[i].id) {
        $scope.parcoursDepart = $scope.parcoursListe.parcours[i].depart;
        $scope.parcoursArrivee = $scope.parcoursListe.parcours[i].arrivee;
        $scope.parcoursDistance = $scope.parcoursListe.parcours[i].distance;
      }
    }
  };
})

//-------------------------------------------------------------Controleur IHM suivi GPS sur le parcours
.controller('SuiviParcoursCtrl', function($scope, $rootScope, $stateParams, $ionicLoading, $compile) {
  $scope.iconPlayPause = "ion-ios-play";
  $scope.parcoursId = $stateParams.parcoursId;

  $scope.depart = $rootScope.parcoursDepart;
  $scope.arrivee = $rootScope.parcoursArrivee;
  $scope.distance = $rootScope.parcoursDistance;

  //Fonction permettant de changer l'icon play/pause
  $scope.switchPlayPause = function() {
    if ($scope.iconPlayPause == "ion-ios-pause")
    {
      $scope.iconPlayPause = "ion-ios-play";
    }
    else
    {
      $scope.iconPlayPause = "ion-ios-pause";
    }
    
  };
  
                //***********************
                //     GOOGLE MAPS
                //***********************
  function initialize() 
  {
    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
    
    var mapOptions = 
    {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);
    
    //Afficher un marqueur a notre position
    navigator.geolocation.getCurrentPosition(function(pos) 
    {
      map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      var myLocation = new google.maps.Marker(
      {
          position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
          map: map,
          title: "My Location"
      });
  });

    $scope.map = map;
  }

  google.maps.event.addDomListener(window, 'load', initialize);

  /*$scope.centerOnMe = function() 
  {
    if(!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) 
    {
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  $scope.clickTest = function() {
    alert('Example of infowindow with ng-click')
  }; */


})


//---------------------------------------------------------------------------Exemple
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
  $scope.idPlaylist = $stateParams.playlistId;
});
