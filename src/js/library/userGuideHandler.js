/*eslint-disable*/
import { data } from 'jquery';
import validator from 'validator';
import { modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';

export class UserGuideHandler {

    constructor() {
        this.doc = document;
        this.uploadzh = this.doc.querySelector('#UploadZh');
        this.uploaden = this.doc.querySelector('#UploadEn');
        this.uploadjp = this.doc.querySelector('#UploadJp');
        this.downloadzh = this.doc.querySelector('#DownloadZh');
        this.downloaden = this.doc.querySelector('#DownloadEn');
        this.downloadjp = this.doc.querySelector('#DownloadJp');
        this.filezh = this.doc.querySelector('#fileZH');
        this.fileen = this.doc.querySelector('#fileEN');
        this.filejp = this.doc.querySelector('#fileJP');
       
        this.langid=1;
        
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

    async upload(myType){

        let files=document.getElementById(`file${myType}`).files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // use a regex to remove data url part
            const base64String = reader.result
                .replace("data:", "")
                .replace(/^.+,/, "");
           
            let data={};
            data.TYPE = myType;
            data.BASE = base64String;

            //console.log(base64String)

            const promise = $.ajax({
                type: 'POST',
                url: '/UserAPI/UserGuide',
                async: true,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                },
                data: data,
            });
            promise.done(async (response) => {
          
                console.log(response);
                modalMsgHandler('modal', 0, oneTerm(this.langid,'success')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                        //window.location = `manageStore?companyid=${this.companyid}`;
    
                        //this.setWhiteList();
    
                    }, timeout);
                    
                });

            });
            promise.fail((e) => {

                $('#ModalError').modal('show');
                console.log(e.responseText);

            });
        };
        reader.readAsDataURL(files);

    }

    downloadBase64File(contentBase64, fileName) {
        const linkSource = `data:application/pdf;base64,${contentBase64}`;
        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);
    
        downloadLink.href = linkSource;
        downloadLink.target = '_self';
        downloadLink.download = fileName;
        downloadLink.click(); 
    }

    async download(myType){

        const promise = $.ajax({
            type: 'GET',
            url: `/UserAPI/UserGuide/${myType}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });
        promise.done(async (response) => {

          
            let Type=response[0].Type;
            let Content=response[0].Content;
            
            if (Content){
                this.downloadBase64File(Content,`UserGuide_${Type}.pdf`)
            }else{
                $('#ModalError').modal('show');
            }
           

        });
        promise.fail((e) => {

            $('#ModalError').modal('show');
            console.log(e.responseText);

        });

    }

    async triggerFile(myType){
        $(`#file${myType}`).trigger('click');
    }

    async uploadZH(){

        this.upload('ZH')

    }

    async uploadEN(){

        this.upload('EN')

    }

    async uploadJP(){

        this.upload('JP')

    }

    async downloadZH(){

        this.download('ZH')

    }

    async downloadEN(){

        this.download('EN')

    }

    async downloadJP(){

        this.download('JP')

    }

    async triggerFileZH(){

        this.triggerFile('ZH')

    }

    async triggerFileEN(){

        this.triggerFile('EN')

    }

    async triggerFileJP(){

        this.triggerFile('JP')

    }




    setButtonClickEvent() {

        this.uploadzh.removeEventListener('click', this.triggerFileZH);
        this.uploadzh.addEventListener('click', this.triggerFileZH.bind(this), false);
        this.uploaden.removeEventListener('click', this.triggerFileEN);
        this.uploaden.addEventListener('click', this.triggerFileEN.bind(this), false);
        this.uploadjp.removeEventListener('click', this.triggerFileJP);
        this.uploadjp.addEventListener('click', this.triggerFileJP.bind(this), false);
        this.downloadzh.removeEventListener('click', this.downloadZH);
        this.downloadzh.addEventListener('click', this.downloadZH.bind(this), false);
        this.downloaden.removeEventListener('click', this.downloadEN);
        this.downloaden.addEventListener('click', this.downloadEN.bind(this), false);
        this.downloadjp.removeEventListener('click', this.downloadJP);
        this.downloadjp.addEventListener('click', this.downloadJP.bind(this), false);
        this.filezh.removeEventListener('change', this.uploadZH);
        this.filezh.addEventListener('change', this.uploadZH.bind(this), false);
        this.fileen.removeEventListener('change', this.uploadEN);
        this.fileen.addEventListener('change', this.uploadEN.bind(this), false);
        this.filejp.removeEventListener('change', this.uploadJP);
        this.filejp.addEventListener('change', this.uploadJP.bind(this), false);
    }

  
}

