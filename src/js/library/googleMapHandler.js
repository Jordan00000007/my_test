
/*eslint-disable*/
import GoogleMapsLoader from 'google-maps'; // only for common js environments
//import { listStyleImage } from 'html2canvas/dist/types/css/property-descriptors/list-style-image';


class GoogleMapHandler {
    constructor() {

        this.GoogleMapsLoader = GoogleMapsLoader;
        //this.GoogleMapsLoader.KEY = 'AIzaSyB9sxfTnFb6UB4d44_GI1VrfDBxDRQ-yMc';
        this.GoogleMapsLoader.KEY = 'AIzaSyAx2v8FyRhnZt5nXc1zMi2jlgwP_b7xygY';
        this.GoogleMapsLoader.VERSION = '3.14';
     

    }

    async initMap(location) {

        this.google = await new Promise((resolve, reject) => {
            this.GoogleMapsLoader.load((function (google) {
                resolve(google);
            }).bind(this))
        })

        this.map = new (this.google).maps.Map(document.getElementById('map'), {
            center: location,
            zoom: 7,
            scaleControl: true,
            scrollwheel: true,
        });

    

        this.geocoder = new (this.google).maps.Geocoder();

        
        this.startMarker = new (this.google).maps.Marker({
        })

        this.endMarker = new (this.google).maps.Marker({
        })

        this.routeLine = new (this.google).maps.Polyline({
        });

        this.snapLine = new (this.google).maps.Polyline({
        });

        this.markerCollection=[];
        this.labelCollection=[];
    }

    async fitStoreBounds(data){
        let bounds = new google.maps.LatLngBounds();
        for(var p in data){
            bounds.extend({lat: data[p].Lat, lng: data[p].Lng});
        }
        this.map.fitBounds(bounds);
    }

    async addStoreMarker(obj){

        let storeName=obj.Name;
        let storeLat=obj.Lat;
        let storeLng=obj.Lng;
        let icon = {
            path:'M602 118.6L537.1 15C531.3 5.7 521 0 510 0H106C95 0 84.7 5.7 78.9 15L14 118.6c-33.5 53.5-3.8 127.9 58.8 136.4 4.5.6 9.1.9 13.7.9 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18.1 20.1 44.3 33.1 73.8 33.1 4.7 0 9.2-.3 13.7-.9 62.8-8.4 92.6-82.8 59-136.4zM529.5 288c-10 0-19.9-1.5-29.5-3.8V384H116v-99.8c-9.6 2.2-19.5 3.8-29.5 3.8-6 0-12.1-.4-18-1.2-5.6-.8-11.1-2.1-16.4-3.6V480c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32V283.2c-5.4 1.6-10.8 2.9-16.4 3.6-6.1.8-12.1 1.2-18.2 1.2z',
            fillColor: '#0066CC',
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 0.05,
            anchor: new google.maps.Point(300,0),   
        }

        let marker = new (this.google).maps.Marker({
            position: { lat: storeLat, lng: storeLng },
            map: this.map,
            icon: icon,
           
        })

        let infowindow = new google.maps.InfoWindow({
            content: `<a href="storeStatus?id=${obj.PK_StoreID}"><span class="MapLabel">${storeName}</span></a>`,
            position:  { lat: storeLat, lng: storeLng },
        });

        infowindow.open(this.map, marker);
        marker.addListener('click',function(){
            infowindow.open(this.map, marker);
        });
    }

    updateMarker(location) {

 

        this.map.setCenter(location);

        this.marker.setPosition(location);

        //console.log(this.marker)

        console.log('設定座標:', location, '完成')

    }
    
