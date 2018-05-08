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
function getPerson(){
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
  $("#question").addClass("hidden");
  $("#answer").removeClass("hidden");
  $("#next-div").removeClass("hidden");

  if (guess === activeQuote.name) {
    $("#correct-answer").removeClass("hidden");
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

  //handler
  $("#choice-div").click(function(event) {
    if (event.target.classList.contains("person")) {
      presentAnswer(event.target.getAttribute("id"));
    }
  });

  $("#next").click(function() {
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
