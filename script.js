
// Navbar Control


const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const detectedLocationBtn = document.getElementById('detected-location');
const searchedLocationBtn = document.getElementById('searched-location-btn')

//Current weather card
const currentWeatherImg = document.getElementById('current-weather-img');
const currentWeatherDes = document.getElementById('current-weather-des');
const currentTemp = document.getElementById('current-temp');
const currentWind = document.getElementById('current-wind');
const currentHumidity = document.getElementById('humidity');
const currentDate = document.getElementById('current-date');

//Sun card
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
//forecast card
const forecastDiv = document.getElementById('forecastDiv');

//Sun card
const sunMeterDiv = document.getElementById('sun-meter');
//City image card
const placeImgDiv = document.getElementById('city-image-div');
const cityImageText = document.getElementById('location-image-text');


//global variables
const week = ['Sun','Mon','Tue','Wed', 'Thu','Fri','Sat'];
const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
const houstonLonLat = [-95.358421, 29.749907];
const apiKey = 'ee759a30a9b8bfdc78fd32c59d9d8abc';
const lngLatSearch = [];

//news variables
const newsImage1 = document.getElementById("newsImage1");
const newsHeadline1 = document.getElementById("newsHeadline1");
const newsDescription1 = document.getElementById("newsDescription1")
const newsURL1 = document.getElementById("newsURL1")
const newsImage2 = document.getElementById("newsImage2");
const newsHeadline2 = document.getElementById("newsHeadline2");
const newsDescription2 = document.getElementById("newsDescription2")
const newsURL2 = document.getElementById("newsURL2")
const newsImage3 = document.getElementById("newsImage3");
const newsHeadline3 = document.getElementById("newsHeadline3");
const newsDescription3 = document.getElementById("newsDescription3")
const newsURL3 = document.getElementById("newsURL3")
const newsImage4 = document.getElementById("newsImage4");
const newsHeadline4 = document.getElementById("newsHeadline4");
const newsDescription4 = document.getElementById("newsDescription4")
const newsURL4 = document.getElementById("newsURL4")
const newsCards = document.getElementById("news-cards")


let detected = true;
const locationArr = [];
var urlLink = '';
var placeImageUrl = '';



//Render current weather card, takes in a array with coordinates
async function getWeather(longLat) {
    try {
        //fetch data from open weather to get the current weather
        const weatherPromise = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${longLat[1]}&lon=${longLat[0]}&appid=${apiKey}`);
        const weatherData = await weatherPromise.json();
        //get the current time from the fetched data and convert to date time format
        const currentDateTime = new Date(weatherData.dt *1000);

        //render data into current weather cards
        currentTemp.textContent = kelvinToFahr(weatherData.main.temp) + "°";
        currentWind.textContent = Math.round((weatherData.wind.speed*2.2369) * 10) / 10 + " mph";
        currentDate.textContent = `${week[currentDateTime.getDay()]} ${getMonthDate(weatherData.dt)} ${currentDateTime.getFullYear()}`;
        currentHumidity.textContent = weatherData.main.humidity + "%";
        currentWeatherDes.textContent = weatherData.weather[0].description.toUpperCase();
        currentWeatherImg.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

        //get unix time format to dateTime format for sunset and sunrise
        const sunriseDateTime = new Date(weatherData.sys.sunrise*1000);
        const sunsetDateTime = new Date(weatherData.sys.sunset*1000);
        sunrise.textContent = `${formattedTime(sunriseDateTime)}AM`;
        sunset.textContent = `${formattedTime(sunsetDateTime)}PM`;
        //use calculateSunriseSunset function to get the percentage of the current sunlight
        const sunPercentage = calculateSunriseSunset(weatherData.sys.sunrise,weatherData.sys.sunset,weatherData.dt);
        sunMeterDiv.style = `margin-left: ${sunPercentage}%`;
        //if sun goes pass 100%, change sun image to a moon image
        if(sunPercentage == 100){
            sunMeterDiv.firstElementChild.src = 'icons/moon.png';
        }


        if(detected === true){
            console.log(weatherData);
            detectedLocationBtn.textContent = weatherData.name + ' (detected)';
            cityImageText.textContent = detectedLocationBtn.textContent;
            detected =  false;
        } 

        
    } catch (error) {
        console.log(error)
    }
}

//render data for weather foreCast card, this card will show weather conditions in the next 5 days
async function getForecast(longLat){
 try {
    //fetch data from openweathermap api
    const forecastPromise = await fetch (`https://api.openweathermap.org/data/2.5/forecast?lat=${longLat[1]}&lon=${longLat[0]}&appid=${apiKey}&units=imperial`);
    const forecastObject = await forecastPromise.json();
    const forecastData = forecastObject.list;

    const forecastHTML = [];
    //loop through the array of objects and make a new div for each object we get from fetched data
    for (let i = 0; i < forecastData.length; i = i+1) {
        const eachElement = `<div class="d-flex flex-column me-5">
        <img class="" src="http://openweathermap.org/img/wn/${forecastData[i].weather[0].icon}@2x.png" alt="" width="40" height="40">
        <p style="color: #000d63;">${forecastData[i].main.temp.toString().substr(0,2)}°</p>
        <p>${forecastData[i].dt_txt.substr(10,6)}</p>
        <h5>${getMonthDate(forecastData[i].dt)}</h5>
        </div>`;
        forecastHTML.push(eachElement);
    }
    forecastDiv.innerHTML = forecastHTML.join('');
 } catch (error) {
    
 }
}

