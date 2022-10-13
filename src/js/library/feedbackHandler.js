/*eslint-disable*/
import { resolve } from 'core-js/stable/promise';
import validator from 'validator';
import { modalMsgHandler,ImgToSvg} from './common';
import { oneTerm } from '../library/setTerm';

export class FeedbackHandler {

    constructor() {
        this.doc = document;
        this.submit = this.doc.querySelector('#Submit');
        this.comment = this.doc.querySelector('#Comment');
        this.typeid = this.doc.querySelector('#PK_TypeID');
        this.langid=1;
    }

    setLangId(id){
       
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
        }
    }

    async setTypeList(){

        const promise = $.ajax({
            type: 'GET',
            url: `/UserAPI/FeedbackType/`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });
        promise.done(async (data) => {

            data.forEach(element => {
                    
                console.log(element)
                let item =this.doc.createElement("option");
                item.value=element.PK_TypeID;
                let name=element.Name;
                name=name.replace("硬體問題",oneTerm(this.langid,'hardwareIssue'));
                name=name.replace("系統問題",oneTerm(this.langid,'systemIssue'));
                name=name.replace("未知類型",oneTerm(this.langid,'unknownType'));
                item.text=name;
                $('#PK_TypeID').append(item);
            
            });

        });
        promise.fail((e) => {
           
            modalMsgHandler('modal', 1, oneTerm(this.langid,'updatefailedToQueryDataPleaseContactTheAdministratorailedPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });


        });
    }

    async addFeedbackInfo(){

        const data = {};

        $('#Comment').removeClass("invalid");

        if (this.comment.value.length == 0) {

            modalMsgHandler('modal', 1, oneTerm(this.langid,'problemDescriptionContentIsNotFilledIn')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            $('#Comment').addClass("invalid");

            return;

        } 

        
        data.PK_TypeID = parseInt(this.typeid.value);
        data.Comment = this.comment.value;
    
        const promise = $.ajax({
            type: 'POST',
            url: '/UserAPI/AddFeedbackAndGetUserInfo/',
            async: true,
            crossDomain: true,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });
        promise.done(async (response) => {

            modalMsgHandler('modal', 0, oneTerm(this.langid,'addedSuccessfully')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                    
                    this.setSendMail(response);


                }, timeout);
                
            });
           
        });
        promise.fail((e) => {
            console.log(e.responseText);
            modalMsgHandler('modal', 1,  oneTerm(this.langid,'addingFailedPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                ImgToSvg();
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });
        });
       
    }

   

    setSendMailCore(res){

        const data = {};
        data.content = this.comment.value;
        data.subject = '[BFresh] User FeedBack';
        data.type=$("#PK_TypeID option:selected").text();
        data.UserName=res[0][0].UserName;
        data.Account=res[0][0].Account;
        data.CompanyName=res[0][0].CompanyName;
        data.Phone=res[0][0].Phone;
        data.Address=res[0][0].Address;
        data.EmailList=res[0][0].EmailList;

        const promise = $.ajax({
            type: 'POST',
            url: '/StoreAPI/SendEmailCore/',
            async: true,
            crossDomain: true,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });
        promise.done(async (response) => {

            modalMsgHandler('modal', 0, oneTerm(this.langid,'emailSentSuccessfully')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                    window.location = '/home';
                }, timeout);
                
            });
            

        });
        promise.fail((e) => {
            console.log(e.responseText);
            modalMsgHandler('modal', 1, oneTerm(this.langid,'emailSendingFailedPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                ImgToSvg();
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });
        });
    }


    setSendMail(res){

        const data = {};
        data.content = this.comment.value;
        data.subject = '[BFresh] User FeedBack';
        data.type=$("#PK_TypeID option:selected").text();
        data.UserName=res[0][0].UserName;
        data.Account=res[0][0].Account;
        data.CompanyName=res[0][0].CompanyName;
        data.Phone=res[0][0].Phone;
        data.Address=res[0][0].Address;
        data.EmailList=res[0][0].EmailList;

        //console.log(`---res---`);
        //console.log(res);

        
        const promise = $.ajax({
            type: 'POST',
            url: '/StoreAPI/SendEmail/',
            async: true,
            crossDomain: true,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });
        promise.done(async (response) => {

            modalMsgHandler('modal', 0, oneTerm(this.langid,'emailSentSuccessfully')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                    window.location = '/home';
                }, timeout);
                
            });
            

        });
        promise.fail((e) => {
            console.log(e.responseText);
            modalMsgHandler('modal', 1, oneTerm(this.langid,'emailSendingFailedPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                ImgToSvg();
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });
        });

        
    }


    setSubmitButtonClickEvent() {

        this.submit.removeEventListener('click', this.addFeedbackInfo);
        this.submit.addEventListener('click', this.addFeedbackInfo.bind(this), false);

    }

   
}

