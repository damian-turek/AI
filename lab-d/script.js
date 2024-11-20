const apiKey = 'fc32deeb1442962f549f5fb166c6c731'; // Wstaw swój klucz API

document.getElementById('getWeather').addEventListener('click', () => {
    const city = document.getElementById('city').value;

    if (city.trim() === '') {
        alert('Please enter a city name.');
        return;
    }

    const method = document.querySelector('input[name="requestMethod"]:checked').value;

    if (method === 'fetch') {
        fetchCurrentWeather(city);
    } else {
        xhrCurrentWeather(city);
    }
});

// Pobieranie aktualnej pogody za pomocą Fetch API
async function fetchCurrentWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`City not found (${response.status})`);
        }

        const data = await response.json();
        displayCurrentWeather(data);
        fetchWeather(city); // Pobierz prognozę po aktualnej pogodzie
    } catch (error) {
        document.getElementById('weatherResult').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

// Pobieranie aktualnej pogody za pomocą XMLHttpRequest
function xhrCurrentWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    const xhr = new XMLHttpRequest();

    xhr.open('GET', apiUrl, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            displayCurrentWeather(data);
            xhrWeather(city); // Pobierz prognozę po aktualnej pogodzie
        } else {
            document.getElementById('weatherResult').innerHTML = `<p style="color: red;">Error: City not found (${xhr.status})</p>`;
        }
    };

    xhr.onerror = function () {
        document.getElementById('weatherResult').innerHTML = `<p style="color: red;">Error: Request failed</p>`;
    };

    xhr.send();
}

// Funkcja wyświetlająca aktualną pogodę
function displayCurrentWeather(data) {
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const description = data.weather[0].description;
    const temperature = data.main.temp;

    const currentWeatherHtml = `
        <div class="current-weather">
            <h2>Current Weather in ${data.name}, ${data.sys.country}</h2>
            <img src="${icon}" alt="${description}" title="${description}">
            <p><strong>${temperature}°C</strong></p>
            <p>${description}</p>
        </div>
    `;

    document.getElementById('weatherResult').innerHTML = currentWeatherHtml;
}

// Pobieranie prognozy na 24 godziny za pomocą Fetch API
async function fetchWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`City not found (${response.status})`);
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.getElementById('weatherResult').innerHTML += `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

// Pobieranie prognozy na 24 godziny za pomocą XMLHttpRequest
function xhrWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    const xhr = new XMLHttpRequest();

    xhr.open('GET', apiUrl, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            displayWeather(data);
        } else {
            document.getElementById('weatherResult').innerHTML += `<p style="color: red;">Error: City not found (${xhr.status})</p>`;
        }
    };

    xhr.onerror = function () {
        document.getElementById('weatherResult').innerHTML += `<p style="color: red;">Error: Request failed</p>`;
    };

    xhr.send();
}

// Funkcja wyświetlająca prognozę na 24 godziny
function displayWeather(data) {
    const hourlyWeather = data.list
        .slice(0, 8) // Ograniczamy dane do pierwszych 24 godzin (8 x 3h)
        .map(entry => {
            const time = new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const temperature = entry.main.temp;
            const description = entry.weather[0].description;
            const icon = `https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`;
            return `
        <div class="hourly">
          <p><strong>${time}</strong></p>
          <img src="${icon}" alt="${description}" title="${description}">
          <p>${temperature}°C</p>
          <p>${description}</p>
        </div>
      `;
        })
        .join('');

    document.getElementById('weatherResult').innerHTML += `<div class="hourly-weather">${hourlyWeather}</div>`;
}
