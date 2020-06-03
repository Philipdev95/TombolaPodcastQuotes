/* eslint-disable no-console */

// Set IS_DEV if running locally
window.IS_DEV = window.origin.includes('localhost') || window.origin.includes('127.0.0.1');

if (window.IS_DEV) {
  console.log('%cYOU\'RE IN DEV MODE',
    'font-weight: bold; font-size: 40px; color: red; text-shadow: 3px 3px 0 rgb(217,31,38),' +
        ' 6px 6px 0 rgb(226,91,14), 9px 9px 0 rgb(245,221,8), 12px 12px 0 rgb(5,148,68),' +
        ' 15px 15px 0 rgb(2,135,206), 18px 18px 0 rgb(4,77,145), 21px 21px 0 rgb(42,21,113)');
}

const EPISODE_SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSgkUq7i7Lz9yxAgpQQ84LdH3gB5_H23231r20_DxkeVK3jwYXN_-yGVXHwYv4ARz2qNU3Yga_T1qgv/pub?output=csv';
const FEED_URL = 'http://tombola.libsyn.com/rss';

const toTwoDigits = number => {
  if (number < 10) {
    return `0${number}`;
  }

  return number;
};

const getColorClass = rating => {
  if (rating < 50) {
    return 'bg-warning';
  } else if (rating >= 50 && rating < 100) {
    return 'bg-success';
  }

  // Rating === 100
  return 'bg-info';
};

const hideLoadingSpinner = () => {
  $('#loading-spinner').hide();
};

const xmlToJson = xml => {
  // Taken from https://davidwalsh.name/convert-xml-json
  let result = {};

  if (xml.nodeType === 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
      result['@attributes'] = {};
      for (let j = 0; j < xml.attributes.length; j++) {
        const attribute = xml.attributes.item(j);
        result['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) { // text
    result = xml.nodeValue;
  }

  // do children
  // If just one text node inside
  if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
    result = xml.childNodes[0].nodeValue;
  } else if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;
      if (typeof (result[nodeName]) === 'undefined') {
        result[nodeName] = xmlToJson(item);
      } else {
        if (typeof (result[nodeName].push) === 'undefined') {
          const old = result[nodeName];
          result[nodeName] = [];
          result[nodeName].push(old);
        }
        result[nodeName].push(xmlToJson(item));
      }
    }
  }

  return result;
};

// eslint-disable-next-line
const filterSearch = () => {
  let episodeMatch;
  let match;
  const filterValue = document.getElementById('searchInput').value;
  const episodes = document.getElementById('episodeList').getElementsByTagName('li');
  const searchFilterType = document.getElementById('search-field-select').value;

  // Loop through all list items, and hide those who don't match the search query
  for (let i = 0; i < episodes.length; i++) {
    if (searchFilterType === 'episode_title_numb_date') {
      episodeMatch = episodes[i].getElementsByTagName('a')[0];
    } else if (searchFilterType === 'episode_comments') {
      episodeMatch = episodes[i].getElementsByClassName('show-notes')[0];
    }
    if (!!episodeMatch) {
      match = episodeMatch.textContent || episodeMatch.innerText || '';
    }
    if (match.toUpperCase().includes(filterValue.toUpperCase())) {
      episodes[i].classList.add('d-block');
      episodes[i].style.display = '';
    } else {
      episodes[i].classList.remove('d-block');
      episodes[i].style.display = 'none';
    }
  }
};

const fetchEpisodeMetadata = () => {
  const url = window.IS_DEV ? `${window.origin}/resources/mock/episodes-response.txt` : EPISODE_SPREADSHEET_URL;
  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      error: error => {
        console.error('Error: There was a problem processing your request, please refresh the browser and try again', error);
        // Display error message
        $('.status-message').html('Något gick fel. Prova att ladda om sidan. <button class="btn btn-sm btn-info" onClick="history.go(0);">Ladda om</button>');
        reject(error);
      },
      success: data => resolve(data.split('\n')),
    });
  });
};

const fetchEpisodesFromFeed = episodesMetadata => {
  return new Promise((resolve, reject) =>
    $.ajax({
      type: 'GET',
      url: FEED_URL,
      dataType: 'xml',
      error: error => {
        console.error('Error: There was a problem processing your request, please refresh the browser and try again', error);
        reject(error);
      },
      success: data => resolve({episodes: data, metadata: episodesMetadata}),
    }),
  );
};

const displayEpisodes = (episodes, metadata) => {
  const jsonResponse = xmlToJson(episodes);
  const titles = jsonResponse.rss.channel.item.reverse();

  $.each(titles, (index, title) => {
    // Skip first element
    if (index === 0) {
      return;
    }

    const episode = metadata[index].split(',');
    let showNotes = '';
    let skojPoints = '';
    let carousel = '';
    const episodeNotes = episode[4];
    const episodeRating = episode[3];
    const epiShowQuotes = episode[5];
    if (!!episodeNotes) {
      showNotes = `<hr class="m-1"><i class="show-notes text-muted">${episodeNotes}</i>`;
    }
    if (!!episodeRating) {
      const colorClass = getColorClass(episodeRating);
      skojPoints = `<hr class="m-1"><div class="progress"><div class="progress-bar ${colorClass}" role="progressbar" style="width: ${episodeRating}%;" aria-valuenow="${episodeRating}" aria-valuemin="0" aria-valuemax="100">Skojfaktor: ${episodeRating}</div></div>`;
    }
    if (!!epiShowQuotes) {
      const quotes = epiShowQuotes.split(';');
      let prev = '';
      let next = '';
      let item;
      let allQuotes = '';
      $.each(quotes, (i, quote) => {
        if (i === 0) {
          item = `<div class="carousel-item active" data-interval="4000">${quote}</div>`;
        } else {
          item = `<div class="carousel-item" data-interval="4000">${quote}</div>`;
          prev = `<a class="carousel-control-prev" href="#quoteCarousel${index}" role="button" data-slide="prev"><i class="text-dark far fa-chevron-left"></i><span class="sr-only">Previous</span></a>`;
          next = `<a class="carousel-control-next" href="#quoteCarousel${index}" role="button" data-slide="next"><i class="text-dark far fa-chevron-right"></i><span class="sr-only">Next</span></a>`;
        }
        allQuotes = allQuotes + item;
      });
      const inner = `<div class="carousel-inner">${allQuotes}</div>`;
      carousel = `<hr class="m-1"><div id="quoteCarousel${index}" class="carousel slide" data-ride="carousel">${inner}${prev}${next}</div>`;
    }
    const pubDate = new Date(title.pubDate);
    const date = `${pubDate.getFullYear()}.${toTwoDigits(pubDate.getMonth() + 1)}.${toTwoDigits(pubDate.getDate())}`;
    $('#episodeList').prepend(
      `<li href="#" data-index="${index}" class="list-group-item list-group-item-action d-block">
                <a class="d-flex justify-content-between">
                    <span>${title.title}</span><span>${date}</span>
                </a>${showNotes}${skojPoints}${carousel}
             </li>`,
    );
  });
};

fetchEpisodeMetadata()
  .then(fetchEpisodesFromFeed)
  .then(({episodes, metadata}) => {
    hideLoadingSpinner();
    displayEpisodes(episodes, metadata);
  });
