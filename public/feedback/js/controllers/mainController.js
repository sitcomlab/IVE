var app = angular.module("ive");


/**
 * Main Controller
 */
app.controller("mainController", function($scope, $socket, $timeout) {

    // save time when feedback page is loaded
    $scope.startDate = new Date();
    $scope.submitAlertMessage = false;

    // Init
    $scope.feedback = {
        rating: null,
        comment: ""
    };

    $scope.reset = function(){
        // Send socket message comment
        $socket.emit('/reset/feedback', null);
    };


    /**
     * [send feedback]
     */
    $scope.send = function(){

        $scope.data.disabled = false;

        var localDate = new Date();
        // time settings
        var options = {
            weekday: "short", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };
        // how long does it take until submit the comment @return time in milliseconds
        var timeUntilSubmitComment = localDate - $scope.startDate;

        if ($scope.feedback.comment !== "" && $scope.feedback.rating === null){

            // Send socket message comment
            $socket.emit('/post/feedback', {
                comment: "participant rated: " + $scope.participantRating + " start: " + $scope.startDate + " end: " + localDate + " time difference: " + timeUntilSubmitComment + " milliseconds" + " #splitHere# " + "On " + localDate.toLocaleTimeString("en-DE", options) + ", citizen wrote: " + ' "' + $scope.feedback.comment + '"'
             });
            $("#feedbackSubmitBtn").slideUp("slow");
        }else { if ( $scope.feedback.rating === "Like" || $scope.feedback.rating === "Dislike" ) {

            $scope.participantRating = $scope.feedback.rating;

            // Send socket message rating
            $socket.emit('/post/feedback', {
                rating: $scope.feedback.rating
            });
            $("#feedbackSubmitBtn").slideUp("slow");
        } else {console.log("no socket message")}
        }

        //hide text area after send comment
        if ($scope.feedback.comment !== "" && $scope.feedback.rating === null){
            $scope.showMeFlipTextarea = true;

        }else { if ( $scope.feedback.rating === "Like" || $scope.feedback.rating === "Dislike" ) {

                    $scope.showMeFlipRating = true;
                } else {console.log("if error")}
        }

        if( $scope.showMeFlipTextarea === true && $scope.showMeFlipRating === true){
            $("#feedbackSubmitBtn").slideUp("slow");
        }

        // submit alert for 2sec
        $scope.submitAlertMessage = true;
        $timeout(function() {
            $scope.submitAlertMessage = false;
        }, 2000);

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
