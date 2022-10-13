/*eslint-disable*/
import { modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';
import validator from 'validator';

export class ManageCompanyEditHandler {

    constructor() {
        this.doc = document;
        this.objectname='';
        this.submit = this.doc.querySelector('#submit');
        this.companyname = this.doc.querySelector('#CompanyName');
        this.address = this.doc.querySelector('#Address');
        this.phone = this.doc.querySelector('#Phone');
        this.groupid=this.doc.querySelector('#groupid');
        this.addbutton=this.doc.querySelector('#addStore');
        this.deleteconfirm=this.doc.querySelector('#DeleteConfirm');
        this.deletesubmit=this.doc.querySelector('#DeleteSubmit');
        this.storesubmit=this.doc.querySelector('#StoreSubmit');
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


    async setCompanyData(){

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/Company/${this.id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });


        promise.done(async (data) => {

            console.log(data);

            this.objectname=data[0][0].Name;
            $('#title').text(data[0][0].Name);
            $('#CompanyName').val(data[0][0].Name);
            $('#Address').val(data[0][0].Address);
            $('#Phone').val(data[0][0].Phone);
            
            let d1=moment(data[0][0].ExpireDateTime).format('YYYY-MM-DD');
            $('#expireDate').datetimepicker('date', d1);
 
            $('#confirmString').html(`${oneTerm(this.langid,'confirmDelete')} ${data[0][0].Name}?`);
            $('#cancel').attr("onclick",`javascript:location.href='manageCompany'`);

            
            
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

    async updateObjectData(){

    
        // let d1=$('#expireDate').datetimepicker('viewDate').format('YYYY-MM-DD');

        // console.log(`aaa${$('#expireDateStr').val()}aaa`)

        let d1=$('#expireDateStr').val();

        const data = {};
        data.PK_CompanyID=this.id;
        data.Name=this.companyname.value;
        data.Address=this.address.value;
        data.Phone=this.phone.value;
        data.expireDate=d1;
       
        
      
        console.log(data)
    
    

        const promise = $.ajax({
            type: 'PATCH',
            url: `/StoreAPI/Company/${this.id}`,
            async: true,
            crossDomain: true,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {

            modalMsgHandler('modal', 0, oneTerm(this.langid,'success')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                    window.location = `manageCompany`;
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

        $('#CompanyName').removeClass("invalid");
       
        if (validator.isEmpty(this.companyname.value)) {
            $('#CompanyName').addClass("invalid");
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'companyNameCannotBeEmpty')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;
        }

        this.updateObjectData();

    }

    objectDelete(){

        console.log(`confirm delete ${this.id}`)

       
        $('#confirmString').html(`${oneTerm(this.langid,'confirmDelete')} ${this.objectname}?`);
        $('#ConfirmDialog').modal('show');

    }

    submitDelete(event){

        console.log(`sumbit delete ${this.id}`)

        $('#ConfirmDialog').modal('hide');
       
        const promise = $.ajax({
            type: 'DELETE',
            url: `/StoreAPI/Company/${this.id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {
            modalMsgHandler('modal', 0, oneTerm(this.langid,'success')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                    window.location = `manageCompany`;
                }, timeout); 
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


    removeStore(event){

        event.target.parentNode.parentNode.remove();

    }

   

    setSubmitButtonClickEvent() {
        this.submit.removeEventListener('click', this.submitData);
        this.submit.addEventListener('click', this.submitData.bind(this), false);
    }

    setDeleteConfirmButtonClickEvent() {
        this.deleteconfirm.removeEventListener('click', this.objectDelete);
        this.deleteconfirm.addEventListener('click', this.objectDelete.bind(this), false);
    }

    setDeleteSubmitButtonClickEvent(){
        this.deletesubmit.removeEventListener('click', this.submitDelete);
        this.deletesubmit.addEventListener('click', this.submitDelete.bind(this), false);
    }


   
}

