import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import { weatherService } from '@/services';

const WeatherWidget = ({ compact = false, className = '' }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const [current, forecastData] = await Promise.all([
          weatherService.getCurrentWeather(),
          weatherService.getForecast()
        ]);
        setCurrentWeather(current);
        setForecast(forecastData);
      } catch (error) {
        console.error('Failed to load weather:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  const getWeatherIcon = (condition) => {
    const iconMap = {
      'Sunny': 'Sun',
      'Partly Cloudy': 'PartlyCloudyDay',
      'Cloudy': 'Cloud',
      'Light Rain': 'CloudRain',
      'Rain': 'CloudRain',
      'Thunderstorm': 'CloudLightning'
    };
    return iconMap[condition] || 'Cloud';
  };

  if (loading) {
    return (
      <Card className={`${compact ? 'p-4' : 'p-6'} ${className}`} hoverable={false}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-surface-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-surface-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center space-x-3 text-sm ${className}`}
      >
        <div className="flex items-center space-x-2">
          <ApperIcon 
            name={getWeatherIcon(currentWeather?.condition)} 
            size={20} 
            className="text-accent" 
          />
          <span className="font-medium">{currentWeather?.temperature}°F</span>
        </div>
        <div className="text-gray-600">
          {currentWeather?.condition}
        </div>
      </motion.div>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Weather</h3>
        <div className="text-sm text-gray-500">{currentWeather?.location}</div>
      </div>

      {/* Current Weather */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
          <ApperIcon 
            name={getWeatherIcon(currentWeather?.condition)} 
            size={32} 
            className="text-accent" 
          />
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">
            {currentWeather?.temperature}°F
          </div>
          <div className="text-gray-600">
            {currentWeather?.condition}
          </div>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-500">Humidity</div>
          <div className="font-semibold">{currentWeather?.humidity}%</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Wind</div>
          <div className="font-semibold">
            {currentWeather?.windSpeed} mph {currentWeather?.windDirection}
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">5-Day Forecast</h4>
        <div className="space-y-2">
          {forecast.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-2 border-b border-surface-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <ApperIcon 
                  name={getWeatherIcon(day.condition)} 
                  size={20} 
                  className="text-accent" 
                />
                <div>
                  <div className="text-sm font-medium">{day.dayOfWeek}</div>
                  <div className="text-xs text-gray-500">{day.condition}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {day.high}° / {day.low}°
                </div>
                <div className="text-xs text-gray-500">
                  {day.precipitation}% rain
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default WeatherWidget;