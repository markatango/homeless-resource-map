// Creates the selectTypeCtrl Module and Controller. Note that it depends on 'geolocation' and 'gservice' modules.
var selectTypeCtrl = angular.module('selectTypeCtrl', ['geolocation','gserviceForProviders']);
selectTypeCtrl.controller('selectTypeCtrl', function ($scope, $log, $http, $rootScope, geolocation, gserviceForProviders) {

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    $scope.selectTypeIndex = new Array();
    $scope.selected = {};
    $scope.selectedKeys = new Array();
    
    // on page load, 
    $http.get('/provider_types', {})
        .success(function (queryResults) {

            // Query Body and Result Logging
           
           //console.log("/provider_types QueryResults: ");
           //console.log(queryResults);

            // Pass the filtered results to the Google Map Service and refresh the map
            /*gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);*/

            // make results avialbe to view
            $scope.provider_types = queryResults;

            // Count the number of records retrieved for the panel-footer
            $scope.queryCount = queryResults.length;

            // Initialize the selectType array
            //if($scope.provider_types.length){
                for (var t in $scope.provider_types){
                    $scope.selected[t.mne] = false;
                }
            //}
            
        })
        .error(function (queryResults) {
            console.log('Error ' + queryResults);
        });

    // Functions
    // ----------------------------------------------------------------------------
   
    // get locactions for selected provider types
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
            /*console.log("query: ");
            console.log(query);
            console.log("projection: ");
            console.log(projection);*/
            gserviceForProviders.refresh(latitude, longitude, queryResults)
            
        }).error(function (queryResults) {
            console.log('Error ' + queryResults);
        });
        
    };
    
    // Public functions
    // --------------------------------------------------------------
    
    // keep track of selected services
    $scope.updateSel = function(ind, mne){
        var logMess = "updateSel(" + ind + ", " + mne  
        console.log("updateSel(" + ind + ", " + mne + ")");
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

    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function () {

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function () {
            $scope.formData.latitude = parseFloat(gserviceForProviders.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gserviceForProviders.clickLong).toFixed(3);
        });
    });
    
    

    
   
});