    updateRoute(route) {

        
        let prev_infowindow =false;

        this.marker.setMap(null);

        let polyLine=[];
       
        let startMarker='';
        let endMarker='';
        let bounds = new google.maps.LatLngBounds();
        let lastMarker='';
        let markerCollection=this.markerCollection;

        let getAddr=function(theMarker){

            return new Promise((resolve, reject) => {
                const markerPosition = theMarker.getPosition();
                let geocoder=new google.maps.Geocoder;
                // 將經緯度透過 Google map Geocoder API 反查地址
                geocoder.geocode({
                    'latLng': markerPosition
                }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results) {
                            console.log(results[0].formatted_address);
                            resolve(results[0].formatted_address);
                        }
                    } else {
                        console.log("Reverse Geocoding failed because: " + status);
                        resolve(null);
                    }
                });
            })

        }

            
             
        

        if (this.markerCollection.length>0){
            this.markerCollection.forEach(item => item.setMap(null));
        }
        this.markerCollection=[];
       

        for(var p in route){
            bounds.extend({lat: route[p].Lat, lng: route[p].Lng});
        }
        this.map.fitBounds(bounds);


        let i=0;
        for(var p in route){
           
            i++;

            //console.log(`=================[${i}]====================`);
            //console.log(route[p].Lat);
            //console.log(route[p].Lng);
            //console.log(route[p].Spd);


            polyLine.push({lat: route[p].Lat, lng: route[p].Lng});
            //bounds.extend({lat: route[p].Lat, lng: route[p].Lng});
            let formatTime=function(timeStr){
                let timeObj=new Date(timeStr);
                let ii=function(i, len) {
                    var s = i + "";
                    len = len || 2;
                    while (s.length < len) s = "0" + s;
                    return s;
                }
                return  ii(timeObj.getUTCHours(),2)+":"+ii(timeObj.getUTCMinutes(),2)+":"+ii(timeObj.getUTCSeconds(),2);
                //console.log(newTime);
            }

            if (i==1){
                this.startMarker.setMap(null);
                this.startMarker = new (this.google).maps.Marker({
                position: {lat: route[p].Lat, lng: route[p].Lng},
                zIndex:25,
                description: formatTime(route[p].Time),
                addr: '',
                icon: {url:require("../../assets/StartPoint.svg"),scaledSize: new google.maps.Size(40, 40)},
                map: this.map
                });

                
                
                
                google.maps.event.addListener(this.startMarker, "click", function (e) {

                   // let infoWindow;
                    /*
                    getAddr(this).then(res => {
                        this.addr=res
                        let infoWindow = new google.maps.InfoWindow({
                            //content: '時間: ' + this.description +'<br />緯度: ' + this.getPosition().lat().toString() + '<br />經度: ' + this.getPosition().lng().toString()+''
                            content: '時間: ' + this.time +'<br />地址: ' +this.addr
                        });
                        if(prev_infowindow) {
                            prev_infowindow.close();
                         }
                        prev_infowindow = infoWindow;
                        infoWindow.open(this.map, this);
                        });
                    });
                    */
                    
                    var infoWindow = new google.maps.InfoWindow({
                        content: '時間: ' + this.description +'<br />緯度: ' + this.getPosition().lat().toString() + '<br />經度: ' + this.getPosition().lng().toString()+''
                        
                    });
                    if(prev_infowindow) {
                        prev_infowindow.close();
                     }
                    prev_infowindow = infoWindow;
                    infoWindow.open(this.map, this);
                    });
                    

                lastMarker=this.startMarker;
            }

            if (i==route.length){
                this.endMarker.setMap(null);
                this.endMarker = new (this.google).maps.Marker({
                position: {lat: route[p].Lat, lng: route[p].Lng},
                zIndex:25,
                description: formatTime(route[p].Time),
                icon: {url:require("../../assets/EndPoint.svg"),scaledSize: new google.maps.Size(40, 40)},
                map: this.map
                });

                google.maps.event.addListener(this.endMarker, "click", function (e) {
                    var infoWindow = new google.maps.InfoWindow({
                        content: '時間: ' + this.description +'<br />緯度: ' + this.getPosition().lat().toString() + '<br />經度: ' + this.getPosition().lng().toString()+''
                    });
                    if(prev_infowindow) {
                        prev_infowindow.close();
                     }
                    prev_infowindow = infoWindow;
                    infoWindow.open(this.map, this);
                    });
            }

            
            var marker="";
            if (i>1){

                var distance = function(map,marker1,marker2) {
                    var p1 = map.getProjection().fromLatLngToPoint(marker1.getPosition());
                    var p2 = map.getProjection().fromLatLngToPoint(marker2.getPosition());
                    var pixelSize = Math.pow(2, -map.getZoom());
                    var d = Math.round(Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y))/pixelSize);
                   return d;
                  }
                

                marker = new (this.google).maps.Marker({
                    position: {lat: route[p].Lat, lng: route[p].Lng},
                    zIndex:20,
                    description: formatTime(route[p].Time)
                    });
    
                marker.setIcon({
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,                        
                        strokeColor: '#fff',
                        strokeWeight: 2,
                        fillColor: '#000',
                        fillOpacity: 0.5,
                        scale: 4,
                        anchor: new google.maps.Point(0, 2),
                        rotation:Math.round(route[p].Dir)
                    });

               

                //console.log("d="+distance(this.map,marker,lastMarker).toString())
                    
                if (distance(this.map,marker,lastMarker)>50){
                   marker.setMap(this.map);

                   google.maps.event.addListener(marker, "click", function (e) {
                    var infoWindow = new google.maps.InfoWindow({
                        content: '時間: ' + this.description +'<br />緯度: ' + this.getPosition().lat().toString() + '<br />經度: ' + this.getPosition().lng().toString()+''
                    });
                    if(prev_infowindow) {
                        prev_infowindow.close();
                     }
                    prev_infowindow = infoWindow;
                    infoWindow.open(this.map, this);
                    });

                   this.markerCollection.push(marker);
                   markerCollection.push(marker);
                   lastMarker=marker;
                }
                

            }
        

        }

        this.routeLine.setMap(null);
        this.routeLine = new (this.google).maps.Polyline({
            path: polyLine,
            zIndex:10,
            geodesic: true,
            strokeColor: '#4597FF',
            strokeOpacity: 1.0,
            strokeWeight: 8.0,
            map: this.map,
          });

        this.map.addListener('zoom_changed',function(){
            
            

            if (markerCollection.length>0){
                markerCollection.forEach(item => item.setMap(null));
            }
            markerCollection=[];

            let i=0;
            for(var p in route){
                i++;
                if (i==1){

                    //let marker = new (this.google).maps.Marker({
                    let marker = new google.maps.Marker({
                        position: {lat: route[p].Lat, lng: route[p].Lng},
                        zIndex:20,

                    });
        
                    lastMarker=marker;
                }

                if (i>1){
                    var distance = function(map,marker1,marker2) {
                        var p1 = map.getProjection().fromLatLngToPoint(marker1.getPosition());
                        var p2 = map.getProjection().fromLatLngToPoint(marker2.getPosition());
                        var pixelSize = Math.pow(2, -map.getZoom());
                        var d = Math.round(Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y))/pixelSize);
                       return d;
                      }
                    
                      let formatTime=function(timeStr){
                        let timeObj=new Date(timeStr);
                        let ii=function(i, len) {
                            var s = i + "";
                            len = len || 2;
                            while (s.length < len) s = "0" + s;
                            return s;
                        }
                        return  ii(timeObj.getUTCHours(),2)+":"+ii(timeObj.getUTCMinutes(),2)+":"+ii(timeObj.getUTCSeconds(),2);
                        //console.log(newTime);
                    }
    
                    marker = new google.maps.Marker({
                        position: {lat: route[p].Lat, lng: route[p].Lng},
                        zIndex:20,
                        description: formatTime(route[p].Time)
                        });
        
                    marker.setIcon({
                            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            strokeColor: '#fff',
                            strokeWeight: 2,
                            fillColor: '#000',
                            fillOpacity: 0.5,
                            scale: 4,
                            
                            anchor: new google.maps.Point(0, 2),
                            rotation:Math.round(route[p].Dir)
                        });

                    if (distance(this,marker,lastMarker)>50){
                        marker.setMap(this);
                        google.maps.event.addListener(marker, "click", function (e) {
                            var infoWindow = new google.maps.InfoWindow({
                                content: '時間: ' + this.description +'<br />緯度: ' + this.getPosition().lat().toString() + '<br />經度: ' + this.getPosition().lng().toString()+''
                            });
                            if(prev_infowindow) {
                                prev_infowindow.close();
                             }
                            prev_infowindow = infoWindow;
                            infoWindow.open(this.map, this);
                        });

                        markerCollection.push(marker);
                        lastMarker=marker;
                    }

                }
        
            }

            


          });
          

        
        console.log('Update Route Complete');

        //this.snapRoute(route);

    }

    updateSnapRoute(route) {

        console.log("updateSnapRoute");

        this.snapLine = new google.maps.Polyline({
            path: route,
            geodesic: true,
            strokeColor: '#ff0000',
            strokeOpacity: 0.5,
            strokeWeight: 10,
            map: this.map,
          });
 

    }

    drawStayLabel(begLat,begLng,stayLabel){

      

        let marker = new google.maps.Marker({
            position:  {lat: begLat, lng: begLng},
            zIndex:50,
            icon: {url:require("../../assets/dialog.svg"),scaledSize: new google.maps.Size(120, 40),anchor: new google.maps.Point(45, 45),},
            label: {
                text: stayLabel,
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "bold",
                labelOrigin: new google.maps.Point(100, 100)
              },
            map:this.map
            });

       
    }

    drawStayLabels(stayCol){

        
        if (this.labelCollection.length>0){
            this.labelCollection.forEach(item => item.setMap(null));
        }
        this.labelCollection=[];
     
        let distance = function(map,marker1,marker2) {
            var p1 = map.getProjection().fromLatLngToPoint(marker1.getPosition());
            var p2 = map.getProjection().fromLatLngToPoint(marker2.getPosition());
            var pixelSize = Math.pow(2, -map.getZoom());
            var d = Math.round(Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y))/pixelSize);
           return d;
          }

        let formateTime=function(stayMin){
            let hh=Math.floor(stayMin/60);
            let mm=stayMin%60;
            let stayLabel=hh.toString()+'h:'+mm.toString()+'m';
            return stayLabel;
        }

        let i=0;
        let lastLabel='';
        for(var p in stayCol){
            
            if(i==0){

                let myLabel = new google.maps.Marker({
                    position:  {lat: stayCol[p].Lat, lng: stayCol[p].Lng},
                    zIndex:50,
                    icon: {url:require("../../assets/dialog.svg"),scaledSize: new google.maps.Size(80, 40),anchor: new google.maps.Point(40, 0),},
                    label: {
                        text: formateTime(stayCol[p].Stay),
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: "bold",
                       
                    },
                    stay:stayCol[p].Stay,
                    opacity:0.9,
                    map:this.map
                    });

                    
                this.labelCollection.push(myLabel);
                lastLabel=myLabel;
            }
            else
            {
                let thisLabel = new google.maps.Marker({
                    position:  {lat: stayCol[p].Lat, lng: stayCol[p].Lng},
                    zIndex:50,
                    icon: {url:require("../../assets/dialog.svg"),scaledSize: new google.maps.Size(80, 40),anchor: new google.maps.Point(40, 0),},
                    label: {
                        text: formateTime(stayCol[p].Stay),
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: "bold",
                        
                    },
                    opacity:0.9,
                    stay:stayCol[p].Stay
                    });

                
                if (distance(this.map,thisLabel,lastLabel)>50){

                    thisLabel.setMap(this.map);
                    this.labelCollection.push(thisLabel);
                    lastLabel=thisLabel;

                }
                else
                {

                    let sum=lastLabel.stay + thisLabel.stay ;
                    lastLabel.stay = sum;
                    lastLabel.label.text=formateTime(sum);

                }

            }

            //
            i++;
        }

        var labelCollection=this.labelCollection;

        this.map.addListener('zoom_changed',function(){

            //console.log(labelCollection);
            if (labelCollection.length>0){
                labelCollection.forEach(item => item.setMap(null));
            }
            labelCollection=[];

            let distance = function(map,marker1,marker2) {
                var p1 = map.getProjection().fromLatLngToPoint(marker1.getPosition());
                var p2 = map.getProjection().fromLatLngToPoint(marker2.getPosition());
                var pixelSize = Math.pow(2, -map.getZoom());
                var d = Math.round(Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y))/pixelSize);
               return d;
              }

            let formateTime=function(stayMin){
                let hh=Math.floor(stayMin/60);
                let mm=stayMin%60;
                let stayLabel=hh.toString()+'h:'+mm.toString()+'m';
                return stayLabel;
            }
    
            let i=0;
            let lastLabel='';
            for(var p in stayCol){
                
                if(i==0){
    
                    let myLabel = new google.maps.Marker({
                        position:  {lat: stayCol[p].Lat, lng: stayCol[p].Lng},
                        zIndex:50,
                        icon: {url:require("../../assets/dialog.svg"),scaledSize: new google.maps.Size(80,40),anchor: new google.maps.Point(40, 0),},
                        label: {
                            text: formateTime(stayCol[p].Stay),
                            color: "#ffffff",
                            fontSize: "15px",
                            fontWeight: "bold",
                            
                        },
                        stay:stayCol[p].Stay,
                        opacity:0.9,
                        map:this
                        });
                    labelCollection.push(myLabel);
                    lastLabel=myLabel;
                }
                else
                {
                    let thisLabel = new google.maps.Marker({
                        position:  {lat: stayCol[p].Lat, lng: stayCol[p].Lng},
                        zIndex:50,
                        icon: {url:require("../../assets/dialog.svg"),scaledSize: new google.maps.Size(80, 40),anchor: new google.maps.Point(40, 0),},
                        label: {
                            text: formateTime(stayCol[p].Stay),
                            color: "#ffffff",
                            fontSize: "15px",
                            fontWeight: "bold",
                            
                        },
                        opacity:0.9,
                        stay:stayCol[p].Stay
                        });
    
                    //console.log("distance="+distance(this,thisLabel,lastLabel).toString());
    
                    if (distance(this,thisLabel,lastLabel)>50){
    
                        thisLabel.setMap(this);
                        labelCollection.push(thisLabel);
                        lastLabel=thisLabel;
    
                    }
                    else
                    {
    
                        let sum=lastLabel.stay + thisLabel.stay ;
                        lastLabel.stay = sum;
                        lastLabel.label.text=formateTime(sum);
    
                    }
    
                }
    
                //
                i++;
            }












        });

       
    }

    getAddress() {

        return new Promise((resolve, reject) => {
            const markerPosition = this.marker.getPosition();

            // 將經緯度透過 Google map Geocoder API 反查地址
            this.geocoder.geocode({
                'latLng': markerPosition
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results) {
                        console.log(results[0].formatted_address);
                        resolve(results[0].formatted_address);
                    }
                } else {
                    console.log("Reverse Geocoding failed because: " + status);
                    resolve(null);
                }
            });
        })
    }

    getReverseGeocoding(Lat,Lng) {

        return new Promise((resolve, reject) => {
            const markerPosition = this.marker.getPosition();

            // 將經緯度透過 Google map Geocoder API 反查地址
            this.geocoder.geocode({
                'latLng': markerPosition
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results) {
                        console.log(results[0].formatted_address);
                        resolve(results[0].formatted_address);
                    }
                } else {
                    console.log("Reverse Geocoding failed because: " + status);
                    resolve(null);
                }
            });
        })
    }

    
}

export const googleMapHandler = new GoogleMapHandler();
