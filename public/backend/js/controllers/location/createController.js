var app = angular.module("ive");

// Location create controller
app.controller("locationCreateController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $locationService) {

    /*************************************************
        FUNCTIONS
     *************************************************/

    /**
     * [changeTab description]
     * @param  {[type]} tab [description]
     * @return {[type]}     [description]
     */
    $scope.changeTab = function(tab){
        $scope.tab = tab;
    };

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function(path){
        $location.url(path);
    };

    /**
     * [cancel description]
     * @return {[type]} [description]
     */
    $scope.cancel = function(){
        if($authenticationService.get()){
            $scope.redirect("/locations");
        } else {
            $scope.redirect("/locations");
        }
    };

    /**
     * [send description]
     * @return {[type]} [description]
     */
    $scope.send = function(){
        // Validate input
        if($scope.createDocumentForm.$invalid) {
            // Update UI
            $scope.createDocumentForm.document_title.$pristine = false;
            $scope.createDocumentForm.document_email_address.$pristine = false;
        } else {
            $scope.changeTab(0);

            $userService.findByEmail($scope.new_document.email_address)
            .success(function(response) {
                // Check if user exists
                if(JSON.parse(response)){
                    $documentService.create($scope.new_document)
                    .success(function(response) {
                        $window.alert("Your new document has been created and an email with the document-ID has been sent to you!");
                        $scope.redirect("/");
                    })
                    .error(function(response) {
                        $window.alert(response);
                    });
                } else {
                    $scope.new_user.email_address = $scope.new_document.email_address || "";
                    $scope.changeTab(2);
                }
            })
            .error(function(response) {
                $window.alert(response);
            });
        }
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.changeTab(0);
    $scope.location = $locationService.init();
    $scope.changeTab(1);

});
