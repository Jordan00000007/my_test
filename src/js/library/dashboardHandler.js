/*eslint-disable*/
import { UnixTimestamp,modalMsgHandler,SvgToObj } from './common';
import { getSvg } from '../library/getSvg.js';
import { oneTerm } from '../library/setTerm';
import { now } from 'moment';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_continentsLow from "@amcharts/amcharts4-geodata/continentsLow";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";
import * as am4plugins_bullets from "@amcharts/amcharts4/plugins/bullets"; 
import { googleMapHandler } from '../library/googleMapHandler';
import { leafletMapHandler } from '../library/leafletMapHandler';
import { mapBoxMapHandler } from '../library/mapBoxMapHandler';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.js';

export class DashboardHandler {

    constructor() {
        this.doc = document;
        this.tbody = this.doc.querySelector('#tbody');
        this.pagelist= this.doc.querySelector('#PageList');
        this.col1=this.doc.querySelector('#col1');
        this.col2=this.doc.querySelector('#col2');
        this.col3=this.doc.querySelector('#col3');
        this.filter=this.doc.querySelector('#filter');
        this.company=this.doc.querySelector('#Company');
        this.download=this.doc.querySelector('#download');
        this.companyid=0;
        this.page=1;
        this.sort='PK_StoreID';
        this.arrow='DESC';
        this.langid=1;
        this.colorOnline='#3B82EC';
        this.colorOffline='#D9534F';
        this.colorIdle='#F0AD4E';
        this.chart1;
        this.chart2;
        this.sensorStr='';
       
    }

