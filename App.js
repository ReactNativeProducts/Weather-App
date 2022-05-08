import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as Location from "expo-location"
import React, {useState, useEffect} from "react"
import Constants from 'expo-constants';
import  Weather from "./components/Weather"
export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [advice, setAdvice] = useState("");
  const [icon, SetIcon] = useState("");
  const [temp, setTemp] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const [minTemp, setMinTemp] = useState("");
  const [name, setName] = useState("");
  const [humidity, setHumidity] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [visibility, setVisibility] = useState("");

  useEffect(() => {
    // API call code starts here


    (async () => {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      let locationForApiCall = JSON.stringify(location);
      var lon = location.coords.longitude;
      var lat = location.coords.latitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=fbc0c1608b532e6213d12729520f25f9`;
      const fetchData = async () => {
        try{
          const response = await fetch(url);
          const json = await response.json();
          setAdvice(json.weather[0].description);
          SetIcon(json.weather[0].icon);
          var temp = json.main.temp;
          var max_temp = json.main.temp_max;
          var max_tempFinal = max_temp - 273.15;
          var max_tempSliced = max_tempFinal.toFixed(0);
          var min_temp = json.main.temp_min;
          var min_tempFinal = min_temp - 273.15;
          var min_tempSliced = min_tempFinal.toFixed(0);

          var name = json.name;
          setName(name);
          var humidity =  json.main.humidity;
          setHumidity(humidity);

          var feelsLike = json.main.feels_like;
          var feelsLikeConverted = feelsLike - 273.15;
          var feelsLikeSliced = feelsLikeConverted.toFixed(0);
          setFeelsLike(feelsLikeSliced);
          var lol = temp - 273.15;

          // slice the decimal
          var fixedSlicedTemp = lol.toFixed(0);

          setTemp(fixedSlicedTemp);
          setMaxTemp(max_tempSliced);
          setMinTemp(min_tempSliced);
        }catch{
          console.log("error", error);
        }
      }
      fetchData();

      // fetching the hourly data.
      const fetchHourlydata = async () => {
        try{
          const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily&appid=fbc0c1608b532e6213d12729520f25f9`)
          const json = await response.json();

          var currentTime = new Date();
          var currentHour = currentTime.getHours();
          var currentMinute = currentTime.getMinutes();
          // convert the current hour to 24 hour format
          var currentHour24 = currentHour % 12 || 12;
          var currentHour24Sliced = currentHour24.toString();
          var currentHour24SlicedFinal = currentHour24Sliced.slice(0,2);
          console.log('Hour is '+ currentHour24SlicedFinal +  ':'+ currentMinute);
         
        
        }catch{
          console.log("error", error);
        }

      }
      fetchHourlydata();
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
          <Weather />


      <Text>{advice}</Text> 


      <Image
        style={{ width: 100, height: 100 }}
        source={{ uri: `http://openweathermap.org/img/w/${icon}.png` }}
      />
      <Text>Temp: {temp}°C</Text>
      <Text>Max_temp: {maxTemp}°C</Text>
      <Text>Min_temp: {minTemp}°C</Text>
      <Text>Name: {name}</Text>
      <Text>Humidity: {humidity}%</Text>
      <Text>Feels Like: {feelsLike}°C</Text>

      <View style={styles.hourlyWeatherContainer}>
        <Text style={styles.hourlyWeatherText}>Hourly Weather</Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourlyWeatherContainer: {
    paddingTop: 40,
  },
  hourlyWeatherText: {
    fontSize: 20,
  }
});
