const axios = require('axios');

const getWeatherForecast = async (bookingDateObj) => {
  try {
    const lat = 13.0836939; // Chennai
    const lon = 80.270186;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    // Fetch 5-day forecast
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);
    const forecastList = response.data.list;

    // Convert booking date to Unix timestamp (seconds)
    const bookingTimestamp = Math.floor(bookingDateObj.getTime() / 1000);

    // Find the nearest data point
    // We reduce the array to find the item with the minimum difference in time
    const nearestForecast = forecastList.reduce((prev, curr) => {
      return (Math.abs(curr.dt - bookingTimestamp) < Math.abs(prev.dt - bookingTimestamp) ? curr : prev);
    });

    // Check weather condition
    const mainWeather = nearestForecast.weather[0].main; // e.g., "Rain", "Clear", "Clouds"
    
    // Suggest Seating
    let suggestedSeating = 'outdoor';
    if (mainWeather === 'Rain' || mainWeather === 'Thunderstorm' || mainWeather === 'Drizzle') {
      suggestedSeating = 'indoor';
    }

    return {
      condition: mainWeather,
      description: nearestForecast.weather[0].description,
      temp: nearestForecast.main.temp,
      suggestedSeating: suggestedSeating,
      rawDt: nearestForecast.dt_txt
    };

  } catch (error) {
    console.error("Weather API Error:", error.message);
    // Fallback if API fails or date is too far in future
    return { condition: 'Unknown', suggestedSeating: 'indoor' }; 
  }
};

module.exports = { getWeatherForecast };