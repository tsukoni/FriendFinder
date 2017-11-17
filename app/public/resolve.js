
 $('#submit').on("click", function() {
     //check to make sure the form is filled out
     var validEntry;
     if ($("#name").val().trim() === '') {
         alert('Please enter a name');
     } else if ($("#pic").val().trim() === '') {
         alert('Please enter a link to photo');
     } else {
         //empty array to hold the value from the survey questions
         var answerArray = [];
         //loop to push the answers from survey to the array (NEED TO UPDATE i< AS QUESTIONS ARE ADDED)
         for (i = 1; i < 11; i++) {
             answerArray.push(parseInt($('#quest' + i).val().substring(0, 1)));
         }
         //creating an object to hold the newly entered information
         var newFriend = {
             name: $("#name").val().trim(),
             photo: $("#pic").val().trim(),
             scores: answerArray
         };
         //records the current location (should work after deployment)
         var currentURL = window.location.origin;
         //add the newly entered information to the friend array
         $.post(currentURL + "/api/friends", newFriend,
             function(data) {});
         //access our array of potential friends so we can analyze it for the best match
         $.ajax({ url: currentURL + "/api/friends", method: "GET" }).done(function(res) {

             var bestFriend;
             var currentBest = 100;
             var differenceArray = [];
             //loops through all friends with the exception of the one just created
             for (i = 0; i < res.length - 1; i++) {
                 //compares the values from the survey questions and pushes the absolute value of the differences to the difference array
                 for (j = 0; j < 10; j++) {
                     var currentDifference = newFriend.scores[j] - res[i].scores[j];
                     differenceArray.push(Math.abs(currentDifference));
                 }
                 //adds the values in the array to give a single value that represents the difference between a potential friend and the current entry
                 var difference = differenceArray.reduce(add, 0);
                 //if the difference is less than any of the previous comparisons, push the current profile to the best match position
                 if (difference < currentBest) {
                     bestFriend = res[i];
                     currentBest = difference;
                     differenceArray = [];
                 }
                 //or just move on
                 else {
                     differenceArray = [];
                 }

             }
             //set up the display for the modal
             var friendName = '<h4>' + bestFriend.name + '<h4>';
             var friendPic = '<img width="300px" src=' + bestFriend.photo + '>';
             //show the modal
             $('#friend-modal').modal('show');
             $('#friend-modal h4').html(friendName);
             $('.modal-body').html(friendPic);
             //clear the entries
             $('#survey')[0].reset();

         });
     }
     return false;
 });

 function add(a, b) {
     return a + b;
 };