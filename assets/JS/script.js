let city_name = "London"; // Replace with the city you want to search for
const API_key = "95181cd738718c1439ace1f949449b4c"; // Replace with your actual API key

// Step 1: Get the Latitude and Longitude of the City
const currentWeatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_key}`;

fetch(currentWeatherEndpoint)
    .then(response => response.json())
    .then(data => {
        const latitude = data.coord.lat;
        const longitude = data.coord.lon;

        // Display current weather details
        document.querySelector("#city-name").textContent = `${data.name} (${new Date().toLocaleDateString()})`;
        document.querySelector(".temperature").textContent = `${data.main.temp}°C`;
        document.querySelector(".wind-speed").textContent = `${data.wind.speed} m/s`;
        document.querySelector(".humidity").textContent = `${data.main.humidity}%`;

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
            const forecastTime = new Date(forecast.dt_txt).getHours();
    
            // Check if the forecast is for noon (12:00)
            if (forecastTime === 12) {
                forecastSections[dayCount].querySelector(".date").textContent = new Date(forecast.dt_txt).toLocaleDateString();
                forecastSections[dayCount].querySelector(".temperature").textContent = `${forecast.main.temp}°C`;
                forecastSections[dayCount].querySelector(".wind-speed").textContent = `${forecast.wind.speed} m/s`;
                forecastSections[dayCount].querySelector(".humidity").textContent = `${forecast.main.humidity}%`;
    
                dayCount++; // Increment the day counter
            }
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
