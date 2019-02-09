// Creates the queryCtrl Module and Controller. Note that it depends on 'geolocation' and 'gservice' modules.
var queryCtrl = angular.module('queryCtrl', ['geolocation', 'gservice']);
queryCtrl.controller('queryCtrl', function ($scope, $log, $http, $rootScope, geolocation, gservice) {

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var queryBody = {};

    // Functions
    // ----------------------------------------------------------------------------

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function (data) {
        coords = {
            lat: data.coords.latitude,
            long: data.coords.longitude
        };

        // Set the latitude and longitude equal to the HTML5 coordinates
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
    });

    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function () {

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function () {
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        });
    });

    // Take query parameters and incorporate into a JSON queryBody
    $scope.queryProviders = function () {

        // Assemble Query Body
        queryBody = {
            Agency: $scope.formData.Agency.data,           
            Service_Type: $scope.formData.Service_Type.data,
            Services: $scope.formData.Services.data,
            
            Population: $scope.formData.restOfProviderInfo.Population.data,
            Hours_of_operation: $scope.formData.restOfProviderInfo.Hours_of_operation.data,
            Street_Address: $scope.formData.restOfProviderInfo.Street_Address.data,
            Suite_Floor_Dept_Room: $scope.formData.restOfProviderInfo.Suite_Floor_Dept_Room.data,
            State: $scope.formData.restOfProviderInfo.State.data,
            City: $scope.formData.restOfProviderInfo.City.data,
            Zip: $scope.formData.restOfProviderInfo.Zip.data,
            Website: $scope.formData.restOfProviderInfo.Website.data,            
            
            Title: $scope.formData.contactInfo.Title.data,
            First_Name: $scope.formData.contactInfo.First_Name.data,
            Last_Name: $scope.formData.contactInfo.Last_Name.data,
            Phone: $scope.formData.contactInfo.Phone.data,
            Email: $scope.formData.contactInfo.Email.data,

            favlang: $scope.formData.favlang,
            longitude: $scope.formData.longitude
            latitude: $scope.formData.latitude,
            htmlverified: $scope.formData.htmlverified
        };

        // Post the queryBody to the /query POST route to retrieve the filtered results
        $http.post('/query', queryBody)

        // Store the filtered results in queryResults
        .then(function (queryResults) {

                // Query Body and Result Logging
                /* console.log("QueryBody:");
                console.log(queryBody);
                console.log("QueryResults:");
                console.log(queryResults); */

                // Pass the filtered results to the Google Map Service and refresh the map
                gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);

                // Count the number of records retrieved for the panel-footer
                $scope.queryCount = queryResults.length;
        })
        .catch(function (queryResults) {
            console.log('Error ' + queryResults);
        })
    };
});
