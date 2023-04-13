// Store our API endpoint as queryURL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Perform a GET request to the query URL/
d3.json(queryURL).then(function (data) { 
  // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
    console.log(data.features);
  });
// Create a function to set the style for the markers 
  function setStyle(feature) {
    return {
      opacity: 0.8,
      fillOpacity: 0.8,
      fillColor: setColor(feature.geometry.coordinates[2]),
      color: "black",
      radius: setSize(feature.properties.mag),
      weight: 0.5
    };
  }
  // Create a function to set the color based on the depth of the earthquake 
  function setColor(depth) {
    var color = "";
    if (depth > 90) {
      return color = "#ff0000";
    }
    else if (depth > 70) {
      return color = "#ff8c00";
    }
    else if (depth > 50) {
      return color = "#ffa500";
    }
    else if (depth > 30) {
      return color = "#ffd700";
    }
    else if (depth > 10) {
      return color = "#98fb98";
    }
    else {
      return color = "#7cfc00";
    }
  }
    // Create a function to set the size based on the magnitude 
    function setSize(mag) {
      if (mag === 0) {
        return 1;
      }
      return mag * 3.5;
    }
     
  function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3> Place: ${feature.properties.place}</h3><hr><h2>Depth: ${feature.geometry.coordinates[2]}</h2><h2>Magnutide: ${feature.properties.mag}</h2></hr>`);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      onEachFeature: onEachFeature,
      style: setStyle
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }
  
  var legend = L.control({position: 'bottomright'});

  // Set up the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var limits = [-10, 10, 30, 50, 70, 90];
    var labels = [];

    // Loop through each depth item to label and color the legend
    for (var i = 0; i < limits.length; i++) {
      labels.push("<i style = 'background-color:" + setColor(limits[i] + 1) + "'></i>" +
      limits[i] + (limits[i + 1] ? '&ndash;' + limits[i+1] + '<br>' : '+'));
      console.log(labels);
      // labels.push("<i style = 'background:" + "#7cfc00" + "'></i>");
  }
  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};


  function createMap(earthquakes) {
  
    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    legend.addTo(myMap);
  
  }
  
  