//this function takes in unix time format and return month/date format
function getMonthDate(unixDateTime){
    const dateTimeOject = new Date(unixDateTime * 1000);
    const month = dateTimeOject.getMonth();
    const date = dateTimeOject.getDate();
    return `${monthArr[month]} ${date}`;
}


//converts kelvin to Fahr
function kelvinToFahr(temp){
    return Math.floor(1.8*(temp-273)+32);
}
//get Hour:Min formatt
function formattedTime(dateTime){

    var hours = "0" + dateTime.getHours();

    var mins = "0" + dateTime.getMinutes();


    return hours.substr(-2) + ':' + mins.substr(-2);
}


function calculateSunriseSunset (sunriseTime,sunsetTime,currentTime){
    const percentage = (currentTime-sunriseTime)/(sunsetTime-sunriseTime) * 100;
    //return 100% if percentage >= 100, else return percentage
    return percentage >= 100 ? 100 : percentage;
}



window.addEventListener('DOMContentLoaded', (e) => {

    //if true, get the current location when page loads
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((loc) => {
            getWeather([loc.coords.longitude,loc.coords.latitude]);
            getForecast([loc.coords.longitude,loc.coords.latitude]);
            
            
            document.getElementById('preloader').style.display ='none';
            detectedLocationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                getWeather([loc.coords.longitude,loc.coords.latitude]);
                getForecast([loc.coords.longitude,loc.coords.latitude]);
                placeImgDiv.style.backgroundImage = `url('icons/defaultImage.jpeg')`;
                cityImageText.textContent = detectedLocationBtn.textContent;
            })
    //Use default location if geolocation is blocked
        }, (error) => {
        detected = false;
        document.getElementById('preloader').style.display ='none';
        getWeather([-95.358421,29.749907]);
        getForecast([-95.358421,29.749907]);
        detectedLocationBtn.textContent = 'Houston (default)';
        cityImageText.textContent = 'Houston, TX (default)';
        detectedLocationBtn.addEventListener('click', (e) => {
            e.preventDefault();
            getWeather([-95.358421,29.749907]);
            getForecast([-95.358421,29.749907]);
            placeImgDiv.style.backgroundImage = `url('icons/defaultImage.jpeg')`;
            cityImageText.textContent = detectedLocationBtn.textContent;

        })
        })

        

    }


    

});



function initMap(){
    autocomplete = new google.maps.places.Autocomplete(locationInput, 
    {
        componentRestrictions: {'country': ['us']},

        fields: [],
        types: ['locality']

    })
    
    autocomplete.addListener('place_changed', () => {
        const location = autocomplete.getPlace();
        lngLatSearch[0] = location.geometry.location.lng();
        lngLatSearch[1] = location.geometry.location.lat();

        //Save this location we get from search result to global variable
        locationArr[0] = location;
        placeImageUrl = location.photos[0].getUrl();
        getNews(location.name)
    })
    
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cityImageText.textContent = locationArr[0].formatted_address;
        getWeather(lngLatSearch);
        getForecast(lngLatSearch);
        updateImage(placeImageUrl);
        searchedLocationBtn.textContent = locationArr[0].formatted_address;
        
        searchedLocationBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cityImageText.textContent = locationArr[0].formatted_address;
            getWeather(lngLatSearch);
            getForecast(lngLatSearch);
            updateImage(placeImageUrl);
        })
    })

}   

initMap();



function updateImage(placeImageUrl) {
    placeImgDiv.style.backgroundImage=`url(${placeImageUrl})`;
}


// async function getNews() {
//     const place = autocomplete.getPlace().name
//     const url = `https://newsapi.org/v2/everything?q=Houston&from=2022-09-08&sortBy=popularity&apiKey=0c4018ad465a4d1591f11610c371c590`

//     const promise = await fetch (`https://newsapi.org/v2/everything?q=Apple&from=2022-09-08&sortBy=popularity&apiKey=0c4018ad465a4d1591f11610c371c590`)
//     const data = await promise.json()
//     console.log(data)

//     newsHeadline1.innerHTML = data.articles[0].title;
//     newsDescription1.innerHTML = data.articles[0].description;
//     newsImage1.src = data.articles[0].urlToImage;
//     newsURL1.href = data.articles[0].url;

    


   

// }

async function getNews(keyword) {
    const promise = await fetch(
      `https://newsapi.org/v2/everything?q=${keyword}&from=2022-09-08&sortBy=popularity&apiKey=0c4018ad465a4d1591f11610c371c590`
    );
    const data = await promise.json();
    console.log(data);
  
    // newsHeadline1.innerHTML = data.articles[0].title;
    // newsDescription1.innerHTML = data.articles[0].description;
    // newsImage1.src = data.articles[0].urlToImage;
    // newsURL1.href = data.articles[0].url;
    const newsHTML =[]
    for (let i = 0; i < 4; i = i+1) {
        eachElement = `<div class="card col-md-3" style="width: 18rem;">
        <img src="${data.articles[i].urlToImage}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${data.articles[i].title}</h5>
          <p class="card-text">${data.articles[i].description}</p>
          <a href="${data.articles[i].url}" class="btn btn-primary">Go to article</a>
        </div>
     </div>`
     newsHTML.push(eachElement)   
    }
    newsCards.innerHTML = newsHTML.join('')

  }


