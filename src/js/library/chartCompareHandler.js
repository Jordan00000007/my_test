/*eslint-disable*/
import validator from 'validator';
import { modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';
import moment from 'moment';
import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts';
const SimpleHashTable = require('simple-hashtable');




//vue-apexcharts\dist\

export class ChartCompareHandler {

    constructor() {
        this.doc = document;
        this.submit = this.doc.querySelector('#Submit');
        this.title=this.doc.querySelector('#title');
        this.download=this.doc.querySelector('#download');
        this.tbody=this.doc.querySelector('#tbody');
        this.calendar=this.doc.querySelector('#calendar');
        this.datesubmit= this.doc.querySelector('#DateSubmit');
        this.SensorNameSubmit= this.doc.querySelector('#SensorNameSubmit');
        this.SensorNameTitle= this.doc.querySelector('#SensorNameTitle');
        this.upload= this.doc.querySelector('#upload');
        this.btn_t1= this.doc.querySelector('#btn_t1');
        this.btn_t2= this.doc.querySelector('#btn_t2');


        this.add0= this.doc.querySelector('#add0');
        this.add1= this.doc.querySelector('#add1');
        this.add2= this.doc.querySelector('#add2');
        this.add3= this.doc.querySelector('#add3');
        this.add4= this.doc.querySelector('#add4');

        this.remove0= this.doc.querySelector('#remove0');
        this.remove1= this.doc.querySelector('#remove1');
        this.remove2= this.doc.querySelector('#remove2');
        this.remove3= this.doc.querySelector('#remove3');
        this.remove4= this.doc.querySelector('#remove4');

        this.langid=1;
        this.gatewaymac='';
        this.sensormac='';
        this.lasttime='';
        this.vue;
        this.OT='';
        this.UT='';
        this.A;
        this.B;
        this.EXP;
        this.LBATT;
        this.updateArr=[
            {
                name:'溫度0',
                data: []
            },
            {
                name:'溫度1',
                data: []
            },
            {
                name:'溫度2',
                data: []
            },
            {
                name:'溫度3',
                data: []
            },
            {
                name:'溫度4',
                data: []
            },
    ]   ;
        this.maxValue=40;
        this.minValue=-20;
        this.calculate=this.doc.querySelector('#calculate');
        this.companylist0=this.doc.querySelector('#CompanyList0');
        this.sensorlist0=this.doc.querySelector('#SensorList0');
        this.companylist1=this.doc.querySelector('#CompanyList1');
        this.sensorlist1=this.doc.querySelector('#SensorList1');
        this.companylist2=this.doc.querySelector('#CompanyList2');
        this.sensorlist2=this.doc.querySelector('#SensorList2');
        this.companylist3=this.doc.querySelector('#CompanyList3');
        this.sensorlist3=this.doc.querySelector('#SensorList3');
        this.companylist4=this.doc.querySelector('#CompanyList4');
        this.sensorlist4=this.doc.querySelector('#SensorList4');
       
        //'#144BA6','#006030','#FF8000','#EA0000','#4B0091'

        this.color_blue='#144BA6';
        this.color_green='#006030';
        this.color_yellow='#FF8000';
        this.color_red='#EA0000';
        this.color_purple='#4B0091';
        this.colorArray= [this.color_blue,this.color_green,this.color_yellow,this.color_red,this.color_purple];

      
    }

    setLangId(id){
       
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
        }
    }

   

    getSensorConfig(mac){

        const data={}
        data.SensorMacArr=mac;

        this.sensormac=mac;

        console.log(mac)

        const promise = $.ajax({
            type: 'POST',
            url: `/StoreAPI/SensorConfigCore`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data,
        });

        promise.done(async (response) => {

            console.log("get sensor config:");
           
            if (response){

                let data={};
                data.A=response[0].A;
                data.B=response[0].B;
                data.LBATT=response[0].LBATT;
                data.EXP=response[0].EXP;
                data.OT=response[0].OT;
                data.UT=response[0].UT;
               
                $('#Par_A1').val(response[0].A);
                $('#Par_B1').val(response[0].B);
                
                this.A=response[0].A;
                this.B=response[0].B;
                this.OT=response[0].OT;
                this.UT=response[0].UT;
                this.LBATT=response[0].LBATT;
                this.EXP=response[0].EXP;

                console.log(data);
               

            }else{

                $('#Par_A1').val('');
                $('#Par_B1').val('');

                modalMsgHandler('modal', 1, '查無偵測器設定值').then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });

            }



            let d1=$('#Filter1').attr('bdt');
            let d2=$('#Filter1').attr('edt');
            var startTs=moment(d1, "YYYY-MM-DD HH:mm:ss").unix();
            var endTs=moment(d2, "YYYY-MM-DD HH:mm:ss").unix();
            let sensormac=$('#SensorList').val();
            this.getSensorData(sensormac,startTs,endTs);
           
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, '偵測器設定值查詢失敗,請聯絡管理員').then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });

    }

    
    getSensorData(mac,startTs,endTs,myID){

        let theID=parseInt(myID);

        console.log('接收資料開始=>'+moment().format("HH:mm:ss"));
        console.log(this.updateArr);

        this.lasttime=endTs;

        const data={};
        data.MacArr=mac;
        data.startTs=startTs;
        data.endTs=endTs;

        console.log(data)

        const promise = $.ajax({
            type: 'POST',
            url: `/StoreAPI/SensorTelemetry`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data:data,
        });

        promise.done(async (response) => {

            //console.log("get sensor data count :"+response[0].data.length); 

            console.log('接收資料完成=>'+moment().format("HH:mm:ss"));

            console.log(response)

            console.log(this.OT)
            console.log(this.UT)

            let maxValue='';
            if (this.OT) maxValue=this.OT;
            let minValue='';
            if (this.UT) minValue=this.UT;

            if (response){
               
                
                if (response.length>0){

                    // this.updateArr[0].data=[];
                    // this.updateArr[0].name=oneTerm(this.langid,'temp');

                    console.log('startTs=>'+startTs);
                    console.log('endTs=>'+endTs);
                    console.log('資料處理開始=>'+moment().format("HH:mm:ss"));

                    let TargetArr=[];
                    console.log(response[0].ts)
                    let bdate=moment.unix(response[0].ts).format("YYYY-MM-DD");
                    console.log(bdate);
                    bdate=moment(`${bdate} 00:00:00`).unix();
                    for (let i=startTs;i<=(endTs+1);i=i+60){
                        TargetArr.push([i,null]);
                    }
                    
                    

                    let DataHash=new SimpleHashTable();
                    response.forEach(ele => {

                        let temp=(ele.TEMP).toFixed(1);

                        if (ele.TEMP!='18498'){

                            if (maxValue=='') maxValue=temp;
                            if (minValue=='') minValue=temp;
                            if (parseFloat(temp)>parseFloat(maxValue)) maxValue=temp;
                            if (parseFloat(temp)<parseFloat(minValue)) minValue=temp;

                            // console.log('temp='+temp)
                            // console.log('maxValue='+maxValue)
                            // console.log('minValue='+minValue)
                            
                            let idate=moment.unix(ele.ts).format("YYYY-MM-DD HH:mm");
                            idate=moment(`${idate}:00`).unix();
                            DataHash.put(idate,temp);
                            
                        
                        }
                    
                    });

                    this.updateArr[theID].data=[];
                    TargetArr.forEach(ele=>{
                        
                        let temp=DataHash.get(ele[0]);
                        if (temp==-1) {
                            temp=null
                        }else{
                            temp=parseFloat(temp);
                        }
                        ;
                        this.updateArr[theID].data.push([ele[0]*1000,temp]); 
                    });

                    console.log('資料處理完成=>'+moment().format("HH:mm:ss"));
                    console.log(this.updateArr)

                   

                    console.log('maxValue='+maxValue)
                    console.log('minValue='+minValue)
                    if ((maxValue+5)>this.maxValue){
                        this.maxValue=parseFloat(maxValue)+5;
                    }
                    if ((minValue-5)<this.minValue){
                        this.minValue=parseFloat(minValue)-5;
                    }
                   
                    
                    console.log('maxValue='+this.maxValue)
                    console.log('minValue='+this.minValue)
                    
                    //this.getSensorEvent(mac,startTs,endTs);

                    let opt={}
                    opt.yaxis={
                        min:parseFloat(this.minValue),
                        max:parseFloat(this.maxValue),
                    }
                    opt.series=this.updateArr;
                    this.vue.$refs.chart.updateOptions(
                        opt
                    )
                    
                   // this.vue.$refs.chart.updateSeries(this.updateArr);
                    
                }else{
                    modalMsgHandler('modal', 1, oneTerm(this.langid,'queryNoData')).then((timeout) => {
                        $('#modal').modal('show');
                        setTimeout(()=>{ 
                            $('#modal').modal('hide');
                            $('#modal').remove();
                        }, timeout);
                        
                    });
                };
    
            
            }else{
                console.log('回應值為空');
                this.updateArr[theID].data=[];
                this.vue.$refs.chart.updateSeries(this.updateArr);
                //this.getSensorEvent(mac,startTs,endTs);
                modalMsgHandler('modal', 1, oneTerm(this.langid,'queryNoData')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });
            }

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

    JsonSort(json,key){
        //console.log(json);
        for(var j=1,jl=json.length;j < jl;j++){
            var temp = json[j],
                val  = temp[key],
                i    = j-1;
            while(i >=0 && json[i][key]>val){
                json[i+1] = json[i];
                i = i-1;   
            }
            json[i+1] = temp;
    
        }
        //console.log(json);
        return json;
    
    }

    exportExcel(jsonData,begStr,endStr){
        const xlsx = require('xlsx');
        // 將資料轉成workSheet
        //let arrayWorkSheet = xlsx.utils.aoa_to_sheet(arrayData);
        let jsonWorkSheet = xlsx.utils.json_to_sheet(jsonData[0].data);


        let TargetObject={"感測器名稱":this.sensorname,"MAC":this.sensormac};
        let TargetArr=[];
        TargetArr.push(TargetObject);
        
        let jsonWorkSheet2 = xlsx.utils.json_to_sheet(TargetArr);
        // console.log(arrayWorkSheet);
        // console.log(jsonWorkSheet);
        // 構造workBook
        let workBook = {
        SheetNames: ['溫度資料','基本資料'],
        Sheets: {
            '溫度資料': jsonWorkSheet,
            '基本資料': jsonWorkSheet2,
        }
        };
        // 將workBook寫入檔案
        xlsx.writeFile(workBook, `${this.sensorname} #${begStr} #${endStr}.xlsx`);
    }

    getDownloadData(){

        console.log('接收資料開始=>'+moment().format("HH:mm:ss"));
        const xlsx = require('xlsx');

        let dataArr=[[],[],[],[],[]];
        let i=0;
        this.updateArr.forEach(ele=>{
            ele.data.forEach(item=>{
                //console.log(item)
                let TargetJson={};
                if (item[1]){

                    let timeStr=moment.unix(item[0]/1000).format("YYYY-MM-DD HH:mm:ss");
                    TargetJson=`{"${oneTerm(this.langid,'time')}":"","${oneTerm(this.langid,'temperature')}":""}`;
                    TargetJson=JSON.parse(TargetJson);
                    TargetJson[oneTerm(this.langid,'time')]=timeStr;
                    TargetJson[oneTerm(this.langid,'temperature')]=item[1];
                    dataArr[i].push(TargetJson);
                }
            });
            i++;
        });


      
        let jsonWorkSheet0 = xlsx.utils.json_to_sheet(dataArr[0]);
        let jsonWorkSheet1 = xlsx.utils.json_to_sheet(dataArr[1]);
        let jsonWorkSheet2 = xlsx.utils.json_to_sheet(dataArr[2]);
        let jsonWorkSheet3 = xlsx.utils.json_to_sheet(dataArr[3]);
        let jsonWorkSheet4 = xlsx.utils.json_to_sheet(dataArr[4]);


      
        
      
        // 構造workBook
        let workBook = {
        SheetNames: ['#0','#1','#2','#3','#4'],
        Sheets: {
            '#0' : jsonWorkSheet0,
            '#1' : jsonWorkSheet1,
            '#2' : jsonWorkSheet2,
            '#3' : jsonWorkSheet3,
            '#4' : jsonWorkSheet4,
        }
        };
        // 將workBook寫入檔案
        xlsx.writeFile(workBook, `download.xlsx`);


        /*
        this.lasttime=endTs;

        const data={};
        data.MacArr=mac;
        data.startTs=startTs;
        data.endTs=endTs;

        const promise = $.ajax({
            type: 'POST',
            url: `/StoreAPI/SensorDataCore`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data:data,
        });

        promise.done(async (response) => {

            console.log('接收資料完成=>'+moment().format("HH:mm:ss"));

            
            let TargetArr=[];

            if (response){
                if (response.length>0){
                
                    if (response[0].data.length>0){
    
                        console.log('startTs=>'+startTs);
                        console.log('endTs=>'+endTs);

                        console.log('資料處理開始=>'+moment().format("HH:mm:ss"));

                      
                        response[0].data.forEach(ele => {

                            if (ele.TEMP!='18498'){                                
                                let idate=moment.unix(ele.ts).format("YYYY-MM-DD HH:mm:ss");
                                let temp=(ele.TEMP/10).toFixed(1);
                                //TargetArr.push(idate,temp);
                                let TargetJson={"時間":idate,"溫度":parseFloat(temp)};
                                TargetArr.push(TargetJson);
                            }
                        
                        });
    
                       

                        console.log('資料處理完成=>'+moment().format("HH:mm:ss"));
                        console.log(TargetArr);

                        let SortArr=this.JsonSort(TargetArr,'時間');

                        let strBeg=moment(startTs*1000).format('YYYY-MM-DD');
                        let strEnd=moment(endTs*1000).format('YYYY-MM-DD');

                        this.exportExcel(SortArr,strBeg,strEnd);
    
                        
    
                       
                    }else{
                        console.log('本日無資料')
                    }
    
                }
                
            }else{
                console.log('回應值為空');
               
            }

           
           
            //this.setMqtt(this.sensormac,this.gatewaymac,this.vue,this.updateArr,this.OT,this.UT);


        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, '查詢最近偵測器資料失敗,請聯絡管理員').then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });

        */

    }

    getAvg(chartContext, { xaxis, yaxis }){
        console.log('get avg');
        let min=Math.round(xaxis.min/1000);
        let max=Math.round(xaxis.max/1000);
        console.log(moment(min).format('YYYY-MM-DD HH:mm:ss'));
        console.log(moment(max).format('YYYY-MM-DD HH:mm:ss'));
        console.log($('#SensorList').val());
        const data={};
        data.MacArr=$('#SensorList').val();
        data.startTs=min;
        data.endTs=max;

        console.log(data)

        const promise = $.ajax({
            type: 'POST',
            url: `/StoreAPI/SensorDataCore`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data:data,
        });

        promise.done(async (response) => {

            //console.log("get sensor data count :"+response[0].data.length); 

            console.log('接收資料完成=>'+moment().format("HH:mm:ss"));
            

            let myAvg=0;
            let myCounter=0;

            if (response){
                if (response.length>0){
                
                    if (response[0].data.length>0){
    
                      
                        response[0].data.forEach(ele => {

                            let temp=(ele.TEMP/10).toFixed(1);

                            //console.log('temp='+temp)
    
                            if (ele.TEMP!='18498'){

                                myAvg+=parseFloat(temp);
                                myCounter++;

                            }
                            //console.log('myAvg='+myAvg)
                        
                        });
    
                        myAvg=(myAvg/myCounter).toFixed(1);

                        console.log('資料處理完成=>'+moment().format("HH:mm:ss"));
                        console.log(myAvg);

                        if ($('#btn_t1').hasClass('msg-green')){
                            $('#Par_T1').val(myAvg);
                            $('#btn_t1').removeClass('msg-green');
                            $('#btn_t1').addClass('msg-red');
                        } 
                        if ($('#btn_t2').hasClass('msg-green')) {
                            $('#Par_T2').val(myAvg);
                            $('#btn_t2').removeClass('msg-green');
                            $('#btn_t2').addClass('msg-red');
                        }

                      
                        
                    }else{
                        console.log('本日無資料')
                    }
    
                }
            }else{
                console.log('回應值為空');
             
                modalMsgHandler('modal', 1, oneTerm(this.langid,'queryNoData')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });
            }

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


    getSensorEvent(mac,startTs,endTs){

        console.log(mac)
        console.log(startTs)
        console.log(endTs)

        const data={};
        data.MacArr=mac;
        data.startTs=startTs;
        data.endTs=endTs;
        data.Keys='0';

        let eventArr=[];

        const promise = $.ajax({
            type: 'POST',
            url: `/StoreAPI/SensorEventLogCore`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data:data,
        });

        promise.done(async (response) => {

            

            
                //console.log("get Sensor Event Count :"+response.length); 
                if (response){

                    if (response.length>0){
                            response.forEach(ele => {
                               
                                if ((ele.eventId=='SWITCH')&&(ele.eventValue=='1')){
                                    eventArr.push(
                                        {
                                            x: ele.ts*1000,
                                            strokeDashArray: 0,
                                            borderColor: "#808040",
                                            label: {
                                                borderColor: "#808040",
                                                style: {
                                                    color: "#fff",
                                                    background: "#808040"
                                                },
                                                orientation: "horizontal",
                                                text: 'ON'
                                            }
                                        });
                                }

                                if ((ele.eventId=='SWITCH')&&(ele.eventValue=='0')){
                                    eventArr.push(
                                        {
                                            x: ele.ts*1000,
                                            strokeDashArray: 0,
                                            borderColor: "#408080",
                                            label: {
                                                borderColor: "#408080",
                                                style: {
                                                    color: "#fff",
                                                    background: "#408080"
                                                },
                                                orientation: "horizontal",
                                                offsetX: 0,
                                                offsetY: 20,
                                                text: 'OFF'
                                            }
                                        });
                                }

                            });

                            // console.log("noteArr");
                            // console.log(noteArr);

                            //this.vue.$refs.chart.options.point.push(eventArr);
                    }

                }

                console.log("min and max")
                console.log("min="+this.minValue)
                console.log("max="+this.maxValue)
                console.log("OT="+this.OT)
                console.log("UT="+this.UT)

                let opt={}
                if ((this.minValue)&&(this.maxValue)){
                    opt.yaxis={
                            min:parseFloat(this.minValue),
                            max:parseFloat(this.maxValue),
                        }
                }
                opt.annotations={
                    yaxis: [
                        {
                            y: this.OT,
                            strokeDashArray: 5,
                            borderColor: "#01814A",
                            label: {
                                borderColor: "#01814A",
                                style: {
                                    color: "#fff",
                                    background: "#01814A"
                                },
                                text: "OT"
                            }
                        },
                        {
                            y: this.UT,
                            strokeDashArray: 5,
                            borderColor: "#9F35FF",
                            label: {
                            borderColor: "#9F35FF",
                            style: {
                                color: "#fff",
                                background: "#9F35FF"
                            },
                            text: "UT",
                            textAnchor: 'end',
                            }
                        }
                    ],
                    xaxis:eventArr
                },

                
                this.vue.$refs.chart.updateOptions(
                   opt
                )

                        // this.vue.$refs.chart.updateSeries(this.updateArr);
                    

                

            
            
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

   
    checkSensorStatus(){
        console.log('checkSensorStatus');
        const promise = $.ajax({
            type: 'GET',
            url: `/DeviceAPI/Sensor/${this.storeid}/${this.sensorid}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {
            
            console.log("get data:");
            console.log(response[1][0].StatusName);
            console.log(response[1][0].StatusCode);

            //SensorStatus
            if (response[1][0].StatusCode=='0'){
                //遺失
                $('#SensorStatus').html(`<span class="msg-warnning">${response[1][0].StatusName}</sapn>`);
            }else if (response[1][0].StatusCode=='3'){
                // 閒置
                $('#SensorStatus').html(`<span class="msg-yellow">${response[1][0].StatusName}</sapn>`);
            }else{
                // 工作中
                $('#SensorStatus').html(`${response[1][0].StatusName}`);
            }
            
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

    setChartInit(){

        let cdt=moment().format("YYYY-MM-DD");
        var u1=moment(`${cdt} 00:00:00`, "YYYY-MM-DD HH:mm:ss").unix();
        var u2=moment(`${cdt} 23:59:59`, "YYYY-MM-DD HH:mm:ss").unix();

        console.log('drawChart');
        console.log(u1);
        console.log(u2);

       
        Vue.use(VueApexCharts)
        Vue.component('apexchart', VueApexCharts)

        this.vue=new Vue({
            el: '#app1',
            components: {
              apexchart: VueApexCharts,
            },
            data: {
              
                series: 
                [
                    {
                        name: "溫度0",
                        data: []
                    },
                    {
                        name: "溫度1",
                        data: []
                    },
                    {
                        name: "溫度2",
                        data: []
                    },
                    {
                        name: "溫度3",
                        data: []
                    },
                    {
                        name: "溫度4",
                        data: []
                    },
                ],
            
                chartOptions: {
                    chart: {
                        id: 'realtime',
                        height: 250,
                        type: 'line',
                        animations: {
                            enabled: false,
                            easing: 'smooth',
                            dynamicAnimation: {
                            speed: 1000
                            }
                        },
                        toolbar: {
                            show: false
                        },
                        zoom: {
                            enabled: false
                        },
                        selection: {
                            enabled: true,
                            type: 'x'
                        },
                        events: {
                       
                        },
                        offsetX: 0,
                        zoom: {
                            enabled: true,
                            type: 'x',  
                            autoScaleYaxis: false,  
                            zoomedArea: {
                            fill: {
                                color: '#90CAF9',
                                opacity: 0.4
                            },
                            stroke: {
                                color: '#0D47A1',
                                opacity: 0.4,
                                width: 1
                            }
                            }
                        },
                        toolbar: {
                            show: true,
                            offsetX: 0,
                            offsetY: 0,
                            tools: {
                                download: true,
                                selection: true,
                                zoom: true,
                                zoomin: true,
                                zoomout: true,
                                pan: true,
                                reset: true | '<img src="/static/icons/reset.png" width="20">',
                            
                            },
                        },
                    },
                    dataLabels: {
                    enabled: false,
                    },
                    stroke: {
                        curve: 'smooth',
                        width: [2, 2, 2],
                        dashArray: [0, 5, 5],
                        colors: this.colorArray
                    },
                    markers: {
                        size: [2,0,0],
                        colors: this.colorArray,
                        strokeColors: '#fff',
                        strokeWidth: 0,
                    },         
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            // format: 'HH:mm',
                            formatter: function (value, timestamp) {
                                return moment(value).format("HH:mm") // The formatter function overrides format property
                            },
                        },
                        // title: {
                        //     text: '時間',
                        //     style: {fontSize:'18px',fontWeight:'400',fontFamily: 'Noto Sans TC'},
                        //     offsetY: 15,
                        //     offsetX: 0,
                        // },
                        tickAmount: 12,
                    },
                    yaxis: {
                        // title: {
                        //     text: '',
                        //     style: {fontSize:'20px',fontWeight:'light',fontFamily: 'Noto Sans TC'},
                        //     rotate: 0,
                        //     offsetX: 0,
                        //     offsetY: 0,
                            
                        // },
                        labels: {
                            rotate:0,
                        },
                        min:this.minValue,
                        max:parseFloat(this.maxValue+5),
                    
                    },
                    grid: {
                        // padding: {
                        //     top: 0,
                        //     right: 0,
                        //     bottom: 0,
                        //     left: 0
                        // },  
                    },   
                
                    annotations:{
                        xaxis: [],    
                    },
                    tooltip: {
                        x: {
                        //   format: "YYYY-MM-DD HH:mm:ss"
                        formatter: function (value, timestamp) {
                            return moment(value).format("MM-DD HH:mm") // The formatter function overrides format property
                        },
                        }
                    },
                    colors:[this.color_blue,this.color_green,this.color_yellow,this.color_red,this.color_purple]
              
            },
           
        }
        })

       
        //this.getSensorData(SensorMac,u1,u2);

        
    }


    showModal(){

        console.log('showModal');
        $('#DateTimeDialog').modal('show');

    }

    dateSubmit(){
        console.log('dateSubmit');
        
        let d1=$('#datetimepicker1').datetimepicker('viewDate').format('YYYY-MM-DD');
        let d2=$('#datetimepicker2').datetimepicker('viewDate').format('YYYY-MM-DD');

        $('#Filter1').val(`${d1} - ${d2}`);
        $('#Filter1').attr('title',`${d1} - ${d2}`);

        d1=d1+' 00:00:00';
        d2=d2+' 23:59:59';


        $('#Filter1').attr('bdt',d1);
        $('#Filter1').attr('edt',d2);
       
        $('#DateTimeDialog').modal('hide');

        var startTs=moment(d1, "YYYY-MM-DD HH:mm:ss").unix();
        var endTs=moment(d2, "YYYY-MM-DD HH:mm:ss").unix();


        console.log(this.sensormac)
        console.log(startTs)
        console.log(endTs)
        this.getSensorData(this.sensormac,startTs,endTs);

       
    }

    toggleConfig(){
        console.log('toggleConfig');
        $('#ConfigDialog').modal('show');
    }

    downloadData(){

        // console.log('download data...');

        // let d1=$('#Filter1').attr('bdt');
        // let d2=$('#Filter1').attr('edt');
        // var startTs=moment(d1, "YYYY-MM-DD HH:mm:ss").unix();
        // var endTs=moment(d2, "YYYY-MM-DD HH:mm:ss").unix();

        // let data={};
        // data.sensormac=this.sensormac;
        // data.startTs=startTs;
        // data.endTs=endTs;

        // console.log(data);

        this.getDownloadData();

    }

    uploadConfig(){
        console.log('upload Config...');

        const data={};
        data.deviceId=this.sensormac;
        data.A=parseFloat($('#Par_A2').val());
        data.B=parseFloat($('#Par_B2').val());


        if ((isNaN(data.A))||(isNaN(data.B))){

            modalMsgHandler('modal', 1, oneTerm(this.langid,'parameterFormatError')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });

            return 
        }
     

        const promise = $.ajax({
            type: 'PATCH',
            url: `/StoreAPI/SensorConfigCore/${this.sensormac}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data:data,
        });

        promise.done(async (response) => {
            
            $('#ConfigDialog').modal('hide');
            modalMsgHandler('modal', 0, oneTerm(this.langid,'updateCompleted')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });
           
            
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'updateFailedPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });

    }

    

    setCalculate(){

        console.log('calculate');
        let A1=parseFloat($('#Par_A1').val());
        let B1=parseFloat($('#Par_B1').val());
        let T1=parseFloat($('#Par_T1').val());
        let T2=parseFloat($('#Par_T2').val());
        let V1=(T1-B1)/A1;
        let V2=(T2-B1)/A1;
        let T3=parseFloat($('#Par_T3').val());
        let T4=parseFloat($('#Par_T4').val());
        let A2=(T4-T3)/(V2-V1);
        let B2=((V1*T4)-(V2*T3))/(V1-V2);
        let data={};
        data.A1=A1;
        data.B1=B1;
        data.T1=T1;
        data.T2=T2;
        data.T3=T3;
        data.T4=T4;
        data.A2=A2;
        data.B2=B2;

        console.log(data)
       
        $('#Par_A2').val(A2.toFixed(5))
        $('#Par_B2').val(B2.toFixed(5))
    }

    changeSensor(){
       
        
        this.sensormac=$('#SensorList').val();
        this.sensorname=$('#SensorList :selected').text();
        this.getSensorConfig(this.sensormac);
 
    }

    setSensorList(CompanyID,myID){
        
        $(`#SensorList${myID}`).empty();

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/SensorListByCompany/${CompanyID}`,
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
                opt.text=item.Name?item.Name:(item.MAC).slice(-4);
                opt.value=item.MAC;   
                $(`#SensorList${myID}`).append(opt);
          
            });

           
            // let sensormac=$('#SensorList').val();
            // this.sensormac=sensormac;
            // this.sensorname=$('#SensorList :selected').text();            
            //this.changeSensor();
        
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

    changeCompany(evt){
       
        let myID=evt.currentTarget.myID

        console.log(`myID=${myID}`)
        let companyID=$(`#CompanyList${myID}`).val();
       
        this.setSensorList(companyID,myID);
 
    }

    addChart(evt){
       
        let myID=evt.currentTarget.myID;
        console.log(`--- myID=${myID}`)
        console.log($(`#SensorList${myID}`))
        let SensorMac=$(`#SensorList${myID}`).val();
        console.log(`--- SensorMac=${SensorMac}`)
        let d1=$('#Filter1').attr('bdt');
        let d2=$('#Filter1').attr('edt');
        var startTs=moment(d1, "YYYY-MM-DD HH:mm:ss").unix();
        var endTs=moment(d2, "YYYY-MM-DD HH:mm:ss").unix();
        this.getSensorData(SensorMac,startTs,endTs,myID);
 
    }

    removeChart(evt){
       
        let myID=evt.currentTarget.myID;
        console.log(`remove chart no. ${myID}`);

        this.updateArr[myID].data=[];

        let opt={}
        opt.series=this.updateArr;
        this.vue.$refs.chart.updateOptions(
            opt
        )
 
    }

    setCompanyList(){

        console.log('set Company List');
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
                $('#CompanyList0').append(opt);
    
            });

            res[0].forEach(item => {

                let opt=document.createElement("option");
                opt.text=item.Name;
                opt.value=item.PK_CompanyID;   
                $('#CompanyList1').append(opt);
    
            });

            res[0].forEach(item => {

                let opt=document.createElement("option");
                opt.text=item.Name;
                opt.value=item.PK_CompanyID;   
                $('#CompanyList2').append(opt);
    
            });

            res[0].forEach(item => {

                let opt=document.createElement("option");
                opt.text=item.Name;
                opt.value=item.PK_CompanyID;   
                $('#CompanyList3').append(opt);
    
            });

            res[0].forEach(item => {

                let opt=document.createElement("option");
                opt.text=item.Name;
                opt.value=item.PK_CompanyID;   
                $('#CompanyList4').append(opt);
    
            });

            this.companylist0.removeEventListener('change', this.changeCompany);
            this.companylist0.addEventListener('change', this.changeCompany.bind(this), false);
            this.companylist0.myID='0';

            this.companylist1.removeEventListener('change', this.changeCompany);
            this.companylist1.addEventListener('change', this.changeCompany.bind(this), false);
            this.companylist1.myID='1';

            this.companylist2.removeEventListener('change', this.changeCompany);
            this.companylist2.addEventListener('change', this.changeCompany.bind(this), false);
            this.companylist2.myID='2';

            this.companylist3.removeEventListener('change', this.changeCompany);
            this.companylist3.addEventListener('change', this.changeCompany.bind(this), false);
            this.companylist3.myID='3';

            this.companylist4.removeEventListener('change', this.changeCompany);
            this.companylist4.addEventListener('change', this.changeCompany.bind(this), false);
            this.companylist4.myID='4';

            this.setSensorList($('#CompanyList0').val(),'0');
            this.setSensorList($('#CompanyList1').val(),'1');
            this.setSensorList($('#CompanyList2').val(),'2');
            this.setSensorList($('#CompanyList3').val(),'3');
            this.setSensorList($('#CompanyList4').val(),'4');
            
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

   

    setCalendarButtonClickEvent(){
        this.calendar.removeEventListener('click', this.showModal);
        this.calendar.addEventListener('click', this.showModal.bind(this), false);
    }

    setDateSubmitButtonClickEvent(){
        this.datesubmit.removeEventListener('click', this.dateSubmit);
        this.datesubmit.addEventListener('click', this.dateSubmit.bind(this), false);
    }

    setDownloadButtonClickEvent(){
        this.download.removeEventListener('click', this.downloadData);
        this.download.addEventListener('click', this.downloadData.bind(this), false);

    }

    setUploadConfigButtonClickEvent(){
        this.upload.removeEventListener('click', this.uploadConfig);
        this.upload.addEventListener('click', this.uploadConfig.bind(this), false);

    }

    setCalculateButtonClickEvent(){
        this.calculate.removeEventListener('click', this.setCalculate);
        this.calculate.addEventListener('click', this.setCalculate.bind(this), false);
    }


    setButtonClickEvent(){

        this.add0.removeEventListener('click', this.addChart);
        this.add0.addEventListener('click', this.addChart.bind(this), false);
        this.add0.myID='0';

        this.add1.removeEventListener('click', this.addChart);
        this.add1.addEventListener('click', this.addChart.bind(this), false);
        this.add1.myID='1';

        this.add2.removeEventListener('click', this.addChart);
        this.add2.addEventListener('click', this.addChart.bind(this), false);
        this.add2.myID='2';

        this.add3.removeEventListener('click', this.addChart);
        this.add3.addEventListener('click', this.addChart.bind(this), false);
        this.add3.myID='3';

        this.add4.removeEventListener('click', this.addChart);
        this.add4.addEventListener('click', this.addChart.bind(this), false);
        this.add4.myID='4';

        this.remove0.removeEventListener('click', this.removeChart);
        this.remove0.addEventListener('click', this.removeChart.bind(this), false);
        this.remove0.myID='0';

        this.remove1.removeEventListener('click', this.removeChart);
        this.remove1.addEventListener('click', this.removeChart.bind(this), false);
        this.remove1.myID='1';

        this.remove2.removeEventListener('click', this.removeChart);
        this.remove2.addEventListener('click', this.removeChart.bind(this), false);
        this.remove2.myID='2';

        this.remove3.removeEventListener('click', this.removeChart);
        this.remove3.addEventListener('click', this.removeChart.bind(this), false);
        this.remove3.myID='3';

        this.remove4.removeEventListener('click', this.removeChart);
        this.remove4.addEventListener('click', this.removeChart.bind(this), false);
        this.remove4.myID='4';

      
    }
    
}

