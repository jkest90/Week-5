angular.module('MyApp', ['leaflet-directive'])                      //Loading MyApp module & injecting 'ngMap'
    .factory('showFact', showFact)                    //creating factory named 'trailFact', with a funciton named 'trailFact'
    .controller('showCtrl', showCtrl)                 //creating controller named 'trailCtrl', with a funciton named 'trailCtrl'

showCtrl.$inject = ['showFact']              //injecting 'trailFact' & 'NgMap' directive into trailCtrl function.
showFact.$inject = ['$http']                           //injecting $http service into trailFact function.

/* Show Controller */
function showCtrl(showFact) {                  //defining trailCtrl function with factory and NgMap as parameters.
    console.debug('showCtrl:loaded', arguments)        //console.debug to make sure controller is loaded.
    var alpha = this;                                   //assigning 'this' to alpha variable
    window.alpha = alpha                                //assigning alpha to the window document (allows ability to object on console). assigning window to the controller
    alpha.title = "My Map"                              //assigning 'title' property to alpha variable


    showFact.getPage(0).then(function(response) {      //'then' promise. a function which returns the data recieved from the server (below) and assigns
      console.log('Response from server!', response);   //to the variable trailData.
      alpha.showData = response.data;

    });

    alpha.center = {
      lat: 39.750953,
      lng: -104.983602,
      zoom: 10
    }
  }
    // showFact.getPage(1).then(function(response) {      //'then' promise. a function which returns the data recieved from the server (below) and assigns
    //   console.log('Response from server!', response);   //to the variable trailData.
    //   alpha.showData2 = response.data;
    // });

    // showFact.getPage(2).then(function(response) {      //'then' promise. a function which returns the data recieved from the server (below) and assigns
    //   console.log('Response from server!', response);       //to the variable trailData.
    //   alpha.showData3 = response.data;
    // });




/*Show Factory */

function showFact($http) {                             //defining trailFact function with the $http service as a parameter. returns the 'getTrail' function
  console.log('showFact:loaded')                       //which uses $http to get trailhad information from the API.
    return {
      getPage: function(num) {
        return $http.get('http://api.jambase.com/events?zipCode=80203&radius=60&api_key=stws3mexz3eeynujdsvw3p4n' + '&page=' + num)
      }
    }
  }
      // getPage1 : function() {
      //     return $http.get('http://api.jambase.com/events?zipCode=80203&radius=60&page=0&api_key=stws3mexz3eeynujdsvw3p4n')
      //   }


      // getPage2 : function() {
      //     return $http.get('http://api.jambase.com/events?zipCode=80203&radius=60&page=1&api_key=stws3mexz3eeynujdsvw3p4n')
      //   },

      //   getPage3 : function() {
      //     return $http.get('http://api.jambase.com/events?zipCode=80203&radius=60&page=2&api_key=stws3mexz3eeynujdsvw3p4n')
      //   }
      // }

    // alpha.showInfoWindow = function (e, position, index) {
    //   alpha.selectedPosition = position
    //   alpha.map.showInfoWindow('marker-info', 'marker-' + index)
    //   }
    // };

    /*Trail Factory*/

                  /* Page 1 Object */

  // alpha.showData.Events[0].Artists[0].Name  +Artist Name   (multiple artists, Artists.length? ng-repeat)
  // alpha.ShowData.Events[0].TicketURL        +Tickets URL
  // alpha.ShowData.Events[0].Date             +Event Date
  // alpha.showData.Events[0].Venue -          +All Venue Info
    // alpha.showData.Events[0].Venue.Name       -Venue Name
    // alpha.showData.Events[0].Venue.Url        -Venue URL
    // alpha.showData.Events[0].Venue.Latitude   -Latitude
    // alpha.showData.Events[0].Venue.Longitude  -Longitude
