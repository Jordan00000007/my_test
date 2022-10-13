import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

class MapBoxMapHandler {
    constructor() {

        this.token='pk.eyJ1IjoiamNhdDE4ODA3OSIsImEiOiJja3czNXkycWgwazBiMm9uaG5iNDkzcGxkIn0.9fZh9v3S1kov1WuFqXxEpQ';
        this.map;
        this.geocoder;
        this.editingMarker;
      
     
    }

    setGeoCoding(result){
        // Get the geocoder results container.
    //const results = document.getElementById('result');

    // Add geocoder result to container.
        this.geocoder.on('result', (e) => {
            //results.innerText = JSON.stringify(e.result, null, 2);

            console.log(JSON.stringify(e.result, null, 2))
        });
    }


    formatFloat(num, pos)
    {
        var size = Math.pow(10, pos);
        return Math.round(num * size) / size;
    };

    onDragEnd(e) {
        // const lngLat = this.getLngLat();
        // $('#latitude').val(this.formatFloat(lngLat.lat,5));
        // $('#longitude').val(this.formatFloat(lngLat.lng,5));

        console.log('drag end')
    }

    onClick_xx(event) {
          
        let coord = event.lngLat;
        $('#latitude').val(this.formatFloat(coord.lat,5));
        $('#longitude').val(this.formatFloat(coord.lng,5));
        
        if (this.editingMarker){
            this.editingMarker.setLngLat(coord);
            
        }else{
            this.editingMarker = new mapboxgl.Marker({draggable: false,color: "#b40219"})
            .setLngLat(coord)
            .addTo(this.map);
        }
    }

    onClick(event) {
          
        let coord = event.lngLat;
        $('#latitude').val(coord.lat);
        $('#longitude').val(coord.lng);
        
        if (this.editingMarker){
            this.editingMarker.setLngLat(coord);
            
        }else{
            this.editingMarker = new mapboxgl.Marker({draggable: false,color: "#b40219"})
            .setLngLat(coord)
            .addTo(this);
        }
    }

    addEditingMarker(){

        if (($('#latitude').val()!='')&&($('#longitude').val()!='')){
            let lat=parseFloat($('#latitude').val());
            let lng=parseFloat($('#longitude').val());

            if ((lat)&&(lng)){

                if (this.editingMarker){
                    this.editingMarker.setLngLat([lng,lat]);
                }else{
                    this.editingMarker = new mapboxgl.Marker({draggable: false,color: "#b40219"})
                    .setLngLat([lng,lat])
                    .addTo(this.map);               
                }
                this.map.setCenter([lng,lat]);
                this.map.flyTo({
                    speed: 1,
                    zoom: 13
                });

            }
        }
    }

    async initMap(MapID,Lat,Lng) {

        mapboxgl.accessToken = this.token;
        this.map = new mapboxgl.Map({
            container: MapID,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [Lng, Lat],
            zoom: 6
        });

        let mapboxLanguage = new MapboxLanguage({
            defaultLanguage: 'zh-Hant'
        });

        this.geocoder = new MapboxGeocoder({
            // Initialize the geocoder
            accessToken: this.token, // Set the access token
            types: 'country,region,place,postcode,locality,neighborhood',
            mapboxgl: mapboxgl, // Set the mapbox-gl instance
            marker: false // Do not use the default marker style
          });
          
          // Add the geocoder to the map
        this.map.addControl(this.geocoder);

        this.map.addControl(mapboxLanguage);
        this.map.addControl(new mapboxgl.FullscreenControl());

        this.map.on('load', this.addEditingMarker.bind(this));
        this.map.on('click',this.setMapClickEvent.bind(this));
     
    }

    goLocation(){
        if (($('#latitude').val()!='')&&($('#longitude').val())){

            let lat= $('#latitude').val();
            let lng= $('#longitude').val();  
            if (this.editingMarker){
                this.editingMarker.setLngLat([lng,lat]);
                
            }else{
                this.editingMarker = new mapboxgl.Marker({draggable: false,color: "#b40219"})
                .setLngLat([lng,lat])
                .addTo(this.map);
            }
            this.map.setCenter([lng,lat]);
            this.map.flyTo({
                speed: 1,
                zoom: 13
            });
        }

    }


    setMapClickEvent(ev){

        let myClass=$('#mapLock').attr('class');
        if (myClass.indexOf('fa-lock-open')>0){
            let coord = ev.lngLat;
            $('#latitude').val(this.formatFloat(coord.lat,5));
            $('#longitude').val(this.formatFloat(coord.lng,5));    
            if (this.editingMarker){
                this.editingMarker.setLngLat(coord);
                
            }else{
                this.editingMarker = new mapboxgl.Marker({draggable: false,color: "#b40219"})
                .setLngLat(coord)
                .addTo(this.map);
            }
        }
    };

  
    

  

    async fitStoreBounds(data){
        let bounds = new mapboxgl.LngLatBounds();
        for(var p in data){
            bounds.extend([ data[p].Lng,  data[p].Lat]);
        }
        this.map.fitBounds(bounds, {
            padding: 80
        });

        console.log('zoom='+this.map.getZoom())
        if (data.length==1){
            if (this.map.getZoom()<=6){
                this.map.setCenter([ data[0].Lng,  data[0].Lat]);
                this.map.flyTo({
                    speed: 1,
                    zoom: 15
                });
            }
        }
    }

    

    async addStoreMarker(obj){

        let storeName=obj.Name;
        let storeLat=obj.Lat;
        let storeLng=obj.Lng;
        let storeID=obj.PK_StoreID;
    
        var el = document.createElement('div');
        el.innerHTML='<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="store" class="svg-inline--fa fa-store fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 616 512"><path fill="#0066CC" d="M602 118.6L537.1 15C531.3 5.7 521 0 510 0H106C95 0 84.7 5.7 78.9 15L14 118.6c-33.5 53.5-3.8 127.9 58.8 136.4 4.5.6 9.1.9 13.7.9 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18.1 20.1 44.3 33.1 73.8 33.1 4.7 0 9.2-.3 13.7-.9 62.8-8.4 92.6-82.8 59-136.4zM529.5 288c-10 0-19.9-1.5-29.5-3.8V384H116v-99.8c-9.6 2.2-19.5 3.8-29.5 3.8-6 0-12.1-.4-18-1.2-5.6-.8-11.1-2.1-16.4-3.6V480c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32V283.2c-5.4 1.6-10.8 2.9-16.4 3.6-6.1.8-12.1 1.2-18.2 1.2z"></path></svg>';
        el.style.padding = '0px 0px';
        el.style.width = '40px';
        el.style.height = '40px';
   
        let marker=new mapboxgl.Marker(el)
        .setLngLat([storeLng, storeLat])
        .setPopup(
            new mapboxgl.Popup({ offset: 20,closeButton: false,
                closeOnClick: false}) // add popups
              .setHTML(
                //`<a href="storeStatus?id=${storeID}"><span class='MapLabel'>${storeName}</span></a>`
                `<span class='MapLabel cursor' onclick="location='storeStatus?id=${storeID}'">${storeName}</span>`
              )
        )
        .addTo(this.map);

        marker.togglePopup();

    }



}

export const mapBoxMapHandler = new MapBoxMapHandler();