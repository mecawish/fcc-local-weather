$(document).ready(function () {
  var key = "8778b577449b7365cf441f1b31fd833b";
  var latitude, longitude, icon, temp;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    $("#location").text("Geolocation is not supported by this browser.");
  }

  function showPosition(position) {
    latitude = String(position.coords.latitude);
    longitude = String(position.coords.longitude);

    $.get(
      "https://ipinfo.io",
      function (response) {
        console.log(response);
        $("#location").text(response.city + ", " + response.country);
      },
      "jsonp"
    );

    $.ajax({
      url:
        "https://api.darksky.net/forecast/" +
        key +
        "/" +
        latitude +
        "," +
        longitude,
      type: "GET",
      dataType: "jsonp",
    })
      .done(function (json) {
        weatherDetails(json);
      })
      .fail(function (xhr, status, errorThrown) {
        $("#summary").text("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      });
  }

  function weatherDetails(json) {
    temp = json.currently.temperature.toFixed(3);
    $("#temp").text(temp);
    $("#summary").text(json.currently.summary);
    icon = json.currently.icon;
    switch (icon) {
      case "clear-day":
        $("#icon").addClass("wi-day-sunny");
        break;
      case "clear-night":
        $("#icon").addClass("wi-night-clear");
        break;
      case "rain":
        $("#icon").addClass("wi-rain");
        break;
      case "snow":
        $("#icon").addClass("wi-snow");
        break;
      case "sleet":
        $("#icon").addClass("wi-sleet");
        break;
      case "wind":
        $("#icon").addClass("wi-day-windy");
        break;
      case "fog":
        $("#icon").addClass("wi-fog");
        break;
      case "cloudy":
        $("#icon").addClass("wi-cloudy");
        break;
      case "partly-cloudy-day":
        $("#icon").addClass("wi-day-sunny-overcast");
        break;
      case "partly-cloudy-night":
        $("#icon").addClass("wi-night-partly-cloudy");
        break;
      default:
        $("#icon").addClass("wi-na");
    }
  }

  $("#tempUnit").on("click", function () {
    $(this).toggleClass("wi-fahrenheit");
    $(this).toggleClass("wi-celsius");

    if ($(this).hasClass("wi-celsius")) {
      temp = (((temp - 32) * 5) / 9).toFixed(3);
      $("#temp").text(temp);
    } else {
      temp = ((temp * 9) / 5 + 32).toFixed(3);
      $("#temp").text(temp);
    }
  });
});
