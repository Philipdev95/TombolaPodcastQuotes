var allQuotes = {};
var activeQuote = {};
var dbRef;
var highscore = [];
var firstGame = true;

/*-----------------*/
function sortHighScore(newScore) {
  highscore.push(newScore);

  highscore = highscore.sort(function(obj1, obj2) {
    return obj2.points - obj1.points;
  });
  highscore = highscore.slice(0, 10);
  printHighscore();
}
/*-----------------*/
function getQuote(name){
  var quotes = allQuotes[name]["quotes"];
  var quote = quotes[Math.floor(Math.random() * quotes.length)];

  activeQuote = {
    name: name,
    quote: quote["quote"]
  }
}
/*-----------------*/
function printPoints(){
  //function to print stored points
  $("#display-points").html(localStorage.getItem("storedPoints"));
}
/*-----------------*/
function addPoints(){
  //checking if there are saved points in storage
  var storedPoints = parseInt(localStorage.getItem("storedPoints"));
  if ($.isNumeric(storedPoints) == false){
    storedPoints = 1;
    localStorage.setItem("storedPoints", storedPoints);
  } else {
    //get storedPoints and add too them.
    storedPoints++;
    localStorage.setItem("storedPoints", storedPoints);
  }
  printPoints();
}
/*-----------------*/
function getPerson(){
  //choosing from who you get the quote
  //if 1 choose carl
  if (Math.floor((Math.random() * 2))) {
    return "carl";
  } else {
    return "marcus";
  }
}
/*-----------------*/
function printQuote(){
  $("#quotes .quote-text").text(activeQuote["quote"]);
}
/*-----------------*/
function presentAnswer(guess){
  //remove question and show result(right vs wrong)
  $("#question").addClass("hidden");
  $("#answer").removeClass("hidden");
  $("#next-div").removeClass("hidden");

  if (guess === activeQuote.name) {
    $("#correct-answer").removeClass("hidden");
    addPoints();
  } else {
    endGame();
  }
}
/*-----------------*/
function newQuote() {
  //reset the visibility
  $("#question").removeClass("hidden");
  $("#answer").addClass("hidden");
  $("#next-div").addClass("hidden");
  $("#correct-answer").addClass("hidden");

  //get a quote from a person
  getQuote(getPerson());

  //present the quote
  printQuote();
}
/*-----------------*/
function startGame(){
  localStorage.setItem("storedPoints", 0);
  $("#end").addClass("hidden");
  //print new quote
  newQuote();
  printPoints();

  if (firstGame) {
    //handler
    $("#choice-div").click(function(event) {
      if (event.target.classList.contains("person")) {
        presentAnswer(event.target.getAttribute("id"));
      }
    });

    $("#next").click(function() {
      newQuote();
    });

    firstGame = false;
  }
}
/*----------------*/
function endGame(){
  $("#question").addClass("hidden");
  $("#answer").addClass("hidden");
  $("#next-div").addClass("hidden");
  $("#end").removeClass("hidden");
  $("#add-form").removeClass("hidden");

  var storedPoints = parseInt(localStorage.getItem("storedPoints"));
  if ($.isNumeric(storedPoints)){
    $("#total-points span").text(storedPoints);
  }
}
/*-----------------*/
function saveHighscore() {
  $("#add-form").addClass("hidden");

  var storedPoints = parseInt(localStorage.getItem("storedPoints"));
  var name = $("#add-form input").val();

  if ($.isNumeric(storedPoints)){
    dbRef.ref("toplist/" + Date.now()).set({name: name, points: storedPoints});
  }

}
/*-----------------*/
function printHighscore() {
  var element;
  highscore.forEach((score,i) => {
    $("#toplist-" + i + " .name").text(score.name);
    $("#toplist-" + i + " .points").text(score.points);
  });
}
/*-----------------*/
$(document).ready(function() {
  //get quotes
  $.getJSON("resources/json/quotes.json", function(quotes) {
    $.getJSON("resources/json/config.json", function(config) {
      // Initialize Firebase
      firebase.initializeApp(config);

      dbRef = firebase.database();

      dbRef.ref("toplist").on("child_added", function(snapshot) {
        sortHighScore(snapshot.val());
      });

      allQuotes = quotes;
      startGame();
    });
  });

  $("#clear-points").click(function() {
    //remove all saved data in localstorage
    localStorage.clear();
    //print new score (0)
    printPoints();
    newQuote();
  });

  $("#add-form").submit(function(e){
    //prevent refresh
    e.preventDefault();
    saveHighscore();
  });

  $("#start-new").click(function() {
    startGame();
  });
});
