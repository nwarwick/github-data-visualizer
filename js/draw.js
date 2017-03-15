mapboxgl.accessToken = 'pk.eyJ1IjoibndhcndpY2siLCJhIjoiY2owYWR6NnZoMDA3NTMzb2F3aGQ2YXpvZyJ9.vQzH-hYOzRMurslNpAfiSg';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/dark-v9', //hosted style id
    center: [0, 0], // starting position
    zoom: 2 // starting zoom
});