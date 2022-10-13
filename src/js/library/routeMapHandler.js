/*eslint-disable*/
import { googleMapHandler } from './googleMapHandler'
import { getTraceInfo } from './getTraceInfo'
import { showMsgHandler } from '../library/common'
import { offMsgHandler } from '../library/common'



export class RouteMapPageHandler {

    constructor() {
        this.doc = document;
        this.deviceSelect = this.doc.querySelector('#deviceSelect');
        this.dateSelect = this.doc.querySelector('#dateSelect');
    }

    


    async setMapRoute() {


            const IMEI = this.deviceSelect.value;
            const dateStr = this.dateSelect.value;
       
            //console.log('At setMapInfo ');
            console.log('裝置IMEI:', IMEI);
            console.log('日期:', dateStr);

            //await $.cookie('homePageDefaultDevice', IMEI);

            let routeInfo = await getTraceInfo(IMEI,dateStr);


            // 過濾資料
            let distance = function(lng1,lat1,lng2,lat2) {
                var radLat1 = lat1*Math.PI / 180.0;
                var radLat2 = lat2*Math.PI / 180.0;
                var a = radLat1 - radLat2;
                var b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
                var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
                Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
                s = s *6378.137 ;// EARTH_RADIUS;
                s = Math.round(s * 10000) / 10000;
                return s;
              };

            let angle=function(lng1,lat1,lng2,lat2) {
            const degreesToRadians = Math.PI / 180.0;
    
            const phi1 = lat1 * degreesToRadians;
            const phi2 = lat2 * degreesToRadians;
            const lam1 = lng1 * degreesToRadians;
            const lam2 = lng2 * degreesToRadians;
            const y = Math.sin(lam2 - lam1) * Math.cos(phi2);
            const x =
                Math.cos(phi1) * Math.sin(phi2) -
                Math.sin(phi1) * Math.cos(phi2) * Math.cos(lam2 - lam1);
    
            const bearing = Math.round((Math.atan2(y, x) * 180) / Math.PI);
    
            return (bearing+360)%360;
            }
            
            let i=0;
            let x1=0;
            let y1=0;
            console.log("beg="+routeInfo.length);
            let routeInfo_v2=[];
            // 刪除太近的點
            for(var p in routeInfo){
                if (i==0){
                    routeInfo_v2.push(routeInfo[p]);
                }
                else{
                    if (parseFloat(routeInfo[p].Dis)>0.1){
                        //routeInfo.splice(i,1);
                        routeInfo_v2.push(routeInfo[p]);
                    }
                }
                i++;
            };
            // 重新計算方向,距離,速度
            i=0;
            let lastPoint='';
            for(var p in routeInfo_v2){
                if (i==0){
                    routeInfo_v2[p].Dir=0;
                    routeInfo_v2[p].Spd=0;
                    routeInfo_v2[p].Dis=0;
                    lastPoint=routeInfo_v2[p];
                }
                else{
                    if (lastPoint!=''){
                        let Dir=angle(lastPoint.Lng,lastPoint.Lat,routeInfo_v2[p].Lng,routeInfo_v2[p].Lat);
                        let Dis=distance(lastPoint.Lng,lastPoint.Lat,routeInfo_v2[p].Lng,routeInfo_v2[p].Lat);
                        let Spd=Dis/((new Date(routeInfo_v2[p].Time) - new Date(lastPoint.Time))/1000/60/60);
                        routeInfo_v2[p].Dir=Dir;
                        routeInfo_v2[p].Dis=Dis;
                        routeInfo_v2[p].Spd=Spd;
                        lastPoint=routeInfo_v2[p];
                    }
                }
                i++;
            };

            // i=0;
            // for(var p in routeInfo_v2){
            //     console.log("Time="+routeInfo_v2[p].Time+" Dir="+routeInfo_v2[p].Dir+" Spd="+routeInfo_v2[p].Spd+" Dis="+routeInfo_v2[p].Dis);
            //     i++;
            // }



            console.log("end="+routeInfo_v2.length);


            
            if (i==0){
                //alert("無資料");
                showMsgHandler('popmsg', 1, '無資料').then((timeout) => {
                    //clearTimeout(timeout);
                });
            }
            else{
                offMsgHandler('popmsg');
            }

           
            await googleMapHandler.initMap({ lat: 25.0453888, lng: 121.549022 });
            await googleMapHandler.updateRoute(routeInfo_v2);
            
            

            
            if (routeInfo.length>0){
                this.stayTime(routeInfo);
            }
            
            /*
            // for test
            if (routeInfo.length>0){
                this.snapRoute(routeInfo);
            }
            */
            
           
        
    }

