var app = angular.module("ive");


/**
 * Main Controller
 */
app.controller("mainController", function($scope, $socket) {

    // Init
    $scope.feedback = {
        rating: null,
        comment: ""
    };

    /**
     * [send feedback]
     */
    $scope.send = function(){
        // Send socket message
        $socket.emit('/post/feedback', {
            rating: $scope.feedback.rating,
            comment: $scope.feedback.comment
        });
        if ($scope.feedback.comment !== "" && $scope.feedback.rating === null){
            $scope.showMeFlipTextarea = true;

        }else { if ( $scope.feedback.rating === "Like" || $scope.feedback.rating === "Dislike" ) {

                    $scope.showMeFlipRating = true;
                } else {console.log("if error")}
        }

        if( $scope.showMeFlipTextarea === true && $scope.showMeFlipRating === true){
            $("#feedbackSubmitBtn").slideUp("slow");
        }

    };

        // show text area and hide ratingArea
        $("#flipTextarea").click(function() {
            $("#comment").slideDown("slow");
            $("#ratingArea").slideUp("slow");
            $("#feedbackSubmitBtn").slideDown("slow");
            //reset rating
            $scope.feedback = {rating : null};

        });

        // show rating area and hide text area
        $("#flipRating").click(function() {
            $("#ratingArea").slideDown("slow");
            $("#comment").slideUp("slow");
            $("#feedbackSubmitBtn").slideDown("slow");
            //reset comment
            $scope.feedback = {comment : ""};

        });

});
