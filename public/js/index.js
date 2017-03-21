mapboxgl.accessToken = 'pk.eyJ1IjoibndhcndpY2siLCJhIjoiY2owYWR6NnZoMDA3NTMzb2F3aGQ2YXpvZyJ9.vQzH-hYOzRMurslNpAfiSg';

console.log("test1");

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/dark-v9', //hosted style id
    center: [0, 0], // starting position
    zoom: 2 // starting zoom
});

map.on('load', function() {
    map.addSource('users', {
        type: 'geojson',
        data: '../data/data.json'
    });
    map.addLayer({
        'id': 'users',
        'type': 'circle',
        'source': 'users',
        'layout': {
            'visibility': 'visible'
        },
        'paint': {
            'circle-radius': 10,
            'circle-color': 'rgb(0, 249, 124)'
        },
    });
});

console.log("test3");
console.log("test3");