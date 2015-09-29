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
.controller('SuiviParcoursCtrl', function($scope, $rootScope, $stateParams, $state, $cordovaGeolocation, $interval) {
  $scope.iconPlayPause = "ion-ios-play";
  $scope.parcoursId = $stateParams.parcoursId;

  $scope.depart = $rootScope.parcoursDepart;
  $scope.arrivee = $rootScope.parcoursArrivee;
  $scope.distance = $rootScope.parcoursDistance;

  // on instancie un objet de type duration pour conserver le chrono
  var t = moment.duration();
  // on le formate avec un format par défaut
  $scope.timer = t.format('h:mm:ss',1, { trim: false });

  // fonction qui va incrémenter et mettre à jour la valeur du chrono
  function updateTimer() {
    t.add(100, 'ms');
    $scope.timer = t.format('h:mm:ss',1, { trim: false });
  };

  //Fonction permettant de changer l'icon play/pause et de lancer ou arreter le chrono
  $scope.switchPlayPause = function() {
    if ($scope.iconPlayPause == "ion-ios-pause")
    {
      $scope.iconPlayPause = "ion-ios-play";
      // on annule l'interval updateTimerInterval si on appuie sur pause
      $interval.cancel(updateTimerInterval);
    }
    else
    {
      $scope.iconPlayPause = "ion-ios-pause";
      // on instancie un $interval que l'on nomme updateTimerInterval qui va appeler la fonction updateInterval toutes les 100ms
      updateTimerInterval = $interval(updateTimer,100);
    }
    
  };

  // fonction qui va conserver le temps total de parcours dans le rootScope avec la variable finalTimer en ms
  // et réinitialiser le timer de la vue courante (nécessaire en cas d'appui sur retour)
  $scope.saveTimer = function() {
    $rootScope.finalTimer = t.asMilliseconds();
    t = moment.duration();
    $scope.timer = t.format('h:mm:ss',1, { trim: false });
  };
  
  //-------- GOOGLE MAP CENTREE SUR NOTRE POSIION
  var options = {timeout: 10000, enableHighAccuracy: true};
 
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //-------- MARQUEUR
    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
     
      var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });      
     
      //----- FENETRE INFORMATIONS
      var infoWindow = new google.maps.InfoWindow({
        content: "Départ"
      });

      infoWindow.open($scope.map, marker);
     
 
});
 
  }, function(error){
    console.log("Could not get location");
  });

})

//-------------------------------------------------------------Controleur IHM résumé fin de parcours
.controller('FinParcoursCtrl', function($scope, $rootScope) {
  // on récupère la valeur du dernier chrono passé par le rootScope et on l'affiche dans le template fin-parcours.html
  var previousTimer = moment.duration($rootScope.finalTimer).format('h [heures] mm [minutes et] ss [secondes]',1);
  $scope.finalTimer = previousTimer;
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
