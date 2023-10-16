document.addEventListener("DOMContentLoaded", function() {
const API_key = "95181cd738718c1439ace1f949449b4c"; // Hide when deployed

// Capture the city name from the search input and fetch weather data
function handleCitySearch(cityName) {
    const currentWeatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}`;

    let timezoneOffset = 0;
    
    // Fetch weather data for the given city name
    fetch(currentWeatherEndpoint)
    .then(response => response.json())
    .then(data => {
        timezoneOffset = data.timezone; 
        const latitude = data.coord.lat;
        const longitude = data.coord.lon;

        // Display current weather details
        document.querySelector("#city-name").textContent = `${data.name} (${new Date().toLocaleDateString()})`;
        document.querySelector(".temperature").textContent = `${data.main.temp}°C`;
        document.querySelector(".wind-speed").textContent = `${data.wind.speed} m/s`;
        document.querySelector(".humidity").textContent = `${data.main.humidity}%`;

        // Extract the icon code and update the image src for current weather
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        console.log(document.querySelector("#weather-icon"));
        document.querySelector("#weather-icon").src = iconUrl;

        // Step 2: Use the Latitude and Longitude to Fetch the 5-Day Forecast
        const forecastEndpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_key}`;
        
        return fetch(forecastEndpoint); // Fetch the 5-day forecast using the coordinates
    })
    .then(response => response.json())
    .then(data => {
        const forecastList = data.list;
        const forecastSections = document.querySelectorAll(".forecast-day"); // Select all forecast day sections
    
        let dayCount = 0; // Counter for the number of days processed
    
        for (let i = 0; i < forecastList.length && dayCount < 5; i++) {
            const forecast = forecastList[i];
            // Adjust for the local timezone
            const localTimestamp = forecast.dt + timezoneOffset;
            const forecastDate = new Date(localTimestamp * 1000); // Convert to milliseconds
            const forecastTime = forecastDate.getUTCHours();
            
    
            // Check if the forecast is for noon (12:00)
            if (forecastTime >= 11 && forecastTime <= 13) {
                forecastSections[dayCount].querySelector(".date").textContent = new Date(forecast.dt_txt).toLocaleDateString();
                forecastSections[dayCount].querySelector(".temperature").textContent = `${forecast.main.temp}°C`;
                forecastSections[dayCount].querySelector(".wind-speed").textContent = `${forecast.wind.speed} m/s`;
                forecastSections[dayCount].querySelector(".humidity").textContent = `${forecast.main.humidity}%`;

                // Extract the icon code and update the image src for the forecast
                const forecastIconCode = forecast.weather[0].icon;
                const forecastIconUrl = `https://openweathermap.org/img/wn/${forecastIconCode}.png`;
                forecastSections[dayCount].querySelector("img").src = forecastIconUrl;
    
                dayCount++; // Increment the day counter
            }
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

    // Save the city name to localStorage
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(cityName)) { // Avoid duplicates
        searchHistory.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }

    // Update the search history display
    displaySearchHistory();
}

function displaySearchHistory() {
    const searchHistoryList = document.querySelector('#searchInput .list-group');
    searchHistoryList.innerHTML = ''; // Clear the current list

    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.forEach(city => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'rounded');
        listItem.textContent = city;
        listItem.addEventListener('click', function() {
            handleCitySearch(city);
        });
        searchHistoryList.appendChild(listItem);
    });
}

// Event listener for the search button
document.querySelector('#searchInput button').addEventListener('click', function() {
    const cityName = document.querySelector('#searchInput input').value.trim();
    if (cityName) {
        handleCitySearch(cityName);
    }
});

// Initial display of search history when the page loads
displaySearchHistory();

// Fetch and display weather data for the default city
handleCitySearch("Sydney");

});