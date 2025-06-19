import weatherData from '../mockData/weather.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const weatherService = {
  async getCurrentWeather(location = 'Default Farm Location') {
    await delay(500);
    return { ...weatherData.current };
  },

  async getForecast(location = 'Default Farm Location', days = 5) {
    await delay(600);
    return [...weatherData.forecast.slice(0, days)];
  },

  async getWeatherAlerts(location = 'Default Farm Location') {
    await delay(400);
    return [...weatherData.alerts || []];
  }
};

export default weatherService;