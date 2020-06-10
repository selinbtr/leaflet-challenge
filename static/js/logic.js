
// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// Use this link to get the geojson data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
// var link2 = "data/PB2002_plates.geojson";

// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(mag) {

    if (mag>=5){
      return "#D95452";
    }
    if (mag>=4){
      return "#D95452";
    }
    if (mag>=3){
      return "#FE8A1E";
    }
    if (mag>=2){
      return "#FFC300";
    }
    if (mag>=1){
      return "#FEE61E";
    }
    else{
      return "#87DE59";
    }
  }

// Function for color legend
function displayLegend(){
    var legendInfo = [{
        label: "0-1",
        color: "#87DE59"
    },
    {
        label: "1-2",
        color: "#FFC300"
    },{
       
        label:"3-4",
        color:"#FE8A1E"
    },
    {
        label:"4-5",
        color:"#E51717"
    },
    {
        label:"5+",
        color:"#880505"
    }];

    var strng = "";
    for (i = 0; i < legendInfo.length; i++){
      // strng += "<p style = \"background-color: "+legendInfo[i].color + "\">"+legendInfo[i].label+"</p> ";
       strng += "<p style = \"color: "+legendInfo[i].color + "\">"+legendInfo[i].label+"</p> ";
    }
    return strng;
  }

  // Perform a GET request to the query URL
  d3.json(link, function(data) {
      // Once we get a response, send the data.features object to the createFeatures function
      createFeatures(data.features);
  });


  function createFeatures(data) {
    
    function onEachLayer(feature) {
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          radius: feature.properties.mag*5,
          fillOpacity: 0.5,
          color: chooseColor(feature.properties.mag),
          fillColor: chooseColor(feature.properties.mag)
        });
    }

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + "Date/Time: " + new Date(feature.properties.time) + 
        "</h3><hr><p>" + "Magnitude: " + feature.properties.mag+"</p>");
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: onEachLayer        
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
    });

    var outdoormap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/outdoors-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
    });
  
    var satellitemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/satellite-v9',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap,
      "Outdoors Map": outdoormap,
      "Satellite Map": satellitemap
    };
    // Create the faultline layer
    var faultLines = new L.LayerGroup();
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Earthquakes": earthquakes,
      "Fault Lines": faultLines
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var map = L.map("map", {
      center: [36.7783, -119.4179],
      zoom: 6,
      layers: [earthquakes, faultLines]
    });

    lightmap.addTo(map); 

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    var link2 = "data/PB2002_plates.json";
    d3.json(link2, function(data) {
      L.geoJSON(data, {
        style: function() {
          return {color: "brown", fillOpacity: 0}
        }
      }).addTo(faultLines)
    });

    var info = L.control({
        position: "bottomright"
    });

    info.onAdd = function(){
        var div = L.DomUtil.create("div","legend");
        return div;
    }

    info.addTo(map);

   document.querySelector(".legend").innerHTML=displayLegend();

}


