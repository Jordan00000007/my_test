/*eslint-disable*/
import validator from 'validator';
import { modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';
import moment from 'moment';
import { data } from 'jquery';
const SimpleHashTable = require('simple-hashtable');




//vue-apexcharts\dist\

export class CalibrationHandler {

    constructor() {
        this.doc = document;
        this.submit = this.doc.querySelector('#Submit');
        this.title=this.doc.querySelector('#title');
        this.download=this.doc.querySelector('#download');
        this.tbody=this.doc.querySelector('#tbody');
        this.calendar=this.doc.querySelector('#calendar');
        this.datesubmit= this.doc.querySelector('#DateSubmit');
        this.col2=this.doc.querySelector('#col2');
        this.col3=this.doc.querySelector('#col3');
        this.uploadAll= this.doc.querySelector('#uploadAll');
        this.langid=1;
        this.gatewaymac='';
        this.sensormac='';
        this.lasttime='';       
        this.highStart='';
        this.highEnd='';
        this.lowStart='';
        this.lowEnd='';
        this.sampelAvgHigh='';
        this.sampelAvgLow='';

        this.calculate=this.doc.querySelector('#calculate');
      
       
      
    }

    setLangId(id){
       
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
        }
    }

    showModal(){

        console.log('showModal');
        $('#DateTimeDialog').modal('show');

    }

    uploadAllConfig(evt){
        console.log('upload All Config...');
        let dataList=this.doc.querySelectorAll('[id^="btn_"]');
        console.log(dataList);
        
        let i=0;
        dataList.forEach(ele=>{
            
            let data={};
            data.GMAC=$('#GMAC').val();
            data.SMAC=ele.par_mac;
            data.A=ele.par_a;
            data.B=ele.par_b;
            data.EXP=ele.par_exp;
            data.OT=ele.par_ot*10;
            data.UT=ele.par_ut*10;
            data.LBATT=ele.par_lbatt;
            data.MODE=ele.par_mode;
            data.INACTION=ele.par_inaction;
            data.LOGFREQ=ele.par_logfreq;
           
            let that=this;
            
            setTimeout(function() {
                that.sendConfig(data);
            }, 3000*i);

            i++;


        });
        
    }


    uploadConfig(evt){
        console.log('upload Config...');
        const data={};
        data.GMAC=$('#GMAC').val();
        data.SMAC=evt.currentTarget.par_mac;
        data.A=evt.currentTarget.par_a;
        data.B=evt.currentTarget.par_b;
        data.EXP=evt.currentTarget.par_exp;
        data.OT=evt.currentTarget.par_ot;
        data.UT=evt.currentTarget.par_ut;
        data.LBATT=evt.currentTarget.par_lbatt;
        data.MODE=evt.currentTarget.par_mode;
        data.INACTION=evt.currentTarget.par_inaction;
        data.LOGFREQ=evt.currentTarget.par_logfreq;
        
        //console.log(data);
        this.sendConfig(data);

        
        

    }

    sendConfig(data){

        const promise = $.ajax({
            type: 'POST',
            url: `/StoreAPI/UploadConfig`,
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


        this.tbody.innerHTML='';
        this.getPeriodHigh();
        
        

       
    }

    getPeriodHigh(){

        let data={};
        data.Sample=$('#Sample').val();
        data.DateTempHigh=$('#DateTempHigh').val();
        data.DateTempLow=$('#DateTempLow').val();
        data.TempThresholdHigh=$('#TempThresholdHigh').val();
        data.TmpThresholdLow=$('#TempThresholdLow').val();

        const promise = $.ajax({
            type: 'POST',
            url: `/StoreAPI/SampleCalibrationPeriodHigh`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data:data,
            
        });

        promise.done(async (res) => {
             
            //console.log(res[1]);
            if (res[0][0]){

                let y1=res[0][0].y1;
                let y2=res[0][0].y2;
                let dataCount=res[1].affectedRows;
                this.highStart=y1;
                this.highEnd=y2;
                //this.col2.innerHTML=`${oneTerm(this.langid,'highTemperaturePeriod')}</br>${moment.unix(y1).format("HH:mm:ss")}-${moment.unix(y2).format("HH:mm:ss")}`;
                let myTitle=`${oneTerm(this.langid,'highTemperaturePeriod')}:${moment.unix(y1).format("HH:mm:ss")}-${moment.unix(y2).format("HH:mm:ss")}`;
                myTitle+=` ${oneTerm(this.langid,'dataAmount')}:${dataCount}`;
                this.col2.setAttribute('title',myTitle);
                this.getPeriodLow();
               

            }else{
            modalMsgHandler('modal', 1, oneTerm(this.langid,'highTemperaturePeriodNoData')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
           }
        
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'highTemperaturePeriodNoData')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });
    }

   
    getPeriodLow(){

        let data={};
        data.Sample=$('#Sample').val();
        data.DateTempHigh=$('#DateTempHigh').val();
        data.DateTempLow=$('#DateTempLow').val();
        data.TempThresholdHigh=$('#TempThresholdHigh').val();
        data.TempThresholdLow=$('#TempThresholdLow').val();

        //console.log(data)

        const promise = $.ajax({
            type: 'POST',
            url: `/StoreAPI/SampleCalibrationPeriodLow`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data:data,
            
        });

        promise.done(async (res) => {
             
            //console.log(res[1]);
            if (res[0][0]){

                let y1=res[0][0].y1;
                let y2=res[0][0].y2;
                this.lowStart=y1;
                this.lowEnd=y2;
                let dataCount=res[1].affectedRows;
                //this.col3.innerHTML=`${oneTerm(this.langid,'lowTemperaturePeriod')}</br>${moment.unix(y1).format("HH:mm:ss")}-${moment.unix(y2).format("HH:mm:ss")}`;
                let myTitle=`${oneTerm(this.langid,'lowTemperaturePeriod')}:${moment.unix(y1).format("HH:mm:ss")}-${moment.unix(y2).format("HH:mm:ss")}`;
                myTitle+=` ${oneTerm(this.langid,'dataAmount')}:${dataCount}`;
                this.col3.setAttribute('title',myTitle);
                this.processSampleElement();

            }else{
                modalMsgHandler('modal', 1, oneTerm(this.langid,'lowTemperaturePeriodNoData')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });
            }
        
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'lowTemperaturePeriodNoData')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });
    }

    round(num,precision) {
        var m = Number((Math.abs(num) * Math.pow(10,precision)).toPrecision(15));
        return Math.round(m) / Math.pow(10,precision) * Math.sign(num);
    }

    processElement(data){

        //console.log(data);

        const promise = $.ajax({
            type: 'POST',
            url: `/StoreAPI/CalibrationData`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data:data,
            
        });

        promise.done(async (res) => {
             
            //console.log(res);
            if (res[0]){


                let caliHigh=this.round(res[0][0].HighTemp,2);
                let caliLow=this.round(res[0][0].LowTemp,2);
                let caliA=res[0][0].A;
                let caliB=res[0][0].B;
                let mySH=this.sampelAvgHigh;
                let mySL=this.sampelAvgLow;

                let CaliV1=(caliHigh-caliB)/caliA;
                let CaliV2=(caliLow-caliB)/caliA;
       
                let AnsA=(mySH-mySL)/(CaliV1-CaliV2);
                let AnsB=((CaliV1*mySL)-(CaliV2*mySH))/(CaliV1-CaliV2);
                AnsA=this.round(AnsA,5);
                AnsB=this.round(AnsB,5);



                let myTr=document.createElement('tr');
                let myTd1=document.createElement('td');
                myTd1.innerHTML=data.MAC;
                let myTd2=document.createElement('td');
                myTd2.innerHTML=this.round(res[0][0].HighTemp,2)+'°C';
                let myTd3=document.createElement('td');
                myTd3.innerHTML=this.round(res[0][0].LowTemp,2)+'°C';
                let myTd4=document.createElement('td');
                myTd4.setAttribute('class','answer-before');
                myTd4.innerHTML=caliA;
                let myTd5=document.createElement('td');
                myTd5.setAttribute('class','answer-before');
                myTd5.innerHTML=caliB;
                let myTd6=document.createElement('td');
                myTd6.innerHTML=AnsA;
                myTd6.setAttribute('class','answer-after');
                let myTd7=document.createElement('td');
                myTd7.innerHTML=AnsB;
                myTd7.setAttribute('class','answer-after');
                let myTd8=document.createElement('td');
                let uploadBtn=document.createElement('button');
                uploadBtn.setAttribute('type','button');
                uploadBtn.setAttribute('class','btn btn-primary custom-blue');
                uploadBtn.setAttribute('id',`btn_${data.MAC}`);
                //uploadBtn.setAttribute('par_b',AnsB);
                uploadBtn.innerHTML=oneTerm(this.langid,'upload');
                uploadBtn.removeEventListener('click', this.uploadConfig);
                uploadBtn.addEventListener('click', this.uploadConfig.bind(this), false);
                uploadBtn.par_mac = data.MAC;
                uploadBtn.par_a = AnsA;
                uploadBtn.par_b = AnsB;
                uploadBtn.par_exp =res[0][0].EXP;
                uploadBtn.par_ot =res[0][0].OT;
                uploadBtn.par_ut =res[0][0].UT;
                uploadBtn.par_lbatt =res[0][0].LBATT;
                uploadBtn.par_mode =res[0][0].MODE;
                uploadBtn.par_inaction =res[0][0].INACTION;
                uploadBtn.par_logfreq =res[0][0].LOGFREQ;
                myTd8.appendChild(uploadBtn);
                myTr.appendChild(myTd1);
                myTr.appendChild(myTd2);
                myTr.appendChild(myTd3);
                myTr.appendChild(myTd4);
                myTr.appendChild(myTd5);
                myTr.appendChild(myTd6);
                myTr.appendChild(myTd7);
                myTr.appendChild(myTd8);
                this.tbody.appendChild(myTr);

            }else{
                modalMsgHandler('modal', 1, '發生錯誤').then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });
            }
         
        
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, '發生錯誤').then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });

    }

    processSampleElement(){

        let data={};
        data.MAC=$('#Sample').val();
        data.HighStart=this.highStart;
        data.HighEnd=this.highEnd;
        data.LowStart=this.lowStart;
        data.LowEnd=this.lowEnd;

        const promise = $.ajax({
            type: 'POST',
            url: `/StoreAPI/CalibrationData`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data:data,
            
        });

        promise.done(async (res) => {
             
            //console.log(res);
            if (res[0]){
               
                this.sampelAvgHigh=this.round(res[0][0].HighTemp,2);
                this.sampelAvgLow=this.round(res[0][0].LowTemp,2);

                let title1=this.col2.getAttribute('title');
                this.col2.setAttribute('title',`${title1} ${oneTerm(this.langid,'highTemperatureAvarage')}:${this.sampelAvgHigh}`);

                let title2=this.col3.getAttribute('title');
                this.col3.setAttribute('title',`${title2} ${oneTerm(this.langid,'lowTemperatureAvarage')}:${this.sampelAvgLow}`);
               

                this.processCalibrationElement();

            }else{
                modalMsgHandler('modal', 1, '發生錯誤').then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });
            }
         
        
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, '發生錯誤').then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });

    }

    processCalibrationElement(){

        let target=$('#Target').val();
        let targetArr=target.split(",");
        targetArr.forEach(ele => {

            //console.log(ele);
            let data={};
            data.MAC=ele;
            data.HighStart=this.highStart;
            data.HighEnd=this.highEnd;
            data.LowStart=this.lowStart;
            data.LowEnd=this.lowEnd;
            this.processElement(data);
            
        });


    }
   

    setCalendarButtonClickEvent(){
        this.calendar.removeEventListener('click', this.showModal);
        this.calendar.addEventListener('click', this.showModal.bind(this), false);
    }

  
    setUploadConfigButtonClickEvent(){
        this.uploadAll.removeEventListener('click', this.uploadAllConfig);
        this.uploadAll.addEventListener('click', this.uploadAllConfig.bind(this), false);

    }

    setCalculateButtonClickEvent(){
        this.calculate.removeEventListener('click', this.setCalculate);
        this.calculate.addEventListener('click', this.setCalculate.bind(this), false);
    }

   

    
}

