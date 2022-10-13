/*eslint-disable*/
import { UnixTimestamp,modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';
import validator from 'validator';
import { runInThisContext } from 'vm';

export class ManageSensorAddHandler {

    constructor() {
        this.doc = document;
        this.submit = this.doc.querySelector('#submit');
        this.company = this.doc.querySelector('#Company');
        this.mac=this.doc.querySelector('#mac');
        this.name=this.doc.querySelector('#name');
        this.ot=this.doc.querySelector('#OT');
        this.ut=this.doc.querySelector('#UT');
        this.a=this.doc.querySelector('#A');
        this.b=this.doc.querySelector('#B');
        this.mode=this.doc.querySelector('#MODE');
        this.inactivity=this.doc.querySelector('#INACTIVITY');
        this.logfreq=this.doc.querySelector('#LOGFREQ');
        this.lbatt=this.doc.querySelector('#LBATT');
        this.exp_d=this.doc.querySelector('#EXP_D');
        this.exp_h=this.doc.querySelector('#EXP_H');
        this.exp_m=this.doc.querySelector('#EXP_M');
        this.groupid=this.doc.querySelector('#groupid');
       
        this.addstore=this.doc.querySelector('#addStore');
        this.storeAvailableList=this.doc.querySelector('#StoreAvailableList');
        this.storeSelectedBody=this.doc.querySelector('#StoreSelectedBody');
        this.storesubmit=this.doc.querySelector('#StoreSubmit');
        this.langid=1;
        this.companyid=0;
        
    }

    setCompanyId(id){
        this.companyid=id;
        console.log(this.companyid)
    }

    setLangId(id){
       
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
        }
    }

    async setModeOption(){
        //$('#MODE')

        $('#MODE').append($('<option>', {
            value: 2649715235,
            text: oneTerm(this.langid,'logMode')
        }));

        $('#MODE').append($('<option>', {
            value: 2649715217,
            text: oneTerm(this.langid,'broadcastMode')
        }));

    }

    async setExpList(){

        let EXP_D=$('#EXP_D')
        for (let i = 0; i < 100; i++) {
            let item=this.doc.createElement("option")
            item.text=(`0${i}D`).slice(-3);
            item.validator=i;
            if (i==5) item.selected=true;
            $('#EXP_D').append(item);
        }
        for (let i = 0; i < 24; i++) {
            let item=this.doc.createElement("option")
            item.text=(`0${i}H`).slice(-3);
            item.validator=i;
            $('#EXP_H').append(item);
        }
        for (let i = 0; i < 60; i++) {
            let item=this.doc.createElement("option")
            item.text=(`0${i}M`).slice(-3);
            item.validator=i;
            $('#EXP_M').append(item);
        }
           
    }

    async setCompanyList(){

        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
        const companyid=queryObject.companyid;

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

            $('#Company').innerHTML='';

            res[0].forEach(item => {

                let opt=document.createElement("option");
                opt.text=item.Name;
                opt.value=item.PK_CompanyID;
                if (item.PK_CompanyID==companyid) opt.setAttribute("selected","true");
                $('#Company').append(opt);
          
            });

           

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

    checkSensorMac(mac){

        const promise = $.ajax({
            type: 'GET',
            url: `/DeviceAPI/CheckSensorMac/${mac}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        return promise;
    }

    async createSensorData(){

        let StoreArr='';
        for (var j = 0; j < this.storeSelectedBody.rows.length; j++) {
                    
            let PK_StoreID=this.storeSelectedBody.rows[j].querySelector('a').getAttribute("pk_storeid");
            StoreArr+=`(${PK_StoreID},@),`

        }
        StoreArr=StoreArr.slice(0,-1);
        
        const data = {};
        data.Name=this.name.value;
        data.MAC=this.mac.value;
        data.OT=this.ot.value;
        data.UT=this.ut.value;
        data.A=this.a.value;
        data.B=this.b.value;
        data.MODE=this.mode.value;
        data.INACTIVITY=this.inactivity.value;
        data.LOGFREQ=this.logfreq.value;
        data.LBATT=Math.round((parseFloat(this.lbatt.value)-2)*100);
        data.EXP=parseInt(this.exp_d.value)*24*60*60+parseInt(this.exp_h.value)*60*60+parseInt(this.exp_m.value)*60;
        data.FK_CompanyID=this.companyid;
        data.StoreArr = StoreArr;

        console.log(data);

        const promise = $.ajax({
            type: 'POST',
            url: '/DeviceAPI/Sensor',
            async: true,
            crossDomain: true,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });
        promise.done(async (response) => {

            const url = require('url');
            const queryObject = url.parse(window.location.href,true).query;
            const companyid=queryObject.companyid;

            console.log(response)
            modalMsgHandler('modal', 0, oneTerm(this.langid,'successfullyAddedASensor')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);

                window.location = `manageSensor?companyid=${this.companyid}`;
                
            });

            

        });
        promise.fail((e) => {
            
            console.log(e.responseText)   
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failed')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });


        
        });

    }

    

    async submitData(){

        $('#mac').removeClass("invalid");
        $('#name').removeClass("invalid");
        $('#A').removeClass("invalid");
        $('#B').removeClass("invalid");
        $('#LBATT').removeClass("invalid");
        $('#OT').removeClass("invalid");
        $('#UT').removeClass("invalid");
        $('#INACTIVITY').removeClass("invalid");
        $('#LOGFREQ').removeClass("invalid");
       

        if (!validator.isMACAddress(this.mac.value,{no_colons: true})) {
            $('#mac').addClass("invalid");
            
            modalMsgHandler('modal', 1,'MAC '+ oneTerm(this.langid,'invalidFormat')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;
        }

        if (!validator.isFloat(this.a.value)) {
            $('#A').addClass("invalid");
            
            modalMsgHandler('modal', 1,'A '+ oneTerm(this.langid,'invalidFormat')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;
        }

        if (!validator.isFloat(this.b.value)) {
            $('#B').addClass("invalid");
            
            modalMsgHandler('modal', 1,'B '+ oneTerm(this.langid,'invalidFormat')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;
        }

        if (!validator.isFloat(this.lbatt.value)) {
            $('#LBATT').addClass("invalid");
            
            modalMsgHandler('modal', 1,'LBATT '+ oneTerm(this.langid,'invalidFormat')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;
        }

        if (!validator.isFloat(this.ot.value)) {
            $('#OT').addClass("invalid");
            
            modalMsgHandler('modal', 1,'OT '+ oneTerm(this.langid,'invalidFormat')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;
        }

        if (!validator.isFloat(this.ut.value)) {
            $('#UT').addClass("invalid");
            
            modalMsgHandler('modal', 1,'UT '+ oneTerm(this.langid,'invalidFormat')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;
        }

        if (!validator.isInt(this.inactivity.value)) {
            $('#INACTIVITY').addClass("invalid");
            
            modalMsgHandler('modal', 1,'INACTIVITY '+ oneTerm(this.langid,'invalidFormat')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;
        }
        
        if (!validator.isInt(this.logfreq.value, { min: 60, max: 43200 })) {
            $('#LOGFREQ').addClass("invalid");
            
            modalMsgHandler('modal', 1,'LOGFREQ '+ oneTerm(this.langid,'invalidFormat')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;
        }

        let inactivity=parseInt(this.inactivity.value);
        let logfreq=parseInt(this.logfreq.value);
        if (logfreq>(inactivity*60)){
            $('#LOGFREQ').addClass("invalid");
            
            modalMsgHandler('modal', 1,`LOGFREQ ${oneTerm(this.langid,'shouldNotGreaterThanValueOfInactivity')} ${inactivity*60}`).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;
        }




        let ans=this.checkSensorMac(this.mac.value);

        ans.done((response) => {

            console.log(response[0][0].cc);
            console.log(response[1]);

            let counter=response[0][0].cc;

            if (counter==0){

                this.createSensorData();

            }else{

                $('#mac').addClass("invalid");

                modalMsgHandler('modal', 1, oneTerm(this.langid,'macDuplicated')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });
                return;

            }


        });
        ans.fail((e) => {
            
            console.log(e.responseText)   
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failed')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
            return;
        });


       

        

        

    }

    companyChange(){

        console.log('companyChange');
        this.storeSelectedBody.innerHTML='';
        this.companyid=$('#Company').val();
        this.updateStoreList();
   
    }

    setSensorConfigCore(config){

        console.log(config);

        const promise = $.ajax({
            type: 'PATCH',
            url: `/StoreAPI/SensorConfigCore/${config.deviceId}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data:config,
        });

        promise.done(async (response) => {
             
            console.log(`update to core complete`);
            console.log(response);
            window.location = `manageSensor?companyid=${this.companyid}`;

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


    setSubmitButtonClickEvent() {

        this.submit.removeEventListener('click', this.submitData);
        this.submit.addEventListener('click', this.submitData.bind(this), false);

    }

    setAddStoreButtonClickEvent() {

        this.addstore.removeEventListener('click', this.addStore);
        this.addstore.addEventListener('click', this.addStore.bind(this), false);

    }

    setSubmitStoreButtonClickEvent() {

        this.storesubmit.removeEventListener('click', this.storeSubmit);
        this.storesubmit.addEventListener('click', this.storeSubmit.bind(this), false);

    }

    async setCompanyChangeEvent(){

        this.company.removeEventListener('change', this.companyChange);
        this.company.addEventListener('change', this.companyChange.bind(this), false);

    }

    addStore(){

        console.log("addStore");
        this.updateStoreList();
        $('#StoreList').modal('show');

    }


    updateStoreList() {

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/StoreAvailableByCompany/${this.companyid}`,
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

                this.storeAvailableList.innerHTML="";
                let tbody=this.doc.createElement("tbody");
                tbody.setAttribute("class","modal-body");
                res[0].forEach(item => {

                    let flag=true;
                    for (var j = 0; j < this.storeSelectedBody.rows.length; j++) {
                    
                        let PK_StoreID=this.storeSelectedBody.rows[j].querySelector('a').getAttribute("pk_storeid");
                        if (PK_StoreID==item.PK_StoreID) flag=false;

                    }

                    if (flag){

                        let td=this.doc.createElement("td");
                        td.innerHTML=`
                        <div>
                            <label class="cursor mb-0">
                                <input type="checkbox" class="hide store-item" id="chk${item.PK_StoreID}" storename="${item.Name}" storeaddress="${item.Address}">
                                <i class="fa fa-fw fa-check-square chks"></i>&nbsp;${item.Name}   
                            </label>
                        </div>
                        `;
                    
                        let tr=this.doc.createElement("tr");
                        tr.appendChild(td);
                        tbody.appendChild(tr);

                    }

                });
                this.storeAvailableList.appendChild(tbody);
            }

        });

        promise.fail((e) => {
            modalMsgHandler('modal', 1,oneTerm(this.langid,'failedToQueryDataPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
        });

    }

    storeSubmit() {

        console.log('storeSubmit');

        $('#StoreList').modal('hide');

        var qryList = document.querySelectorAll('.store-item');
        let FK_StoreID=[]
        for (var i = 0; i < qryList.length; i++) {
            var qryItem = qryList[i];
            
            if (qryItem.checked){
                FK_StoreID.push((qryItem.id).replace("chk",""));
                let PK_StoreID=(qryItem.id).replace("chk","");
                let Name=qryItem.getAttribute("storename");
                let Address=qryItem.getAttribute("storeaddress");
                let td1=this.doc.createElement("td");
                td1.innerHTML=Name;
                let td2=this.doc.createElement("td");
                td2.innerHTML=((Address=='null')?'&nbsp;':Address+'&nbsp;');
                let td3=this.doc.createElement("td");
                let a=this.doc.createElement("a");
                a.innerText=oneTerm(this.langid,'delete');
                a.setAttribute("class","msg-delete");
                a.setAttribute("PK_StoreID",PK_StoreID);
                a.removeEventListener('click', this.removeStore);
                a.addEventListener('click', this.removeStore.bind(this), false);

                td3.appendChild(a);
                let tr=this.doc.createElement("tr");
                td1.setAttribute("class","h44");
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
               
                $('#StoreSelectedBody').append(tr);
                $('#StoreSelected').removeClass('hidden');
                $('#StoreLabel').addClass('hidden');

            }
        }



    }

    removeStore(event){
        
        event.target.parentNode.parentNode.remove()
        
        if (this.storeSelectedBody.rows.length==0){
            $('#StoreSelected').addClass('hidden');
            $('#StoreLabel').removeClass('hidden');

        }

    }
}

