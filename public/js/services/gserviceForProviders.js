// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gserviceForProviders', [])
    .factory('gserviceForProviders', function ($rootScope, $http) {

        // Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return
        var googleMapServiceFP = {};

        // Handling Clicks and location selection
        googleMapServiceFP.clickLat = 0;
        googleMapServiceFP.clickLong = 0;

        // Array of locations obtained from API calls
        var locations = [];

        // Selected Location (initialize to center of Los Angeles)
        var selectedLat = 34.045;
        var selectedLong = -118.006355;



        // Functions
        // --------------------------------------------------------------

        // Refresh the Map with new data. Takes three parameters (lat, long, and filtering results)
        googleMapServiceFP.refresh = function (latitude, longitude, filteredResults) {

            console.log("googleMapServiceFP.refresh: " + latitude + " " + longitude + " " + JSON.stringify(filteredResults));

            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = latitude;
            selectedLong = longitude;

            // If filtered results are provided in the refresh() call...
            if (filteredResults) {
                //console.log("attempting to get filteredResponse locations...");
                // Then convert the filtered results into map points.
                locations = convertToMapPoints(filteredResults);
                //console.log("Locations: " + locations);

                // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
                initialize(latitude, longitude, true);
            }

            // If no filter is provided in the refresh() call...
            else {
                //console.log("no filteredResults provided")
                // Perform an AJAX call to get all of the records in the db.
                $http.get('/providers', {})
                    .then(function (response) {

                        // Then convert the results into map points
                        // console.log("attempting to get NO filteredResponse locations...");
                        locations = convertToMapPoints(response);
                        //console.log("locations from /providers GET: " + locations);

                        // Then initialize the map -- noting that no filter was used.
                        initialize(latitude, longitude, false);
                    }).catch(function () {});
            }
        };
        
        
        // Refresh the Map with new data. Takes three parameters (lat, long, and filtering results)
        googleMapServiceFP.geocode = function (providerData) {

                $http.post('/geocode', {providerData})
                    .then(function (response) {

                        // Then convert the results into map points
                        // console.log("attempting to get NO filteredResponse locations...");
                        // locations = convertToMapPoints(response);
                        //console.log("locations from /providers GET: " + locations);

                        // Then initialize the map -- noting that no filter was used.
                        initialize(latitude, longitude, false);
                    }).catch(function () {});
            };

        // Private Inner Functions
        // --------------------------------------------------------------
        // Convert a JSON of users into map points
        var convertToMapPoints = function (response) {

            // Clear the locations holder
            var locations = [];

            // Loop through all of the JSON entries provided in the response
            for (var i = 0; i < response.length; i++) {
                var provider = response[i];

                // Create popup windows for each record
                var contentString =
                    '<h4 style="color:blue;">' + provider.Agency + '</h4>' + '\n' +
                    '<p><b>Service_Type</b>: ' + provider.Service_Type + '\n' +
                    '<br><b>Population</b>: ' + provider.Population +  '\n' +
                    '<br><b>Street_Address</b>: ' + provider.Street_Address + '\n' +
                    '<br><b>City</b>: ' + provider.City + '\n' +
                    '<br><b>Phone</b>: ' + provider.Phone + '\n' +
                    '</p>';

                // Converts each of the JSON records into Google Maps Location format.
                locations.push({
                    latlon: new google.maps.LatLng(provider.Location.latitude, provider.Location.longitude),
                    message: new google.maps.InfoWindow({
                            content: contentString,
                            maxWidth: 320
                        })
                        /*,
                                            Agency: provider.Agency,
                                            Service_Type: provider.Service_Type,
                                            Population:  provider.Population,
                                            Street_Address: provider.Street_Address,
                                            City: provider.City,
                                            Phone: provider.Phone*/
                });
            }
            // location is now an array populated with records in Google Maps format
            return locations;
        };

  
        var getGeocoordsFromAddress = function(providerData){
           
           $http.post('/providerGeocode', {
               params: address
           }).
           then(function(response){
               var retObj = [];
               if (response.status == "OK"){
                   var location = response.results.geometry.location;
                       retObj.lat = location.lat;
                       retObj.lng = location.lng;
               
                $scope.geocoords = retObj;  
               }
           });
           
           
       } 

        // Initializes the map
        var initialize = function (latitude, longitude, filter) {

            // Uses the selected lat, long as starting point
            var myLatLng = {
                lat: selectedLat,
                lng: selectedLong
            };

            // If map has not been created...
            if (!map) {

                // Create a new map and place in the index.html page
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 8,
                    center: myLatLng
                });
                
                console.log(map.getZoom())
                var ctaLayer = new google.maps.KmlLayer(
                {
                    url: 'http://markatango.com/kml/kmlfiles/ctaLA2012polyonly.kml',
                    map: map,
                    preserveViewport : true
                }); 
            }
            
            google.maps.event.addListener(ctaLayer, 'click', function (kmlEvent) {
                //var text = kmlEvent.featureData.description;
                //alert(text);

            });

            // If a filter was used set the icons yellow, otherwise blue
            if (filter) {
                icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
            } else {
                icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
            }

            // Loop through each location in the array and place a marker
            locations.forEach(function (n, i) {
                var marker = new google.maps.Marker({
                    position: n.latlon,
                    map: map,
                    title: "Service provider",
                    icon: icon,
                });

                // For each marker created, add a listener that checks for clicks
                google.maps.event.addListener(marker, 'click', function (e) {

                    // When clicked, open the selected marker's message
                    currentSelectedMarker = n;
                    n.message.open(map, marker);
                });
            });

            // Set initial location as a bouncing red marker
            var initialLocation = new google.maps.LatLng(latitude, longitude);
            var marker = new google.maps.Marker({
                position: initialLocation,
                animation: google.maps.Animation.BOUNCE,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });
            lastMarker = marker;

            // Function for moving to a selected location
            map.panTo(new google.maps.LatLng(latitude, longitude));

            // Clicking on the Map moves the bouncing red marker
            google.maps.event.addListener(map, 'click', function (e) {
                var marker = new google.maps.Marker({
                    position: e.latLng,
                    animation: google.maps.Animation.BOUNCE,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                });

                // When a new spot is selected, delete the old red bouncing marker
                if (lastMarker) {
                    lastMarker.setMap(null);
                }

                // Create a new red bouncing marker and move to it
                lastMarker = marker;
                map.panTo(marker.position);

                // Update Broadcasted Variable (lets the panels know to change their lat, long values)
                googleMapServiceFP.clickLat = marker.getPosition().lat();
                googleMapServiceFP.clickLong = marker.getPosition().lng();
                $rootScope.$broadcast("clicked");
            });
            
            map.setZoom(14);

        };

        // Refresh the page upon window load. Use the initial latitude and longitude
        google.maps.event.addDomListener(window, 'load',
            googleMapServiceFP.refresh(selectedLat, selectedLong));

        // The point of this factory: returng googleMapServiceFP and its element function: 'refresh'
        return googleMapServiceFP;
    });
