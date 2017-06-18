
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCtHMVUycyFkCL5qpVDguUYWHM4omFsvqM",
    authDomain: "trainschedule-dd7b4.firebaseapp.com",
    databaseURL: "https://trainschedule-dd7b4.firebaseio.com",
    projectId: "trainschedule-dd7b4",
    storageBucket: "",
    messagingSenderId: "159858591180"
  };
  firebase.initializeApp(config);

//create db container
var database = firebase.database();

console.log();

//click event
$("#input").on("click", function(event) {
      //prevents page from refreshing when a user hits "enter"
      event.preventDefault();
      //get input
      var name = $("#name").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrain = $("#firstTrain").val().trim();
      var frequency = $("#frequency").val().trim();

    //first Time (pushed back 1 year to make sure it comes before current time)
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    console.log(firstTrainConverted);

    //current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    //difference between times
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    //time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    //minute until train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    //next train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    var arrivalTime = moment(nextTrain).format("LT");
    var minutesAway = moment(nextTrain).fromNow(moment(),"minutes"); 

    //add to firebase database
    database.ref().push({
    TRAIN:name, TO:destination, FREQUENCY:frequency, NEXT:arrivalTime, MINUTES:minutesAway
})
    console.log(name + " " + destination + " " + frequency + " " + moment(nextTrain).format("LT") 
      + " " + minutesAway);

    window.location.reload();
})

//list values under each property
database.ref().on("child_added", function(childSnapshot) {
    //log snapshot values
    console.log(childSnapshot.val().TRAIN);
    console.log(childSnapshot.val().TO);
    console.log(childSnapshot.val().FREQUENCY);
    console.log(childSnapshot.val().NEXT);
    console.log(childSnapshot.val().MINUTES);

    //display in HTML
    $("#name-display").append("<p>" + childSnapshot.val().TRAIN + "</p>");
    $("#destination-display").append("<p>" + childSnapshot.val().TO + "</p>");
    $("#frequency-display").append("<p>" + childSnapshot.val().FREQUENCY + "</p>");
    $("#firstTrain-display").append("<p>" + childSnapshot.val().NEXT + "</p>");
    $("#minutes-display").append("<p>" + childSnapshot.val().MINUTES + "</p>");

    //handle errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
});