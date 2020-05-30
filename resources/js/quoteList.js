// Set IS_DEV if running locally
window.IS_DEV = window.origin.includes('localhost') || window.origin.includes('127.0.0.1');

if (window.IS_DEV) {
  console.log('%cDEV MODE ENABLED!',
    'font-weight: bold; font-size: 40px; color: red; text-shadow: 3px 3px 0 rgb(217,31,38),' +
        ' 6px 6px 0 rgb(226,91,14), 9px 9px 0 rgb(245,221,8), 12px 12px 0 rgb(5,148,68),' +
        ' 15px 15px 0 rgb(2,135,206), 18px 18px 0 rgb(4,77,145), 21px 21px 0 rgb(42,21,113)');
}

const hideLoadingSpinner = () => {
  $('#loading-spinner').hide();
};

const displayQuotes = ({carl, marcus}) => {
  $('#quote-container').show();
  const quotesCarl = $('#quotesCarl');
  const quotesMarcus = $('#quotesMarcus');

  carl.quotes
    .forEach(({quote}) =>
      quotesCarl.append(`<p>${quote}</p>`),
    );
  marcus.quotes
    .forEach(({quote}) =>
      quotesMarcus.append(`<p>${quote}</p>`),
    );
};

const fetchQuotes = () => {
  const url = window.IS_DEV ? `${window.origin}/resources/json/quotes.json` : '../json/quotes.json';
  return new Promise((resolve, _reject) =>
    $.getJSON(url, json => resolve(json)))
    .then(quotes => displayQuotes(quotes));
};

fetchQuotes()
  .then(__ => {
    hideLoadingSpinner();
  });
