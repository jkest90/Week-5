angular.module('MyApp', ['ngMap'])                      //Loading MyApp module & injecting 'ngMap'
    .factory('trailFact', trailFact)                    //creating factory named 'trailFact', with a funciton named 'trailFact'
    .controller('trailCtrl', trailCtrl)                 //creating controller named 'trailCtrl', with a funciton named 'trailCtrl'

trailCtrl.$inject = ['trailFact', 'NgMap']              //injecting 'trailFact' & 'NgMap' directive into trailCtrl function.
trailFact.$inject = ['$http']                           //injecting $http service into trailFact function.

/* Trail Controller */

function trailCtrl(trailFact, NgMap) {                  //defining trailCtrl function with factory and NgMap as parameters.
    console.debug('trailCtrl:loaded', arguments)        //console.debug to make sure controller is loaded.
    var alpha = this;                                  //assigning 'this' to alpha variable
    window.alpha = alpha                                //assigning alpha to the window document (allows ability to object on console). assigning window to the controller
    alpha.title = "My Map"                              //assigning 'title' property to alpha variable

    NgMap.getMap().then(function(map) {                //function to retrieve google map
      console.log('map',map);
      alpha.map = map
    });

    trailFact.getTrailhead().then(function(response) {      //'then' promise. a function which returns the data recieved from the server (below) and assigns
      console.log('Response from server!', response);   //to the variable trailData.
      alpha.trailData = response.data;
    });

    alpha.showInfoWindow = function (e, position, index) {
      alpha.selectedPosition = position
      alpha.map.showInfoWindow('marker-info', 'marker-' + index)
      }
    };

/*Trail Factory*/

function trailFact($http) {                             //defining trailFact function with the $http service as a parameter. returns the 'getTrail' function
    console.log('trailFact:loaded')                       //which uses $http to get trailhad information from the API.
    return {
      getTrailhead : function() {
        return $http.get('https://api.transitandtrails.org/api/v1/trailheads?key=69b2da0cad2dd7913114f17e18e6dccde6cc0dc94f2db4cfc2d2b959a2448196')
      }
    }
  }

// alpha.popUp = [];
// for (var i =alpha.trailData[0]; i <alpha.trailData.length; i++) {
// vm.showStore = function(evt, storeId) {
//   vm.store = vm.stores[storeId];
//   vm.map.showInfoWindow('foo', this);
// };




    // function getLocation(longitude, latitude) {
    //   alpha.long = []
    //   alpha.lat = []
    //   for (var prop in obj) {
    //     return alpha.trailData
    //   }
    //
    //   }

    // alpha.getMarkers = alpha.trailData.longitude new Array ()
    // for (var i = alpha.trailData.length; i <alpha.trailData.length; i++) {
    //   if apha {
    //
    //   }
    // }
    //
    // alpha.addMarker = function(latitude,longitude) {
    //   alpha
    // }