    setLangID(id){
       
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
        }
    }

    setCompanyId(id){
        this.companyid=id;
    }

      
    
    async getFilterData(companyid){

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/Company`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (res) => {

            res[0].forEach(item => {

                let opt=document.createElement("option");
                opt.text=item.Name;
                opt.value=item.PK_CompanyID;
                if (item.PK_CompanyID==companyid) opt.setAttribute("selected","true");
                $('#Company').append(opt);
          
            });

            this.company.removeEventListener('change', this.changeCompany);
            this.company.addEventListener('change', this.changeCompany.bind(this), false);

        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failedToQueryDataPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });

    }

    changeCompany(){
       
        this.companyid=$('#Company').val();
        let company=$('#Company').val();
        $.cookie("SelectCompany", company);
        this.updateChart1(company);
        this.updateChart2(company);
        this.updateChart3(company);
        this.updateChart4(company);
      
      
    }

  

    showFilter(){
        console.log('toggle filter');
        $('#Company').toggleClass('hidden');
    }

    setFilterButtonClickEvent(){
        this.filter.removeEventListener('click', this.showFilter);
        this.filter.addEventListener('click', this.showFilter.bind(this), false);
    }

    updatePageData(){
        console.log('update Page Data');

        if (this.companyid!=0){
            console.log('getPageDataByCompany')
            this.getPageDataByCompany(this.companyid)
        }else{
            console.log('getPageDataByUser')
            this.getPageDataByUser(this.page,this.sort,this.arrow);
        }
        
    }

    updateChart1(myCompanyID){

         // Create chart instance
        
         var chart1 = am4core.create("chartdiv1", am4charts.PieChart3D);

         const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/ChartData1/${myCompanyID}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {

            let data=response[0];
            let connect=data[0].Connect;
            let lost=data[0].Lost;
            let idle=data[0].Idle;

            chart1.data = [
                {
                    "status": oneTerm(this.langid,'working'),
                    "count": connect,
                    "color": am4core.color(this.colorOnline)
                }, 
                {
                    "status": oneTerm(this.langid,'idle'),
                    "count": idle,
                    "color": am4core.color(this.colorIdle)
                }, 
                {
                    "status": oneTerm(this.langid,'lost'),
                    "count": lost,
                    "color": am4core.color(this.colorOffline)
                }
            ];
            
            chart1.innerRadius = am4core.percent(50);
            var pieSeries = chart1.series.push(new am4charts.PieSeries3D());
            pieSeries.dataFields.value = "count";
            pieSeries.dataFields.category = "status";
            pieSeries.slices.template.propertyFields.fill = "color";
            // pieSeries.slices.template.stroke = am4core.color("#fff");
            // pieSeries.slices.template.strokeWidth = 2;
            // pieSeries.slices.template.strokeOpacity = 1;
            pieSeries.hiddenState.properties.opacity = 1;
            pieSeries.hiddenState.properties.endAngle = -90;
            pieSeries.hiddenState.properties.startAngle = -90;

           
           
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failed')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
    
        });

    }
    
    updateChart2(myCompanyID){
        
        
        this.chart2 = am4core.create("chartdiv2", am4charts.XYChart3D);

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/ChartData2/${myCompanyID}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {

            let data=response[0];
            console.log(data);
            this.chart2.data=data;

            function goStore(ev) {
            
                let obj=ev.target.dataItem.category;
                let storeid=ev.target.dataItem._dataContext.PK_StoreID;
                window.location=`./storeStatus?id=${storeid}`;

            }

            // Create axes
            var categoryAxis = this.chart2.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "Name";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;

            categoryAxis.renderer.labels.template.events.on("hit", goStore);
            categoryAxis.renderer.labels.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
            if (data.length>4){
                categoryAxis.renderer.labels.template.rotation = -45;
                categoryAxis.renderer.labels.template.horizontalCenter = "right";
                categoryAxis.renderer.labels.template.verticalCenter = "middle";
            }
            

            var valueAxis = this.chart2.yAxes.push(new am4charts.ValueAxis());
            //valueAxis.title.text = "各分店感測器摘要";
            valueAxis.renderer.labels.template.adapter.add("text", function(text) {
            return text ;
            });

            // Create series
            var series = this.chart2.series.push(new am4charts.ColumnSeries3D());
            series.dataFields.valueY = "Lost";
            series.dataFields.categoryX = "Name";
            series.name = oneTerm(this.langid,'lost');
            series.clustered = false;
            series.columns.template.tooltipText = `{Name} ${oneTerm(this.langid,'lost')}: [bold]{valueY}[/]`;
            series.columns.template.fillOpacity = 0.5;
            series.columns.template.fill = am4core.color(this.colorOffline);
            series.columns.template.stroke = am4core.color(this.colorOffline);
        
            var series2 = this.chart2.series.push(new am4charts.ColumnSeries3D());
            series2.dataFields.valueY = "Idle";
            series2.dataFields.categoryX = "Name";
            series2.name = oneTerm(this.langid,'idle');
            series2.clustered = false;
            series2.columns.template.tooltipText = `{Name} ${oneTerm(this.langid,'idle')}: [bold]{valueY}[/]`;
            series2.columns.template.fill = am4core.color(this.colorIdle);
            series2.columns.template.stroke = am4core.color(this.colorIdle);

            var series3 = this.chart2.series.push(new am4charts.ColumnSeries3D());
            series3.dataFields.valueY = "Connect";
            series3.dataFields.categoryX = "Name";
            series3.name = oneTerm(this.langid,'working');;
            series3.clustered = false;
            series3.columns.template.tooltipText = `{Name} ${oneTerm(this.langid,'working')}: [bold]{valueY}[/]`;
            series3.columns.template.fill = am4core.color(this.colorOnline);
            series3.columns.template.stroke = am4core.color(this.colorOnline);

           
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failed')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
    
        });

        

    }

    async updateChart3(myCompanyID){
        this.updateChart3_mapbox(myCompanyID);
    }

    async updateChart3_am4chartEarth(myCompanyID){

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/ChartData3/${myCompanyID}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {

            console.log(response);

            var chart3 = am4core.create("map", am4maps.MapChart);
            var interfaceColors = new am4core.InterfaceColorSet();
    
            try {
                chart3.geodata = am4geodata_worldHigh;
            }
            catch (e) {
                chart3.raiseCriticalError(new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."));
            }
    
            // Set projection
            chart3.projection = new am4maps.projections.Orthographic();
            chart3.panBehavior = "rotateLongLat";
            chart3.padding(20,20,20,20);
    
            // Add zoom control
            chart3.zoomControl = new am4maps.ZoomControl();
    
            var homeButton = new am4core.Button();
            homeButton.events.on("hit", function(){
            chart3.goHome();
            });
    
            homeButton.icon = new am4core.Sprite();
            homeButton.padding(7, 5, 7, 5);
            homeButton.width = 30;
            homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
            homeButton.marginBottom = 10;
            homeButton.parent = chart3.zoomControl;
            homeButton.insertBefore(chart3.zoomControl.plusButton);
    
            //chart3.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#bfa58d");
            chart3.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#85C5E3");
            chart3.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;
            chart3.deltaLongitude = 20;
            chart3.deltaLatitude = -20;
    
            // limits vertical rotation
            chart3.adapter.add("deltaLatitude", function(delatLatitude){
                return am4core.math.fitToRange(delatLatitude, -90, 90);
            })
    
            // Create map polygon series
    
            var shadowPolygonSeries = chart3.series.push(new am4maps.MapPolygonSeries());
            shadowPolygonSeries.geodata = am4geodata_continentsLow;
    
            try {
                shadowPolygonSeries.geodata = am4geodata_continentsLow;
            }
            catch (e) {
                shadowPolygonSeries.raiseCriticalError(new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."));
            }
    
            shadowPolygonSeries.useGeodata = true;
            shadowPolygonSeries.dx = 2;
            shadowPolygonSeries.dy = 2;
            shadowPolygonSeries.mapPolygons.template.fill = am4core.color("#000");
            shadowPolygonSeries.mapPolygons.template.fillOpacity = 0.2;
            shadowPolygonSeries.mapPolygons.template.strokeOpacity = 0;
            shadowPolygonSeries.fillOpacity = 0.1;
            shadowPolygonSeries.fill = am4core.color("#000");
    
    
            // Create map polygon series
            
            var polygonSeries = chart3.series.push(new am4maps.MapPolygonSeries());
            polygonSeries.useGeodata = true;
    
            polygonSeries.calculateVisualCenter = true;
            polygonSeries.tooltip.background.fillOpacity = 0.2;
            polygonSeries.tooltip.background.cornerRadius = 20;
    
            var template = polygonSeries.mapPolygons.template;
            template.nonScalingStroke = true;
            template.fill = am4core.color("#f9e3ce");
            template.stroke = am4core.color("#e2c9b0");
    
            polygonSeries.calculateVisualCenter = true;
            template.propertyFields.id = "id";
            template.tooltipPosition = "fixed";
            template.fillOpacity = 1;
    
            template.events.on("over", function (event) {
            if (event.target.dummyData) {
                event.target.dummyData.isHover = true;
            }
            })
            template.events.on("out", function (event) {
            if (event.target.dummyData) {
                event.target.dummyData.isHover = false;
            }
            })
    
            var hs = polygonSeries.mapPolygons.template.states.create("hover");
            hs.properties.fillOpacity = 1;
            hs.properties.fill = am4core.color("#deb7ad");
    
    
            var graticuleSeries = chart3.series.push(new am4maps.GraticuleSeries());
            graticuleSeries.mapLines.template.stroke = am4core.color("#fff");
            graticuleSeries.fitExtent = false;
            graticuleSeries.mapLines.template.strokeOpacity = 0.2;
            graticuleSeries.mapLines.template.stroke = am4core.color("#fff");
    
            var measelsSeries = chart3.series.push(new am4maps.MapPolygonSeries())
            measelsSeries.tooltip.background.fillOpacity = 0;
            measelsSeries.tooltip.background.cornerRadius = 20;
            measelsSeries.tooltip.autoTextColor = false;
            measelsSeries.tooltip.label.fill = am4core.color("#000");
            measelsSeries.tooltip.dy = -5;
    
            var measelTemplate = measelsSeries.mapPolygons.template;
            measelTemplate.fill = am4core.color("#bf7569");
            measelTemplate.strokeOpacity = 0;
            measelTemplate.fillOpacity = 0.75;
            measelTemplate.tooltipPosition = "fixed";
    
            var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";
    
    
            // Create hover state and set alternative fill color
            // var hs = polygonTemplate.states.create("hover");
            // hs.properties.fill = chart.colors.getIndex(0);
    
            // Add image series
            var imageSeries = chart3.series.push(new am4maps.MapImageSeries());
            imageSeries.mapImages.template.propertyFields.longitude = "longitude";
            imageSeries.mapImages.template.propertyFields.latitude = "latitude";
            imageSeries.mapImages.template.tooltipText = "{title}";
            imageSeries.mapImages.template.propertyFields.url = "url";
    
            var circle = imageSeries.mapImages.template.createChild(am4core.Circle);
            circle.radius = 3;
            circle.propertyFields.fill = "color";
            circle.nonScaling = true;
    
            var circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
            circle2.radius = 3;
            circle2.propertyFields.fill = "color";
    
    
            circle2.events.on("inited", function(event){
            animateBullet(event.target);
            })
    
    
            function animateBullet(circle) {
                var animation = circle.animate([{ property: "scale", from: 1 / chart3.zoomLevel, to: 5 / chart3.zoomLevel }, { property: "opacity", from: 1, to: 0 }], 1000, am4core.ease.circleOut);
                animation.events.on("animationended", function(event){
                animateBullet(event.target.object);
                })
            }
    
            var colorSet = new am4core.ColorSet();


            let data=response[0];
            if (data.length>0){
                imageSeries.data=[]
                data.forEach(ele => {
                    let obj={};
                    obj.title=ele.Name;
                    obj.latitude=ele.Lat;
                    obj.longitude=ele.Lng;
                    obj.color=colorSet.next();
                    imageSeries.data.push(obj);
                });
            }

            let animation;
            setTimeout(function(){
                animation = chart3.animate({property:"deltaLongitude", to:100000}, 20000000);
            }, 3000)
    
            chart3.seriesContainer.events.on("down", function(){
                if(animation){
                    animation.stop();
                }
            })

        });


        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failed')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
    
        });


       
        /*
        imageSeries.data = [{
            "title": "忠孝新生",
            "latitude": 25.04257,
            "longitude": 121.53288,
            "color":colorSet.next()
        }, {
            "title": "松江南京",
            "latitude": 25.05222,
            "longitude": 121.53320,
            "color":colorSet.next()
        }, {
            "title": "南港展覽館",
            "latitude": 25.05678,
            "longitude": 121.61812,
            "color":colorSet.next()
        }, {
            "title": "善導寺",
            "latitude": 25.04502,
            "longitude": 121.52340,
            "color": am4core.color("#FF8000") 
        }];

       */
       
    }

    async updateChart3_am4chartbullet(myCompanyID){

        console.log('update chart3')

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/ChartData3/${myCompanyID}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {

            // Create map instance
        this.chart3 = am4core.create("map", am4maps.MapChart);
        this.chart3.geodata = am4geodata_continentsLow;
        this.chart3.projection = new am4maps.projections.Miller();

        // Colors
        var color1 = this.chart3.colors.getIndex(0);

        this.chart3.homeGeoPoint = {
            latitude: 23.5,
            longitude: 121.54
        }
        this.chart3.homeZoomLevel = 10;
        this.chart3.minZoomLevel = 0.75;

        // Create map polygon series
        var polygonSeries = this.chart3.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.exclude = ["antarctica"];
        polygonSeries.useGeodata = true;

        // Configure series
        var polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.fill = am4core.color("#f8f8f8");

        // Add shadow
        var shadow = polygonSeries.filters.push(new am4core.DropShadowFilter());
        shadow.color = am4core.color("#60666b");
        shadow.blur = 0;

        // Pins
        var imageSeries = this.chart3.series.push(new am4maps.MapImageSeries());
        var imageTemplate = imageSeries.mapImages.template;
        imageTemplate.propertyFields.longitude = "longitude";
        imageTemplate.propertyFields.latitude = "latitude";
        imageTemplate.nonScaling = true;

        // Creating a pin bullet
        var pin = imageTemplate.createChild(am4plugins_bullets.PinBullet);
        pin.background.fill = color1;
        pin.background.pointerBaseWidth = 1;
        pin.background.pointerLength = 250;
        pin.background.propertyFields.pointerLength = "length";
        pin.circle.fill = pin.background.fill;
        
        pin.label = new am4core.Label();
        pin.label.text = "{title}";
        pin.label.fill = color1.alternate;
        pin.label.background = color1.alternate;
            console.log(`============================`);
            console.log(response);
            let data=response[0];
            if (data.length>0){
                let i=10;
                imageSeries.data=[]
                data.forEach(ele => {
                    
                    let obj={};
                    obj.title=ele.Name;
                    obj.latitude=ele.Lat;
                    obj.longitude=ele.Lng;
                    obj.value=5,
                    obj.length=i;
                    imageSeries.data.push(obj);
                    //googleMapHandler.addStoreMarker(ele);
                    i=i+40;
                });

                console.log(imageSeries.data)
                //googleMapHandler.fitStoreBounds(data);

            }

        });


        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failed')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
    
        });
        

    }

    async updateChart3_googlemap(myCompanyID){

        await googleMapHandler.initMap({ lat: 23.780117, lng: 121.024735 });

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/ChartData3/${myCompanyID}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {

            console.log(response);
            let data=response[0];
            if (data.length>0){

                data.forEach(ele => {
                    
                    googleMapHandler.addStoreMarker(ele);

                });

                googleMapHandler.fitStoreBounds(data);

            }

        });


        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failed')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
    
        });


    }

    async updateChart3_mapbox(myCompanyID){
        await mapBoxMapHandler.initMap('map',23.780117,121.024735);

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/ChartData3/${myCompanyID}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {

            console.log(response);
            let data=response[0];
            if (data.length>0){

                data.forEach(ele => {
                    
                    mapBoxMapHandler.addStoreMarker(ele);

                });

                mapBoxMapHandler.fitStoreBounds(data);

            }

        });


        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failed')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
    
        });
    }

    updateChart4(myCompanyID){

        console.log('update chart 4')
        
        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/ChartData4/${myCompanyID}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {

            let data=response[0];
         
            if($('.slider-class').hasClass('slick-initialized')) {
                $('.slider-class').slick('unslick');
                $('#MySlider').empty();

            }else{
                $('#MySlider').empty();
            }

            if (data.length>0){

                let i=0;
                let sensorStr='';
                data.forEach(ele => {
                    console.log(ele);
                    i++;
                    let img=document.createElement("img");
                    img.setAttribute("PK_SensorID",ele.PK_SensorID);
                    img.setAttribute("src",`data:image/png;base64,${ele.PIC}`);
                    sensorStr+=ele.PK_SensorID+','                
                    
                    if (ele.StoreID){
                        img.setAttribute("class","slider-image cursor");
                        img.setAttribute("onclick",`location.href = 'sensorStatus?storeid=${ele.StoreID}&sensorid=${ele.PK_SensorID}'`);
                    }
                    
                   
                    let txt=document.createElement("div");
                    txt.setAttribute("class","slider-text ml-1");
                    if (!ele.StoreName) ele.StoreName='N/A';
                    txt.innerHTML= `${ele.StoreName} - ${ele.Name}`

                    let temp=document.createElement("span");
                    temp.setAttribute("id",`sensor_${ele.PK_SensorID}`);
                  
                    let panel=document.createElement("div");
                    panel.setAttribute("class","slider-panel");
                    panel.appendChild(temp);
                    panel.appendChild(txt)
                    
                    let div=document.createElement("div");
                    div.setAttribute("class","slider-container");
                    div.appendChild(img);
                    div.appendChild(panel);
                   

                    $('#MySlider').append(div);

                    this.updateTemp(ele);

                   

                });
                this.sensorStr=sensorStr;

                $('.slider-class').slick({
                    nfinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    centerMode: false,
                    variableWidth: false,
                    autoplay: true,
                    autoplaySpeed: 2000
                });
              
    
            }else{

                let img=document.createElement("img");
                img.setAttribute("src",require('../../assets/image-regular.svg'));
                img.setAttribute("style","width:100%;height:260px");
                $('#MySlider').append(img);
               
               
            }
        
           
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failed')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
    
        });

        

    }
    
    updateTemp(myEle){
        let myObj=this.doc.getElementById(`sensor_${myEle.PK_SensorID}`);
        myObj.setAttribute("class","slider-temp-green");
        let OT=parseFloat(myEle.OT);
        let UT=parseFloat(myEle.UT);

        if (myEle.LastStatus=='Offline'){

            myObj.setAttribute("class","slider-temp-offline");
            myObj.innerHTML= oneTerm(this.langid,'lost');
        } else if (myEle.LastStatus=='Idle'){
            myObj.setAttribute("class","slider-temp-idle");
            myObj.innerHTML= oneTerm(this.langid,'idle');

        }else{

            if (myEle.LastTemp==1849.8){
                myObj.setAttribute("class","slider-temp-yellow");
                myObj.innerHTML= oneTerm(this.langid,'idle');
            }else{
                if (myEle.LastTemp>=OT) myObj.setAttribute("class","slider-temp-red");
                if (myEle.LastTemp<=UT) myObj.setAttribute("class","slider-temp-blue");
                if (myEle.LastTemp){
                    myObj.innerHTML= `${myEle.LastTemp}°C`
                }else{
                    myObj.setAttribute("class","slider-temp-yellow");
                    myObj.innerHTML= 'N/A';
                }
            }

        }
    }
   
    updateChart4Refresh(){

        let sensorStr=this.sensorStr;
        if (sensorStr.length>0){
            sensorStr=sensorStr.substr(0,sensorStr.length-1);
            let data={};
            data.SensorStr=sensorStr;
        
            const promise = $.ajax({
                type: 'POST',
                url: `/StoreAPI/ChartData4Refresh/`,
                async: true,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                },
                data:data,
            });

        promise.done(async (response) => {

            let data=response[0];

            if (data.length>0){

                data.forEach(ele => {
                    this.updateTemp(ele);
                });

            };
            $('.slider-class').slick('refresh');

        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failed')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
    
        });

    }

    }

    

    

}