    async stayTime(route){
        console.log("stay time begin...");
        let stayTimeCollection=[];
        let dataNum=0;
        let tripNum=0;
        let lastNum=0;
        let begTime='';
        let endTime='';
        let begLat='';
        let begLng='';
        for(var p in route){
            dataNum++;
            if (route[p].Spd<5){
                //urlStr+=route[p].Lat+","+route[p].Lng+"|";
               
                if ((lastNum!='')&&((dataNum-1)==lastNum)){
                    
                    //console.log('dataNum='+dataNum.toString());
                    //console.log(route[p].Time);
                    //console.log(route[p].Spd);
                }
                else{
                    tripNum++;
                    begTime=route[p].Time;
                    begLat=route[p].Lat;
                    begLng=route[p].Lng;
                    //console.log('---------------[ '+tripNum.toString()+' ]----------------');
                    //console.log('dataNum='+dataNum.toString());
                    //console.log(route[p].Time);
                    //console.log(route[p].Spd);
                }
                lastNum=dataNum;
            }
            else{
                if ((dataNum-1)==lastNum){
                    endTime=route[p].Time;
                    
                    begTime=new Date(begTime);
                    endTime=new Date(endTime);
                  
                    
                    let mm=Math.round((endTime-begTime)/1000/60);
                   
                    if (mm>=5){
                        
                        let stayMin=Math.round((endTime-begTime)/1000/60);
                        stayTimeCollection.push({"Lat":begLat,"Lng":begLng,"Stay":stayMin});

                    }



                    
                    
                }
            }
        
        }

        //console.log(stayTimeCollection);
        await googleMapHandler.drawStayLabels(stayTimeCollection);


    }

    async snapRoute(route) {

        console.log("snap route begin...");
        let mod=Math.floor(route.length/100)+1;
       
        let urlStr="https://roads.googleapis.com/v1/snapToRoads?path=";
        let i=0;
        let j=0;
        for(var p in route){
            i++;
            //if ((i%mod)==0){
            if (i<100){
                urlStr+=route[p].Lat+","+route[p].Lng+"|";
                j++;
            }
        
        }

        urlStr=urlStr.substr(0,urlStr.length-1);
        urlStr+="&interpolate=true&key="+"AIzaSyAx2v8FyRhnZt5nXc1zMi2jlgwP_b7xygY";
        

        $.get(urlStr, function(data) {
            let snappedCoordinates = [];
            let placeIdArray = [];
            for (var i = 0; i < data.snappedPoints.length; i++) {
                var latlng = new google.maps.LatLng(
                    data.snappedPoints[i].location.latitude,
                    data.snappedPoints[i].location.longitude);
                //snappedCoordinates.push(latlng);
                snappedCoordinates.push({lat: data.snappedPoints[i].location.latitude, lng: data.snappedPoints[i].location.longitude});
                placeIdArray.push(data.snappedPoints[i].placeId);

            }

            googleMapHandler.updateSnapRoute(snappedCoordinates);
           
           
        });



    }



    async deviceSelectEvent() {
        const IMEI = this.deviceSelect.value;

        if (IMEI === 'editDevice') {
            window.location = '/editDevice';
            await $.cookie('lastPage', 'routeMap');
        } else {

            await $.cookie('homePageDefaultDevice', IMEI);
            this.setMapRoute();
            

        }
        console.log(deviceSelect.value)
    }


    setDeviceSelectListenOnChange() {

        this.deviceSelect.removeEventListener('change', this.deviceSelectEvent);
        this.deviceSelect.addEventListener('change', this.deviceSelectEvent.bind(this), false);

    }

    setDateSelectListenOnChange() {

        this.dateSelect.removeEventListener('change', this.setMapRoute);
        this.dateSelect.addEventListener('change', this.setMapRoute.bind(this), false);
    }
}