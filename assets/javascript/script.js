//global elements
var searchInput = $("#search-term");
var recordCount = $("#record-count");
var searchButton = $("#search");
var clearButton = $("#clear");
var resultsDiv = $("#search-results");
var resultsHead = $("#results-header");

//global constants
const key = "&api-key=nkOagOQenbPYBWYjlxZR78GzIub78bOp";
const apiURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=";

function doSearch(query) {
  //construct the query URL
  var queryURL = apiURL + query + key;
  var maxRecords = recordCount.val();

  //make the ajax call
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    resultsDiv.empty();
    var result = response.response.docs; //this is an array of objects
    console.log(result[0]);
    if (result.length === 0) {
      var errorDiv = $("<div>");
      var p = $("<p>")
        .text("We're sad to say we've ruined your day with no results to display...")
        .addClass("error-message");
      errorDiv
        .append('<i class="fas fa-heart-broken"></i>')
        .append(p)
        .addClass("error");
      resultsDiv.append(errorDiv);
      return;
    }
    //for each object in the array, parse the result and peel off data to display in the results section
    for (var i = 0; i < maxRecords; i++) {
      var returnDiv = $("<div>").addClass("result-box");

      var pubDate = dateFormat(result[i].pub_date);
      var dateDiv = $("<div>")
        .addClass("result-date")
        .append(pubDate);

      var headline = result[i].headline.main;
      var link = result[i].web_url;
      var title = $("<a href='" + link + "'>").append(headline);
      var titleDiv = $("<div>")
        .addClass("result-title")
        .append(title);

      var abstract = result[i].abstract;
      var absDiv = $("<div>")
        .addClass("result-abstract")
        .text(abstract);

      var byline = result[i].byline.original;
      var byDiv = $("<div>")
        .addClass("result-byline")
        .text("-- " + byline);

      returnDiv
        .append(dateDiv)
        .append(titleDiv)
        .append(absDiv)
        .append(byDiv);

      resultsDiv.append(returnDiv);
    }
  });
}

$(document).ready(function() {
  searchButton.on("click", function() {
    var query = searchInput.val();
    doSearch(query);
  });
});

function dateFormat(date) {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var ymd = date.split("-");
  var y = ymd.shift();
  var m = months[parseInt(ymd.shift()) - 1];
  var d = ymd
    .shift()
    .split("T")
    .shift();
  return m + " " + d + ", " + y;
}

$(document).on("keyup", function(event) {
  var code = event.keyCode === 13;
  var search =
    $("#search-term")
      .val()
      .trim().length > 0;
  if (search && code) {
    searchButton.click();
  }
});
