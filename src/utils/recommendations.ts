import {
  WeatherData,
  AIRecommendation,
  AIExecutiveSummary,
  TemperatureUnit,
} from '../types/weather';
import { getWeatherConditionInfo } from './weatherCodes';

/**
 * Deterministically generate rich, instant rule-based AI Recommendations
 * based on current weather parameters, UV index, wind, humidity, and rain probabilities.
 */
export function generateLocalRecommendations(
  weather: WeatherData,
  unit: TemperatureUnit
): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];
  const curr = weather.current;
  const tempC = curr.tempC;
  const humidity = curr.humidity;
  const wind = curr.windSpeed;
  const uv = curr.uvIndex;
  const rainProb = curr.precipProbabilityMax;
  const weatherInfo = getWeatherConditionInfo(curr.weatherCode);

  // 1. Clothing Suggestions
  let clothingTitle = '';
  let clothingDesc = '';
  let clothingIcon = 'Shirt';

  if (tempC >= 30) {
    clothingTitle = 'Light Breathable Clothing';
    clothingDesc = 'Wear lightweight, loose-fitting cotton or linen clothes. Don natural sunglasses and a broad-brimmed sun hat.';
    clothingIcon = 'Sun';
  } else if (tempC >= 20) {
    clothingTitle = 'Comfortable Casual Wear';
    clothingDesc = 'A comfortable t-shirt or light shirt paired with shorts or trousers is ideal for today’s moderate temperature.';
    clothingIcon = 'Shirt';
  } else if (tempC >= 10) {
    clothingTitle = 'Layered Outerwear';
    clothingDesc = 'Wear a sweater or light fleece jacket over a t-shirt. A windbreaker may be handy if breezes pick up.';
    clothingIcon = 'Layers';
  } else if (tempC >= 0) {
    clothingTitle = 'Warm Coat & Layers';
    clothingDesc = 'Bundle up with an insulated jacket, scarf, and warm trousers. Consider gloves if spending extended time outside.';
    clothingIcon = 'Coat';
  } else {
    clothingTitle = 'Heavy Winter Gear';
    clothingDesc = 'Sub-zero temperatures! Put on a thermal base layer, heavy winter coat, insulated gloves, beanie, and winter boots.';
    clothingIcon = 'Snowflake';
  }

  recommendations.push({
    id: 'clothing-1',
    category: 'clothing',
    title: clothingTitle,
    description: clothingDesc,
    iconName: clothingIcon,
    badgeText: 'Attire',
    priority: tempC < 5 || tempC > 32 ? 'high' : 'medium',
  });

  // 2. Rain & Umbrella Alert
  if (rainProb >= 60 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(curr.weatherCode)) {
    recommendations.push({
      id: 'rain-1',
      category: 'rainAlert',
      title: 'Umbrella & Waterproof Gear Advised',
      description: `High precipitation chance (${rainProb}%) with ${weatherInfo.description.toLowerCase()}. Carry an umbrella and wear waterproof shoes.`,
      iconName: 'Umbrella',
      badgeText: 'Rain Alert',
      priority: 'high',
    });
  } else if (rainProb >= 30) {
    recommendations.push({
      id: 'rain-2',
      category: 'rainAlert',
      title: 'Slight Chance of Rain',
      description: `Moderate precipitation probability (${rainProb}%). Keep a compact umbrella in your bag just in case.`,
      iconName: 'CloudRain',
      badgeText: 'Weather Watch',
      priority: 'medium',
    });
  } else {
    recommendations.push({
      id: 'rain-3',
      category: 'rainAlert',
      title: 'Low Rain Risk',
      description: `Precipitation probability is low (${rainProb}%). Ideal dry conditions for outdoor activities without rain gear.`,
      iconName: 'CloudSun',
      badgeText: 'Clear Skies',
      priority: 'low',
    });
  }

  // 3. Outdoor Activity Recommendations
  if (rainProb > 60 || [95, 96, 99].includes(curr.weatherCode)) {
    recommendations.push({
      id: 'activity-1',
      category: 'activities',
      title: 'Indoor Activities Recommended',
      description: 'Rain or thunderstorm activity expected. Great day for visiting museums, gym workouts, indoor swimming, or cozy reading.',
      iconName: 'Building2',
      badgeText: 'Indoor Plan',
      priority: 'high',
    });
  } else if (tempC >= 15 && tempC <= 26 && wind < 25) {
    recommendations.push({
      id: 'activity-2',
      category: 'activities',
      title: 'Prime Outdoor Sport & Walking Day',
      description: `Pleasant temperatures around ${tempC}°C and light winds make it perfect for running, cycling, photography, or a park picnic.`,
      iconName: 'Bike',
      badgeText: 'Ideal Outdoor',
      priority: 'medium',
    });
  } else if (tempC > 30) {
    recommendations.push({
      id: 'activity-3',
      category: 'activities',
      title: 'Early Morning / Evening Outdoor Time',
      description: 'Schedule strenuous workouts or outdoor chores before 10 AM or after 6 PM to avoid peak heat.',
      iconName: 'Footprints',
      badgeText: 'Heat Caution',
      priority: 'medium',
    });
  } else {
    recommendations.push({
      id: 'activity-4',
      category: 'activities',
      title: 'Brisk Outdoor Exercise',
      description: 'Cool weather is energizing for jog or brisk walk. Wear breathable wind-resistant gear to stay warm.',
      iconName: 'Activity',
      badgeText: 'Active Day',
      priority: 'low',
    });
  }

  // 4. UV Exposure Advice
  if (uv >= 8) {
    recommendations.push({
      id: 'uv-1',
      category: 'uvAdvice',
      title: 'Very High UV Index (Index: ' + uv + ')',
      description: 'Very high UV radiation! Apply SPF 50+ sunscreen every 2 hours, wear UV-blocking sunglasses, and seek shade between 11 AM - 4 PM.',
      iconName: 'Sun',
      badgeText: 'UV Hazard',
      priority: 'high',
    });
  } else if (uv >= 5) {
    recommendations.push({
      id: 'uv-2',
      category: 'uvAdvice',
      title: 'Moderate to High UV Protection',
      description: `UV index is ${uv}. Apply SPF 30+ broad-spectrum sunscreen and wear a hat if outdoors for more than 20 minutes.`,
      iconName: 'ShieldAlert',
      badgeText: 'Sun Care',
      priority: 'medium',
    });
  } else {
    recommendations.push({
      id: 'uv-3',
      category: 'uvAdvice',
      title: 'Minimal UV Risk',
      description: `UV index is currently low (${uv}). Minimal sun hazard, though light sunscreen is always good practice for prolonged exposure.`,
      iconName: 'ShieldCheck',
      badgeText: 'Safe Sun',
      priority: 'low',
    });
  }

  // 5. Health & Air/Humidity Precautions
  if (humidity >= 80 && tempC >= 25) {
    recommendations.push({
      id: 'health-1',
      category: 'health',
      title: 'High Humidity Caution',
      description: `Relative humidity at ${humidity}%. Sweating is less efficient, so pace physical efforts and rest in air-conditioned spaces.`,
      iconName: 'Droplets',
      badgeText: 'Humidity Alert',
      priority: 'medium',
    });
  } else if (humidity <= 25) {
    recommendations.push({
      id: 'health-2',
      category: 'health',
      title: 'Dry Air Care',
      description: `Low humidity (${humidity}%). Keep skin moisturized, use lip balm, and consider a humidifier indoors to avoid dry throat or eyes.`,
      iconName: 'Wind',
      badgeText: 'Dry Air',
      priority: 'medium',
    });
  } else if (tempC <= 2) {
    recommendations.push({
      id: 'health-3',
      category: 'health',
      title: 'Cold Weather Health Precautions',
      description: 'Near-freezing temperatures increase risk of cold stiffness or frost nip on exposed fingers. Cover neck and hands.',
      iconName: 'ThermometerSnowflake',
      badgeText: 'Cold Guard',
      priority: 'high',
    });
  } else {
    recommendations.push({
      id: 'health-4',
      category: 'health',
      title: 'Comfortable Atmospheric Health',
      description: 'Humidity and atmospheric pressure are within optimal human comfort range. Perfect for deep breathing and focus.',
      iconName: 'HeartPulse',
      badgeText: 'Optimal Air',
      priority: 'low',
    });
  }

  // 6. Hydration Reminders
  if (tempC >= 28 || humidity >= 75) {
    recommendations.push({
      id: 'hydration-1',
      category: 'hydration',
      title: 'Increased Hydration Goal (2.5L+)',
      description: `Elevated heat (${curr.tempC}°C) and humidity require steady hydration. Drink water regularly and add electrolyte coconut water or lemon water.`,
      iconName: 'GlassWater',
      badgeText: 'Hydrate+',
      priority: 'high',
    });
  } else {
    recommendations.push({
      id: 'hydration-2',
      category: 'hydration',
      title: 'Standard Daily Water Intake (2.0L)',
      description: 'Maintain steady hydration throughout the day. Aim for 8 glasses of water to stay energized.',
      iconName: 'Droplet',
      badgeText: 'Hydration',
      priority: 'low',
    });
  }

  // 7. Travel & Commute Advice
  if (wind >= 35) {
    recommendations.push({
      id: 'travel-1',
      category: 'travel',
      title: 'Windy Driving Conditions',
      description: `Strong gusts up to ${wind} km/h. Keep two hands on the wheel, especially when driving high-profile vehicles or on exposed bridges.`,
      iconName: 'Wind',
      badgeText: 'Gale Warning',
      priority: 'high',
    });
  } else if (curr.visibility < 3) {
    recommendations.push({
      id: 'travel-2',
      category: 'travel',
      title: 'Low Visibility Travel Warning',
      description: `Visibility reduced to ${curr.visibility} km due to fog or mist. Drive with fog lights on and maintain extra stopping distance.`,
      iconName: 'Eye',
      badgeText: 'Visibility Warning',
      priority: 'high',
    });
  } else {
    recommendations.push({
      id: 'travel-3',
      category: 'travel',
      title: 'Clear Travel & Smooth Roads',
      description: `Excellent road visibility (${curr.visibility} km) and light winds (${curr.windSpeed} km/h). Safe for commuting and road trips.`,
      iconName: 'Car',
      badgeText: 'Smooth Commute',
      priority: 'low',
    });
  }

  return recommendations;
}

