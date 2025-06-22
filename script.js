const cityInput=document.querySelector('.city-input')
const searchBtn=document.querySelector('.search-btn')

const notFound=document.querySelector('.not-found')
const searchCity=document.querySelector('.search-city')
const weatherInfo=document.querySelector('.weather-info')

const countryTxt=document.querySelector('.country-txt')
const tempTxt=document.querySelector('.temp-txt')
const conditionTxt=document.querySelector('.condition-txt')
const humidityTxt=document.querySelector('.humidity-value-txt')
const windTxt=document.querySelector('.wind-value-txt')
const weatherImg=document.querySelector('.weather-summary-img')
const currDate=document.querySelector('.current-date-txt')

const forecatItem=document.querySelector('.forecast-item-container')

const apiKey='a3f5e1461327619863c556e16a3c27f4'
searchBtn.addEventListener('click',() => {
    if(cityInput.value.trim()!=''){
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
    
})

cityInput.addEventListener('keydown',(event)=>{
    if (event.key =='Enter'&& cityInput.value.trim() !=''){
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }   
})

async function getFetchData(endPoint,city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const response= await fetch(apiUrl)
    return response.json()
}

function getWeatherIcon(id){
    if(id<=232) return 'thunderstrom.svg'
    if(id<=321) return 'drizzle.svg'
    if(id<=531) return 'rain.svg'
    if(id<=622) return 'snow.svg'
    if(id<=781) return 'atmosphere.svg'
    if(id<=800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate(){
    const currentDate=new Date()
    const options={
        weekday:'short',
        day:'2-digit',
        month:'short'
    }
    return currentDate.toLocaleDateString('en-GB',options)
}
async function updateWeatherInfo(city){
    const weatherData= await getFetchData('weather',city)
    if (weatherData.cod!=200){
        showDisplaySection(notFound)
        return
    }
    console.log(weatherInfo)

    const{
        name:country,
        main:{temp,humidity},
        weather:[{id,main}],
        wind:{speed},
    }=weatherData

    countryTxt.textContent=country
    tempTxt.textContent=Math.round(temp) + ' °C'
    conditionTxt.textContent=main
    humidityTxt.textContent=humidity + '%'
    windTxt.textContent=speed + 'M/s'

    currDate.textContent=getCurrentDate()
    weatherImg.src=`weather/${getWeatherIcon(id)}`

    await updateForecastInfo(city)

    showDisplaySection(weatherInfo)
}

async function updateForecastInfo(city){
    const forecastData=await getFetchData('forecast',city)

    const timeTaken='12:00:00'
    const todayDate=new Date().toISOString().split('T')[0]

    forecatItem.innerHTML=''

    forecastData.list.forEach(forecastWeather=>{
        if (forecastWeather.dt_txt.includes(timeTaken)  ){
            updateForecastItems(forecastWeather)
        }
    })
}

function updateForecastItems(weatherData){
    const{
        dt_txt:date,
        weather:[{id}],
        main:{temp}
    }=weatherData
    
    const dateTaken= new Date(date)
    const dateOption = {
        day:'2-digit',
        month:'short',   
    }

    const dateResult=dateTaken.toLocaleDateString('en-US',dateOption)

    const forecatItemlist=`
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
        </div>
    `
    forecatItem.insertAdjacentHTML('beforeend',forecatItemlist)
}

function showDisplaySection(section){
    [weatherInfo,searchCity,notFound]
        .forEach(section=>section.style.display='none')
    section.style.display='flex'
}