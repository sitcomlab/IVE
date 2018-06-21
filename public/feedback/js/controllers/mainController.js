var app = angular.module("ive");


/**
 * Main Controller
 */
app.controller("mainController", function($scope, $socket, $timeout) {



    $scope.submitAlertMessage = false;

    // Init
    $scope.feedback = {
        rating: null,
        comment: ""
    };


    $socket.on('/set/video', function(data){
        console.log( data.video_id);
    });

    $scope.reset = function(){
        // Send socket message comment
        $socket.emit('/reset/feedback', null);
    };


    /**
     * [send feedback]
     */
    $scope.send = function(){

        var localDate = new Date();
        var options = {
            weekday: "short", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };

        if ($scope.feedback.comment !== "" && $scope.feedback.rating === null){

            // Send socket message comment
            $socket.emit('/post/feedback', {
                comment: "On " + localDate.toLocaleTimeString("en-DE", options) + ", citizen wrote: " + ' "' + $scope.feedback.comment + '"'
             });
        }else { if ( $scope.feedback.rating === "Like" || $scope.feedback.rating === "Dislike" ) {

            // Send socket message rating
            $socket.emit('/post/feedback', {
                rating: $scope.feedback.rating
            });

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
