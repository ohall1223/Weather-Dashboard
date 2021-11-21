// global variables
var currentCity;
var APIkey = "81f51e0aad6e42c02f096b9b679089ee"
var testUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=30.489772&lon=-99.771335"

console.log("Linked")

// function that gets the current weather information 
function getCurrentWeather (event){
    // get the city name from the user input
    var city = "Denver"
    
    // $("#searchCity").val()
    // set the request URL 
    console.log("fetching")
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey
    fetch(requestURL)
    .then((response) => {
        console.log(response)
        return response.json();
    })
    .then((response) =>{
        console.log(response)
        // save city to local storage 
        saveCity(city);
        $("#savedCities").text("");
        // display list of searched cities
        renderCities()
        // fetch the 5 day forcast 
        getFiveDayForecast(event)
        // fetch an icon for the current weather from OpenWEather
        var currentWeatherIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        var currentTimeUTC = response.dt;
        var currentTimeZoneOffset = response.timezone;
        var currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
        var currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);

        var currentWeatherHTML =
        `<h3>${response.name} ${currentMoment.format("(MM/DD/YY")}<img src="${currentWeatherIcon}"></h3>
        <ul>
            <li>Temp: ${response.main.temp}</li>
            <li>Wind: ${response.main.humidity}</li>
            <li>Humidity: ${response.main.temp}</li>
            <li>UV Index: ${response.wind.speed}</li>
        </ul>`
        $("#currentWeather").html(currentWeatherHTML)
    })
    
    // function to fetch the 5 day forcast 
    function getFiveDayForecast (event){
        var city = $('#searchCity').val();
        var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey
        fetch(requestURL)
        .then((response) => {
            return response.json();
        })
        .then((response) =>{
            console.log(response)
            var fiveDayForecastHTML = `
            <h2>5-day Forecast:</h2>
            <div id="fiveDayForecastUl" class="d-inline-flex flex-wrap">`
            // iterate over the five day forecast
            for(var i =0; i < response.length; i++){
                var datData = response.list[i];
                var TimeUTC = dayData.dt;
                var timeZoneOffset = response.city.timezone;
                var timeZoneOffsetHours = timeZoneOffset / 60 / 60;
                var thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeZoneOffsetHours);
                var iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
            }
            fiveDayForecastHTML += `</div>`;
            $("#fiveDayForecast").html(fiveDayForecastHTML)
        })

    }

    function saveCity (newCity) {
        var cityExsists = false;
        // if the city exsists in local storage 
        for(var i = 0; i < localStorage.length; i++){
            if(localStorage["cities" + i] === newCity){
                // no action needed, break the loop 
                cityExsists = true;
                return 
            }
            // if ths city does not exsist in local storage 
            if(cityExsists === false){
                // add it to local storage 
                localStorage.setItem('cities' + localStorage.length, newCity)
            }
        }
    }

    function renderCities () {
        var defaultCity = "Denver"
        // if there are no cities saved to local storage 
     if(localStorage.length === 0){
        $("#searchCity").attr("value", defaultCity)
     }  else {
         // set the last city to the last searched city 
         var lasyCityKey = "cities" + (localStorage.length-1)
         lastCity = localStorage.getItem(lasyCityKey)
         // set the search input to the last city searched
         $("#searchCity").attr("value", defaultCity)
         // iterate over the cities array and append each city to the DOM
         for(var i =0; i < localStorage.length; i++){
             var city = localStorage.getItem("cities" + i);
             var cityElement;
             if(currentCity === "")
             currentCity = defaultCity;
         }
         if(city === currentCity) {
             cityElement = `<button type = "button" class="list-group-itemlist-group-item-action active">${city}</button></li>`
         } else {
             cityElement = `<button type = "button" class"list-group-item list-group-item-action">${city}</button></li>`
         }
         $('#cityResults').prepend(cityElement);
     } 
    }

    // event listeners
    $("#searchButton").on("click", (event) => {
        event.preventDefault();
        currentCity=$("#searchCity").val()
        getCurrentWeather(event);
    })
}

getCurrentWeather()