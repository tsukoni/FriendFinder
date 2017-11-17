$(document).ready(function() {

    $('#submit').on("click", function() {
        var validEntry;
        if ($("#name").val().trim() === '') {
            alert('Please enter a name');
        } else if ($("#pic").val().trim() === '') {
            alert('Please enter a link to photo');
        } else {
            var answerArray = [];
            for (i = 1; i < 11; i++) {
                answerArray.push(parseInt($('#quest' + i).val().substring(0, 1)));
            }
            var newFriend = {
                name: $("#name").val().trim(),
                photo: $("#pic").val().trim(),
                scores: answerArray
            };
            var currentURL = window.location.origin;
            $.post(currentURL + "/api/friends", newFriend,
                function(data) {});
            $.ajax({ url: currentURL + "/api/friends", method: "GET" }).done(function(res) {
                var bestFriend;
                var currentBest = 100;
                var differenceArray = [];
                for (i = 0; i < res.length - 1; i++) {
                    for (j = 0; j < 10; j++) {
                        var currentDifference = newFriend.scores[j] - res[i].scores[j];
                        differenceArray.push(Math.abs(currentDifference));
                    }
                    var difference = differenceArray.reduce(add, 0);
                    if (difference < currentBest) {
                        bestFriend = res[i];
                        currentBest = difference;
                        differenceArray = [];
                    } else {
                        differenceArray = [];
                    }
                }
                var friendName = '<h4>' + bestFriend.name + '<h4>';
                var friendPic = '<img width="300px" src=' + bestFriend.photo + '>';
                $('#friend-modal').modal('show');
                $('#friend-modal h4').html(friendName);
                $('.modal-body').html(friendPic);
                $('#survey')[0].reset();
            });
        }
        return false;
    });

    function add(a, b) {
        return a + b;
    };

});