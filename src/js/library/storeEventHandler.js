/*eslint-disable*/
import { UnixTimestamp,UnixTimestampFormat,modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';
import moment from 'moment';
import 'tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min.js';
import 'tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css';

const SimpleHashTable = require('simple-hashtable');


export class StoreEventHandler {

    constructor() {
        this.doc = document;
        this.tbody = this.doc.querySelector('#tbody');
        this.pagelist= this.doc.querySelector('#PageList');
        this.filter= this.doc.querySelector('#filter');
        this.filter1= this.doc.querySelector('#Filter1');
        this.filter2= this.doc.querySelector('#Filter2');
        this.filter3= this.doc.querySelector('#Filter3');
        this.calendar= this.doc.querySelector('#calendar');
        this.download= this.doc.querySelector('#download');
        this.datesubmit= this.doc.querySelector('#DateSubmit');
        this.langid=1;
        this.selectdatetime= this.doc.querySelector('#SelectDateTime');
        this.companyid=0;
        this.storeid=0;
        this.storename='';
        this.eventhash  = new SimpleHashTable();
        this.sensorhash  = new SimpleHashTable();
        this.macarr='';
       
    }

    setLangID(id){
       
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
        }
    }

    setStoreID(id){

        this.storeid=id;

    }

    setCompanyID(id){

        this.companyid=id;

    }

    async fillTable(ans){

        console.log('fill table')

        let Arr=[];
        if (ans[0].length>0){
            ans[0].forEach(item => {
            Arr.push(item);
            });
        }
        $('#tbody').empty();
        //let EventArr=['啟動','閒置','超過溫度上限','超過溫度下限','超過保存時間','電壓過低','故障',遺失];
        let EventArr=[];
        EventArr.push(oneTerm(this.langid,'startUp')+'/'+oneTerm(this.langid,'idle'));
        EventArr.push(oneTerm(this.langid,'exceedingTheUpperTemperatureLimit'));
        EventArr.push(oneTerm(this.langid,'exceedingTheLowerTemperatureLimit'));
        EventArr.push(oneTerm(this.langid,'saveTimeExceeded'));
        EventArr.push(oneTerm(this.langid,'voltageIsTooLow'));
        EventArr.push(oneTerm(this.langid,'malfunction'));
        EventArr.push(oneTerm(this.langid,'lost'));

        Arr.forEach(item => {

            let tr = document.createElement("tr");
            let td1 = document.createElement("td");
            //td1.innerHTML=`<a href='storeStatus?id=${item.PK_StoreID}'>${item.Name}</a>`;
            td1.innerHTML=EventArr[parseInt(item.PK_SensorID)%7];
            td1.setAttribute("class","h44");
            td1.setAttribute("store_id",item.Name);
            let td2 = document.createElement("td");
            //td2.innerHTML= parseInt(item.PK_StoreID)%2==0?'A':'B';
            //td2.innerHTML= (parseInt(item.PK_SensorID)%2==0)?'冷凍A':'冷凍B';
            let td3 = document.createElement("td");
            td3.innerHTML= `2020-12-02 08:00`;;
          
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
           
            this.tbody.appendChild(tr);
                               
        });
        this.setPagination(ans[1]);

    }

    async setPagination(data)
    {
        const Url="manageStore"
        const {ThePage,TotalRecord,TotalPage}=data[0];
        let ul=document.createElement("ul");
        ul.setAttribute("class","pagination justify-content-end");

        let lt=document.createElement("li");
        if (ThePage==1) {
            lt.setAttribute("class","page-link cursor disabled");
        }else{
            lt.setAttribute("class","page-link cursor");
            lt.removeEventListener('click', this.changePage);
            lt.addEventListener('click', this.changePage.bind(this), false);
        }
        lt.setAttribute("page",(ThePage-1).toString());
        let i1=document.createElement("i");
        i1.setAttribute("page",(ThePage-1).toString());
        i1.setAttribute("class","fas fa-chevron-left cursor");
        lt.appendChild(i1);
        ul.appendChild(lt);

        for (let i = 1; i <= TotalPage; i++) {
            let li=document.createElement("li");
            if (ThePage==i) {
                li.setAttribute("class","page-link cursor active");
            }else{
                li.setAttribute("class","page-link cursor");
                li.removeEventListener('click', this.changePage);
                li.addEventListener('click', this.changePage.bind(this), false);
            }
            li.setAttribute("page",i.toString());
            
            li.innerText=i.toString();
            ul.appendChild(li);
        }

        let gt=document.createElement("li");
        if (ThePage==TotalPage) {
            gt.setAttribute("class","page-link cursor disabled");
        }else{
            gt.setAttribute("class","page-link cursor");
            gt.removeEventListener('click', this.changePage);
            gt.addEventListener('click', this.changePage.bind(this), false);
        }
        gt.setAttribute("page",(ThePage+1).toString());
        let i2=document.createElement("i");
        i2.setAttribute("page",(ThePage+1).toString());
        i2.setAttribute("class","fas fa-chevron-right cursor");
        gt.appendChild(i2) ;
        ul.appendChild(gt);

        this.pagelist.innerHTML="";
        this.pagelist.appendChild(ul);
    }

    async changePage(e){
        console.log(e.target.getAttribute("page"));
        let page=parseInt(e.target.getAttribute("page"));
        this.getPageData(this.storeid,page);
    }

    setEventSelector(data){

        this.eventhash.clear();

        // let opt=this.doc.createElement("option");
        // opt.text=oneTerm(this.langid,'allEvent');
        // opt.value='0';
        // $('#Filter1').append(opt);
        data.forEach(item => {
            
            let opt=this.doc.createElement("option");  
            opt.value=item.EventCode;
            switch (item.EventCode) {
                case 'SWITCH':
                    opt.text=oneTerm(this.langid,'startUp')+'/'+oneTerm(this.langid,'idle');
                  break;
                case 'OT':
                    opt.text=oneTerm(this.langid,'exceedingTheUpperTemperatureLimit');
                    break;
                case 'UT':
                    opt.text=oneTerm(this.langid,'exceedingTheLowerTemperatureLimit');
                    break;
                case 'EXP':
                    opt.text=oneTerm(this.langid,'saveTimeExceeded');
                    break;
                case 'LBATT':
                    opt.text=oneTerm(this.langid,'voltageIsTooLow');
                    break;
                case 'LOST':
                    opt.text=oneTerm(this.langid,'lost');
                    break;
                default:
                    opt.text='N/A';
            }

           

            $('#Filter1').append(opt);

            this.eventhash.put(item.EventCode,opt.text);
        });    


        let str= oneTerm(this.langid,'itemsSelected');

        $('#Filter1').selectpicker({
            'deselectAllText': oneTerm(this.langid,'deselectAll'),
            'selectAllText': oneTerm(this.langid,'selectAll'),
            'noneSelectedText': oneTerm(this.langid,'nothingSelected'),
            'selectedTextFormat':'count > 2',
            'countSelectedText':'{0} '+str
        });

        $('#Filter1').selectpicker('selectAll');
    }

    setSensorSelector(data){

        this.sensorhash.clear();
        // let opt=this.doc.createElement("option");
        // opt.text=oneTerm(this.langid,'allSensor');
        // opt.value='0';
        // $('#Filter2').append(opt);


        data.forEach(item => {
            //console.log(item);
            let opt=this.doc.createElement("option");
            opt.text=item.Name==null?(item.MAC).slice(-4):item.Name;
            opt.value=item.MAC;
            $('#Filter2').append(opt);
            this.sensorhash.put(item.MAC,item.Name==null?(item.MAC).slice(-4):item.Name);
        });    

        let str= oneTerm(this.langid,'itemsSelected');

        $('#Filter2').selectpicker({
            'deselectAllText': oneTerm(this.langid,'deselectAll'),
            'selectAllText': oneTerm(this.langid,'selectAll'),
            'noneSelectedText': oneTerm(this.langid,'nothingSelected'),
            'selectedTextFormat':'count > 2',
            'countSelectedText':'{0} '+str
        });

        $('#Filter2').selectpicker('selectAll');


    }

    async getSensorList(storeid){

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/SensorListByStore/${storeid}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {
            
            let MacArr=response[0][0].MacArr;
            this.macarr=response[0][0].MacArr;
            this.setEventSelector(response[2]);
            this.setSensorSelector(response[1]);
            //this.getEventListCore(MacArr,'0',this.filter3.value);
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


    async getEventListCore(MacArr,Keys){

        console.log(`MacArr=${MacArr}`)
        console.log(`Keys=${Keys}`)
        
        let beg=$('#Filter3').attr('bdt');
        let end=$('#Filter3').attr('edt');
        var startTs=moment(beg, "YYYY-MM-DD HH:mm:ss").unix();
        var endTs=moment(end, "YYYY-MM-DD HH:mm:ss").unix();
        MacArr=MacArr.join(",");
        Keys=Keys.join(",");

      
        const data={};
        data.MacArr=MacArr;
        data.Keys=Keys;
        data.startTs=startTs;
        data.endTs=endTs;

        const promise = $.ajax({
            type: 'POST',
            //url: `/StoreAPI/SensorEventLogCore`,
            url: `/StoreAPI/EventList`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data:data,
        });

        promise.done(async (response) => {
            
           
            this.tbody.innerHTML="";

            if (response!=null){

                function compare( a, b ) {
                    
                    if ( a.ts < b.ts ){
                      return 1;
                    }
                    if ( a.ts > b.ts ){
                      return -1;
                    }
                    return 0;
                  }

                
                //response.sort(compare);

                response.forEach(element => {
                    

                    let td1=this.doc.createElement("td");
                    //td1.innerHTML=this.getEventNameByCode(element.eventId,element.eventValue);
                    // if ((element.eventId=="SWITCH")&&(element.eventValue=="1")) element.eventId="SWITCH_ON";
                    // if ((element.eventId=="SWITCH")&&(element.eventValue=="0")) element.eventId="SWITCH_OFF";
                    td1.innerHTML=this.eventhash.get(element.EventId);
                    //td1.innerHTML=element.EventId;
                    td1.setAttribute("class","h44")
                    let td2=this.doc.createElement("td");
                    //td2.innerHTML=element.deviceId;
                    td2.innerHTML=this.sensorhash.get(element.SMAC);
                    //td2.innerHTML=element.SMAC;
                    let td3=this.doc.createElement("td");
                    td3.innerHTML=moment(element.GDT).format('YYYY-MM-DD HH:mm:ss');
                    let td4=this.doc.createElement("td");
                    
                    if (element.NextID==null) {
                        td4.innerHTML="--";
                    }else{
                        td4.innerHTML=moment(element.NextGDT).format('YYYY-MM-DD HH:mm:ss');
                    }
                    let tr=this.doc.createElement("tr");
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    if ((element.NextID==null)&&(element.EventId!='SWITCH')) {
                        td1.setAttribute("style","color:red;");
                        td2.setAttribute("style","color:red;");
                        td3.setAttribute("style","color:red;");
                        td4.setAttribute("style","color:red;");
                    }

                   

                    this.tbody.appendChild(tr);


                });
            }
            
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


    
    async getEventListCoreDownload(MacArr,Keys){

        
        let beg=$('#Filter3').attr('bdt');
        let end=$('#Filter3').attr('edt');

        //console.log(beg)
        //console.log(end)

        var startTs=moment(beg, "YYYY-MM-DD HH:mm:ss").unix();
        var endTs=moment(end, "YYYY-MM-DD HH:mm:ss").unix();

        //console.log('startTs='+startTs);
        //console.log('endTs='+endTs);

        MacArr=MacArr.join(",");
        Keys=Keys.join(",");

        const data={};
        data.MacArr=MacArr;
        data.Keys=Keys;
        data.startTs=startTs;
        data.endTs=endTs;

        const promise = $.ajax({
            type: 'POST',
            //url: `/StoreAPI/SensorEventLogCore`,
            url: `/StoreAPI/EventList`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data:data,
        });

        promise.done(async (response) => {
            
            console.log('get event list')
            console.log(response);
            
            if (response!=null){

             

                //console.log("get download data");
                console.log(response)

                let data=[];
                response.forEach(element => {

                    // if ((element.eventId=="SWITCH")&&(element.eventValue=="1")) element.eventId="SWITCH_ON";
                    // if ((element.eventId=="SWITCH")&&(element.eventValue=="0")) element.eventId="SWITCH_OFF";

                    //moment(element.GDT).format('YYYY-MM-DD HH:mm:ss');
                    
                    if (element.NextID==null){
                        let item={"事件名稱":this.eventhash.get(element.EventId),"感測器":this.sensorhash.get(element.SMAC),"開始時間":moment(element.GDT).format('YYYY-MM-DD HH:mm:ss'),"結束時間":"--"};
                        data.push(item);
                    }else{

                        let item={"事件名稱":this.eventhash.get(element.EventId),"感測器":this.sensorhash.get(element.SMAC),"開始時間":moment(element.GDT).format('YYYY-MM-DD HH:mm:ss'),"結束時間":moment(element.NextGDT).format('YYYY-MM-DD HH:mm:ss')};
                        data.push(item);
                    }
                    
                   
                });

                this.exportExcel(data);


            }
            
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

    async getPageData(storeid,page){

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/StoreEventByStoreByPage/${storeid}/${page}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {
            console.log('fill tale');
            this.fillTable(response);
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

    showFilter(){

        //console.log('toggle filter');
        $('#Filter1').toggleClass('hidden');
        $('#Filter2').toggleClass('hidden');
        $('#Filter3').toggleClass('hidden');
        $('#calendar').toggleClass('hidden');
        $('#optionPanel').toggleClass('hidden');
        

    }

    changeFilter(){

        
        var Arr1=$('#Filter1').val();
        var Arr2=$('#Filter2').val();
       
       
        // if (this.filter2.value=="0") {
        //     this.getEventListCore(this.macarr,this.filter1.value);
        // }else{
        //     this.getEventListCore(Arr2,Arr1);
        // }

        this.getEventListCore(Arr2,Arr1);
        
       
    }

    exportExcel(jsonData){

        const xlsx = require('xlsx');
        // 將資料轉成workSheet
        //let arrayWorkSheet = xlsx.utils.aoa_to_sheet(arrayData);
        let jsonWorkSheet = xlsx.utils.json_to_sheet(jsonData);
        
        let workBook = {
            SheetNames: ['事件'],
            Sheets: {
                '事件' : jsonWorkSheet,
            }
        };
        // 將workBook寫入檔案
        xlsx.writeFile(workBook, `${this.storename}.xlsx`);


    }

    changeFilter2(){

        console.log('changeFilter2');        
    }

    showModal(){

        console.log('showModal');
        $('#DateTimeDialog').modal('show');

    }

    setStoreName(name){
        this.storename=name;
    }

    dateSubmit(){
        console.log('dateSubmit');
        
        let d1=$('#datetimepicker1').datetimepicker('viewDate').format('YYYY-MM-DD HH:mm:ss');
        let d2=$('#datetimepicker2').datetimepicker('viewDate').format('YYYY-MM-DD HH:mm:ss');
       
        $('#Filter3').attr('bdt',d1);
        $('#Filter3').attr('edt',d2);
        $('#Filter3').val(`${d1} - ${d2}`);
        $('#Filter3').attr('title',`${d1} - ${d2}`);
        $('#DateTimeDialog').modal('hide');

        this.changeFilter();

       
    }

    downloadData(){

        console.log('download data');

        // if (this.filter2.value=="0") {
        //     this.getEventListCoreDownload(this.macarr,this.filter1.value);
        // }else{
        //     this.getEventListCoreDownload(this.filter2.value,this.filter1.value);
        // }

        var Arr1=$('#Filter1').val();
        var Arr2=$('#Filter2').val();

        this.getEventListCoreDownload(Arr2,Arr1);
    }

    setFilterButtonClickEvent(){
        this.filter.removeEventListener('click', this.showFilter);
        this.filter.addEventListener('click', this.showFilter.bind(this), false);
    }

    setFilter1ChangeEvent(){
        this.filter1.removeEventListener('change', this.changeFilter);
        this.filter1.addEventListener('change', this.changeFilter.bind(this), false);
    }

    setFilter2ChangeEvent(){
        this.filter2.removeEventListener('change', this.changeFilter);
        this.filter2.addEventListener('change', this.changeFilter.bind(this), false);
    }

    setFilter3ChangeEvent(){
        this.filter3.removeEventListener('change', this.changeFilter);
        this.filter3.addEventListener('change', this.changeFilter.bind(this), false);
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

    setInitDateTimeEvent(){
        let i;
        let dateString='';
        let dt=new Date();
        for (i = 0; i < 30; i++) {
            if (i>0){
                dt.setDate(dt.getDate() -1);
            }
            var mm = dt.getMonth() + 1; // getMonth() is zero-based
            var dd = dt.getDate();
            var formatdate=[dt.getFullYear(),'-',(mm>9 ? '' : '0') + mm,'-',(dd>9 ? '' : '0') + dd].join('');
            dateString+='<option value="'+formatdate+'">'+formatdate+'</option>';

        }
        $('#Filter3').html(dateString);
    }
}

