import '../Css/styles.css'

// API FROM AQICN
const api =
{ 
   key: process.env.API_KEY_AQI,
    baseUrl: 'https://api.waqi.info/feed/'
}


const searchBox = document.querySelector('.search-box');
searchBox.addEventListener('keypress', setQuery);

function setQuery(evt){
  var keyCode=evt.keyCode;

  if(keyCode == 13){
    evt.returnValue=false;
    evt.stopPropagation();

    getResults(searchBox.value);
    
   }
    
}

//Fetch 
function getResults (query){



    fetch(`${api.baseUrl}${query}/?token=${api.key}`)
      .then(response =>  {
      return response.json();
    })

    .then(displayResults);
    
}


// FUNCTION TO DISPLAY THE RESULTS
function displayResults(elements){

  
  
  // IF THE CITY DON'T EXIST SHOW ALERT WITH ERROR 
  if(elements.status != 'ok'){
  alert('error try with other city');
  
  document.getElementById('aqiId').style.color=  '#FFF';
  document.getElementById('statusId').style.color=  '#FFF';

  let city = document.querySelector('.location .city');
  city.innerText = '--';
 
  let date = document.querySelector('.location .date');
  date.innerText = '--';
 
  let temp = document.querySelector('.current .aqi');
  temp.innerHTML =  '--';
 
  let status_el = document.querySelector('.current .status');
  status_el.innerText = '--';


} // ELSE WITH .INNERTEXT CHANGE ALL FIELDS
  else{
    let lat = elements.data.city.geo[0],
    lng = elements.data.city.geo[1];

    //SET THE CENTER OF MAP
    mymap.setView({
      lat: lat,
      lng: lng,
    },
    10
    );

    let aq = elements.data.aqi;

    //CHANGE TEXT IN P ELEMENTS
    let city = document.querySelector('.location .city');
    city.innerText = `${elements.data.city.name}`;

  
    let date = document.querySelector('.location .date');
    date.innerText = `${(elements.data.time.s)}`;


    let aqi = document.querySelector('.current .aqi');
    aqi.innerHTML =  `${(elements.data.aqi)}`;

    let status_el = document.querySelector('.current .status');
    status_el.innerText = status(aq);
  }
}



// SWITCH TO RETURN THE AIR QUALITY
function status(value){

  
  switch (true){

    case (value >= 0 && value <= 50 ) : 
      document.getElementById('aqiId').style.color= '#44ac5e';
      document.getElementById('statusId').style.color= '#44ac5e';

      return 'Good'; 
      break;
    case (value > 50 && value <= 100 ) :

      document.getElementById('aqiId').style.color= '#fee033';
      document.getElementById('statusId').style.color= '#fee033';
      
      return 'Moderate';
      break;


    case (value > 100 && value <= 150 ) : 
      document.getElementById('aqiId').style.color= '#ffa500';
      document.getElementById('statusId').style.color= '#ffa500';
    
      return 'Unhealthy for Sensitive Groups';
      break;
    case (value > 150 && value <= 200 ) :
    
      document.getElementById('aqiId').style.color=  '#cc0136';
      document.getElementById('statusId').style.color=  '#cc0136';
    
    
      return 'Unhealthy';
      break;
    case (value > 200 && value <= 300 ) : 

      document.getElementById('aqiId').style.color=  '#670097';
      document.getElementById('statusId').style.color=  '#670097';
      return 'Very Unhealthy';
      break;
    case (value > 300 && value <= 500 ) : 
      document.getElementById('aqiId').style.color=  '#500000';
      document.getElementById('statusId').style.color=  '#500000';
      return 'Hazardous';
      break;
    
    default : return 'there is no data';
  }

  
}


//GEOLOCATION

function coordinate(pos) {
  var crd = pos.coords;

  let place = `geo:${crd.latitude};${crd.longitude}`;

  mymap.setView({
      lat: `${crd.latitude}`,
      lng: `${crd.longitude}`,
  
    },
    10
  );
  
  fetch(`${api.baseUrl}${place}/?token=${api.key}`)
  .then(response =>  {
  return response.json();
  
}).then(displayResults);
}


function error(err) {
  alert(`ERROR(${err.code}): ${err.message}`);
  
}

document.getElementById('automaticPosition').addEventListener('click',
function ()
{
  navigator.geolocation.getCurrentPosition(coordinate,error)
})



// MAP FROM LEAFLET

let mapToken = process.env.API_KEY_MAP;

var mymap = L.map('map').setView([44.927039900000004,10.814637699999999],8);

let firstMap = L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapToken}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: `${mapToken}`
}).addTo(mymap);

let aqicnMap = L.tileLayer(
  `https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=${api.key}`,
);

mymap.addLayer(firstMap).addLayer(aqicnMap);


// SHOW HIDE CATEGORIES
document.getElementById('hiddenShowCategories').addEventListener('click', 

function (){
  
  let x = document.getElementById('categoriesId');
  if (x.style.display === 'none') {
    x.style.display = 'block';
    document.querySelector('.categories-btn').innerText = 'Hide Categories'
  } else {
    x.style.display = 'none';
    document.querySelector('.categories-btn').innerText = 'See Categories'

  }
})
