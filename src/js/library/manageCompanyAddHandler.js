/*eslint-disable*/
import { modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';
import validator from 'validator';

export class ManageCompanyAddHandler {

    constructor() {
        this.doc = document;
        this.submit = this.doc.querySelector('#submit');
        this.company = this.doc.querySelector('#Company');
        this.groupid=this.doc.querySelector('#groupid');
       
        this.addstore=this.doc.querySelector('#addStore');

        this.companyname = this.doc.querySelector('#CompanyName');
        this.address = this.doc.querySelector('#Address');
        this.phone = this.doc.querySelector('#Phone');
      
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

    async submitData(){

        $('#CompanyName').removeClass("invalid");
        

        if (validator.isEmpty(this.companyname.value)){
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
      
        let d1=$('#expireDateStr').val();

        const data = {};
        data.Name=this.companyname.value;
        data.Address=this.address.value;
        data.Phone=this.phone.value;
        data.ExpireDate=d1;
       
        console.log(data);

        const promise = $.ajax({
            type: 'POST',
            url: '/StoreAPI/Company',
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
                    window.location = `manageCompany`;
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

    setSubmitButtonClickEvent() {

        this.submit.removeEventListener('click', this.submitData);
        this.submit.addEventListener('click', this.submitData.bind(this), false);

    }

    
}

