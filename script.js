const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weatherImg = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const locationNotFound = document.querySelector('.location-not-found');
const weatherBody = document.querySelector('.weather-body');
const forecastContainer = document.getElementById('forecast-container');

const apiKey = "7c11012b51c0e0516413958557c101a2";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

async function checkWeather(city) {
    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(`${apiUrl}${city}&appid=${apiKey}`),
            fetch(`${forecastUrl}${city}&appid=${apiKey}`)
        ]);

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();
        
        if (weatherData.cod === '404') {
            locationNotFound.style.display = "flex";
            weatherBody.style.display = "none";
            return;
        }
        
        locationNotFound.style.display = "none";
        weatherBody.style.display = "flex";
        
        temperature.innerHTML = `${Math.round(weatherData.main.temp)}<sup>°C</sup>`;
        description.innerHTML = weatherData.weather[0].description;
        humidity.innerHTML = `${weatherData.main.humidity}%`;
        windSpeed.innerHTML = `${weatherData.wind.speed} Km/H`;
        
        const weatherCondition = weatherData.weather[0].main.toLowerCase();
        weatherImg.src = 
            weatherCondition.includes("cloud") ? "images/cloud.png" :
            weatherCondition.includes("rain") ? "images/rain.png" :
            weatherCondition.includes("clear") ? "images/sun.png" :
            weatherCondition.includes("snow") ? "images/snow.png" :
            "images/cloud.png"; // Default image
        
        // Updating 5-day forecast
        forecastContainer.innerHTML = ""; // Clear previous data
        const dailyData = {};
        
        forecastData.list.forEach(forecast => {
            const date = new Date(forecast.dt_txt).toLocaleDateString("en-US", { weekday: "long" });
            if (!dailyData[date]) {
                dailyData[date] = {
                    temp: Math.round(forecast.main.temp),
                    icon: forecast.weather[0].main.toLowerCase()
                };
            }
        });

        Object.keys(dailyData).slice(0, 5).forEach(day => {
            const forecastDay = document.createElement("div");
            forecastDay.classList.add("forecast-day");

            const weatherIcon = dailyData[day].icon.includes("cloud")
                ? "images/cloud.png"
                : dailyData[day].icon.includes("rain")
                ? "images/rain.png"
                : dailyData[day].icon.includes("clear")
                ? "images/sun.png"
                : "images/cloud.png"; // Default fallback

            forecastDay.innerHTML = `
                <p class="day">${day}</p>
                <img src="${weatherIcon}" alt="Weather">
                <p class="temp">${dailyData[day].temp}°C</p>
            `;

            forecastContainer.appendChild(forecastDay);
        });
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Search button event listener
searchBtn.addEventListener("click", () => {
    const city = inputBox.value.trim();
    if (city) {
        checkWeather(city);
    }
});

// Trigger search on pressing Enter key
inputBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});