/**
 * Call the server-side Gemini API endpoint for deep AI Weather Intelligence
 */
export async function fetchGeminiAiSummary(
  weather: WeatherData,
  unit: TemperatureUnit
): Promise<AIExecutiveSummary | null> {
  try {
    const curr = weather.current;
    const weatherInfo = getWeatherConditionInfo(curr.weatherCode);

    const payload = {
      locationName: `${curr.cityName}, ${curr.country}`,
      unit,
      weatherData: {
        currentTemp: unit === 'f' ? curr.tempF : curr.tempC,
        feelsLike: unit === 'f' ? curr.feelsLikeF : curr.feelsLikeC,
        weatherDescription: weatherInfo.description,
        humidity: curr.humidity,
        windSpeed: curr.windSpeed,
        windDirectionText: curr.windDirectionText,
        pressure: curr.pressure,
        uvIndex: curr.uvIndex,
        visibility: curr.visibility,
        todayMax: unit === 'f' ? curr.todayMaxF : curr.todayMaxC,
        todayMin: unit === 'f' ? curr.todayMinF : curr.todayMinC,
        precipProbabilityMax: curr.precipProbabilityMax,
        forecastSummary: weather.daily
          .slice(0, 5)
          .map((d) => `${d.dayName}: ${unit === 'f' ? d.tempMaxF : d.tempMaxC}° / ${unit === 'f' ? d.tempMinF : d.tempMinC}°, ${d.precipProbabilityMax}% rain`)
          .join('; '),
      },
    };

    const response = await fetch('/api/ai-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn('Gemini AI endpoint returned error status:', response.status);
      return null;
    }

    const json = await response.json();
    if (json.success && json.data) {
      return {
        ...json.data,
        isAiGenerated: true,
      };
    }
    return null;
  } catch (err) {
    console.warn('Unable to connect to Gemini AI backend, using local intelligence engine.', err);
    return null;
  }
}
