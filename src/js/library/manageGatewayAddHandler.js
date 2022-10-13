/*eslint-disable*/
import { modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';
import validator from 'validator';

export class ManageGatewayAddHandler {

    constructor() {
        this.doc = document;
        this.submit = this.doc.querySelector('#submit');
        this.company = this.doc.querySelector('#Company');
        this.groupid=this.doc.querySelector('#groupid');
        this.gatewayname = this.doc.querySelector('#GatewayName');
        this.gatewaymac = this.doc.querySelector('#GatewayMac');
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

    async submitData(){

        $('#GatewayMac').removeClass("invalid");

        if (validator.isEmpty(this.gatewaymac.value)){
            $('#GatewayMac').addClass("invalid");

            modalMsgHandler('modal', 1, oneTerm(this.langid,'gatewayMacCannotBeEmpty')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;

        }
        

        console.log(this.gatewaymac.value);

        if (!validator.isMACAddress(this.gatewaymac.value,{no_colons: true})){

            $('#GatewayMac').addClass("invalid");

            modalMsgHandler('modal', 1, oneTerm(this.langid,'gatewayMacFormatIsInvalid')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;

        }
      
        let d1=$('#expireDateStr').val();

        const data = {};
        data.gatewaymac=(this.gatewaymac.value).trim();
        data.gatewayname=(this.gatewayname.value).trim();
        data.fk_companyid=parseInt($('#Company').val());
       
        console.log(data);

        const promise = $.ajax({
            type: 'POST',
            url: '/DeviceAPI/Gateway',
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data: data,
        });

        promise.done(async (response) => {
            console.log(response)
            modalMsgHandler('modal', 0, oneTerm(this.langid,'success')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                    window.location = `manageGateway`;
                }, timeout);
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



    companyChange(){
  
        this.companyid=$('#Company').val();
        
    }

    setSubmitButtonClickEvent() {

        this.submit.removeEventListener('click', this.submitData);
        this.submit.addEventListener('click', this.submitData.bind(this), false);

    }

    async setCompanyChangeEvent(){

        this.company.removeEventListener('change', this.companyChange);
        this.company.addEventListener('change', this.companyChange.bind(this), false);

    }

    
}

