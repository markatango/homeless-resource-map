// /public/js/addCtrl
// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' module 
//  and service.
var addCtrl = angular.module('addCtrl', ['geolocation', 'gserviceForProviders']);
addCtrl.controller('addCtrl', function ($scope, $http, $rootScope, geolocation, gserviceForProviders) {

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;
    
    $scope.providerInfo = [
        "Street_Address",
        "Services",
        "First_Name",
        "Last_Name",
        "Agency",
        "Title",
        "Service",
        "Population",
        "Hours_of_operation",
        "Suite_Floor_Dept_Room",
        "State",
        "City",
        "Zip",
        "Phone",
        "Email",
        "Website"
       ];
     
    // Set initial coordinates to the center of LA
    $scope.formData.latitude = 34.052;
    $scope.formData.longitude = -118.169;

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function (data) {

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = {
            lat: data.coords.latitude,
            long: data.coords.longitude
        };

        // Display coordinates in location textboxes rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);


        //console.log($scope.formData.longitude, $scope.formData.latitude);

        // Display message confirming that the coordinates verified.
        $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";
        // parseFloat turned the numbers into characters and google api didn't like them.
        gserviceForProviders.refresh(coords.lat, coords.long);

    });

    // Functions
    // ----------------------------------------------------------------------------
    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function () {

        // Run the gserviceForProviders functions associated with identifying coordinates
        $scope.$apply(function () {
            $scope.formData.latitude = parseFloat(gserviceForProviders.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gserviceForProviders.clickLong).toFixed(3);
            $scope.formData.htmlverified = "Nope (Thanks for spamming my map...)";
        });
    });

    // Creates a new provider based on the form fields
    $scope.createProvider = function () {

        // Grabs all of the text box fields
        var providerData = {
            Street_Address: $scope.formData.Street_Address,
            Services: $scope.formData.Services,
            First_Name: $scope.formData.First_Name,
            Last_Name: $scope.formData.Last_Name,
            Agency: $scope.formData.Agency,
            Title: $scope.formData.Title,
            Service_Type: $scope.formData.Service_Type,
            Population: $scope.formData.Population,
            Hours_of_operation: $scope.formData.Hours_of_operation,
            Suite_Floor_Dept_Room: $scope.formData.Suite_Floor_Dept_Room,
            State: $scope.formData.State,
            City: $scope.formData.City,
            Zip: $scope.formData.Zip,
            Phone: $scope.formData.Phone,
            Email: $scope.formData.Email,
            Website: $scope.formData.Website,

            favlang: $scope.formData.favlang,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };

        // Saves the provider data to the db
        $http.post('/providers', providerData)
            .then(function (data) {

            // Once complete, clear the form (except location)
                $scope.formData.Street_Address = "";
                $scope.formData.Services = "";
                $scope.formData.First_Name = "";
                $scope.formData.Last_Name = "";
                $scope.formData.Agency = "";
                $scope.formData.Title = "";
                $scope.formData.Service_Type = "";
                $scope.formData.Population = "";
                $scope.formData.Hours_of_operation = "";
                $scope.formData.Suite_Floor_Dept_Room = "";
                $scope.formData.State = "";
                $scope.formData.City = "";
                $scope.formData.Zip = "";
                $scope.formData.Phone = "";
                $scope.formData.Email = "";
                $scope.formData.Website = "";
                $scope.formData.favlang = "";

                // Refresh the map with new data
                gserviceForProviders.refresh($scope.formData.latitude, $scope.formData.longitude);

            })
            .catch(function (data) {
                console.log('Error: ' + data);
            });
    };
});
