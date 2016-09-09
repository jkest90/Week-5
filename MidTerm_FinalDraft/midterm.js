angular.module('MyApp', ['leaflet-directive'])    //Loading MyApp module & injecting 'leaflet-directive' / ngRoute
  .factory('showFact', showFact)                  //creating factory named 'showFact', with a function named 'showFact'
  .controller('showCtrl', showCtrl)               //creating controller named 'showCtrl', with a function named 'showCtrl'

  showCtrl.$inject = ['showFact']      // Injects showFact into ctrl. Run showFact function and expect the return value to come into showCtrl. Gives you the returned object of showFact in ctrl.
  showFact.$inject = ['$http']         //injecting $http service into showFact function. Can now use showFact and $http as parameters within showCtrl and showFact, respectively.
  // Router.$inject = ['$routeProvider']

  /* Routing */

  // function Router($routeProvider) {
  //   $routeProvider.otherwise({ redirectTo : '/' });
  //   $routeProvider
  //       .when('/', {
  //         templateUrl : '/templates/home.html',
  //       })
  //       .when('/origins/:id', {
  //         templateUrl : '/templates/origins.html',
  //       })
  //       .when('/menu', {
  //         templateUrl : '/templates/menu.html',
  //       })
  //
  // }

  /* Disabling automatic leaflet debugging */

angular.module('MyApp').config(function($logProvider) {
    $logProvider.debugEnabled(false);
  });

/* Filter to shorten URLs */

angular.module('MyApp').filter( 'domain', function () {
  return function ( input ) {
    var matches,
    output = "",
    urls = /\w+:\/\/([\w|\.]+)/;

    matches = urls.exec( input );

    if ( matches !== null ) output = matches[1];

    return output;
  };
});


/* Show Controller */

function showCtrl(showFact) {                   //defining showCtrl function with showFact as a parameter.
  console.debug('showCtrl:loaded', arguments)   //console.debug to make sure controller is loaded.
  var alpha = this;                             //assigning 'this' to alpha variable

  window.alpha = alpha;                         //(window.showFact = showFactObj) - assigning alpha to the window document (allows ability to object on console). assigning window to the controller.  never want to deploy. leaking the controller, just for debugging.
  alpha.title = "My Map";                       //assigning 'title' property to alpha variable
  alpha.markers = [];
  alpha.newMarkers = []

//start pagination variables

  alpha.resultData = [];
  alpha.current = 1;
  alpha.pageSize =  5;

  alpha.setPage = function(pageNo) {
    alpha.currentPage = pageNo;
  };  // end alpha.setPage()

  alpha.currentPage = function(pageNo) {
    alpha.current = pageNo;
    alpha.newMarkers = alpha.getNextMarkers();
  }; //end alpha.currentPage()

  alpha.getNextResults = function() {
    return alpha.resultData.slice(alpha.pageSize*(alpha.current-1), alpha.pageSize*alpha.current)
  }; //end alpha.getNextResults()

//end pagination variables

//start API Response 'then' promise

  showFact.getPage(0).then(function(response) {        //'then' method/promise. What do do AFTER we get the request from the API (asynchronous).
    console.log('Response from server!', response);    //A function which returns the JSON data recieved from the server (below) and assigns it
    alpha.showData = response.data;                    //to the variable showData.
    alpha.getMarkers();
    alpha.getResults();
    alpha.newMarkers = alpha.getNextMarkers();
  });  //end 'then' promise

  alpha.currentMarkers = function(markerPage) {
      alpha.current = markerPage
    };  //end alpha.currentMarkers()

  alpha.submitData = [];
  alpha.submitFollow = function(result) {
    alpha.submitData.push({
      Artist: result.Artist,
      Venue: result.Venue,
      Address: result.Address,
      Date: result.Date,
      TicketUrl: result.TicketUrl
    });
  } //end alpha.submitData()

  alpha.getNextMarkers = function() {
    console.log(alpha.markers.slice((alpha.current-1)*(alpha.pageSize), alpha.pageSize*alpha.current));
    return alpha.markers.slice((alpha.current-1)*(alpha.pageSize), alpha.pageSize*alpha.current).filter(function(element){
      if (element.lat != 0 && element.lng != 0) {
        return true
      } else {
        return false
      }
    });   //end filter - removes markers with lat: 0, lng: 0
  };   //end alpha.getNextMarkers()


  alpha.getMarkers = function (result) {
    if (alpha.showData && alpha.showData.Events) {
      console.log("inside getmarkers");
      alpha.showData.Events.forEach(function(element){
        // if (element.Venue.Latitude !== 0 && element.Venue.Longitude !== 0) {  //able to access alpha.showData.Events with the 'element' parameter.
        alpha.markers.push({
          lat: element.Venue.Latitude,
          lng: element.Venue.Longitude,
          message: element.Artists[0].Name //how do I get multiple key-value JSON pairs into popup ?
        }); //end markers.push()
      }); //end forEach()
    }; // end if()
  }; //end alpha.getMarkers()


  alpha.getResults = function() {
    if (alpha.showData && alpha.showData.Events) {
      alpha.showData.Events.forEach(function(element) {
        alpha.resultData.push({
          Venue: element.Venue.Name,
          Date: element.Date,
          TicketUrl: element.TicketUrl,
          Address: element.Venue.Address,
          Artist: element.Artists[0].Name
        }) // end resultData.push()
      }) //end forEach()
    } //end if()
  }; //end alpha.getResults()

  /* alternate 'for statements
  for (var i=0; i <alpha.showData.Events.length; i++)  {
  alpha.markers.push({lat: alpha.showData.Events[i].Venue.Latitude, lng: alpha.showData.Events[i].Venue.Longitude});
  }

  for (event in alpha.showData.Events) {
  var obj = alpha.showData.Events[event];
  console.log('event log' + event.Venue.Latitude)
  alpha.markers.push({lat: obj.Venue.Latitude, lng: obj.Venue.Longitude});
  } */

  alpha.defaults = {
    scrollWheelZoom: false
  };

  alpha.center = {
    lat: 39.750953,
    lng: -104.983602,
    zoom: 10
  }
};
// End Show Controller


/* Show Factory */

function showFact($http) {             //Defining showFact function with the $http service as a parameter. Returns the 'getPage' function
console.log('showFact:loaded')       //which uses $http to get show info from the Jambase API.
return {
  getPage: function(num) {           //getPage is now a function that we can use in our controller.
    return $http.get('http://api.jambase.com/events?zipCode=80203&radius=30&api_key=stws3mexz3eeynujdsvw3p4n' + '&page=' + num)
  }
}
};
// End Show Factory

/*
Page 1 Object
alpha.showData.Events[0].Artists[0].Name  +Artist Name   (multiple artists, Artists.length? ng-repeat)
alpha.ShowData.Events[0].TicketURL        +Tickets URL
alpha.ShowData.Events[0].Date             +Event Date
alpha.showData.Events[0].Venue -          +All Venue Info
alpha.showData.Events[0].Venue.Name       -Venue Name
alpha.showData.Events[0].Venue.Url        -Venue URL
alpha.showData.Events[0].Venue.Latitude   -Latitude
alpha.showData.Events[0].Venue.Longitude  -Longitude
*/

// Jambase Keys
// stws3mexz3eeynujdsvw3p4n
// xtdm3yudej7rnptxxxhs2gww
// 7srane628g45btdnbxsxqn4v
