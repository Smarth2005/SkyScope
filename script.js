function getWeather() {
    const apiKey = "cd55d46d9683aa98fe37c8dcf7ba4085"; // API key wrapped in quotes
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    
    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';
    
    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        
        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;
        
        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;
        
        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        // Get the time of day (day or night)
        const isDayTime = isDay(data.sys.sunrise, data.sys.sunset);

        // Update background based on weather condition and time of day
        updateBackground(description, isDayTime);

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}




function isDay(sunrise, sunset) {
    const currentTime = new Date().getTime() / 1000;  // Get current time in UNIX timestamp (seconds)

    // Compare the current time with sunrise and sunset times
    return currentTime > sunrise && currentTime < sunset;
}

function updateBackground(weatherDescription, isDayTime) {
    const body = document.body;
    const query = weatherDescription + (isDayTime ? ' day' : ' night'); 
    // Use the weather description and time of day as the search query

    // Unsplash API request URL (replace 'YOUR_API_KEY' with your actual API key)
    const unsplashApiUrl = `https://api.unsplash.com/photos/random?query=${query}&client_id=cOEocMpalHk2Rp4TOP4AnVovTUaSi7MwG8ezbssALLk`;

    fetch(unsplashApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const imageUrl = data[0].urls.full;  // Use the URL of the first image in the result
                body.style.backgroundImage = `url(${imageUrl})`;
                body.style.backgroundSize = 'cover';
                body.style.backgroundPosition = 'center';
                body.style.backgroundAttachment = 'fixed';
            } else {
                // Fallback if no image found, use a default background
                body.style.backgroundImage = 'url("default_weather_image_url.jpg")';
            }
        })
        .catch(error => {
            console.error('Error fetching image from Unsplash:', error);
            // Fallback if there is an error, use a default background
            body.style.backgroundImage = 'url("default_weather_image_url.jpg")';
        });
}
