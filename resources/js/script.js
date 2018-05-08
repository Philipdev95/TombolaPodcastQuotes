/*-----------------*/
$.getJSON("resources/json/quotes.json", function(data) {
  for (var courses in data) {
    alert(courses);
  }
});

$(".programmediv").toggle();
  $(".programme").click(function() {
    var programID = "#" + $(this).attr("title");
    $(programID).toggle();
    $(this).toggleClass("lean");
    console.log("click");
  });
  $(".quote").click(function() {
    $(this).nextUntil(".quote").toggle();
  });
});
