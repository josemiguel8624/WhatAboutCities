(function($){
  $(function(){

    $('.sidenav').sidenav();

  }); // end of document ready
})(jQuery); // end of jQuery name space

var title;
var lat;
var long;

//Functions for search engine
$(function() {
  // enter
    $("#searchTerm").keypress(function(e){
    	if(e.keyCode===13){
        found = true;
        var searchTerm = $("#searchTerm").val();

        //Clear screen
        $("#error").html("");
        $("#gralInfo").html("");
        $("#cityTitle").html("");
        $("#wikiResult").html("");
        $("#bingResult").html("");
        $("#govResult").html("");
        $("#news").html("");
        $("#output").hide();
        $("#loader").html("<div class='col s4'></div><img class='col s4' src='img/loading-gears-animation.gif'>");

        /********** Wikipedia **********/
        var wikipedia = function()
        {
          var url = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=City:"+ searchTerm +"&format=json&callback=?";
          var searchValues;
          var bestMatch;
          var wikiContent;

          $.ajax({
            url: url,
            type: 'GET',
            contentType: "application/json",
            async: false,
            dataType: "json",
            success: function (data, status, jqXHR) {

              searchValues = Object.values(data)[2];
              if(searchValues!=null)
              {
                //Wikipedia information
                bestMatch = Object.values(searchValues)[1][0];
                wikiContent = Object.values(bestMatch)[5];
                title = Object.values(bestMatch)[1];

                $("#wikiResult").prepend(wikiContent + '<a id="wikiLink" class="red-text" href="https://en.wikipedia.org/wiki/'+title+'"> ...Wikipedia</a>');
                $("#cityTitle").prepend(title);
                $("#gralInfo").prepend("General information")
              }
              else
              {
                $("#error").prepend("<h4 class='red-text center'> Ciudad no encontrada </h4>");
                found = false;
              }
              finishFlag = true;
            }
          });
        }

        /********** Bing information **********/
        var bingInfo = function()
        {
          var url = "http://dev.virtualearth.net/REST/v1/Locations?"+
                    "query="+title+"&"+
                    "includeNeighborhood="+
                    "&include="+
                    "&maxResults=1"+
                    "&key=AiztiSSMdcvTJQVeSF8H0eNcHHnZ1iSnA3w9DrnS673NiZ88pDya-rAl4eoG-PoS";
          var bingContent;
          var bingData;

          $.ajax({
            url: url,
            type: 'GET',
            success: function (data, status, jqXHR) {
              //Bing information
              bingContent = Object.values(data);
              //console.log(bingContent);
              //console.log(bingContent[3][0].resources[0].address.countryRegion);
              //console.log(bingContent[3][0].resources[0].address.locality);
              //console.log(bingContent[3][0].resources[0].entityType);
              //console.log(bingContent[3][0].resources[0].point.coordinates);
              lat = bingContent[3][0].resources[0].point.coordinates[0];
              long = bingContent[3][0].resources[0].point.coordinates[1];

              bingData = "<b>Country: </b>"+ bingContent[3][0].resources[0].address.countryRegion + "<br>" +
                          "<b>Locality: </b>"+ bingContent[3][0].resources[0].address.locality + "<br>" +
                          "<b>Entity Type: </b>"+ bingContent[3][0].resources[0].entityType + "<br>" +
                          "<b>Coordinates: </b>"+bingContent[3][0].resources[0].point.coordinates;


                $("#bingResult").prepend(bingData + '<a id="bingLink" class="red-text" href="https://www.bing.com/search?q='+title+'"> ...Bing</a>');

              //}
              /*
              else
              {
                $("#bingResult").prepend("<h4 class='red-text center'> Ciudad no encontrada </h4>");
              }
              */
              finishFlag = true;
            }
          });
        }


        //Maps
        var mapAPI = function()
        {
            var map = L.map('map').setView([lat, long], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker([lat, long]).addTo(map)
              .bindPopup(title)
              .openPopup();
        }

                  //Economy

                  //Environment

        /********** Ney York Times **********/
        var society = function(){
          //Society (News)
          var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
          var news;
          var newOne;
          var newTwo;
          //newkey = 52a2e3ecdc954fd6842b0d91fd158d72
          url += '?' + $.param({
            'api-key': "73973f6140e64ca0a83c6281ebb4ed65",
            'q': title,
            'page': '0',
            'begin_date': "20181101",
            'end_date': "20181108"
          });
          $.ajax({
            url: url,
            method: 'GET',
          }).done(function(result) {
            //console.log(result);
            news = Object.values(result)[2];
            console.log(news);
            //console.log((Object.values(news)[0]).length);
            if((Object.values(news)[0]).length >= 2)
            {
              newOne = Object.values(news)[0][0];
              newTwo = Object.values(news)[0][1];
              //console.log(newOne.headline.main);

              //console.log(Object.values(newOne)[0]); //hyperlink
              //console.log(Object.values(newOne)[1]); //description
              //console.log(Object.values(Object.values(newOne)[5])[0]); //title

              //News
              $("#news").prepend("<h5>Society</h5>" +
                                "<h6>" + newOne.headline.main + "</h6>" +
                                "<p>" + Object.values(newOne)[1] +
                                '<a class="red-text" href="' + Object.values(newOne)[0] + '"> ...NYTimes</a>'  + "</p>" +
                                "<h6>" + newTwo.headline.main + "</h6>" +
                                "<p>" + Object.values(newTwo)[1] +
                                '<a class="red-text" href="' + Object.values(newTwo)[0] + '"> ...NYTimes</a>'  + "</p>");
            }
            else
            {
              $("#news").prepend("<p class='red-text'>No news for this city.</p>");
            }
            finishFlag = true;
          }).fail(function(err) {
            throw err;
          });
        }

        //At the end show information
        function showResult()
        {
          $("#loader").html("");
          $("#output").show();
        }

        function sequence(){
          finishFlag = false;
          wikipedia();
          function waitForWikipedia(){
              if (!finishFlag) {
                  setTimeout(function(){waitForWikipedia()},100);
              }
              else {
                if(found)
                {
                  finishFlag = false;
                  bingInfo();
                  function waitForBing(){
                      if (!finishFlag) {
                        setTimeout(function(){waitForBing()},100);
                      } else {
                        finishFlag = false;
                        /*
                        society();
                        function waitForSociety(){
                            if (!finishFlag) {
                              setTimeout(function(){waitForSociety()},100);
                            } else {
                              console.log("here!");
                              //mapAPI();
                              showResult();
                            };
                        }
                        waitForSociety();
                        */
                        mapAPI();
                        showResult();
                      };
                  }
                  waitForBing();
                }
                else {
                  showResult();
                };
              };
          }
          waitForWikipedia();
        };
        sequence();


      }
    });
});
