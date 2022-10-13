/*eslint-disable*/
import { modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';
import validator from 'validator';

export class ManageSensorEditHandler {

    constructor() {
        this.doc = document;
        this.submit = this.doc.querySelector('#submit');
        this.title = this.doc.querySelector('#title');
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
        this.addbutton=this.doc.querySelector('#addStore');
        this.deleteconfirm=this.doc.querySelector('#DeleteConfirm');
        this.deletesubmit=this.doc.querySelector('#DeleteSubmit');
        this.storeAvailableList=this.doc.querySelector('#StoreAvailableList');
        this.sensorConfigList=this.doc.querySelector('#SensorConfigList');
        this.storeSelectedBody=this.doc.querySelector('#StoreSelectedBody');
        this.storesubmit=this.doc.querySelector('#StoreSubmit');
        this.addpic=this.doc.querySelector('#AddPic');
        this.subpic=this.doc.querySelector('#SubPic');
        this.exppic=this.doc.querySelector('#ExpPic');
        this.picfile=this.doc.querySelector('#PicFile');
        this.companyid=0;
        this.gatewaymacarr=[];
        this.langid=1;
        this.groupid=0;
        this.id=0;
        
    }

    setId(id){
        this.id=id;
    }

    setGroupId(id){
        this.groupid=id;
    }

    setLangId(id){
       
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
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

           
            this.setSensorData();

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

    async setExpList(){

        let EXP_D=$('#EXP_D')
        for (let i = 0; i < 100; i++) {
            let item=this.doc.createElement("option")
            item.text=(`0${i}D`).slice(-3);
            item.value=i;
            $('#EXP_D').append(item);
        }
        for (let i = 0; i < 24; i++) {
            let item=this.doc.createElement("option")
            item.text=(`0${i}H`).slice(-3);
            item.value=i;
            $('#EXP_H').append(item);
        }
        for (let i = 0; i < 60; i++) {
            let item=this.doc.createElement("option")
            item.text=(`0${i}M`).slice(-3);
            item.value=i;
            $('#EXP_M').append(item);
        }
           
    }

    async setSensorData(){

        const promise = $.ajax({
            type: 'GET',
            url: `/DeviceAPI/Sensor/${this.id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (data) => {

            console.log(`---my data---`)
            console.log(data)
 
            $('#name').val(data[0].Name);
            $('#mac').val(data[0].MAC);
            $('#OT').val(data[0].OT);
            $('#UT').val(data[0].UT);
            $('#A').val(data[0].A);
            $('#B').val(data[0].B);
            if (data[0].MODE){
                $('#MODE').val(data[0].MODE);
            }
            $('#INACTIVITY').val(data[0].INACTION);
            $('#LOGFREQ').val(data[0].LOGFREQ);
            $('#LBATT').val((data[0].LBATT/100)+2);
            let Par_day=Math.floor(data[0].EXP/86400);
            let Par_hour=Math.floor((data[0].EXP%86400)/3600);
            let Par_min=Math.floor(((data[0].EXP%86400)%3600)/60);
            $('#EXP_D').val(Par_day);
            $('#EXP_H').val(Par_hour);
            $('#EXP_M').val(Par_min);
            $("#groupid").val(data[0].FK_GroupID);
            $("#title").text(data[0].Name);

            if (data[0].PIC){
                $("#MyPic").attr('src', `data:image/png;base64,${data[0].PIC}`);
            }
            
 
            $('#confirmString').html(`${oneTerm(this.langid,'confirmDelete')} ${data[0].Name}?`);

            let companyid=data[0].FK_CompanyID;
            this.companyid=companyid;
            $('#Company').val(companyid);
            $('#cancel').attr("onclick",`javascript:location.href='manageSensor?companyid=${companyid}'`);

            this.setStoreSelectedListByCompany(companyid);
           
            
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

    checkSensorMac(mac,sensorid){

        const promise = $.ajax({
            type: 'GET',
            url: `/DeviceAPI/CheckSensorMacBySensorID/${mac}/${sensorid}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        return promise;
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

    async sendSensorData(myData){

        let StoreArr='';
        let GatewayMacArr='';
        for (var j = 0; j < this.storeSelectedBody.rows.length; j++) {
                    
            let StoreID=this.storeSelectedBody.rows[j].querySelector('a').getAttribute("StoreID");
            StoreArr+=`(${StoreID},@),`
            let GatewayMac=this.storeSelectedBody.rows[j].querySelector('a').getAttribute("GatewayMac");
            GatewayMacArr+=GatewayMac+','

        }
        console.log('--- GatewayMacArr ---')
        console.log(GatewayMacArr)
        StoreArr=StoreArr.slice(0,-1);

        myData.ID=this.id;
        myData.Name=this.name.value;
        myData.MAC=this.mac.value;
        myData.OT=this.ot.value;
        myData.UT=this.ut.value;
        myData.A=this.a.value;
        myData.B=this.b.value;
        myData.MODE=this.mode.value;
        myData.INACTIVITY=this.inactivity.value;
        myData.LOGFREQ=this.logfreq.value;
        myData.LBATT=this.lbatt.value==''?'':Math.round((parseFloat(this.lbatt.value)-2)*100);
        myData.EXP=parseInt(this.exp_d.value)*24*60*60+parseInt(this.exp_h.value)*60*60+parseInt(this.exp_m.value)*60;
        myData.FK_CompanyID=this.company.value;
        myData.StoreArr = StoreArr;
        myData.GMACARR=GatewayMacArr;

        console.log('--send my data---')
        console.log(myData)
        
        
        let promise = $.ajax({
            type: 'PATCH',
            url: `/DeviceAPI/SensorUpdate/${this.id}`,
            async: true,
            crossDomain: true,
            data: myData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {
            modalMsgHandler('modal', 0, oneTerm(this.langid,'sensorModifiedSuccessfully')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                    window.location = `manageSensor?companyid=${this.companyid}`;
                }, timeout);
            });
        });

        promise.fail((e) => {
            console.log(e.responseText)

            modalMsgHandler('modal', 1, `${oneTerm(this.langid,'failed')}`).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
        });
        
        
        
    }


    async createSensorData(){

        let PIC=$('#MyPic').attr('src');
        if (PIC.indexOf('base64')>0){
            PIC=PIC.substr(PIC.indexOf('base64')+7,PIC.length)
        }else{
            PIC='';
        }
        let data = {};
        data.PIC=PIC;
        this.sendSensorData(data);

       
    }

    async submitData(){

        console.log('submit data')

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


        let ans=this.checkSensorMac(this.mac.value,this.id);

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

    sensorDelete(){

        console.log(`confirm delete ${this.id}`)

        $('#DeleteSubmit').attr("SensorID",'0');
        $('#confirmString').html(`${oneTerm(this.langid,'confirmDelete')} ${this.name.value}?`);
        $('#ConfirmDialog').modal('show');

    }

    submitDelete(event){

        console.log(`sumbit delete ${this.id}`)

        $('#ConfirmDialog').modal('hide');
       
        const promise = $.ajax({
            type: 'DELETE',
            url: `/DeviceAPI/Sensor/${this.id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {
            modalMsgHandler('modal', 0, oneTerm(this.langid,'sensorDeletedSuccessfully')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                    window.location = `manageSensor?companyid=${this.companyid}`;
                }, timeout); 
            });
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failedToDeleteSensorPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
        });



    }

    addStore(){
     
        $('#StoreList').modal('show');

        let companyid=$('#Company').val();

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/StoreListByCompany/${companyid}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });

        promise.done(async (res) => {
            
            
            if (res[0].length>0){

                this.storeAvailableList.innerHTML="";
                let tbody=this.doc.createElement("tbody");
                tbody.setAttribute("class","modal-body");
                res[0].forEach(item => {

                    let currentID=parseInt(item.PK_StoreID);

                    // Check been selected or not
                    $('#StoreSelectedBody > tr').each(function() { 
                        let selectedStoreID=parseInt($(this).find('.msg-delete').attr('StoreID'));
                        if (currentID==selectedStoreID) currentID=0;
                     });


                    if (currentID!=0){

                        let td=this.doc.createElement("td");
                        td.innerHTML=`
                        <div>
                            <label class="cursor mb-0">
                                <input type="checkbox" class="hide store-item" id="chk${item.PK_StoreID}" addr="${item.Address}" store="${item.Name}">
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
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failedToQueryDataPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
        });


    }

    submitStore(){

        console.log('submitStore')

        $('#StoreList').modal('hide');

        var qryList = document.querySelectorAll('.store-item');
        for (var i = 0; i < qryList.length; i++) {
            var qryItem = qryList[i];    
            
            if (qryItem.checked){

                let StoreID=(qryItem.id).replace("chk","");
                let StoreAddress=qryItem.getAttribute("addr");
                let StoreName=qryItem.getAttribute("store");
                console.log(StoreID)
                console.log(StoreAddress)
                console.log(StoreName)
                let td1=this.doc.createElement("td");
                td1.innerHTML=StoreName+'&nbsp;';
                let td2=this.doc.createElement("td");
                td2.innerHTML=StoreAddress+'&nbsp;';
                let td3=this.doc.createElement("td");
                let a=this.doc.createElement("a");
                a.innerText= oneTerm(this.langid,'delete');
                a.setAttribute("class","msg-delete");
                a.setAttribute("StoreID",StoreID);
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

    getConfigList(){
        //this.mac
        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/SensorConfigList/${this.mac.value}`,
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


    setStoreSelectedList(){

        //this.setStoreSelectedListByCompany(this.companyid);
    }

    setStoreSelectedListByCompany(companyid){

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/StoreSelectedByCompanyBySensor/${companyid}/${this.id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });

        promise.done(async (res) => {
            
            console.log('------get store selected--------')
            console.log(res);

            $('#StoreSelectedBody').html('');

            if (res[0].length>0){
               
                res[0].forEach(ele =>{
                     
                    let td1=this.doc.createElement("td");
                    td1.innerHTML=ele.Name+'&nbsp;';
                    let td2=this.doc.createElement("td");
                    td2.innerHTML=ele.Address+'&nbsp;';
                    let td3=this.doc.createElement("td");
                    let a=this.doc.createElement("a");
                    a.innerText= oneTerm(this.langid,'delete');
                    a.setAttribute("class","msg-delete");
                    a.setAttribute("StoreID",ele.PK_StoreID);
                    a.setAttribute("GatewayMac",ele.GatewayMac);
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
                });
            }
            else{
                $('#StoreLabel').removeClass('hidden');
                $('#StoreSelected').addClass('hidden');
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

    removeStore(event){

        event.target.parentNode.parentNode.remove();
    }

    addPicture(event){
        //event.target.parentNode.parentNode.remove();
        $("#PicFile").trigger('click');
    }

    subPicture(event){
      
        $("#PicFile").val('');
        $('#MyPic').attr('src', require('../../assets/image-regular.svg'));
    }

    readPicture(){
        if (this.picfile.files && this.picfile.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#MyPic').attr('src', e.target.result);
            }
            reader.readAsDataURL(this.picfile.files[0]);
        }
    }

    pickPicture(event){
        //event.target.parentNode.parentNode.remove();
        //$("#PicFile").trigger('click');
        this.readPicture(this);
        console.log('pick picture');
    }

    configList(event){
        console.log('get config list');
        $('#ConfigList').modal('show');
        this.getConfigList();
    }

    changeCompany(event){
        let companyid=$('#Company').val();
        this.setStoreSelectedListByCompany(companyid);
    }

    setSubmitButtonClickEvent() {
        this.submit.removeEventListener('click', this.submitData);
        this.submit.addEventListener('click', this.submitData.bind(this), false);
    }

    setDeleteConfirmButtonClickEvent() {
        this.deleteconfirm.removeEventListener('click', this.sensorDelete);
        this.deleteconfirm.addEventListener('click', this.sensorDelete.bind(this), false);
    }

    setDeleteSubmitButtonClickEvent(){
        this.deletesubmit.removeEventListener('click', this.submitDelete);
        this.deletesubmit.addEventListener('click', this.submitDelete.bind(this), false);
    }

    setAddStoreButtonClickEvent(){
        this.addbutton.removeEventListener('click', this.addStore);
        this.addbutton.addEventListener('click', this.addStore.bind(this), false);
    }

    setStoreSubmitButtonClickEvent(){
        this.storesubmit.removeEventListener('click', this.submitStore);
        this.storesubmit.addEventListener('click', this.submitStore.bind(this), false);
    }

    setCompanyChangeEvent(){
        this.company.removeEventListener('change', this.changeCompany);
        this.company.addEventListener('change', this.changeCompany.bind(this), false);
    }

    setPictureButtonEvent(){
        this.addpic.removeEventListener('click', this.addPicture);
        this.addpic.addEventListener('click', this.addPicture.bind(this), false);
        this.subpic.removeEventListener('click', this.subPicture);
        this.subpic.addEventListener('click', this.subPicture.bind(this), false);
        this.picfile.removeEventListener('change', this.pickPicture);
        this.picfile.addEventListener('change', this.pickPicture.bind(this), false);
    }

    setConfigQueryEvent(){
        this.title.removeEventListener('click', this.configList);
        this.title.addEventListener('click', this.configList.bind(this), false);
        
    }
}

