/*eslint-disable*/
import { UnixTimestamp,modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';
import validator from 'validator';
import { mapBoxMapHandler } from '../library/mapBoxMapHandler';
import { trim } from 'lodash';

export class ManageStoreEditHandler {

    constructor() {
        this.doc = document;
        this.confirm = this.doc.querySelector('#StoreDeleteConfirm');
        this.delete = this.doc.querySelector('#StoreDelete');
        this.submit = this.doc.querySelector('#submit');
        this.modal = this.doc.querySelector('#ConfirmDialog');
        this.name=this.doc.querySelector('#name');
        this.address=this.doc.querySelector('#address');
        this.latitude=this.doc.querySelector('#latitude');
        this.longitude=this.doc.querySelector('#longitude');
        this.phone=this.doc.querySelector('#phone');
        this.person=this.doc.querySelector('#person');
        this.addGateway=this.doc.querySelector('#addGateway');
        this.addSensor=this.doc.querySelector('#addSensor');
        this.golocation1=this.doc.querySelector('#GoLocation1');
        this.golocation2=this.doc.querySelector('#GoLocation2');
        this.gatewayAvailableList=this.doc.querySelector('#gatewayAvailableList');
        this.sensorAvailableList=this.doc.querySelector('#sensorAvailableList');
        this.gatewaySubmit=this.doc.querySelector('#GatewaySubmit');
        this.sensorSubmit=this.doc.querySelector('#SensorSubmit');
        this.addlocation=this.doc.querySelector('#addLocation');
        this.companyid=0;
        this.langid=1;
        this.groupid=0;
        this.id=0;
    }

    setId(storeID){
        this.id=storeID;
    }

    setCompanyId(companyID){
        this.companyid=companyID;
    }

    setGroupId(groupID){
        this.groupid=groupID;
    }

    setLangId(id){
       
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
        }
    }


    showModal(){
        
        $('#ConfirmDialog').modal('show');
       
    }

    async deleteStore(){


        $('#ConfirmDialog').modal('hide');

        const promise = $.ajax({
            type: 'DELETE',
            url: `/StoreAPI/Store/${this.id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
           
        });

        promise.done(async (response) => {

            modalMsgHandler('modal', 0,oneTerm(this.langid,'storeDeletedSuccessfully')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                    window.location = `manageStore`;
                }, timeout);
                
            });

            //console.log('刪除店家成功')

        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failedToDeleteTheStorePleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });

            
        });

        

    }

    async setMap(){

        await mapBoxMapHandler.initMap('myMap',23.780117,121.024735);

    }

    async editStoreDone(){

        if (trim(this.latitude.value)!=''){

            if (!validator.isNumeric(this.latitude.value,{no_colons: true})) {
                $('#latitude').addClass("invalid");
                
                modalMsgHandler('modal', 1,oneTerm(this.langid,'latitude')+' '+ oneTerm(this.langid,'invalidFormat')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                });

                return;
            }

            let lat=parseFloat(this.latitude.value);
            if ((lat>90)||(lat<-90)){

                $('#latitude').addClass("invalid");
                modalMsgHandler('modal', 1,oneTerm(this.langid,'latitude')+' '+ oneTerm(this.langid,'invalidFormat')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                });

                return;
            }

        }

        if (trim(this.longitude.value)!=''){

            if (!validator.isNumeric(this.longitude.value,{no_colons: true})) {
                $('#longitude').addClass("invalid");
                
                modalMsgHandler('modal', 1,oneTerm(this.langid,'longitude')+' '+ oneTerm(this.langid,'invalidFormat')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                });

                return;
            }

            let lng=parseFloat(this.longitude.value);
            if ((lng>180)||(lng<-180)){

                $('#longitude').addClass("invalid");
                modalMsgHandler('modal', 1,oneTerm(this.langid,'longitude')+' '+ oneTerm(this.langid,'invalidFormat')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                });

                return;
            }

        }

        let d1=$('#expireDateStr').val();

        let lat=this.latitude.value;
        let lng=this.longitude.value;
        if (lat.length>9){
            let pindex=lat.indexOf('.');
            lat=lat.substring(0,pindex+7);
        }
        if (lng.length>9){
            let pindex=lng.indexOf('.');
            lng=lng.substring(0,pindex+7);
        }

        this.latitude.value=lat;
        this.longitude.value=lng;

    
        const data={};
        data.Name=this.name.value;
        data.Address=this.address.value;
        data.Latitude=this.latitude.value;
        data.Longitude=this.longitude.value;
        data.Phone=this.phone.value;
        data.Person=this.person.value;
        data.ExpireDate='';
        //data.ExpireDate=d1;

        console.log(data);

        const promise = $.ajax({
            type: 'PATCH',
            url: `/StoreAPI/Store/${this.id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data: data,
        });

        promise.done(async (response) => {
            
            modalMsgHandler('modal', 0, oneTerm(this.langid,'modifyTheStoreSuccessfully')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                    //window.location = `manageStore?companyid=${this.companyid}`;

                    this.setWhiteList();

                }, timeout);
                
            });

        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failedToModifyTheStorePleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });

        
    }

    setWhiteList(){

        console.log("setWhiteList");

        //console.log($('#GatewaySelectedBody').DataTable())

        let GatewayMacArr='';
        $('#GatewaySelectedBody  tr').each(function() {
            GatewayMacArr+=$(this).find("td:nth-child(2)").html()+","
        });
        GatewayMacArr=GatewayMacArr.slice(0,-1);
        console.log('---GatewayMacArr---');
        console.log(GatewayMacArr);

        let SensorMacArr='';
        $('#SensorSelectedBody  tr').each(function() {
            SensorMacArr+=$(this).find("td:nth-child(2)").html()+","
        });
        SensorMacArr=SensorMacArr.slice(0,-1);
        console.log(SensorMacArr);

        let data={};
        data.GatewayMacArr=GatewayMacArr;
        data.SensorMacArr=SensorMacArr;

        if (GatewayMacArr.length>0){

            const promise = $.ajax({
                type: 'POST',
                url: `/StoreAPI/WhiteList`,
                async: true,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                },
                data:data,
            });
    
            promise.done(async (res) => {
    
                console.log(res);
    
                window.location = `manageStore`;
    
            });
    
            promise.fail((e) => {
    
                console.log(e)
                
                modalMsgHandler('modal', 1, oneTerm(this.langid,'failedToSetTheWhitelistPleaseContactTheAdministrator')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });
          
            });

        }else{

            window.location = `manageStore`;

        }

        

       
    }

    addGatewayEvent(){
        console.log("addGateway");
        $('#GatewayList').modal('show');

        const promise = $.ajax({
            type: 'GET',
            url: `/DeviceAPI/GatewayAvailableByStore/${this.id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });

        promise.done(async (res) => {

            if (res[0].length>0){

                this.gatewayAvailableList.innerHTML="";
                let tbody=this.doc.createElement("tbody");
                tbody.setAttribute("class","modal-body");
                let myGatewayList='';
                res[0].forEach(item => {
                  
                    let td=this.doc.createElement("td");
                    td.innerHTML=`
                    <div class=' d-flex flex-row justify-content-between align-items-center'>
                        <label class="cursor mb-0">
                            <input type="checkbox" class="hide gateway-item" id="gchk${item.PK_GatewayID}">
                            <i class="fa fa-fw fa-check-square chks"></i>&nbsp;${item.MAC}  
                           
                        </label>
                        <div id='${item.MAC}'>
                        </div> 
                    </div>
                    `;
                    //td.appendChild(div);
                    let tr=this.doc.createElement("tr");
                    tr.appendChild(td);
                    tbody.appendChild(tr);
                    myGatewayList+=`${item.PK_GatewayID},`;


                });
                this.gatewayAvailableList.appendChild(tbody);
                if (myGatewayList.length>0){
                    myGatewayList=myGatewayList.slice(0,-1);
                    this.updateGatewayStatus(myGatewayList);
                }
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

    addSensorEvent(){
        console.log("addSensor");
        $('#SensorList').modal('show');

        const promise = $.ajax({
            type: 'GET',
            url: `/DeviceAPI/SensorAvailableByStore/${this.id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });

        promise.done(async (res) => {

            console.log(res);

            if (res[0].length>0){

                this.sensorAvailableList.innerHTML="";
                let tbody=this.doc.createElement("tbody");
                tbody.setAttribute("class","modal-body");
                res[0].forEach(item => {
                   
                    let td=this.doc.createElement("td");
                    td.innerHTML=`
                    <div>
                        <label class="cursor mb-0">
                            <input type="checkbox" class="hide sensor-item" id="schk${item.PK_SensorID}">
                            <i class="fa fa-fw fa-check-square chks"></i>&nbsp;${item.Name==null?item.MAC:item.Name}   
                        </label>
                    </div>
                    `;
                   
                    let tr=this.doc.createElement("tr");
                    tr.appendChild(td);
                    tbody.appendChild(tr);

                });
                this.sensorAvailableList.appendChild(tbody);
            }
           
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1,  oneTerm(this.langid,'failedToQueryDataPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });



    }

    addGatewaySubmit(){
        console.log("addGatewaySubmit");

        $('#GatewayList').modal('hide');

        var qryList = document.querySelectorAll('.gateway-item');
        let FK_GatewayID=[]
        for (var i = 0; i < qryList.length; i++) {
            var qryItem = qryList[i];
            
            if (qryItem.checked){
                FK_GatewayID.push((qryItem.id).replace("gchk",""));
            }
        }

        FK_GatewayID=FK_GatewayID.join(",");
        console.log(FK_GatewayID);

        if (FK_GatewayID.length>0){

            let data={};
            data.FK_GatewayID=FK_GatewayID;

            const promise = $.ajax({
                type: 'POST',
                url: `/StoreAPI/StoreAddGateway/${this.id}`,
                async: true,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                },
                data:data,
            });

            promise.done(async (res) => {

                console.log(res);
                this.setGatewayList();
             
            });
    
            promise.fail((e) => {
                
                modalMsgHandler('modal', 1,  oneTerm(this.langid,'failedToQueryDataPleaseContactTheAdministrator')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });
          
            });
    

        }

    }

    addSensorSubmit(){

        console.log("addSensorSubmit");

        $('#SensorList').modal('hide');

        var qryList = document.querySelectorAll('.sensor-item');
        let FK_SensorID=[]
        for (var i = 0; i < qryList.length; i++) {
            var qryItem = qryList[i];
            
            if (qryItem.checked){
                FK_SensorID.push((qryItem.id).replace("schk",""));
            }
        }

        FK_SensorID=FK_SensorID.join(",");
        console.log(FK_SensorID);

        if (FK_SensorID.length>0){

            let data={};
            data.FK_SensorID=FK_SensorID;

            const promise = $.ajax({
                type: 'POST',
                url: `/StoreAPI/StoreAddSensor/${this.id}`,
                async: true,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                },
                data:data,
            });

            promise.done(async (res) => {

                console.log(res);
                this.setSensorList();
             
            });
    
            promise.fail((e) => {
                
                modalMsgHandler('modal', 1,  oneTerm(this.langid,'failedToQueryDataPleaseContactTheAdministrator')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });
          
            });
    

        }

    }

    addLocationEvent(){
       
        let myClass=$('#mapLock').attr('class');
        if (myClass.indexOf('fa-lock-open')>0){
            $('#mapLock').attr('class','fas fa-lock fa-fw fa-lg');
        }else{
            $('#mapLock').attr('class','fas fa-lock-open fa-fw fa-lg');
        }
       
    }


    setConfirmButtonClickEvent() {
        this.confirm.removeEventListener('click', this.showModal);
        this.confirm.addEventListener('click', this.showModal.bind(this), false);
    }

    setDeleteButtonClickEvent(){
        this.delete.removeEventListener('click', this.deleteStore);
        this.delete.addEventListener('click', this.deleteStore.bind(this), false);
    }

    setSubmitButtonClickEvent(){
        this.submit.removeEventListener('click', this.editStoreDone);
        this.submit.addEventListener('click', this.editStoreDone.bind(this), false);
    }

    setGatewayButtonClickEvent(){
        this.addGateway.removeEventListener('click', this.addGatewayEvent);
        this.addGateway.addEventListener('click', this.addGatewayEvent.bind(this), false);
    }

    goLocation(){

        mapBoxMapHandler.goLocation();

    }

    setSensorButtonClickEvent(){
        this.addSensor.removeEventListener('click', this.addSensorEvent);
        this.addSensor.addEventListener('click', this.addSensorEvent.bind(this), false);
    }

    setGatewaySubmitClickEvent(){
        this.gatewaySubmit.removeEventListener('click', this.addGatewaySubmit);
        this.gatewaySubmit.addEventListener('click', this.addGatewaySubmit.bind(this), false);
    }

    setSensorSubmitClickEvent(){
        this.sensorSubmit.removeEventListener('click', this.addSensorSubmit);
        this.sensorSubmit.addEventListener('click', this.addSensorSubmit.bind(this), false);
    }

    setAddLocationClickEvent(){
        this.addlocation.removeEventListener('click', this.addLocationEvent);
        this.addlocation.addEventListener('click', this.addLocationEvent.bind(this), false);
    }

    setGoLocationClickEvent(){
        this.golocation1.removeEventListener('click', this.goLocation);
        this.golocation1.addEventListener('click', this.goLocation.bind(this), false);
        this.golocation2.removeEventListener('click', this.goLocation);
        this.golocation2.addEventListener('click', this.goLocation.bind(this), false);
    }


    setGatewayList(){

        console.log('setGatewayList')

        const promise = $.ajax({
            type: 'GET',
            url: `/DeviceAPI/GatewayByStoreID/${this.id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });

        promise.done(async (res) => {
            console.log('success');
            console.log(res);
            if (res!=undefined){
                $('#GatewaySelectedBody').html('');
                res.forEach(ele =>{
                    //console.log(ele.MAC);
                    let td1=this.doc.createElement("td");
                    td1.innerHTML=ele.Name?ele.Name:ele.Mac.slice(-4);
                    let td2=this.doc.createElement("td");
                    td2.innerHTML=ele.Mac;
                    let td3=this.doc.createElement("td");
                    td3.innerHTML="";
                    td3.setAttribute('id',ele.Mac);
                    let td4=this.doc.createElement("td");
                    td4.setAttribute("class","cursor");
                    let link=document.createElement("div");
                    link.setAttribute('style','vertical-align:middle;')
                    link.innerHTML= `<i class="fas fa-trash-alt fa-2x mr-2 icon-delete"></i>${oneTerm(this.langid,'delete')}`;
                    if (this.groupid<=3){

                        td4.removeEventListener('click', this.removeGateway);
                        td4.addEventListener('click', this.removeGateway.bind(this,ele.PK_StoreGatewayID), false);
                    }
                    td4.appendChild(link);

                    // let a=this.doc.createElement("a");
                    // a.innerText=oneTerm(this.langid,'delete');
                  
                    // if (this.groupid<=3){

                    //     a.setAttribute("class","msg-delete");
                    //     a.setAttribute("PK_StoreGatewayID",ele.PK_StoreGatewayID);
                    //     a.removeEventListener('click', this.removeGateway);
                    //     a.addEventListener('click', this.removeGateway.bind(this), false);

                    // }

                    // td4.appendChild(a);


                    // let td4=this.doc.createElement("td");
                    // td4.setAttribute("class","cursor");
                    // let link=document.createElement("div");
                    // link.setAttribute('style','vertical-align:middle;')
                    // link.innerHTML= `<i class="fas fa-trash-alt fa-2x mr-2 icon-delete"></i>${oneTerm(this.langid,'delete')}`;
                    // if (this.groupid<=3){

                    //     //a.setAttribute("class","msg-delete");
                    //     td4.setAttribute("PK_StoreSensorID",ele.PK_StoreSensorID);
                    //     td4.removeEventListener('click', this.removeSensor);
                    //     td4.addEventListener('click', this.removeSensor.bind(this,ele.PK_StoreSensorID), false);
                    // }
                    // td4.appendChild(link);




                    let tr=this.doc.createElement("tr");
                    td1.setAttribute("class","h44");
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    $('#GatewaySelectedBody').append(tr);
                    $('#GatewaySelected').removeClass('hidden');
                    $('#GatewayLabel').addClass('hidden');

                    this.updateGatewayStatus(ele.FK_GatewayID.toString());
                });
            }
            else{
                $('#GatewayLabel').removeClass('hidden');
                $('#GatewaySelected').addClass('hidden');
            }
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1,  oneTerm(this.langid,'failedToQueryDataPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });
    }

    async updateGatewayStatus(myGatewayList){

        let data={};
        data.GatewayList=myGatewayList;

        const promise = $.ajax({
            type: 'POST',
            url: `/DeviceAPI/GatewayStatus`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data: data,
        });

        promise.done(async (res) => {
   
            res[0].forEach(item => {

                let myObj=this.doc.getElementById(item.GMAC);
               
                if (item.GStatus=='Offline'){
                    myObj.innerHTML= `<div class='d-flex flex-row align-items-center'><i class="fas fa-power-off fa-2x mr-2 msg-red-noline"></i>${oneTerm(this.langid,'offline')}</div>`;
                }
                else{
                    myObj.innerHTML= `<div class='d-flex flex-row align-items-center'><i class="fas fa-power-off fa-2x mr-2 msg-blue-noline"></i>${oneTerm(this.langid,'online')}</div>`;
                }
               
            });

           

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

    async toggleChange(FK_SensorID){
       
        let Subs=$(`#checkbox_${FK_SensorID}`).is(":checked");
        let data={};
        data.SensorID=FK_SensorID;
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

    setSensorList(){

        console.log('setSensorList')

        const promise = $.ajax({
            type: 'GET',
            url: `/DeviceAPI/SensorByStoreID/${this.id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });

        promise.done(async (res) => {
 
            if (res!=undefined){
                $('#SensorSelectedBody').html('');
                res.forEach(ele =>{
                    //console.log(ele);
                    let td1=this.doc.createElement("td");
                    td1.innerHTML=ele.Name?ele.Name:(ele.MAC).slice(-4);
                    let td2=this.doc.createElement("td");
                    td2.innerHTML=ele.MAC;
                    let td3=this.doc.createElement("td");
                    //td3.innerHTML="N/A";
                    td3.setAttribute('id',ele.MAC);
                    if (ele.LastStatus=='Offline'){
                        td3.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-power-off fa-2x mr-2 msg-red-noline"></i>${oneTerm(this.langid,'lost')}</div>`;
                    }else if(ele.LastStatus=='Idle'){
                        td3.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-power-off fa-2x mr-2 msg-yellow-noline"></i>${oneTerm(this.langid,'idle')}</div>`;
                    }
                    else{
                        td3.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-power-off fa-2x mr-2 msg-blue-noline"></i>${oneTerm(this.langid,'working')}</div>`;
                    
                    }
                    let td4=this.doc.createElement("td");
                    td4.setAttribute("class","cursor");
                    let link=document.createElement("div");
                    link.setAttribute('style','vertical-align:middle;')
                    link.innerHTML= `<i class="fas fa-trash-alt fa-2x mr-2 icon-delete"></i>${oneTerm(this.langid,'delete')}`;
                    if (this.groupid<=3){

                        //a.setAttribute("class","msg-delete");
                        td4.setAttribute("PK_StoreSensorID",ele.PK_StoreSensorID);
                        td4.removeEventListener('click', this.removeSensor);
                        td4.addEventListener('click', this.removeSensor.bind(this,ele.PK_StoreSensorID), false);
                    }
                    td4.appendChild(link);

                    let td5=this.doc.createElement("td");
                    let td5_label=this.doc.createElement("label");
                    let td5_input=this.doc.createElement("input");
                    let td5_span=this.doc.createElement("span");
                    td5_label.setAttribute('class','switch mt-2');
                    td5_input.setAttribute('type','checkbox');
                    td5_input.setAttribute('id',`checkbox_${ele.FK_SensorID}`);
                    td5_span.setAttribute('class','slider round');
                    td5_label.appendChild(td5_input);
                    td5_label.appendChild(td5_span);
                    td5.appendChild(td5_label);
                    td5_input.addEventListener('change', this.toggleChange.bind(this,ele.FK_SensorID), false);
                    if (ele.PK_SubsID){
                        td5_input.setAttribute('checked','checked');
                    }else{
                        td5_input.removeAttribute('checked');
                    }


                    let tr=this.doc.createElement("tr");
                    td1.setAttribute("class","h44");
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);
                    $('#SensorSelectedBody').append(tr);
                    $('#SensorSelected').removeClass('hidden');
                    $('#SensorLabel').addClass('hidden');
                });
            }
            else{
                $('#SensorLabel').removeClass('hidden');
                $('#SensorSelected').addClass('hidden');
            }
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1,  oneTerm(this.langid,'registrationSuccess')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });
    }

    async removeGateway(PK_StoreGatewayID){
        
        const promise = $.ajax({
            type: 'DELETE',
            url: `/DeviceAPI/RemoveStoreGateway/${PK_StoreGatewayID}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });

        promise.done(async (res) => {

            console.log(res);
            this.setGatewayList();
          
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failedToDeleteTheGatewayPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });

        
    }

    async removeSensor(PK_StoreSensorID){
        //alert(e.target);
       

        const promise = $.ajax({
            type: 'DELETE',
            url: `/DeviceAPI/RemoveStoreSensor/${PK_StoreSensorID}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });

        promise.done(async (res) => {

            console.log(res);
            this.setSensorList();
          
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failedToDeleteTheSensorPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });

        
    }

    
}

