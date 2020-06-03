/* eslint-disable no-console */

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
let isFirstGame = true;

const sortHighScore = newScore => {
  highscore.push(newScore);

  highscore = highscore.sort((obj1, obj2) => obj2.points - obj1.points);
  highscore = highscore.slice(0, 10);
};

const getQuote = name => {
  const quotes = allQuotes[name].quotes;
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  activeQuote = {
    name,
    quote: quote.quote,
  };
};

const printPoints = () => {
  // Print stored points
  $('#display-points').html(localStorage.getItem('storedPoints'));
};

const addPoints = () => {
  // checking if there are saved points in storage
  let storedPoints = parseInt(localStorage.getItem('storedPoints'), 10);
  if (!$.isNumeric(storedPoints)) {
    localStorage.setItem('storedPoints', 1);
  } else {
    // get storedPoints and add too them.
    localStorage.setItem('storedPoints', ++storedPoints);
  }
};

const getRandomPerson = () => {
  // choosing from who you get the quote
  // if 1 choose carl
  if (Math.floor((Math.random() * 2))) {
    return 'carl';
  }
  return 'marcus';
};

const printQuote = () => {
  $('#quotes .quote-text').text(activeQuote.quote);
};

const newQuote = () => {
  // reset the visibility
  $('#question').removeClass('hidden');
  $('#answer').addClass('hidden');
  $('#next-div').addClass('hidden');
  $('#correct-answer').addClass('hidden');

  // get a quote from a random person
  getQuote(getRandomPerson());

  // present the quote
  printQuote();
};


const endGame = () => {
  $('#question').addClass('hidden');
  $('#answer').addClass('hidden');
  $('#next-div').addClass('hidden');
  $('#end').removeClass('hidden');
  $('#add-form').removeClass('hidden');

  const storedPoints = parseInt(localStorage.getItem('storedPoints'), 10);
  if ($.isNumeric(storedPoints)) {
    $('#total-points span').text(storedPoints);
  }
};

const presentAnswer = guess => {
  // remove question and show result(right vs wrong)
  $('#question').addClass('hidden');
  $('#answer').removeClass('hidden');
  $('#next-div').removeClass('hidden');

  if (guess === activeQuote.name) {
    $('#correct-answer').removeClass('hidden');
    addPoints();
    printPoints();
  } else {
    endGame();
  }
};

const startGame = () => {
  localStorage.setItem('storedPoints', 0);
  $('#end').addClass('hidden');
  // print new quote
  newQuote();
  printPoints();

  if (isFirstGame) {
    // handler
    $('#choice-div').click(({target}) => {
      if (target.classList.contains('person')) {
        presentAnswer(target.getAttribute('id'));
      }
    });

    $('#next').click(() => {
      newQuote();
    });

    isFirstGame = false;
  }
};

const saveHighscore = () => {
  $('#add-form').addClass('hidden');

  const storedPoints = parseInt(localStorage.getItem('storedPoints'), 10);
  const name = $('#add-form input').val();

  if ($.isNumeric(storedPoints)) {
    dbRef.ref(`toplist/${Date.now()}`).set({name, points: storedPoints});
  }
};

const printHighscore = () => {
  highscore.forEach(({name, points}, i) => {
    $(`#toplist-${i} .name`).text(name);
    $(`#toplist-${i} .points`).text(points);
  });
};

$(document).ready(() => {
  // get quotes
  $.getJSON('../resources/json/quotes.json', quotes => {
    $.getJSON('../resources/json/config.json', config => {
      // Initialize Firebase
      firebase.initializeApp(config); // eslint-disable-line

      dbRef = firebase.database(); // eslint-disable-line

      dbRef.ref('toplist').on('child_added', snapshot => {
        sortHighScore(snapshot.val());
        printHighscore();
      });

      allQuotes = quotes;
      startGame();
    });
  });

  $('#clear-points').click(() => {
    // remove all saved data in localstorage
    localStorage.clear();
    // print new score (0)
    printPoints();
    newQuote();
  });

  $('#add-form').submit(e => {
    // prevent refresh
    e.preventDefault();
    saveHighscore();
  });

  $('#start-new').click(() => {
    startGame();
  });
});
