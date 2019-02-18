// Creates the listProvidersCtrl Module and Controller. Note that it depends on 'geolocation' and 'gserviceForProviders' modules.
var listProvidersCtrl = angular.module('listProvidersCtrl', ['geolocation','gserviceForProviders']);
listProvidersCtrl.controller('listProvidersCtrl', function ($scope, $log, $http, $rootScope, geolocation, gserviceForProviders) {

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    $scope.selectTypeIndex = new Array();
    $scope.selected = {};
    $scope.selectedKeys = new Array();
    $scope.searchFish   = '';     // set the default search/filter term
    $scope.sortType     = 'Agency'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    
    var fields = [
            "Agency",
            "Services",
            "Service_Type",
            "Street_Address",
            "Suite_Floor_Dept_Room" ,   
            "City",
            "State" , 
            "Zip",
            "Website" ,
            "Location1",
            "Population",
            "Hours_of_operation",
            "Title",
            "First_Name",
            "Last_Name",
            "Phone",
            "Email" ,
            "Longitude",
            "Latitude"
    ] 
    
    $scope.fields = angular.copy(fields)
    
    // on page load, 
    var query = {}
    
    var selector = {
        "Agency" : 1,
        "Services" : 1,
        "Service_Type" : 1,
        "Street_Address" : 1,
        "City" : 1,
        "State" : 1 , 
        "Zip" : 1,
        "Website" : 1 ,
        "Population" : 1,
        "Hours_of_operation" : 1,
        "Title" : 1,
        "First_Name" : 1,
        "Last_Name" : 1,
        "Phone" : 1,
        "Email" : 1
    }
    
    $http.get('/providers', {})
        .success(function (queryResults) {
            $scope.providers = queryResults
            $scope.queryCount = queryResults.length
        })
        .error(function (queryResults) {
            console.log('Error ' + queryResults);
        });
    
    
        
   

    // Functions
    // ----------------------------------------------------------------------------
   
    // get locations for selected provider types
    // Private Inner Functions
    // --------------------------------------------------------------
    getLocations = function(types){
        
        var latitude = 34.045;
        var longitude = -118.240;
        
        var query = {Services: {$in: types}};
        var projection = {_id:0};
        
        // console.log("getLocations(" + types);
        
        $http.post('/providerlocsbytype', {query, projection} )
        .success(function(queryResults){
           // console.log("query: ");
           // console.log(query);
           // console.log("projection: ");
           // console.log(projection);
            gserviceForProviders.refresh(latitude, longitude, queryResults)
            
        }).error(function (queryResults) {
            // console.log('Error ' + queryResults);
        });       
    };
    
    // Public functions
    // --------------------------------------------------------------
    
    // keep track of selected services
    $scope.updateSel = function(ind, mne){
        var logMess = "updateSel(" + ind + ", " + mne  
        // console.log("updateSel(" + ind + ", " + mne + ")");
        if(mne){
            $scope.selected[mne] = $scope.selectTypeIndex[ind];
        if(!$scope.selected[mne]) delete $scope.selected[mne];
        }
        
       /*for ( u in selected){
            if(!u) delete $scope.selected[u];
        }*/
        $scope.selectedKeys = Object.keys($scope.selected);
        getLocations($scope.selectedKeys);  
    };
    
    // Get User's actual coordinates based on HTML5 at window load
   /* geolocation.getLocation().then(function (data) {
        coords = {
            lat: data.coords.latitude,
            long: data.coords.longitude
        };

        // Set the latitude and longitude equal to the HTML5 coordinates
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
    });*/
    
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

        // Run the gserviceForProviders functions associated with identifying coordinates
        $scope.$apply(function () {
            $scope.formData.latitude = parseFloat(gserviceForProviders.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gserviceForProviders.clickLong).toFixed(3);
        });
    });
});
