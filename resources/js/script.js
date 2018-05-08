/*-----------------*/
$(document).ready(function() {
  var carlsList = [];
  var marcusList = [];
  var allQuots = [];
  $.getJSON("resources/json/quotes.json", function(data) {
    for (var hosts in data) {
      $("#quotes").append("<h3 class='host-name col-12'>" + data[hosts].person + "</h3>");
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
  alert(allQuots.length);
  var texten = "";
  for (i = 0; i < allQuots.length; i++) {
    texten += "<p class='col-12'>" + allQuots[i] + "</p>";
  }
  $("#quotes").append(texten);
});
