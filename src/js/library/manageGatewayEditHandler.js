/*eslint-disable*/
import { modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';
import validator from 'validator';

export class ManageGatewayEditHandler {

    constructor() {
        this.doc = document;
        this.submit = this.doc.querySelector('#submit');

        this.company = this.doc.querySelector('#Company');
        this.mac=this.doc.querySelector('#GatewayMac');
        this.name=this.doc.querySelector('#GatewayName');
        this.groupid=this.doc.querySelector('#groupid');
        
        this.deleteconfirm=this.doc.querySelector('#DeleteConfirm');
        this.deletesubmit=this.doc.querySelector('#DeleteSubmit');
      
        this.companyid=0;
        this.langid=1;
        this.id=0;
        
    }

    setId(id){
        this.id=id;
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

        console.log(companyid)

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

   

    async setGatewayData(){

        const promise = $.ajax({
            type: 'GET',
            url: `/DeviceAPI/Gateway/${this.id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });


        promise.done(async (data) => {


            console.log(data[0])
 
            $('#GatewayName').val(data[0].Name);
            $('#GatewayMac').val(data[0].MAC);
           
            // $("#groupid").val(data[0].FK_GroupID);
            
            $("#title").text(data[0].Name);
            $('#confirmString').html(`${oneTerm(this.langid,'confirmDelete')} ${data[0].Name}?`);

            let companyid=data[0].FK_CompanyID;
            this.companyid=companyid;
            $('#Company').val(companyid);
            $('#cancel').attr("onclick",`javascript:location.href='manageGateway?companyid=${companyid}'`);

           
           
            
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

    async updateGatewayData(){

        
        const data = {};
        data.ID=this.id;
        data.Name=this.name.value;
        data.MAC=this.mac.value;
        data.FK_CompanyID=this.company.value;
        
        console.log(data)
    
        const promise = $.ajax({
            type: 'PATCH',
            url: `/DeviceAPI/Gateway/${this.id}`,
            async: true,
            crossDomain: true,
            data: data,
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
                    window.location = `manageGateway?companyid=${this.companyid}`;
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

    async submitData(){

        $('#mac').removeClass("invalid");
        $('#name').removeClass("invalid");
        $('#A').removeClass("invalid");
        $('#B').removeClass("invalid");
        $('#LBATT').removeClass("invalid");
        $('#OT').removeClass("invalid");
        $('#UT').removeClass("invalid");

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

        let ans=this.checkSensorMac(this.mac.value,this.id);

        ans.done((response) => {

            console.log(response[0][0].cc);
            console.log(response[1]);

            let counter=response[0][0].cc;

            if (counter==0){

                this.updateGatewayData();

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

    gatewayDelete(){

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
            url: `/DeviceAPI/Gateway/${this.id}`,
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
                    window.location = `manageGateway?companyid=${this.companyid}`;
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

   
    companyChange(){
  
        this.companyid=$('#Company').val();
        
    }

    setSubmitButtonClickEvent() {
        this.submit.removeEventListener('click', this.submitData);
        this.submit.addEventListener('click', this.submitData.bind(this), false);
    }

    setDeleteConfirmButtonClickEvent() {
        this.deleteconfirm.removeEventListener('click', this.gatewayDelete);
        this.deleteconfirm.addEventListener('click', this.gatewayDelete.bind(this), false);
    }

    setDeleteSubmitButtonClickEvent(){
        this.deletesubmit.removeEventListener('click', this.submitDelete);
        this.deletesubmit.addEventListener('click', this.submitDelete.bind(this), false);
    }

    setCompanyChangeEvent(){
        this.company.removeEventListener('change', this.companyChange);
        this.company.addEventListener('change', this.companyChange.bind(this), false);
    }
}

