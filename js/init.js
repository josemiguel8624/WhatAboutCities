(function($){
  $(function(){

    $('.sidenav').sidenav();

  }); // end of document ready
})(jQuery); // end of jQuery name space

//Functions for search engine
$(function() {
  // enter
    $("#searchTerm").keypress(function(e){
    	if(e.keyCode===13){
    		var searchTerm = $("#searchTerm").val();
		    var url = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=City:"+ searchTerm +"&format=json&callback=?";
        var searchValues;
        var bestMatch;
        var title;
        var wikiContent;

        //Clear screen
        $("#error").html("");
        $("#gralInfo").html("");
        $("#cityTitle").html("");
        $("#wikiResult").html("");
        $("#baiduResult").html("");
        $("#govResult").html("");
        $("#news").html("");
        $("#output").hide();

		    $.ajax({
    			url: url,
    			type: 'GET',
    			contentType: "application/json",
    			async: true,
            	dataType: "json",
            	success: function (data, status, jqXHR) {
            		$("#output").html();

                searchValues = Object.values(data)[2];
                if(searchValues!=null)
                {
                  //Wikipedia information
                  bestMatch = Object.values(searchValues)[1][0];
                  wikiContent = Object.values(bestMatch)[5];
                  title = Object.values(bestMatch)[1];

                  //Baidu information

                  //Maps

                  //Economy

                  //Environment

                  //Society (News)
                  var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
                  var news;
                  var newOne;
                  var newTwo;
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
                    //console.log(news);
                    if(news != null)
                    {
                      newOne = Object.values(news)[0][0];
                      newTwo = Object.values(news)[0][1];

                      //console.log(Object.values(newOne)[0]); //hyperlink
                      //console.log(Object.values(newOne)[1]); //description
                      //console.log(Object.values(Object.values(newOne)[5])[0]); //title

                      //New one
                      $("#news").prepend("<h5>Society</h5>" +
                                        "<h6>" + Object.values(Object.values(newOne)[5])[0] + "</h6>" +
                                        "<p>" + Object.values(newOne)[1] +
                                        '<a class="red-text" href="' + Object.values(newOne)[0] + '"> ...NYTimes</a>'  + "</p>" +
                                        "<h6>" + Object.values(Object.values(newTwo)[5])[0] + "</h6>" +
                                        "<p>" + Object.values(newTwo)[1] +
                                        '<a class="red-text" href="' + Object.values(newTwo)[0] + '"> ...NYTimes</a>'  + "</p>");
                    }
                    else
                    {
                      $("#news").prepend("<p class='red-text'>No news for this city.</p>");
                    }
                  }).fail(function(err) {
                    throw err;
                  });



                  $("#wikiResult").prepend(wikiContent + '<a id="wikiLink" class="red-text" href="https://en.wikipedia.org/wiki/'+title+'"> ...Wikipedia</a>');
                  $("#cityTitle").prepend(title);
                  $("#gralInfo").prepend("General information")

                  //At the end show information
                  $("#output").show();

                }
                else
                {
                  $("#error").prepend("<h4 class='red-text center'> Ciudad no encontrada </h4>");
                }

            	  //$("#output").prepend("<div><div class='well'><a href="+data[3][i]+"><h2>" + data[1][i]+ "</h2>" + "<p>" + data[2][i] + "</p></a></div></div>");

        	}
	      })
    	}
    });
});
