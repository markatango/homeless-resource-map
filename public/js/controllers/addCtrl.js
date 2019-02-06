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

    $scope.formData.Agency = 

        {
            info: "Agency",
            name: "Provider",
            hint: "Community Services",
            data: ""
        };
    
    $scope.formData.Services = 

        {
            info: "Services",
            name: "Services",
            hint: "Clothes, food distribution, etc",
            data: ""
        };
        
 /* $scope.formData.Street_Address = "";
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
 */
    
    $scope.formData.restOfProviderInfo = {

         "Population" :   {
                info: "Population",
                name: "Population",
                hint: "Adult males, over 18 years old",
                data: ""
            },

         "Hours_of_operation"   :   {
                info: "Hours_of_operation",
                name: "Hrs of operation",
                hint: "8:00 am - 5:00 pm, M-Th",
                data: ""
            },

         "Street_Address"   :   {
                info: "Street_Address",
                name: "Street address",
                hint: "123 Main St",
                data: ""
            },

         "Suite_Floor_Dept_Room"   :   {
                info: "Suite_Floor_Dept_Room",
                name: "Ste Floor Dept Rm",
                hint: "Unit A",
                data: ""
            },

         "City"   :   {
                info: "City",
                name: "City",
                hint: "Los Angeles",
                data: ""
            },

         "State"   :   {
                info: "State",
                name: "State",
                hint: "State",
                data: ""
            },

         "Zip"   :   {
                info: "Zip",
                name: "Zip",
                hint: "91234",
                data: ""
            },

         "Website"   :   {
                info: "Website",
                name: "Website",
                hint: "www.example.com",
                data: ""
            }
        };

    $scope.formData.contactInfo = {
         "Title"   :   {
                info: "Title",
                name: "Title",
                hint: "Salutation",
                data: ""
            },

         "First_Name" :  {
                info: "First_Name",
                name: "First name",
                hint: "First",
                data: ""
            },

         "Last_Name" :  {
                info: "Last_Name",
                name: "Last name",
                hint: "Last",
                data: ""
            },

         "Phone" :   {
                info: "Phone",
                name: "Phone",
                hint: "626-555-1212",
                data: ""
            },

         "Email" :   {
                info: "Email",
                name: "Email",
                hint: "user@example.com",
                data: ""
            }
        };

    /*$scope.providerInfo = angular.copy(providerInfo);

    $scope.contactInfo = angular.copy(contactInfo);*/           

    /*$scope.providerValues = {};
    //  $scope.contactValues = {};

    $scope.$watch('providerValues', function (newValue, oldValue, scope) {
        console.log(newValue);
    }, true);

    $scope.$watch('contactValues', function (newValue, oldValue, scope) {
        console.log(newValue);
        }, true);*/

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
            Agency: $scope.formData.Agency.data,           
            
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
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };
        
        console.log(providerData);
        $http.post('/geocode', providerData)
            .then(function(result){
                console.log(result)
            });

        // Saves the provider data to the db
        $http.post('/providers', providerData)
            .then(function (data) {
                console.log('Posted: ' + data);

                // Once complete, clear the form (except location)
                
                $scope.formData.Agency.data = "";
                $scope.formData.Services.data = "";
                
                $scope.formData.restOfProviderInfo.Population.data = "";
                $scope.formData.restOfProviderInfo.Hours_of_operation.data = "";
                $scope.formData.restOfProviderInfo.Street_Address.data = "";
                $scope.formData.restOfProviderInfo.Suite_Floor_Dept_Room.data = "";
                $scope.formData.restOfProviderInfo.State.data = "";
                $scope.formData.restOfProviderInfo.City.data = "";
                $scope.formData.restOfProviderInfo.Zip.data = "";
                $scope.formData.restOfProviderInfo.Website.data = "";
                 
                $scope.formData.contactInfo.Title.data = "";
                $scope.formData.contactInfo.First_Name.data = "";
                $scope.formData.contactInfo.Last_Name.data = "";
                $scope.formData.contactInfo.Phone.data = "";
                $scope.formData.contactInfo.Email.data = "";
               
                $scope.formData.favlang = "";
                

                // Refresh the map with new data
                gserviceForProviders.refresh($scope.formData.latitude, $scope.formData.longitude);

            })
            .catch(function (data) {
                console.log('Error: ' + data);
            });
    };
});
