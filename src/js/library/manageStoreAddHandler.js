/*eslint-disable*/
import { UnixTimestamp,modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';
import validator from 'validator';
import { mapBoxMapHandler } from '../library/mapBoxMapHandler';

export class ManageStoreAddHandler {

    constructor() {
        this.doc = document;
        this.submit = this.doc.querySelector('#submit');
        this.cancel = this.doc.querySelector('#cancel');
        this.name=this.doc.querySelector('#name');
        this.address=this.doc.querySelector('#address');
        this.latitude=this.doc.querySelector('#latitude');
        this.longitude=this.doc.querySelector('#longitude');
        this.phone=this.doc.querySelector('#phone');
        this.person=this.doc.querySelector('#person');
        this.addGateway=this.doc.querySelector('#addGateway');
        this.addSensor=this.doc.querySelector('#addSensor');
        this.gatewayAvailableList=this.doc.querySelector('#gatewayAvailableList');
        this.sensorAvailableList=this.doc.querySelector('#sensorAvailableList');
        this.gatewaySelectedBody=this.doc.querySelector('#GatewaySelectedBody');
        this.sensorSelectedBody=this.doc.querySelector('#SensorSelectedBody');
        this.gatewaySubmit=this.doc.querySelector('#GatewaySubmit');
        this.sensorSubmit=this.doc.querySelector('#SensorSubmit');
        this.golocation1=this.doc.querySelector('#GoLocation1');
        this.golocation2=this.doc.querySelector('#GoLocation2');
        this.addlocation=this.doc.querySelector('#addLocation');
        this.companyid=0;
        this.langid=1;
        this.id=0;
        
    }

    setCompanyId(companyid){
        this.companyid=companyid;
    }

    setLangId(id){
       
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
        }
    }

    async submitData(){

        if (this.latitude.value.trim()!=''){

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

        if (this.longitude.value.trim()!=''){

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

        $('#name').removeClass("invalid");
        
        if (validator.isEmpty(this.name.value)) {
            $('#name').addClass("invalid");

            modalMsgHandler('modal', 1, oneTerm(this.langid,'storeNameCannotBeEmpty')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });

            return;
        };

        let GatewayArr='';
        for (var j = 0; j < this.gatewaySelectedBody.rows.length; j++) {
                    
            let PK_GatewayID=this.gatewaySelectedBody.rows[j].querySelector('a').getAttribute("pk_gatewayid");
            GatewayArr+=`(@,${PK_GatewayID}),`

        }
        GatewayArr=GatewayArr.slice(0,-1);

        let SensorArr='';
        for (var j = 0; j < this.sensorSelectedBody.rows.length; j++) {
                    
            let PK_SensorID=this.sensorSelectedBody.rows[j].querySelector('a').getAttribute("pk_sensorid");
            SensorArr+=`(@,${PK_SensorID}),`

        }
        SensorArr=SensorArr.slice(0,-1);

        console.log(GatewayArr);
        console.log(SensorArr);
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

        let data={};
        data.CompanyId=this.companyid;
        data.Name=this.name.value;
        data.Address=this.address.value;
        data.Latitude=this.latitude.value;
        data.Longitude=this.longitude.value;
        data.Phone=this.phone.value;
        data.Person=this.person.value;
        data.GatewayArr=GatewayArr;
        data.SensorArr=SensorArr;

        console.log(data)

        const promise = $.ajax({
            type: 'POST',
            url: `/StoreAPI/Store`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data: data
        });
        promise.done(async (response) => {

            console.log(response);
            console.log(this.langid);
            
            modalMsgHandler('modal', 0, oneTerm(this.langid,'successfullyAddedAStore')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();

                    this.setWhiteList();

                    
                }, timeout);
                
            });


        });
        promise.fail((e) => {
            console.log(e.responseText);          
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failedToAddStorePleaseContactTheAdministrator')).then((timeout) => {
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
            GatewayMacArr+=$(this).find("td:first").html()+","
        });
        GatewayMacArr=GatewayMacArr.slice(0,-1);
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

                window.location = `manageStore?companyid=${this.companyid}`;
            
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
        }
        else{

            window.location = `manageStore?companyid=${this.companyid}`;

        }

       
    }

    async setMap(){

        await mapBoxMapHandler.initMap('myMap',23.780117,121.024735);

    }

    async cancelData(){

        window.location=`manageStore?companyid=${this.companyid}`;

    }

    removeGateway(){
        console.log('removeGateway');
    }

   
    addGatewaySubmit(){
        console.log("addGatewaySubmit");

        $('#GatewayList').modal('hide');

        var qryList = document.querySelectorAll('.gateway-item');
        
        for (var i = 0; i < qryList.length; i++) {
            var qryItem = qryList[i];
            
            if (qryItem.checked){
                
                let PK_GatewayID=(qryItem.id).replace("gchk","");
                let Mac=qryItem.getAttribute("mac");
                let Version=qryItem.getAttribute("version");

                let td1=this.doc.createElement("td");
                td1.innerHTML=Mac;
                let td2=this.doc.createElement("td");
                td2.innerHTML='N/A';
                let td3=this.doc.createElement("td");
                td3.innerHTML=((Version=='null')?'N/A':Version);
                let td4=this.doc.createElement("td");
                let a=this.doc.createElement("a");
                a.innerText=oneTerm(this.langid,'delete');
                a.setAttribute("class","msg-delete");
                a.setAttribute("PK_GatewayID",PK_GatewayID);
                a.removeEventListener('click', this.removeGateway);
                a.addEventListener('click', this.removeGateway.bind(this), false);
        
                td4.appendChild(a);
                let tr=this.doc.createElement("tr");
                td1.setAttribute("class","h44");
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                
                $('#GatewaySelectedBody').append(tr);
                $('#GatewaySelected').removeClass('hidden');
                $('#GatewayLabel').addClass('hidden');
            }
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

    goLocation(){

        mapBoxMapHandler.goLocation();

    }

    
    addSensorSubmit(){

        console.log("addSensorSubmit");

        $('#SensorList').modal('hide');

        var qryList = document.querySelectorAll('.sensor-item');
        let FK_SensorID=[]
        for (var i = 0; i < qryList.length; i++) {
            var qryItem = qryList[i];
            
            if (qryItem.checked){
                
                let PK_SensorID=(qryItem.id).replace("schk","");
                let SensorName=qryItem.getAttribute("sensorname");
                let Mac=qryItem.getAttribute("mac");
                console.log(SensorName);
                
                let td1=this.doc.createElement("td");
                td1.innerHTML=((SensorName)?Mac.slice(-4):SensorName);;
                let td2=this.doc.createElement("td");
                td2.innerHTML=Mac;
                let td3=this.doc.createElement("td");
                td3.innerHTML='N/A'
                let td4=this.doc.createElement("td");
                let a=this.doc.createElement("a");
                a.innerText=oneTerm(this.langid,'delete');
                a.setAttribute("class","msg-delete");
                a.setAttribute("PK_SensorID",PK_SensorID);
                a.setAttribute("SensorName",SensorName);
                a.removeEventListener('click', this.removeSensor);
                a.addEventListener('click', this.removeSensor.bind(this), false);
        
                td4.appendChild(a);
                let tr=this.doc.createElement("tr");
                td1.setAttribute("class","h44");
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                
                $('#SensorSelectedBody').append(tr);
                $('#SensorSelected').removeClass('hidden');
                $('#SensorLabel').addClass('hidden');


            }
        }

       

    }

    async removeGateway(event){
     

        event.target.parentNode.parentNode.remove();
        
        if (this.gatewaySelectedBody.rows.length==0){
            $('#GatewaySelected').addClass('hidden');
            $('#GatewayLabel').removeClass('hidden');

        }
        
    }

    async removeSensor(event){
        
        event.target.parentNode.parentNode.remove();
        
        if (this.sensorSelectedBody.rows.length==0){
            $('#SensorSelected').addClass('hidden');
            $('#SensorLabel').removeClass('hidden');

        }
 
    }


    setSubmitButtonClickEvent() {

        this.submit.removeEventListener('click', this.submitData);
        this.submit.addEventListener('click', this.submitData.bind(this), false);

    }

    setCancelButtonClickEvent() {

        this.cancel.removeEventListener('click', this.cancelData);
        this.cancel.addEventListener('click', this.cancelData.bind(this), false);

    }


    setGatewayAvailableButtonClickEvent(){
        this.addGateway.removeEventListener('click', this.setGatewayAvailableList);
        this.addGateway.addEventListener('click', this.setGatewayAvailableList.bind(this), false);
    }

    setSensorAvailableButtonClickEvent(){
        this.addSensor.removeEventListener('click', this.setSensorAvailableList);
        this.addSensor.addEventListener('click', this.setSensorAvailableList.bind(this), false);
    }

    setGatewaySelectedButtonClickEvent(){
        this.gatewaySubmit.removeEventListener('click', this.addGatewaySubmit);
        this.gatewaySubmit.addEventListener('click', this.addGatewaySubmit.bind(this), false);
    }

    setSensorSelectedButtonClickEvent(){
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

    setGatewayAvailableList(){
        console.log("addGateway");
        $('#GatewayList').modal('show');

        const promise = $.ajax({
            type: 'GET',
            url: `/DeviceAPI/GatewayAvailableByCompany/${this.companyid}`,
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

                this.gatewayAvailableList.innerHTML="";
                res[0].forEach(item => {

                    console.log(this.gatewaySelectedBody.rows.length)

                    let flag=true;
                    for (var j = 0; j < this.gatewaySelectedBody.rows.length; j++) {
                    
                        let PK_GatewayID=this.gatewaySelectedBody.rows[j].querySelector('a').getAttribute("pk_gatewayid");
                        if (PK_GatewayID==item.PK_GatewayID) flag=false;

                    }

                    if (flag){

                        let td=this.doc.createElement("td");
                        td.innerHTML=`
                        <div>
                            <label class="cursor mb-0">
                                <input type="checkbox" class="hide gateway-item" id="gchk${item.PK_GatewayID}" mac="${item.MAC}"  version="${item.Version}" >
                                <i class="fa fa-fw fa-check-square chks"></i>&nbsp;${item.MAC}   
                            </label>
                        </div>
                        `;
                        //td.appendChild(div);
                        let tr=this.doc.createElement("tr");
                        tr.appendChild(td);
                        this.gatewayAvailableList.appendChild(tr);

                    }



                    
                   

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

    setSensorAvailableList(){
        console.log("addSensor");
        $('#SensorList').modal('show');

        const promise = $.ajax({
            type: 'GET',
            url: `/DeviceAPI/SensorAvailableByCompany/${this.companyid}`,
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
                res[0].forEach(item => {
                    

                    let flag=true;
                    for (var j = 0; j < this.sensorSelectedBody.rows.length; j++) {
                    
                        let PK_SensorID=this.sensorSelectedBody.rows[j].querySelector('a').getAttribute("pk_sensorid");
                        if (PK_SensorID==item.PK_SensorID) flag=false;
    
                    }
    
                    if (flag){
    
                        let td=this.doc.createElement("td");
                        td.innerHTML=`
                        <div>
                            <label class="cursor mb-0">
                                <input type="checkbox" class="hide sensor-item" id="schk${item.PK_SensorID}" mac="${item.MAC}" sensorname="${item.Name}">
                                <i class="fa fa-fw fa-check-square chks"></i>&nbsp;${(item.Name==null)?item.MAC:item.Name}   
                            </label>
                        </div>
                        `;
                        //td.appendChild(div);
                        let tr=this.doc.createElement("tr");
                        tr.appendChild(td);
                        this.sensorAvailableList.appendChild(tr);
    
                    }



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

}

