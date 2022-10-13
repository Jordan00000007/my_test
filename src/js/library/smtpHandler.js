/*eslint-disable*/
import { data } from 'jquery';
import validator from 'validator';
import { modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';

export class SmtpHandler {

    constructor() {
        this.doc = document;
        this.submit = this.doc.querySelector('#Submit');
        this.host = this.doc.querySelector('#Host');
        this.port = this.doc.querySelector('#Port');
        this.account = this.doc.querySelector('#Account');
        this.password = this.doc.querySelector('#Password');
        this.sendname = this.doc.querySelector('#SendName');
        this.encodenone = this.doc.querySelector('#EncodeNone');
        this.encodetls = this.doc.querySelector('#EncodeTLS');
        this.encodessl = this.doc.querySelector('#EncodeSSL');
        this.langid=1;
        this.pk_smtpid=0;
      
    }

    setSmtpId(id){
        this.pk_smtpid=id;
    }

    setLangId(id){
       
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
        }
    }

    async fillTable(ans){

        let Arr=[];
        if (ans.length>0){
            ans.forEach(item => {
            Arr.push(item);
            });
        }

        $('#tbody').empty();

        Arr.forEach(item => {


            let tr = document.createElement("tr");
            let td1 = document.createElement("td");
            td1.innerHTML=`<a href='manageStoreEdit?id=${item.PK_StoreID}'>${item.Name}</a>`;
            td1.setAttribute("store_id",item.PK_StoreID);
            let td2 = document.createElement("td");
            td2.innerHTML=`${item.Address==null?'':item.Address}`;
            let td3 = document.createElement("td");
            td3.innerHTML=`${item.Person==null?'':item.Person}`;
            let td4 = document.createElement("td");
            td4.innerHTML=`${item.Phone==null?'':item.Phone}`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            this.tbody.appendChild(tr);
                    
                    
        });

    }



    
    async updateUserInfo(){

        const data = {};

        if (this.username.value.length != 0) {
            if (this.username.value.indexOf(' ') != -1) {
                modalMsgHandler('modal', 1, oneTerm(this.langid,'usernameCannotContainBlankCharacters')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                });
                return;
            } else {
                data.UserName = this.username.value;
            }
        } else {
            modalMsgHandler('modal', 1, oneTerm(this.langid,'usernameCannotBeEmpty')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });
            return;
        }

        data.Phone=this.phone.value;
        data.FK_GroupID = parseInt(this.groupid.value);
        data.FK_LangID = parseInt(this.langid.value);
        data.SendNote = this.sendnote.checked? 1 : 0 ;


        console.log(data)

        if (validator.isEmail(this.account.value)) {
            data.Account = this.account.value;
        } else {
           
            modalMsgHandler('modal', 1, oneTerm(this.langid,'emailFormatIsIncorrect')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });
            return;
        }

        const promise = $.ajax({
            type: 'PATCH',
            url: '/UserAPI/User/',
            async: true,
            crossDomain: true,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });
        promise.done(async (response) => {

            modalMsgHandler('modal', 0, oneTerm(this.langid,'updateCompleted')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                    window.location = '/home';
                }, timeout);
            });
            console.log(response)

        });
        promise.fail((e) => {
            console.log(e.responseText)

            modalMsgHandler('modal', 1, oneTerm(this.langid,'updateFailedPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });


        });
        console.log('data: ', data);


    }

    updateSmtpInfo(){

        const data={}
        data.Host=this.host.value;
        data.Port=this.port.value;
        data.Account=this.account.value;
        data.Password=this.password.value;
        data.SendName=this.sendname.value;
        data.EncodeTLS=$('#EncodeTLS').is(":checked")?1:0;
        data.EncodeSSL=$('#EncodeSSL').is(":checked")?1:0;

        console.log(data);

        
        const promise = $.ajax({
            type: 'PATCH',
            url: `/StoreAPI/Smtp/${this.pk_smtpid}`,
            async: true,
            crossDomain: true,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });
        promise.done(async (response) => {

            modalMsgHandler('modal', 0, oneTerm(this.langid,'updateCompleted')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                    window.location = '/home';
                }, timeout);
            });
            console.log(response)

        });
        promise.fail((e) => {
            console.log(e.responseText)

            modalMsgHandler('modal', 1, oneTerm(this.langid,'updateFailedPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });


        });

       
    }

    updateSmtpInfoCore(){

        const data={}
        data.smtpHost=this.host.value;
        data.smtpPort=this.port.value;
        data.username=this.account.value;
        data.password=this.password.value;
        data.senderName=this.sendname.value;
        data.enableTls=$('#EncodeTLS').is(":checked")?true:false;
        data.enableSsl=$('#EncodeSSL').is(":checked")?true:false;

        console.log('smtp info')
        console.log(data)


        const promise = $.ajax({

            type: 'POST',
            url: `/StoreAPI/SmtpCore`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data:data, 
        });

        promise.done(async (response) => {

            console.log('success')
            console.log(response);

            this.updateSmtpInfo();

        });
        promise.fail((e) => {

            console.log('fail')
            console.log(e.responseText)
            modalMsgHandler('modal', 1, oneTerm(this.langid,'updateFailedPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });


        });


    }



    setSubmitButtonClickEvent() {

        this.submit.removeEventListener('click', this.updateSmtpInfo);
        this.submit.addEventListener('click', this.updateSmtpInfo.bind(this), false);

    }

  
}

