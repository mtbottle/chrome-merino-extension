var timeoutId = null;
/**
 * Show the URL link for the Firefox Suggest link that a user clicks.
 */

browser.omnibox.onInputEntered.addListener(function (url, disposition) {
    switch (disposition) {
        case "currentTab":
          browser.tabs.update({url});
          break;
        case "newForegroundTab":
          browser.tabs.create({url});
          break;
        case "newBackgroundTab":
          browser.tabs.create({url, active: false});
          break;
      }
});


browser.omnibox.onInputChanged.addListener(function(text, suggest) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(function() {
    onInputChanged(text, suggest);
  }, 300);
});


/**
 * Ask Merino API Search when user enters something in the omnibox.
 */

function onInputChanged(text, suggest) {
    var url = 'https://merino.services.mozilla.com/api/v1/suggest';
    var params = new URLSearchParams();
    params.append('q', text);
    params.append('providers', "accuweather,adm,wikipedia,top_picks");


    const myRequest = new Request(url + '?' + params.toString());
    fetch(myRequest).then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        };
        return response.json();
    }).then((data) => {
        var results = [];
        data.suggestions.forEach(function(item) {
            results.push({
                content: item.url,
                description: item.title,
            })
        })
        suggest(results);
    });

};