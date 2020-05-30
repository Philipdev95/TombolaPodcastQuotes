// Set IS_DEV if running locally
window.IS_DEV = window.origin.includes('localhost') || window.origin.includes('127.0.0.1');

if (window.IS_DEV) {
  console.log('%cDEV MODE ENABLED!',
      'font-weight: bold; font-size: 40px; color: red; text-shadow: 3px 3px 0 rgb(217,31,38),' +
      ' 6px 6px 0 rgb(226,91,14), 9px 9px 0 rgb(245,221,8), 12px 12px 0 rgb(5,148,68),' +
      ' 15px 15px 0 rgb(2,135,206), 18px 18px 0 rgb(4,77,145), 21px 21px 0 rgb(42,21,113)');
}

let allQuotes = {};
let activeQuote = {};
let dbRef;
let highscore = [];
let firstGame = true;

/*-----------------*/
function sortHighScore(newScore) {
  highscore.push(newScore);

  highscore = highscore.sort((obj1, obj2) => obj2.points - obj1.points);
  highscore = highscore.slice(0, 10);
  printHighscore();
}
function getAllQuotes(){
  $.getJSON("../json/quotes.json", data => {
    const cQuotes = data.carl.quotes;
    let i = 0;
    while (i < cQuotes.length){
      $("#quotesCarl").append("<p>" + cQuotes[i].quote + "</p>");
      i++;
    }
    const mQuotes = data.marcus.quotes;
    let x = 0;
    while (x < mQuotes.length){
      $(".quotesMarcus").append("<p>" + mQuotes[x].quote + "</p>");
      x++;
    }
  });
}

