/*-----------------*/
$(document).ready(function() {
  var carlsList = [];
  var marcusList = [];
  var allQuots = [];
  $.getJSON("resources/json/quotes.json", function(data) {
    for (var hosts in data) {
      $("#quotes").append("<h3 class='col-xs-12'>" + data[hosts].person + "</h3>");
      for (var quotes in data[hosts].quotes){
        $("#quotes").append("<p class='col-xs-12'>" + data[hosts].quotes[quotes].quote + "</p>");
        allQuots.push(data[hosts].quotes[quotes].quote);
      }
    }
  });
});

/*---
for (var courses in data) {
  $("section").append("<p class='programme'>" + data[courses].programme + "</p><div id='" + data[courses].programmecode + "' class='programmediv style" + colornumber + "'>");
  for (var course in data[courses].courses) {
    $("#" + data[courses].programmecode).append("<p class='course " + data[courses].courses[course].coursecode + "'>" + data[courses].courses[course].course + "</p>");
    for (var book in data[courses].courses[course].coursebook) {
      $("." + data[courses].courses[course].coursecode).after("<a class='name' target='_blank' style='display: none;' href='" + data[courses].courses[course].coursebook[book].link + "'>" + data[courses].courses[course].coursebook[book].name + "</a><br style='display: none;'>");
    }
  }
}
---*/
