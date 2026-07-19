// GeoJSON stores [longitude, latitude]
const longitude = listing.geometry.coordinates[0];
const latitude = listing.geometry.coordinates[1];

// initialize the map on the "map" div with a given center and zoom
const map = L.map('map').setView([latitude,longitude], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 9,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// adding a red icon
const redIcon = L.icon({
    iconUrl: "/mapicon/marker-icon-2x-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});


//adding marker & popup for location
L.marker([latitude,longitude],{icon:redIcon})
.addTo(map)
.bindPopup(`<h4>${listing.title}</h4><p>Exact location will be provided after booking!</p>`)
.openPopup();
