import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { weatherService } from '@/services';

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [current, forecastData, alertsData] = await Promise.all([
        weatherService.getCurrentWeather(),
        weatherService.getForecast(),
        weatherService.getWeatherAlerts()
      ]);
      
      setCurrentWeather(current);
      setForecast(forecastData);
      setAlerts(alertsData);
    } catch (err) {
      setError(err.message || 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const iconMap = {
      'Sunny': 'Sun',
      'Partly Cloudy': 'PartlyCloudyDay',
      'Cloudy': 'Cloud',
      'Light Rain': 'CloudRain',
      'Rain': 'CloudRain',
      'Thunderstorm': 'CloudLightning',
      'Snow': 'CloudSnow',
      'Fog': 'CloudFog'
    };
    return iconMap[condition] || 'Cloud';
  };

  const getAlertSeverity = (severity) => {
    switch (severity) {
      case 'warning': return 'warning';
      case 'watch': return 'info';
      case 'advisory': return 'info';
      default: return 'default';
    }
  };

  const getFarmingAdvice = (weather) => {
    const advice = [];
    
    if (weather.precipitation > 70) {
      advice.push('Heavy rain expected - avoid irrigation and field work');
    } else if (weather.precipitation < 10 && weather.temperature > 80) {
      advice.push('Hot and dry conditions - increase irrigation schedule');
    }
    
    if (weather.windSpeed > 15) {
      advice.push('High winds - secure greenhouse structures and avoid spraying');
    }
    
    if (weather.temperature < 40) {
      advice.push('Frost risk - protect sensitive plants');
    }
    
    if (weather.humidity > 80) {
      advice.push('High humidity - monitor for fungal diseases');
    }
    
    return advice;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 rounded w-32 mb-4"></div>
          <div className="h-4 bg-surface-200 rounded w-64"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SkeletonLoader count={2} type="card" />
          </div>
          <div>
            <SkeletonLoader count={1} type="card" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <ErrorState message={error} onRetry={loadWeatherData} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather</h1>
        <p className="text-gray-600">
          Stay informed about weather conditions affecting your farm operations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Weather Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Weather */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Current Conditions</h2>
              <div className="text-sm text-gray-500">{currentWeather?.location}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
                  <ApperIcon 
                    name={getWeatherIcon(currentWeather?.condition)} 
                    size={40} 
                    className="text-accent" 
                  />
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {currentWeather?.temperature}°F
                  </div>
                  <div className="text-lg text-gray-600">
                    {currentWeather?.condition}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Humidity</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {currentWeather?.humidity}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Wind</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {currentWeather?.windSpeed}
                  </div>
                  <div className="text-xs text-gray-500">
                    mph {currentWeather?.windDirection}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Extended Forecast */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">5-Day Forecast</h2>
            <div className="space-y-4">
              {forecast.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <ApperIcon 
                      name={getWeatherIcon(day.condition)} 
                      size={32} 
                      className="text-accent" 
                    />
                    <div>
                      <div className="font-medium text-gray-900">{day.dayOfWeek}</div>
                      <div className="text-sm text-gray-600">{day.condition}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {day.high}° / {day.low}°
                    </div>
                    <div className="text-sm text-gray-600">
                      {day.precipitation}% rain
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {day.windSpeed} mph
                    </div>
                    <div className="text-sm text-gray-600">
                      {day.humidity}% humidity
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Weather Alerts */}
          {alerts.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Alerts</h3>
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-warning/10 border border-warning/20 rounded-lg"
                  >
                    <div className="flex items-start space-x-3">
                      <ApperIcon 
                        name="AlertTriangle" 
                        size={20} 
                        className="text-warning mt-0.5" 
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{alert.title}</h4>
                          <Badge variant={getAlertSeverity(alert.severity)} size="sm">
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {alert.description}
                        </p>
                        <div className="text-xs text-gray-500">
                          {format(new Date(alert.startDate), 'MMM dd, h:mm a')} - {format(new Date(alert.endDate), 'MMM dd, h:mm a')}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}

          {/* Farming Advice */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Farming Advice</h3>
            <div className="space-y-3">
              {forecast.slice(0, 2).map((day, index) => {
                const advice = getFarmingAdvice(day);
                if (advice.length === 0) return null;
                
                return (
                  <div key={day.date} className="p-3 bg-info/10 border border-info/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <ApperIcon name="Lightbulb" size={16} className="text-info" />
                      <span className="text-sm font-medium text-gray-900">{day.dayOfWeek}</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {advice.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-2">
                          <span className="text-info">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              
              {/* General Tips */}
              <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="BookOpen" size={16} className="text-secondary" />
                  <span className="text-sm font-medium text-gray-900">General Tips</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-start space-x-2">
                    <span className="text-secondary">•</span>
                    <span>Check soil moisture before watering</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-secondary">•</span>
                    <span>Monitor plants for weather stress signs</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-secondary">•</span>
                    <span>Adjust greenhouse ventilation as needed</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Quick Weather Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Thermometer" size={16} className="text-accent" />
                  <span className="text-sm text-gray-600">Avg Temperature</span>
                </div>
                <span className="font-medium text-gray-900">
                  {Math.round(forecast.reduce((sum, day) => sum + (day.high + day.low) / 2, 0) / forecast.length)}°F
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="CloudRain" size={16} className="text-info" />
                  <span className="text-sm text-gray-600">Rain Days</span>
                </div>
                <span className="font-medium text-gray-900">
                  {forecast.filter(day => day.precipitation > 30).length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Wind" size={16} className="text-secondary" />
                  <span className="text-sm text-gray-600">Avg Wind</span>
                </div>
                <span className="font-medium text-gray-900">
                  {Math.round(forecast.reduce((sum, day) => sum + day.windSpeed, 0) / forecast.length)} mph
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Weather;