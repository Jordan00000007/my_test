import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';




class LeafletMapHandler {
    constructor() {
        this.map; 
    }

    async initMap(Lat,Lng) {

        this.map = L.map('map').setView([Lat, Lng], 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        //     maxZoom: 18,
        //     id: 'mapbox/streets-v11',
        //     tileSize: 512,
        //     zoomOffset: -1,
        //     accessToken: 'sk.eyJ1IjoiamNhdDE4ODA3OSIsImEiOiJja3czNjNyY3cwZ3hqMnZxbDRkNzJxaXVnIn0.z-XVeeLMZq_Q12eOg4YBFQ'
        // }).addTo(this.map);

        // var language = new MapboxLanguage({defaultLanguage: "zh"});
        // this.map.addControl(language);

        

      
        

        // L.marker([51.5, -0.09]).addTo(map)
        //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        //     .openPopup();
        
     
    }

}

export const leafletMapHandler = new LeafletMapHandler();