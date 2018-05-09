var allQuotes = {};
var activeQuote = {};

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
  console.log(storedPoints);
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
    $("#wrong-answer").removeClass("hidden");
  }
}
/*-----------------*/
function newQuote() {
  //reset the visibility
  $("#question").removeClass("hidden");
  $("#answer").addClass("hidden");
  $("#next-div").addClass("hidden");
  $("#correct-answer").addClass("hidden");
  $("#wrong-answer").addClass("hidden");

  //get a quote from a person
  getQuote(getPerson());

  //present the quote
  printQuote();
}
/*-----------------*/
function startGame(){
  //print new quote
  newQuote();
  printPoints();
  //handler
  $("#choice-div").click(function(event) {
    if (event.target.classList.contains("person")) {
      presentAnswer(event.target.getAttribute("id"));
    }
  });

  $("#next").click(function() {
    newQuote();
  });
  $("#clear-points").click(function() {
    //remove all saved data in localstorage
    localStorage.clear();
    //print new score (0)
    printPoints();
    newQuote();
  });
}
/*-----------------*/
$(document).ready(function() {
  //get quotes
  $.getJSON("resources/json/quotes.json", function(data) {
    allQuotes = data;
    startGame()
  });
});
