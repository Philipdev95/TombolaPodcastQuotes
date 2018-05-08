var carlsList = [
  "Jamen, det har min mamma alltid sagt!",
  "Ge oss pengar på patreon nu för fan!",
  "Snälla bli patreon!"];
var marcusList = [
  "Har du döpt sköldpaddan till Jerry Williams?",
  "WAAAOOW, hans mamma är från Americat!",
  "I Mölndal finns sveriges godaste räckmacka!"
];
/*-----------------*/
function getQuote(name){
  if (name == "carl"){
    var carlN = Math.floor((Math.random() * carlsList.length) + 0);
    $("#quotes").html("<p class='quote-text p-3 mt-3'>" + carlsList[carlN] + "</p><div id='cbuttons' class='col-12'></div>");
    $("#choice-div").append('<button id="correct" type="button" class="col-4 offset-1 btn btn-outline-dark">CARL</button><button id="wrong" type="button" class="col-4 offset-2 btn btn-outline-dark">MARCUS</button>');
  } else {
    var marcusN = Math.floor((Math.random() * marcusList.length) + 0);
    $("#quotes").html("<p class='quote-text p-3 mt-3'>" + marcusList[marcusN] + "</p>");
    $("#choice-div").html('<button id="wrong" type="button" class="col-4 offset-1 btn btn-outline-dark">CARL</button><button id="correct" type="button" class="col-4 offset-2 btn btn-outline-dark">MARCUS</button>');
  }
}
/*-----------------*/
function getPerson(){
  $("#quotes").html(" ");
  $("#choice-div").html(" ");
  var oneOrTwo = Math.floor((Math.random() * 2) + 1);
  if (oneOrTwo == 1) {
    getQuote("carl");
  } else {
    getQuote("marcus");
  }
}
/*-----------------*/
$(document).ready(function() {
  getPerson();
  $("#correct").click(function() {
    alert("Det var rätt! Bra jobbat mr Williams");
    location.reload();
  });
  $("#wrong").click(function() {
    alert("Det var inte alls rätt! Alltså fel...");
    location.reload();
  });
  /*-----------------*/
  var allQuots = [];
  $.getJSON("resources/json/quotes.json", function(data) {
    for (var hosts in data) {
      //$("#quotes").append("<h3 class='host-name col-12'>" + data[hosts].person + "</h3>");
      for (var quotes in data[hosts].quotes){
        var theQuote = "<p class'col-12'>" + data[hosts].quotes[quotes].quote + "</p>";
        //$("#quotes").append("<div class='quote-div'><p class='quote-text col-12 col-md-12'>" + data[hosts].quotes[quotes].quote + "</p>");
        //$("#quotes").append('<div class="btn-group col-10 offset-1 col-md-4 offset-md-4" role="group" aria-label="choose host"><button type="button" class="col-sm btn btn-dark">Carl</button><button type="button" class="col-sm btn btn-dark">Marcus</button></div>');
        //$("#quotes").append('<button type="button" class="col-6 btn btn-primary">Carl</button>');
        //$("#quotes").append('<button type="button" class="col-6 btn btn-primary">Marcus</button></div>');
        allQuots.push(theQuote);
      }
      //$("#quotes").append("");
    }
  });
  var texten = "";
  for (i = 0; i < allQuots.length; i++) {
    texten += "<p class='col-12'>" + allQuots[i] + "</p>";
  }
  $("#quotes").append(texten);
});
