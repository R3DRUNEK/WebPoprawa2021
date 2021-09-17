class WeatherApp {
  apiKey = '34e78b4a18aac1dea7da6cd3f29fcef3';
  inputCity: HTMLInputElement;
  submitButton: HTMLInputElement;
  resultBlock: HTMLDivElement;
  cities: string[] = [];
  citiesData: any[] = [];

  constructor() {
    this.startApp();
  }

  private startApp() {
    this.setElements();
    this.setListeners();
  }

   private async getDataFromWeatherApi(city: string) {
     const openWeatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`;
     const weatherResponse = await fetch(openWeatherUrl);
     return weatherResponse.json();
   }

   private setElements() {
      this.inputCity = document.querySelector('#data');
      this.submitButton = document.querySelector('#submit');
      this.resultBlock = document.querySelector('#result');
   }

   private setListeners() {
      this.submitButton.addEventListener('click', () => this.setWeatherData(this.inputCity.value));
      window.addEventListener('beforeunload', () => {
        WeatherApp.saveData(this.citiesData);
      });
     window.addEventListener('load', () => {
       this.citiesData = WeatherApp.getData('weatherData');
       this.cities = WeatherApp.getData('cities');
       this.createDynamicWeatherElement(this.citiesData ?? []);
       this.cities.forEach((el) => {
         setInterval(async () => {
           await this.setWeatherData(el, 'update')
         }, 10000);
       })
     });
   }

   private async setWeatherData(value: string, mode: string = 'add'): Promise<null | void> {
     const weatherDataJson = await this.getDataFromWeatherApi(value);

     if (weatherDataJson.message === 'city not found' || weatherDataJson.message === 'Nothing to geocode') {
       alert('City not found');
       return;
     }

     if (this.cities.indexOf(weatherDataJson.name) === -1) {
       this.cities.push(weatherDataJson.name);
       this.citiesData.push(weatherDataJson);
     } else if (mode === 'update') {
        const index = this.cities.indexOf(value);
        this.citiesData[index] = weatherDataJson;
        return;
     } else {
       alert('Already added');
       return;
     }
     this.createDynamicWeatherElement([weatherDataJson]);
   }

   private createDynamicWeatherElement(weatherBlocksToCreate: any[]): void {
     weatherBlocksToCreate.forEach((el) => {
       const weatherDiv: HTMLDivElement  = document.createElement('div');
       weatherDiv.className = 'weatherDiv';
       const weatherCityName = document.createElement('div');
       weatherCityName.className = '';
       weatherCityName.innerHTML = el.name;
       const sky: HTMLDivElement = document.createElement('div');
       sky.innerHTML = `Sky - ${el.weather[0].main}`;
       sky.className = 'sky';
       const temp: HTMLDivElement  = document.createElement('div');
       temp.innerHTML = `Temp - ${el.main.temp} ° C`;
       temp.className = 'temp';
       const pressureN: HTMLDivElement  = document.createElement('div');
       pressureN.innerHTML = `Pressure: ${el.main.pressure}`;
       pressureN.className = 'pressureN';
       const humidity: HTMLDivElement  = document.createElement('div');
       humidity.innerHTML = `Humidity: ${el.main.humidity}`;
       humidity.className = 'humidity';

       const icon: HTMLDivElement  = document.createElement('div');
       icon.className = 'icon';
       icon.style.backgroundImage = `url(http://openweathermap.org/img/wn/${el.weather[0].icon}@2x.png)`;
       icon.style.backgroundRepeat = "no-repeat";
       icon.style.backgroundSize = "auto";

       weatherDiv.appendChild(icon);
       weatherDiv.appendChild(weatherCityName);
       weatherDiv.appendChild(sky);
       weatherDiv.appendChild(temp);
       weatherDiv.appendChild(pressureN);
       weatherDiv.appendChild(humidity);

       this.resultBlock.appendChild(weatherDiv);
     })
   }

   private static saveData(data: any) {
      localStorage.setItem('weatherData', JSON.stringify(data));
      localStorage.setItem('cities', JSON.stringify(data.map(el => el.name)));
   }

   private static getData(key: string) {
      const data = localStorage.getItem(key);
      if (data !== null && Object.keys(data).length > 2 && Object.keys(data).length !== 0 && data.length !== 0) {
        return JSON.parse(data);
      } else {
        return [];
      }
   }

}
const weatherApp = new WeatherApp();
