/*eslint-disable*/
import validator from 'validator';
import { modalMsgHandler,SvgToObj,UnixTimestamp,UnixTimestampFormat } from './common';
import { getSvg } from '../library/getSvg.js';
import { oneTerm } from '../library/setTerm';

import 'textillate/jquery.textillate.js';
import 'textillate/assets/jquery.fittext.js';
import 'textillate/assets/jquery.lettering.js';
import 'textillate/assets/animate.css';

import moment from 'moment';
import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts';
//import { reduce } from 'core-js/fn/array';
var mqtt=require('mqtt');
const SimpleHashTable = require('simple-hashtable');



//vue-apexcharts\dist\

export class SensorStatusHandler {

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
        this.upload= this.doc.querySelector('#UploadConfig');
        this.sensorConfigList=this.doc.querySelector('#SensorConfigList');
        this.groupid='';
        this.langid=1;
        this.storeid=0;
        this.sensorid=0;
        this.storename='';
        this.sensorname='';
        this.gatewaymac='';
        this.sensormac='';
        this.lasttime='';
        this.vue;
        this.OT='';
        this.UT='';
        this.updateArr=[{
            name: '',
            data: []
        }];
        this.maxValue='';
        this.minValue='';
        this.setExpired='';
        
       
      
    }

    

    setLangId(id){
       
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
        }
    }

    setStoreId(id){
        this.storeid=id;
    }

    setGroupId(id){
        this.groupid=id;
    }

    setStoreName(name){
        this.storename=name;
    }

    setSensorId(id){
        this.sensorid=id;
    }

    setSensorName(name){
       this.sensorname=name;
    }

    editName(event){
        console.log('editName =>'+this.sensorid);
        console.log(event.target);
        $('#EditSensorName').modal('show');
        $('#SensorName').val(this.sensorname);
       
    }

    setUpdateStr(id,str,style){

        $(id).attr("style",style);  
        $(id).text(str);

    }

    getSensorStatus(mac){

        
        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/SensorStatus/${mac}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {

            console.log('sensor status')
            console.log(response)
              
            this.OT=response[0].OT;
            this.UT=response[0].UT;

            //let diffSec=(moment(response[0].LastDateTime).unix()+(response[0].INACTION*60))-moment().unix();

            if (response[0].LastLost=='1'){
                $('#SensorStatus').html(`<span class="msg-warnning">${oneTerm(this.langid,'lost')}</span>`);
            }else{
                if (response[0].LastTemp>1840){
                    //Idle
                    $('#SensorStatus').html(`<span class="msg-yellow">${oneTerm(this.langid,'idle')}</span>`);
                }else{
                    //Online
                    $('#SensorStatus').html(`${oneTerm(this.langid,'working')}`);
                }
            }

            // if (diffSec>=0){
            //     // Online or Idel
            //     if (response[0].LastTemp>1840){
            //         //Idle
            //         $('#SensorStatus').html(`<span class="msg-yellow">${oneTerm(this.langid,'idle')}</span>`);
            //     }else{
            //         //Online
            //         $('#SensorStatus').html(`${oneTerm(this.langid,'working')}`);
            //     }

            // }else{
            //     // Offline
            //     $('#SensorStatus').html(`<span class="msg-warnning">${oneTerm(this.langid,'lost')}</span>`);
            // }

            
            // 更新溫度欄位
            if (response[0].LastTemp){
                let temp='N/A';
                let dt='';
                if(response[0].LastTemp<1840){
                    temp=response[0].LastTemp;
                    dt=moment(response[0].LastDateTime).format('YYYY-MM-DD HH:mm:ss');
                }else{
                    if (response[0].LastTemp2){
                        temp=response[0].LastTemp2;
                        dt=moment(response[0].LastDateTime2).format('YYYY-MM-DD HH:mm:ss');
                    }else{
                        temp='N/A';
                    }
                   
                }
                if (temp!='N/A'){
                    let bg='#01B468';
                    if (parseFloat(temp)> parseFloat(this.OT)) bg='#CE0000';
                    if (parseFloat(temp)< parseFloat(this.UT)) bg='#0066CC';
                    this.setUpdateStr('#SensorTemp',temp+'°C',`background-color:${bg};color:white;border-radius:5px;padding:2px 8px 5px;`);
                    if (dt!=''){
                        $('#SensorTemp').attr('title',dt);
                        $('#SensorTemp').attr('data-original-title',dt);
                        $('#SensorTemp').attr('data-html','true');
                        $('#SensorTemp').attr('rel','tooltip');

                        
                    }
                }else{
                    this.setUpdateStr('#SensorTemp','N/A','');
                }
                
                

            }else{
                this.setUpdateStr('#SensorTemp','N/A','');
            }

           

            // 更新保存期限剩餘時時
            if (response[0].ExpDateTime){

                let ExpDateTime=moment(response[0].ExpDateTime).unix();
                let CurrentDateTime=moment().unix();
                let ExpTime=ExpDateTime-CurrentDateTime;  
                let min=Math.floor(parseInt(ExpTime)/60);
                if (min<0){
                    this.setUpdateStr('#ExpiredTime',oneTerm(this.langid,'expired'),'');
                }else{
                    let hour=Math.floor(min/60);
                    min=min%60
                    let day=Math.floor(hour/24);
                    hour=hour%24;
                    let exp= `${('0'+day).slice(-2)}d:${('0'+hour).slice(-2)}h:${('0'+min).slice(-2)}m`;
                    this.setUpdateStr('#ExpiredTime',exp,'');
                    
                }

            }else{
                this.setUpdateStr('#ExpiredTime','N/A','');
            }

            // let exp=response[0].LEXP;
            // let now=moment();
            // let the=moment.unix(exp);
            // let min=parseInt(exp)/60;

            // if ((response[0].EXP=='N/A')||(response[0].LEXP=='N/A')){
            //     this.setUpdateStr('#ExpiredTime','N/A','');
            // }else{

            //     if (min<0){
            //         exp=oneTerm(this.langid,'expired');
            //     }else{
            //             //exp=Math.floor(parseInt(response[0].LEXP)/60);
            //             let day=Math.floor(exp/86400);
            //             let hour=Math.floor((exp%86400)/3600);
            //             let min=Math.floor(((exp%86400)%3600)/60);
            //             exp= `${('0'+day).slice(-2)}d:${('0'+hour).slice(-2)}h:${('0'+min).slice(-2)}m`;
                      
            //     }
            //     this.setUpdateStr('#ExpiredTime',exp,'');
            // }      
            
            // 更新訂閱狀況
           
            if (response[0].Subs==0){
               
                $("#toggleSubs").removeAttr('checked');
            }else{
                
                $("#toggleSubs").attr('checked', 'checked');
            }
            

               
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, '偵測器狀態查詢失敗,請聯絡管理員').then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });

    }

    getSensorConfig_xx(){

        const data={}
        data.SensorMacArr=this.sensormac;

        console.log(this.sensormac)

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
                if (response[0].UT)
                this.UT=response[0].UT;
                if (response[0].OT)
                this.OT=response[0].OT;

                $('#Parameter_A').val(response[0].A);
                $('#Parameter_B').val(response[0].B);
                $('#ExpLabel').attr("title",response[0].EXP);
                $('#Parameter_LBATT').val((response[0].LBATT/100)+2);
                $('#Parameter_OT').val(response[0].OT);
                $('#Parameter_UT').val(response[0].UT);


                let Par_day=Math.floor(response[0].EXP/86400);
                let Par_hour=Math.floor((response[0].EXP%86400)/3600);
                let Par_min=Math.floor(((response[0].EXP%86400)%3600)/60);
                $('#EXP_day').val(Par_day);
                $('#EXP_hour').val(Par_hour);
                $('#EXP_min').val(Par_min);

                this.setExpired=`${('0'+Par_day).slice(-2)}d:${('0'+Par_hour).slice(-2)}h:${('0'+Par_min).slice(-2)}m`;
                $('#ExpiredSetting').html(this.setExpired);
               

            }
           
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, '偵測器狀態查詢失敗,請聯絡管理員').then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });

    }

    getSensorBasicData(){

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

            console.log(response[1][0])

            this.gatewaymac=response[0][0].GatewayMac;
            // Set Title
            let a1=this.doc.createElement("a");
            let img=this.doc.createElement("img");
            let a2=this.doc.createElement("a");
            a1.innerText= oneTerm(this.langid,'store')
            a1.href="home";
            a1.setAttribute("class","mb-3");
            let svg1=SvgToObj(getSvg('icon_next'));
            svg1.setAttribute("class","mb-3");
            let svg2=SvgToObj(getSvg('icon_next'));
            svg2.setAttribute("class","mb-3");
            a2.innerText=response[0][0].Name;
            this.setStoreName(response[0][0].Name);
            a2.href=`storeStatus?id=${this.storeid}`;
            //a2.href="javascript:history.back()";
            a2.setAttribute("class","mb-3");
            
            let div=this.doc.createElement("div");
            div.innerHTML=response[1][0].Name==null?(response[1][0].MAC).slice(-4):response[1][0].Name;
            div.setAttribute("id","SensorNameTitle");
            div.setAttribute("class","cursor dropdown");

            this.sensormac=response[1][0].MAC;

            if (this.groupid>=2){
               // div.addEventListener('click', this.toggleConfig.bind(this), false);
            }
            
           
            this.setSensorName(response[1][0].Name==null?(response[1][0].MAC).slice(-4):response[1][0].Name);
            this.sensormac=response[1][0].MAC;
            this.title.appendChild(a1);
            this.title.appendChild(svg1);
            this.title.appendChild(a2);
            this.title.appendChild(svg2);
            //this.title.appendChild(a3);


            // sensor menu begin
            let menuDiv=this.doc.createElement('div');
            let menuButton=this.doc.createElement('button');
            let menuArrow=this.doc.createElement('button');
            let menuArrowSpan=this.doc.createElement('span');
            let menuDrop=this.doc.createElement('div');
            let menuSubButton_1=this.doc.createElement('a');
            let menuSubButton_2=this.doc.createElement('a');
            let menuSubButton_3=this.doc.createElement('a');
            menuDiv.setAttribute('class','btn-group mb-3');
            
            menuButton.setAttribute('class','btn');
            menuButton.setAttribute('style','font-size:25px!important;background-color:#144BA7;color:#ffffff;');
            //menuButton.setAttribute('style','padding: 8px 20px 8px 5px!important');
            menuButton.setAttribute('type','button');
            menuArrow.setAttribute('type','button');
            menuArrow.setAttribute('class','btn');
            //onMouseOver="this.style.color='#0F0'"
            menuArrow.setAttribute('onMouseOver',"this.style.backgroundColor='#3478EB'");
            menuArrow.setAttribute('onMouseOut',"this.style.backgroundColor='#144BA7'");
            menuArrow.setAttribute('style','font-size:25px!important;background-color:#144BA7;color:#ffffff;width:30px!important;');
            menuArrow.setAttribute('data-toggle','dropdown');
            menuArrow.setAttribute('aria-haspopup','true');
            menuArrow.setAttribute('aria-expanded','false');
            menuArrowSpan.setAttribute('class','sr-only');
            menuArrowSpan.setAttribute('style','padding-right:10px!important');
            menuButton.innerHTML=response[1][0].Name==null?(response[1][0].MAC).slice(-4):response[1][0].Name;
            menuArrow.setAttribute('class','btn dropdown-toggle dropdown-toggle-split');
            menuDrop.setAttribute('class','dropdown-menu dropdown-menu-right');
            menuSubButton_1.setAttribute('class','dropdown-item');
            menuSubButton_1.setAttribute('type','button');
            menuSubButton_1.setAttribute('style','padding:10px 20px;font-size:20px;');
            menuSubButton_1.innerHTML=oneTerm(this.langid,'sensorSettingValue');
            menuSubButton_1.addEventListener('click', this.toggleConfig.bind(this), false);
            menuSubButton_2.setAttribute('class','dropdown-item');
            menuSubButton_2.setAttribute('type','button');
            menuSubButton_2.setAttribute('style','padding:10px 20px;font-size:20px;');
            menuSubButton_2.innerHTML=oneTerm(this.langid,'sensorReport');
            menuSubButton_2.addEventListener('click', this.toggleConfigList.bind(this), false);
           
            menuArrow.appendChild(menuArrowSpan);
            menuDrop.appendChild(menuSubButton_1);
            menuDrop.appendChild(menuSubButton_2);
            menuDiv.appendChild(menuButton);
            menuDiv.appendChild(menuArrow);
            menuDiv.appendChild(menuDrop);
            this.title.appendChild(menuDiv);


            // Set Sensor
            let tr=this.doc.createElement("tr");
            let td1=this.doc.createElement("td");
            td1.innerHTML=response[1][0].Name==null?(response[1][0].MAC).slice(-4):response[1][0].Name;
            let svg=SvgToObj(getSvg('icon_edit'));
            svg.setAttribute("class","svg-lightgray cursor");
            svg.setAttribute("sensorid",this.sensorid);
            svg.removeEventListener('click', this.editName);
            svg.addEventListener('click', this.editName.bind(this), false);
            td1.appendChild(svg);
            let td2=this.doc.createElement("td");
            td2.innerHTML=response[1][0].MAC;
            let td3=this.doc.createElement("td");
            td3.setAttribute("id","SensorStatus");
            td3.innerHTML="waitting...";
            let td4=this.doc.createElement("td");
            let sp=this.doc.createElement("span");
            sp.setAttribute("id","SensorTemp");
            sp.innerHTML="waitting...";
            td4.appendChild(sp);
            let td5=this.doc.createElement("td");
            td5.innerHTML="waitting...";
            td5.setAttribute("id","ExpiredTime");
            let td6=this.doc.createElement("td");
            td6.innerHTML="waitting...";
            td6.setAttribute("id","ExpiredSetting");


            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tr.appendChild(td6);
            this.tbody.appendChild(tr);

            
            this.MacArr=response[1][0].MAC;
            this.sensormac==response[1][0].MAC;

            
           
            if (response[2]){
                //this.gatewaymac=response[2][0].Mac;
                this.gatewaymac='';
                response[2].forEach(ele => {
                    
                    this.gatewaymac+=`${ele.Mac},`;

                });
                if (this.gatewaymac.length>0){
                    this.gatewaymac=this.gatewaymac.slice(0,-1);
                }
                else{
                    modalMsgHandler('modal', 1, '此商家未指派閘道').then((timeout) => {
                        $('#modal').modal('show');
                        setTimeout(()=>{ 
                            $('#modal').modal('hide');
                            $('#modal').remove();
                        }, timeout);
                        
                    });
                }
                

            }
            

            // Set Config Page
            if (response[1][0].UT)
            this.UT=response[1][0].UT;
            if (response[1][0].OT)
            this.OT=response[1][0].OT;

            $('#Parameter_A').val(response[1][0].A);
            $('#Parameter_B').val(response[1][0].B);
            $('#ExpLabel').attr("title",response[1][0].EXP);
            $('#Parameter_LBATT').val((response[1][0].LBATT/100)+2);
            $('#Parameter_OT').val(response[1][0].OT);
            $('#Parameter_UT').val(response[1][0].UT);
            $('#Parameter_Mode').val(response[1][0].MODE);
            $('#Parameter_Inaction').val(response[1][0].INACTION);
            $('#Parameter_Logfreq').val(response[1][0].LOGFREQ);


            let Par_day=Math.floor(response[1][0].EXP/86400);
            let Par_hour=Math.floor((response[1][0].EXP%86400)/3600);
            let Par_min=Math.floor(((response[1][0].EXP%86400)%3600)/60);
            $('#EXP_day').val(Par_day);
            $('#EXP_hour').val(Par_hour);
            $('#EXP_min').val(Par_min);

            this.setExpired=`${('0'+Par_day).slice(-2)}d:${('0'+Par_hour).slice(-2)}h:${('0'+Par_min).slice(-2)}m`;
            $('#ExpiredSetting').html(this.setExpired);




            this.getSensorStatus(response[1][0].MAC);
            
            this.drawChart();
            
            
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, '查詢失敗,請聯絡管理員').then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });


    }

    getSensorExpTime(){

        const promise = $.ajax({
            type: 'GET',
            url: `/DeviceAPI/SensorExpTimeCore/${this.sensormac}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {
            
            console.log("getSensorExpTime : ============");
            console.log(response);
           
            let exp=response[0].expTime;
            let now=moment();
            let the=moment.unix(exp);
            let min=the.diff(now,'minutes');

            if (exp==0){
                exp='N/A';
            }else{

                if (min<0){
                    exp=oneTerm(this.langid,'expired');
                }else{
                        let hour=Math.floor(min/60);
                        min=min%60
                        let day=Math.floor(hour/24);
                        hour=hour%24;
                        exp= `${('0'+day).slice(-2)}d:${('0'+hour).slice(-2)}h:${('0'+min).slice(-2)}m`;
                }
            }

           
            this.setUpdateStr('#ExpiredTime',exp,'');
 
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, '查詢失敗,請聯絡管理員').then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });


    }

    modifySensorName(){
        let newName= $('#SensorName').val();
        console.log(newName);

        if (validator.isEmpty(newName, { 'ignore_whitespace': true })) {

            modalMsgHandler('modal', 1, '名稱不得為空值').then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            $('#SensorName').addClass("invalid");

            return;
        }

        let data={};
        data.Name=newName;

        const promise = $.ajax({
            type: 'PATCH',
            url: `/DeviceAPI/Sensor/${this.sensorid}`,
            async: true,
            crossDomain: true,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });

        promise.done(async (response) => {

            console.log(response);
            window.location=`sensorStatus?storeid=${this.storeid}&sensorid=${this.sensorid}`;


        });
        promise.fail((e) => {
            console.log(e.responseText)

            modalMsgHandler('modal', 1, '更新失敗,請聯絡管理員').then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });


        });

    }

    setEditNameSubmitButtonClickEvent() {

        this.SensorNameSubmit.removeEventListener('click', this.modifySensorName);
        this.SensorNameSubmit.addEventListener('click', this.modifySensorName.bind(this), false);

    }

    getSensorData(mac,startTs,endTs){

        this.lasttime=endTs;

        const data={};
        data.MacArr=mac;
        data.startTs=startTs;
        data.endTs=endTs;

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

            let maxValue='';
            if (this.OT) maxValue=this.OT;
            let minValue='';
            if (this.UT) minValue=this.UT;

            if (response){
                
                console.log(`${moment().format('HH:mm:ss')}->SensorData->max=${this.maxValue} min=${this.minValue} `)

                
                this.updateArr[0].data=[];
                this.updateArr[0].name=oneTerm(this.langid,'temp');

               
                let TargetArr=[];
                
                for (let i=startTs;i<=(endTs+1);i=i+60){
                    TargetArr.push([i,null]);
                }
                
                let DataHash=new SimpleHashTable();
                response.forEach(ele => {

                    let temp=ele.TEMP;
                    if (maxValue=='') maxValue=temp;
                    if (minValue=='') minValue=temp;
                    if (parseFloat(temp)>parseFloat(maxValue)) maxValue=temp;
                    if (parseFloat(temp)<parseFloat(minValue)) minValue=temp;

                    let idate=moment.unix(ele.ts).format("YYYY-MM-DD HH:mm");
                    idate=moment(`${idate}:00`).unix();
                    DataHash.put(idate,temp);
                        
                });

                this.updateArr[0].data=[];
                TargetArr.forEach(ele=>{
                    
                    let temp=DataHash.get(ele[0]);
                    if (temp==-1) temp=null;
                    this.updateArr[0].data.push([ele[0]*1000,temp]); 
                });

                this.maxValue=maxValue;
                this.minValue=minValue;

                let opt={}
                opt.yaxis={
                    max:(parseFloat(maxValue)+5),
                    min:(parseFloat(minValue)-5),
                }
                console.log(`maxValue=${maxValue}`)
                console.log(`minValue=${minValue}`)
                this.vue.$refs.chart.updateOptions(opt);
                this.vue.$refs.chart.updateSeries(this.updateArr);

                
               
            }else{
                console.log('回應值為空');
                this.updateArr[0].data=[];
                this.vue.$refs.chart.updateSeries(this.updateArr);
                
            }

            this.getSensorEvent(mac,startTs,endTs);
           
           
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
        let jsonWorkSheet = xlsx.utils.json_to_sheet(jsonData);


        //let TargetObject={"感測器名稱":this.sensorname,"MAC":this.sensormac};
        let TargetObject=`{"${oneTerm(this.langid,'sensorName')}":"","MAC":""}`;
        TargetObject=JSON.parse(TargetObject);
        TargetObject[oneTerm(this.langid,'sensorName')]=this.sensorname;
        TargetObject["MAC"]=this.sensormac;
        let TargetArr=[];
        TargetArr.push(TargetObject);
        
        let jsonWorkSheet2 = xlsx.utils.json_to_sheet(TargetArr);
        
        let data=`{"${oneTerm(this.langid,'temperatureData')}":"","${oneTerm(this.langid,'basicInformation')}":""}`;
        data=JSON.parse(data);
        data[oneTerm(this.langid,'temperatureData')]=jsonWorkSheet;
        data[oneTerm(this.langid,'basicInformation')]=jsonWorkSheet2;


        let workBook = {
        SheetNames: [oneTerm(this.langid,'temperatureData'),oneTerm(this.langid,'basicInformation')],
        Sheets: data,
        };
        // 將workBook寫入檔案
        xlsx.writeFile(workBook, `${this.sensorname} #${begStr} #${endStr}.xlsx`);
    }

    async setModeOption(){
        //$('#MODE')

        $('#Parameter_Mode').append($('<option>', {
            value: 2649715235,
            text: oneTerm(this.langid,'logMode')
        }));

        $('#Parameter_Mode').append($('<option>', {
            value: 2649715217,
            text: oneTerm(this.langid,'broadcastMode')
        }));

    }

    getDownloadData(mac,startTs,endTs){

        this.lasttime=endTs;

        const data={};
        data.MacArr=mac;
        data.startTs=startTs;
        data.endTs=endTs;

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

           
            let TargetArr=[];

            if (response){
                if (response.length>0){
                
                   
                    response.forEach(ele => {

                        if (ele.TEMP!='18498'){                                
                            let idate=moment.unix(ele.ts).format("YYYY-MM-DD HH:mm:ss");
                            let temp=(ele.TEMP).toFixed(1);
                            //TargetArr.push(idate,temp);
                            let TargetJson={};
                            if (this.groupid==3){
                                TargetJson=`{"${oneTerm(this.langid,'time')}":"","${oneTerm(this.langid,'temperature')}":"","${oneTerm(this.langid,'voltage')}":""}`;
                                TargetJson=JSON.parse(TargetJson);
                                TargetJson[oneTerm(this.langid,'time')]=idate;
                                TargetJson[oneTerm(this.langid,'temperature')]=parseFloat(temp);
                                TargetJson[oneTerm(this.langid,'voltage')]=parseFloat(ele.BATT).toFixed(2);
                            }else{
                                TargetJson=`{"${oneTerm(this.langid,'time')}":"","${oneTerm(this.langid,'temperature')}":""}`;
                                TargetJson=JSON.parse(TargetJson);
                                TargetJson[oneTerm(this.langid,'time')]=idate;
                                TargetJson[oneTerm(this.langid,'temperature')]=temp;
                            }

                            TargetArr.push(TargetJson);
                        }
                    
                    });

                    
                    let SortArr=this.JsonSort(TargetArr,'時間');

                    let strBeg=moment(startTs*1000).format('YYYY-MM-DD');
                    let strEnd=moment(endTs*1000).format('YYYY-MM-DD');

                    this.exportExcel(SortArr,strBeg,strEnd);
    
                    
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

    }

    getSensorEvent(mac,startTs,endTs){

        const data={};
        data.MacArr=mac;
        data.startTs=startTs;
        data.endTs=endTs;
        data.Keys='0';

        let eventArr=[];

        const promise = $.ajax({
            type: 'POST',
            url: `/StoreAPI/SensorSwitchEvent`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data:data,
        });

        promise.done(async (response) => {

            if (response){

                console.log(`${moment().format('HH:mm:ss')}->SensorEvent->max=${this.maxValue} min=${this.minValue} `)

                if (response.length>0){
                        response[0].forEach(ele => {

                            
                            let theGDT=new Date(ele.GDT);
                            let ts=moment(theGDT).unix()*1000;
                            

                            if (ele.EventValue==1){
                                eventArr.push(
                                    {
                                        x: ts,
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

                            if (ele.EventValue==0){
                                eventArr.push(
                                    {
                                        x: ts,
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

                        
                        //this.vue.$refs.chart.options.point.push(eventArr);
                }

            }

            let opt={}
            opt.annotations={
                yaxis: [
                    {
                        y: this.OT,
                        strokeDashArray: 5,
                        borderColor: "#CE0000",
                        label: {
                            borderColor: "#CE0000",
                            style: {
                            color: "#fff",
                            background: "#CE0000"
                            },
                        
                        text: "High"
                    }
                    },
                    {
                        y: this.UT,
                        strokeDashArray: 5,
                        borderColor: "#0066CC",
                        label: {
                        borderColor: "#0066CC",
                        style: {
                            color: "#fff",
                            background: "#0066CC"
                        },
                        text: "Low",
                        textAnchor: 'end',
                        }
                    }
                ],
                xaxis:eventArr
            }

            //console.log(this.vue)
            
            this.vue.$refs.chart.updateOptions(
                opt
            )

            // this.vue.$refs.chart.updateSeries(this.updateArr);  
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

    }

    setMqtt(sensormac,gatewaymac,vue,upArr,OT,UT){

        console.log('set MQTT');

        // Create a client instance
        //let client = new Paho.MQTT.Client('172.21.20.54', 9001, "clientId");

        let options={
            clientId:"abc",
            username:"bfresh-web",
            password:"abd28dd823aaf34e2e2ce5e197153f8328727f9621ec3eb55f499832c87e18ea",
            clean:true};

        //let client = mqtt.connect("mqtt://172.21.20.54:9001",options)
        let client = mqtt.connect("ws://bfresh.antzertech.com/mqtt",options)
        
        client.on("connect",function(){	
            console.log("connected");
            console.log(gatewaymac);
            var topic=`bfresh/gws/${gatewaymac}/telemetry/#`;
            client.subscribe(topic,{qos:1});
            console.log("subscribe ["+topic+']');

        });

        client.on("close",function(error){ 
            console.log("close");
        });
 
        client.on("error",function(error){ 
            console.log("Can't connect"+error);
        });

        client.on('message',function(topic, message, packet){
            console.log("topic is "+ topic);
            console.log("message is "+ message);
            let myObj=JSON.parse(message);
            let time='';
         

        });


    }


    checkSensorStatus(){

        this.getSensorStatus(this.sensormac);
    }
   
    drawChart(){

        let cdt=moment().format("YYYY-MM-DD");
        
        var u1=moment(`${cdt} 00:00:00`, "YYYY-MM-DD HH:mm:ss").unix();
        var u2=moment(`${cdt} 23:59:59`, "YYYY-MM-DD HH:mm:ss").unix();

      
        Vue.use(VueApexCharts)
        Vue.component('apexchart', VueApexCharts)

        this.vue=new Vue({
            el: '#app1',
            components: {
              apexchart: VueApexCharts,
            },
            data: {
              
                series: [ {
                    name:'時間',
                    data: [
                        // {x:'2020-10-22 08:00:00',y:2},
                    ]
                }
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
                        selection: function(chartContext, { xaxis, yaxis }) {
                            console.log('select action');
                            console.log(chartContext.series);
                           
                        },
                        updated: function(chartContext, config) {
                            
                            console.log('updated event fired');
                            console.log(`max=${config.config.yaxis[0].max}`);
                            console.log(`min=${config.config.yaxis[0].min}`);


                        },
    
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
                            selection: false,
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
                    colors: ['#01B468']
                },
                markers: {
                    size: [2,0,0],
                    colors: ['#01B468'],
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
                    min:-20,
                    max:40,
                 
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
                colors:['#144BA6']
              
            },
           
        }
        })


        this.getSensorData(this.sensormac,u1,u2);
       
      

        
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

    getConfigList(){
        
        console.log('get config list '+this.sensormac.value)

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/SensorConfigList/${this.sensormac}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (res) => {
             
            console.log(`get sensor config list success`);
            console.log(res);
            //window.location = `manageSensor?companyid=${this.companyid}`;

            if (res[0].length>0){

                this.sensorConfigList.innerHTML="";
                let tbody=this.doc.createElement("tbody");
                tbody.setAttribute("class","modal-body");
                res[0].forEach(item => {

                
                    let td1=this.doc.createElement("td");
                    td1.innerHTML=`<i class="fa fa-fw fa-user mr-1"></i>${item.UserName}`;
                    td1.setAttribute('style','width:150px')
                    let td2=this.doc.createElement("td");
                    td2.innerHTML=`<i class="fa fa-fw fa-clock mr-1"></i>${moment(item.SensorTS*1000).format('YYYY-MM-DD HH:mm:ss')}`;
                    td2.setAttribute('style','width:250px')

                    let tr=this.doc.createElement("tr");
                    //tr.setAttribute('style','width:100%')
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tbody.appendChild(tr);



                    let tr2=this.doc.createElement("tr");
                    if (item.GatewayTS){
                        let td3=this.doc.createElement("td");
                        td3.setAttribute('colspan','2');
                        //td3.setAttribute('style','font-size:5px;');
                        //<span class="badge">5</span>
                        td3.innerHTML=`
                        <table ><tr><td>
                        <span class='badge-blue'><span class='badge-white mr-1'>A</span> ${item.A}</span></span>
                        <span class='badge-blue'><span class='badge-white mr-1'>B</span>${item.B}</span></span>
                        <span class='badge-blue' ><span class='badge-white mr-1'>EXP</span>${item.EXP}</span></span>
                        </td></tr><tr><td>
                        <span class='badge-blue'><span class='badge-white mr-1'>LBATT</span>${item.LBATT}</span></span>
                        <span class='badge-blue'><span class='badge-white mr-1'>INACTIVITY</span>${item.INACTIVITY}</span></span>
                        <span class='badge-blue'><span class='badge-white mr-1'>LOGFREQ</span>${item.LOGFREQ}</span></span>
                        </td></tr></table>
                        `;
                        tr2.appendChild(td3);
                        tbody.appendChild(tr2);

                    }else{
                        let td3=this.doc.createElement("td");
                        td3.setAttribute('colspan','2');
                        td3.innerHTML=`N/A`;
                        tr2.appendChild(td3);
                        tbody.appendChild(tr2);
                    }
                  


                    

                });
                this.sensorConfigList.appendChild(tbody);
            }

        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1,  oneTerm(this.langid,'failed')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });
    }

    toggleConfig(){
        console.log('toggleConfig');
        $('#ConfigDialog').modal('show');
    }

    toggleChange(){
        console.log('toggleChange');
        let Subs=$('#toggleSubs').is(":checked");
        let data={};
        data.SensorID=this.sensorid;
        data.Subscribe=Subs?'1':'0';
        console.log(data);
        
        const promise = $.ajax({
            type: 'PATCH',
            url: `/DeviceAPI/SensorSubscribe`,
            async: true,
            crossDomain: true,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });

        promise.done(async (response) => {

            console.log(response);
            //window.location=`sensorStatus?storeid=${this.storeid}&sensorid=${this.sensorid}`;


        });
        promise.fail((e) => {
            console.log(e.responseText)

            modalMsgHandler('modal', 1, '更新失敗,請聯絡管理員').then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });


        });

       
    }

    toggleConfigList(){
        console.log('toggleConfigList');
        $('#ConfigList').modal('show');
        this.getConfigList();
    }

    downloadData(){

        console.log('download data...');

        let d1=$('#Filter1').attr('bdt');
        let d2=$('#Filter1').attr('edt');
        var startTs=moment(d1, "YYYY-MM-DD HH:mm:ss").unix();
        var endTs=moment(d2, "YYYY-MM-DD HH:mm:ss").unix();

        this.getDownloadData(this.sensormac,startTs,endTs);

    }

    uploadConfig(){
        console.log('upload Config...');

        // Check data
        // 1. Check LOGFREQ
        if (!validator.isInt($('#Parameter_Inaction').val())) {
            $('#Parameter_Inaction').addClass("invalid");
            
            modalMsgHandler('modal', 1,'INACTIVITY '+ oneTerm(this.langid,'invalidFormat')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;
        }
        // 2. Check LOGFREQ
        if (!validator.isInt($('#Parameter_Logfreq').val(), { min: 60, max: 43200 })) {
            $('#Parameter_Logfreq').addClass("invalid");
            
            modalMsgHandler('modal', 1,'LOGFREQ '+ oneTerm(this.langid,'invalidFormat')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;
        }

        let inactivity=parseInt($('#Parameter_Inaction').val());
        let logfreq=parseInt($('#Parameter_Logfreq').val());
        if (logfreq>(inactivity*60)){
            $('#Parameter_Logfreq').addClass("invalid");
            
            modalMsgHandler('modal', 1,`LOGFREQ ${oneTerm(this.langid,'shouldNotGreaterThanValueOfInactivity')} ${inactivity*60}`).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;
        }

        const data={};
        data.deviceId=this.sensormac;
        data.A=parseFloat($('#Parameter_A').val());
        data.B=parseFloat($('#Parameter_B').val());
        data.LBATT=parseInt((parseFloat($('#Parameter_LBATT').val())-2)*100);
        data.OT=$('#Parameter_OT').val();
        data.UT=$('#Parameter_UT').val();
        data.GMAC=this.gatewaymac;

        let Par_day=$('#EXP_day').val();
        let Par_hour=$('#EXP_hour').val();
        let Par_min=$('#EXP_min').val();
        let Par_exp=(Par_day*24*60*60)+(Par_hour*60*60)+(Par_min*60);
        data.EXP=parseInt(Par_exp);
        data.MODE=$('#Parameter_Mode').val();
        data.INACTIVITY=$('#Parameter_Inaction').val();
        data.LOGFREQ=$('#Parameter_Logfreq').val();
        if ($('#toggleSubs').is(':checked')){
            data.Subs='1';
        }else{
            data.Subs='0';
        }
        
        console.log('--- upload config data ---')
        console.log(data)

        const promise = $.ajax({
            type: 'PATCH',
            url: `/StoreAPI/SensorConfig/${this.sensormac}`,
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
            
            modalMsgHandler('modal', 1,  oneTerm(this.langid,'updateFailedPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });

    }

    setExpOption(){
       
        for (let i = 0; i < 100; i++) {     
            let opt=this.doc.createElement("option");
            opt.text=`${('0'+i).slice(-2)} d`;
            opt.value=i;
            $('#EXP_day').append(opt);
        }
        for (let i = 0; i < 24; i++) {     
            let opt=this.doc.createElement("option");
            opt.text=`${('0'+i).slice(-2)} h`;
            opt.value=i;
            $('#EXP_hour').append(opt);
        }
        for (let i = 0; i < 60; i++) {     
            let opt=this.doc.createElement("option");
            opt.text=`${('0'+i).slice(-2)} m`;
            opt.value=i;
            $('#EXP_min').append(opt);
        }
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

    
}

