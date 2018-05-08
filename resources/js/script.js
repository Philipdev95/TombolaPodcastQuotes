/*-----------------*/
$(document).ready(function() {
  $.getJSON("resources/json/quotes.json", function(data) {
    for (var persons in data) {
      $(".quotes").append("<p>" + data[persons].person + "</p>");
    }
  });
});
