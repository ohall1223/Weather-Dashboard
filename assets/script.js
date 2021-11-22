// global variables
var currentCity;
var APIkey = "81f51e0aad6e42c02f096b9b679089ee"
var today = moment()

console.log("Linked")

// function that gets the current weather information 
function getCurrentWeather (event){
    // get the city name from the user input
    var city = document.querySelector("#searchCity").value
    
    console.log(city)
    // set the request URL 
    console.log("fetching")
    var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIkey}`
    fetch(requestURL)
    .then((response) => {
        return response.json();
    })
    .then((response) =>{
        console.log(response)
        // save city to local storage 
        console.log(city)
        saveCity(city);
        $("#savedCities").text("");
        // display list of searched cities
        renderCities()
        // fetch the 5 day forcast 
        getFiveDayForecast(event)
        // fetch an icon for the current weather from OpenWEather
        var currentWeatherIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        var currentDate = today.format("MM/DD/YYYY")
        
        // var elem = {}
        // elem.src = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
        // document.getElementById("currentIcon").appendChild(elem);

        var latitude = response.coord.lat
        var longitude = response.coord.lon

        
        document.querySelector("#currentCity").textContent = city + " (" + currentDate + ")"
        document.querySelector("#currentTemp").textContent = "Temp: " + response.main.temp + "\xB0F" 
        document.querySelector("#currentWind").textContent = "Wind: " + response.wind.speed + " MPH"
        document.querySelector("#currentHumid").textContent = "Humidity: " + response.main.humidity + "%"

        var uvRequestURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${APIkey}`

        fetch(uvRequestURL)
        .then((response) => {
            return response.json()
        })
        .then((response) =>{
            console.log(response)
            var uvIndex = response.current.uvi

            document.querySelector("#currentUV").textContent = "UV Index: " + uvIndex
            
        })
        
     
    })
}
    
    
    // function to fetch the 5 day forcast 
    function getFiveDayForecast (event){
        var city = document.querySelector("#searchCity").value
        console.log(city)
        var requestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}`
        fetch(requestURL)
        .then((response) => {
            return response.json();
        })
        .then((response) =>{
            console.log(response)
            // iterate over the five day forecast
            for(var i =0; i < response.list.length; i++){
                var dayData = response.list[i];
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

    $("#searchedCities").on("click", (event) => {
        event.preventDefault();
        $("#searchCity").val(event.target.textContent);
        currentCity = $(searchCity).val()
        getCurrentWeather(event);
    })


renderCities()

getCurrentWeather()