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
    
    var providerInfo = [
    
        {info: "Agency",
         name: "Provider",
         hint: "Community Services",
         data: ""},

        {info: "Services",
         name: "Services",
         hint: "Clothes, food distribution, etc",
         data: ""},
        
        {info: "Service",
         name: "Service",
         hint: "123 Main St",
         data: ""},
        
        {info: "Population",
         name: "Population",
         hint: "Adult males, over 18 years old",
         data: ""},
        
        {info: "Hours_of_operation",
         name: "Hours of operation",
         hint: "8:00 am - 5:00 pm, M-Th",
         data: ""},
                 
        {info: "Street_Address",
         name: "Street address",
         hint: "123 Main St",
         data: ""},
         
        {info: "Suite_Floor_Dept_Room",
         name: "Suite Floor Dept Room",
         hint: "Unit A",
         data: ""},
 
        {info: "City",
         name: "City",
         hint: "Los Angeles",
         data: ""},
                
        {info: "State",
         name: "State",
         hint: "State",
         data: ""},
        
        {info: "Zip",
         name: "Zip",
         hint: "91234",
         data: ""},
        
        {info: "Website",
         name: "Website",
         hint: "www.example.com",
         data: ""}
       ];
       
   var contactInfo = [
        {info: "Title",
         name: "Title",
         hint: "Salutation",
         data: ""},
        
        {info: "First_Name",
         name: "First name",
         hint: "First",
         data: ""},
        
        {info: "Last_Name",
         name: "Last name",
         hint: "Last",
         data: ""},
     
        {info: "Phone",
         name: "Phone",
         hint: "626-555-1212",
         data: ""},
        
        {info: "Email",
         name: "Email",
         hint: "user@example.com",
         data: ""}
       ];
       
   $scope.providerInfo = angular.copy(providerInfo);
   
   $scope.contactInfo = angular.copy(contactInfo);
       
   $scope.providerValues = {};
 //  $scope.contactValues = {};
   
   $scope.$watch('providerValues', function (newValue, oldValue, scope) {
    console.log(newValue);
    }, true);
    
/*   $scope.$watch('contactValues', function (newValue, oldValue, scope) {
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