function getTwoDigits (number) {
  let newNumber;
  if (number < 10) {
    newNumber = '0' + number;
    return newNumber;
  } else {
    return number;
  }
}
/*
function getAllQuotes(){
  var Cquotes = allQuotes["carl"]["quotes"];
  var Mquotes = allQuotes["marcus"]["quotes"];
  $(".quotesCarl").append(Cquotes);
  $(".quotesMarcus").append(Mquotes);
}q

/*------*/
$("#allQuotes").click(() => {
  getAllQuotes();
});
/*-----------------*/
function getQuote(name){
  const quotes = allQuotes[name]["quotes"];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

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
  let storedPoints = parseInt(localStorage.getItem("storedPoints"));
  if (!$.isNumeric(storedPoints)){
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
    $("#choice-div").click(event => {
      if (event.target.classList.contains("person")) {
        presentAnswer(event.target.getAttribute("id"));
      }
    });

    $("#next").click(() => {
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

  const storedPoints = parseInt(localStorage.getItem("storedPoints"));
  if ($.isNumeric(storedPoints)){
    $("#total-points span").text(storedPoints);
  }
}
/*-----------------*/
function saveHighscore() {
  $("#add-form").addClass("hidden");

  const storedPoints = parseInt(localStorage.getItem("storedPoints"));
  const name = $("#add-form input").val();

  if ($.isNumeric(storedPoints)){
    dbRef.ref("toplist/" + Date.now()).set({name: name, points: storedPoints});
  }

}
/*-----------------*/
function printHighscore() {
  highscore.forEach((score,i) => {
    $("#toplist-" + i + " .name").text(score.name);
    $("#toplist-" + i + " .points").text(score.points);
  });
}
/*-----------------*/
$(document).ready(() => {
  //get quotes
  $.getJSON("../resources/json/quotes.json", quotes => {
    $.getJSON("../resources/json/config.json", config => {
      // Initialize Firebase
      firebase.initializeApp(config);

      dbRef = firebase.database();

      dbRef.ref("toplist").on("child_added", snapshot => {
        sortHighScore(snapshot.val());
      });

      allQuotes = quotes;
      startGame();
    });
  });

  $("#clear-points").click(() => {
    //remove all saved data in localstorage
    localStorage.clear();
    //print new score (0)
    printPoints();
    newQuote();
  });

  $("#add-form").submit(e => {
    //prevent refresh
    e.preventDefault();
    saveHighscore();
  });

  $("#start-new").click(() => {
    startGame();
  });
});

function xmlToJson(xml) {

	// Create the return object
	let obj = {};

	if (xml.nodeType === 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (let j = 0; j < xml.attributes.length; j++) {
				const attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType === 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	// If just one text node inside
	if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
		obj = xml.childNodes[0].nodeValue;
	}
	else if (xml.hasChildNodes()) {
		for(let i = 0; i < xml.childNodes.length; i++) {
			const item = xml.childNodes.item(i);
			const nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					const old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}
function getXML(feedUrl) {
  let ssArr, url;
  if (window.IS_DEV) {
    url = `${window.origin}/resources/mock/episodes-response.txt`;
  } else {
    url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSgkUq7i7Lz9yxAgpQQ84LdH3gB5_H23231r20_DxkeVK3jwYXN_-yGVXHwYv4ARz2qNU3Yga_T1qgv/pub?output=csv';
  }
  $.ajax({
    url: url,
    success: function (data) {
      ssArr = data.split("\n");
    }
  });
  $.ajax({
    type: "GET",
    url: feedUrl,
    dataType: "xml",
    error: function (_response) {
      console.log('Error: There was a problem processing your request, please refresh the browser and try again');
    },
    success: function (response) {
      const XMLisJSON = xmlToJson(response);
      const titles = XMLisJSON.rss.channel.item.reverse();
      let lastTitle;
      $.each(titles, (index, title) => {
        if (ssArr === undefined) {
          $('.status-message').html('Något gick fel. Pröva att ladda om sidan. <button class="btn btn-sm" onClick="history.go(0);">Refresh Page</button>');
          return false;
        } else {
          $('.status-message').html('');
        }
        let item = ssArr[index].split(',');
        let showNotes = '';
        let skojPoints = '';
        let carousel = '';
        const gs_showRated = item[3];
        const gs_showNotes = item[4];
        const gs_showQuotes = item[5];
        if (index !== 0) {
          if (item[4] !== '') {
            showNotes = '<hr class="m-1"><i class="show-notes text-muted">' + gs_showNotes + '</i>';
          }
          if (gs_showRated !== '') {
            let colorClass;
            if (gs_showRated < 50) {colorClass = 'bg-warning';} else if (gs_showRated >= 50 && gs_showRated < 100) {colorClass = 'bg-success';} else if (gs_showRated === 100) {colorClass = 'bg-info';}
            skojPoints = '<hr class="m-1"><div class="progress"><div class="progress-bar ' + colorClass + '" role="progressbar" style="width: ' + gs_showRated + '%;" aria-valuenow="' + gs_showRated + '" aria-valuemin="0" aria-valuemax="100">Skojfaktor: ' + gs_showRated + '</div></div>';
          }
          if (gs_showQuotes !== '') {
            let quotes;
            let prev = '';
            let next = '';
            quotes = gs_showQuotes.split(';');
            let item;
            let allQuotes = '';
            $.each(quotes, (i, quote) => {
              if (i === 0) {
                item = '<div class="carousel-item active" data-interval="4000">' + quote + '</div>';
              } else {
                item = '<div class="carousel-item" data-interval="4000">' + quote + '</div>';
                prev = '<a class="carousel-control-prev" href="#quoteCarousel' + index + '" role="button" data-slide="prev"><i class="text-dark far fa-chevron-left"></i><span class="sr-only">Previous</span></a>';
                next = '<a class="carousel-control-next" href="#quoteCarousel' + index + '" role="button" data-slide="next"><i class="text-dark far fa-chevron-right"></i><span class="sr-only">Next</span></a>';
              }
              allQuotes = allQuotes + item;
            });
            const inner = '<div class="carousel-inner">' + allQuotes + '</div>';
            carousel = '<hr class="m-1"><div id="quoteCarousel' + index + '" class="carousel slide" data-ride="carousel">' + inner + prev + next + '</div>';
          }
          const date = new Date(title.pubDate).getFullYear() + '.' + getTwoDigits(new Date(title.pubDate).getMonth() + 1) + '.' + getTwoDigits(new Date(title.pubDate).getDate());
          $("#episodeList").prepend('<li href="#" data-index="' + index + '" class="list-group-item list-group-item-action d-block">' +
          '<a class="d-flex justify-content-between">' +
          '<span>' + title.title + '</span>' +
          '<span>' + date + '</span>' + '</a>' + showNotes + skojPoints + carousel +
          '</li>');
        }
        lastTitle = title.title;
      });
    }
  });
}
$.ajax({
  type: 'post',
  url: 'https://itunes.apple.com/lookup?id=1095020110&entity=podcast',
  cache: false,
  success: function(results) {
    const data = JSON.parse(results);
    getXML(data.results[0].feedUrl);
  },
  error: function(err) {
    console.log(JSON.parse(err.responseText));
  }
});

function filterFunction() {
  // Declare variables
  let input, filter, ul, li, a, i, txtValue, searchFieldSelectVal;
  input = document.getElementById('searchInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById("episodeList");
  li = ul.getElementsByTagName('li');
  searchFieldSelectVal = document.getElementById('search-field-select').value;
  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    if (searchFieldSelectVal === 'episode_title_numb_date') {
      a = li[i].getElementsByTagName("a")[0];
    } else if (searchFieldSelectVal === 'episode_comments') {
      a = li[i].getElementsByClassName("show-notes")[0];
    }
    if (a !== undefined) {
      txtValue = a.textContent || a.innerText;
    } else {
      txtValue = '';
    }
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].classList.add("d-block");
      li[i].style.display = "";
    } else {
      li[i].classList.remove("d-block");
      li[i].style.display = "none";
    }
  }
}