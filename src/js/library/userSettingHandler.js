/*eslint-disable*/
import validator from 'validator';
import { modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';


export class UserSettingHandler {

    constructor() {
        this.doc = document;
        this.submit = this.doc.querySelector('#Submit');
        this.username = this.doc.querySelector('#UserName');
        this.account = this.doc.querySelector('#Account');
        this.phone = this.doc.querySelector('#Phone');
        this.groupid = this.doc.querySelector('#FK_GroupID');
        this.langid = this.doc.querySelector('#FK_LangID');
        this.sendnote = this.doc.querySelector('#SendNote');
        this.sendline=this.doc.querySelector('#SendLine');
        this.sendphone=this.doc.querySelector('#SendPhone');
        this.qrbutton=this.doc.querySelector('#qrbutton');
        this.submitlinetest=this.doc.querySelector('#SubmitLineTest');
        this.submitemailtest=this.doc.querySelector('#SubmitEmailTest');
        this.submitphonetest=this.doc.querySelector('#SubmitPhoneTest');
        this.lang=1;
        this.userid=0;
    }

    setLangId(id){
       
        if ($.cookie("langId")){
            this.lang=parseInt($.cookie("langId"));
        }else{
            this.lang=parseInt(id);
        }

        let term=oneTerm(this.lang,'inputTestString');

        $('#TestLineString').attr("placeholder",term);
        $('#TestEmailString').attr("placeholder",term);
        $('#TestPhoneString').attr("placeholder",term);
    }

    setUserId(id){
       
       this.userid=id;
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
                modalMsgHandler('modal', 1, oneTerm(this.lang,'usernameCannotContainBlankCharacters')).then((timeout) => {
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
            modalMsgHandler('modal', 1, oneTerm(this.lang,'usernameCannotBeEmpty')).then((timeout) => {
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
        data.SendLine = this.sendline.checked? 1 : 0 ;
        data.SendPhone = this.sendphone.checked? 1 : 0 ;

        console.log(data)

        if (validator.isEmail(this.account.value)) {
            data.Account = this.account.value;
        } else {
           
            modalMsgHandler('modal', 1,oneTerm(this.lang,'emailFormatIsIncorrect')).then((timeout) => {
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

            modalMsgHandler('modal', 0, oneTerm(this.lang,'updateCompleted')).then((timeout) => {
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

            modalMsgHandler('modal', 1, oneTerm(this.lang,'updateFailedPleaseContactTheAdministrator')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });


        });
        console.log('data: ', data);


    }

    async openScanCode(){

        const QRCode = require('qrcode');
        const myUrl=`https://bfresh.antzertech.com/DeviceAPI/LineUrl/${this.userid}`;

        QRCode.toDataURL(myUrl,{ version: 4 }, (err, url) => {
            if (err) throw console.log(err);
            $("#canvas").attr("src",url);
            $("#canvasUrl").attr("href",myUrl);
            $("#canvasUrl").attr("target","_blank");
            
        })

        $('#LineSubscription').modal('show');

    }

    async sendEmailTest(){

        console.log('Send Email Test');

        let content=$('#TestEmailString').val();
        let email=$('#Account').val();
        

        const data = {};
        data.content = content;
        data.subject = `[BFresh] ${content}`;
        data.type=$("#PK_TypeID option:selected").text();
        data.UserName='';
        data.Account='';
        data.CompanyName='';
        data.Phone='';
        data.Address='';
        data.EmailList=email;

        const promise = $.ajax({
            type: 'POST',
            url: '/StoreAPI/SendTestEmail/',
            async: true,
            crossDomain: true,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });
        promise.done(async (response) => {

            modalMsgHandler('modal', 0, oneTerm(this.langid,'success')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
            

        });
        promise.fail((e) => {
            console.log(e.responseText);
            modalMsgHandler('modal', 1, oneTerm(this.langid,'failed')).then((timeout) => {
                $('#modal').modal('show');
                ImgToSvg();
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });
        });

    }

    async sendLineTest(){

        const promise = $.ajax({
            type: 'GET',
            url: '/UserAPI/User/',
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });
        promise.done(async (response) => {

            let myToken=response[0].LineToken;
            $('#SubmitLineTest').attr("title",myToken);
            let myMsg=$('#TestLineString').val();
            if (myMsg.length>0){

                let myUrl=`https://notify-api.line.me/api/notify`;
                let data={};
                data.Token=myToken;
                data.Message=myMsg;

                const promise2 = $.ajax({
                    type: 'POST',
                    url: '/DeviceAPI/LineMsg/',
                    async: true,
                    crossDomain: true,
                    data: data,
                 
                });
                promise2.done(async (response) => {
        
                    modalMsgHandler('modal', 0, oneTerm(this.lang,'success')).then((timeout) => {
                        $('#modal').modal('show');
                        setTimeout(()=>{ 
                            $('#modal').modal('hide');
                            $('#modal').remove();
                        }, timeout);
                    });
                    console.log(response)
        
                });
                promise2.fail((e) => {
                    console.log(e.responseText)
        
                    modalMsgHandler('modal', 1, oneTerm(this.lang,'failed')).then((timeout) => {
                        $('#modal').modal('show');
                        setTimeout(()=>{ 
                            $('#modal').modal('hide');
                            $('#modal').remove();
                        }, timeout);
                    });
        
        
                });
            }
           

        });
        promise.fail((e) => {
           
            modalMsgHandler('modal', 1, oneTerm(this.lang,'failed')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

        });

    }

    async sendPhoneTest(){

        console.log('Send Phone Test');
        let myMsg=$('#TestPhoneString').val();
        let myPhone=$('#Phone').val();

        if ((myMsg.length>0)&&(myPhone.length>0)){

            let data={};
            data.Phone=myPhone;
            data.Message=myMsg;

           

            const promise = $.ajax({
                type: 'POST',
                url: '/DeviceAPI/PhoneMsg/',
                async: true,
                crossDomain: true,
                data: data,
            
            });
            promise.done(async (response) => {

                modalMsgHandler('modal', 0, oneTerm(this.lang,'success')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                });
                console.log(response)

            });
            promise.fail((e) => {
                console.log(e.responseText)

                modalMsgHandler('modal', 1, oneTerm(this.lang,'failed')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                });


            });

        }else{
            console.log('empty message')
        }
    }

    setSubmitButtonClickEvent() {

        this.submit.removeEventListener('click', this.updateUserInfo);
        this.submit.addEventListener('click', this.updateUserInfo.bind(this), false);

    }

    setLineSubscriptionClickEvent() {

        this.qrbutton.removeEventListener('click', this.openScanCode);
        this.qrbutton.addEventListener('click', this.openScanCode.bind(this), false);
        this.submitlinetest.removeEventListener('click', this.sendLineTest);
        this.submitlinetest.addEventListener('click', this.sendLineTest.bind(this), false);
        this.submitemailtest.removeEventListener('click', this.sendEmailTest);
        this.submitemailtest.addEventListener('click', this.sendEmailTest.bind(this), false);
        this.submitphonetest.removeEventListener('click', this.sendPhoneTest);
        this.submitphonetest.addEventListener('click', this.sendPhoneTest.bind(this), false);

    }

    

    async setGroupList(){

        const promise = $.ajax({
            type: 'GET',
            url: `/UserAPI/CompanyAndGroup/`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });
        promise.done(async (response) => {

            console.log("==================")
            console.log(response[1])

            response[1].forEach(ele => {
                       
                let item =this.doc.createElement("option");
                item.value=ele.PK_GroupID;
                let name=ele.Name;
                name=name.replace('系統管理者',oneTerm(this.lang,'systemManager'));
                name=name.replace('管理者',oneTerm(this.lang,'manager'));
                name=name.replace('使用者',oneTerm(this.lang,'user'));
                item.text=name;
                $('#FK_GroupID').append(item);

            });

            this.setUserData();

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

    async setUserData(){
        const geUser = $.ajax({
            type: 'GET',
            url: `/UserAPI/User/`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            success: function (data, textStatus, jqXHR) {

                if (+jqXHR.status === 204) {
                    console.log('No device data');
                    
                } else {

                    console.log('===============================');
                    console.log(data[0])

                    // $('#StoreName').html(data[0].Name);
                    $('#UserName').val(data[0].UserName);
                    $('#Account').val(data[0].Account);
                    $('#Phone').val(data[0].Phone);
                    $('#Person').val(data[0].Person);
                    let FK_GroupID=data[0].FK_GroupID;
                    $('#FK_GroupID').val(FK_GroupID);
                    let FK_LangID=data[0].FK_LangID;
                    $('#FK_LangID').val(FK_LangID);
                    if (data[0].SendNote==1){
                        $('#SendNote').attr("checked",true);
                    }else{
                        $('#SendNote').attr("checked",false);
                    }
                    if (data[0].SendLine==1){
                        $('#SendLine').attr("checked",true);
                    }else{
                        $('#SendLine').attr("checked",false);
                    }
                    if (data[0].SendPhone==1){
                        $('#SendPhone').attr("checked",true);
                    }else{
                        $('#SendPhone').attr("checked",false);
                    }
                    

                    console.log(data[0].LineToken);
                    if (data[0].LineToken){
                        $('#SubmitLineTest').attr("title",`${data[0].LineToken}`);
                    }
                    


                
                }
            },
            error: function (data) {
                console.log(data.responseText)
                if (+data.status === 401) {
                    window.location.reload();
                }
                
            },
            complete: async function (data) {
                
                
            
            }
        })
    }


    

    
}

