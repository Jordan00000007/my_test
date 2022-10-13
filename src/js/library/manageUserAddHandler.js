/*eslint-disable*/
import { UnixTimestamp,modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';
import validator from 'validator';

export class ManageUserAddHandler {

    constructor() {
        this.doc = document;
        this.submit = this.doc.querySelector('#submit');
        this.account=this.doc.querySelector('#account');
        this.password=this.doc.querySelector('#pass_word');
        this.username=this.doc.querySelector('#user_name');
        this.groupid=this.doc.querySelector('#groupid');
        this.address=this.doc.querySelector('#address');
        this.phone=this.doc.querySelector('#phone');
        this.sendnote=this.doc.querySelector('#SendNote');
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

    async setGroupList(gid){

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


            response[1].forEach(ele => {
                    
                if (gid>=ele.PK_GroupID){
                    
                    let item =this.doc.createElement("option");
                    item.value=ele.PK_GroupID;
                    let name=ele.Name;
                    name=name.replace('系統管理者',oneTerm(this.langid,'systemManager'));
                    name=name.replace('管理者',oneTerm(this.langid,'manager'));
                    name=name.replace('使用者',oneTerm(this.langid,'user'));
                    item.text=name;
                    $('#groupid').append(item);

                }

            });

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

    async submitData(){

        $('#account').removeClass("invalid");
        $('#password').removeClass("invalid");
        $('#username').removeClass("invalid");
        $('#address').removeClass("invalid");
        $('#phone').removeClass("invalid");

        if (!validator.isEmail(this.account.value)) {
            $('#account').addClass("invalid");
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'theAccountDoesNotConformToTheEmailFormat')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;
        }

        if (validator.isEmpty(this.password.value, { 'ignore_whitespace': true })) {
            $('#password').addClass("invalid");
           
            modalMsgHandler('modal', 1, oneTerm(this.langid,'passwordFormatIsWrong')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });
            return;
        }

        if (validator.isEmpty(this.username.value)) {
            $('#username').addClass("invalid");
            
            modalMsgHandler('modal', 1, oneTerm(this.langid,'usernameCannotBeEmpty')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });

            return;
        }


        let StoreArr='';
        for (var j = 0; j < this.storeSelectedBody.rows.length; j++) {
                    
            let PK_StoreID=this.storeSelectedBody.rows[j].querySelector('a').getAttribute("pk_storeid");
            StoreArr+=`(@,${PK_StoreID}),`

        }
        StoreArr=StoreArr.slice(0,-1);
        
        const data = {};
        data.Account=this.account.value;
        data.Password=this.password.value;
        data.UserName=this.username.value;
        data.FK_GroupID=parseInt(this.groupid.value);
        data.FK_CompanyID=this.companyid;
        data.Address = this.address.value;
        data.Phone = this.phone.value;
        data.StoreArr = StoreArr;

        console.log(data);

        const promise = $.ajax({
            type: 'POST',
            url: '/UserAPI/User',
            async: true,
            crossDomain: true,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });
        promise.done(async (response) => {


            modalMsgHandler('modal', 0, oneTerm(this.langid,'registrationSuccess')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                    window.location = `manageUser?companyid=${this.companyid}`;
                }, timeout);
                
            });

            console.log(response)

        });
        promise.fail((e) => {
            console.log(e.responseText)

            if (validator.contains(e.responseText, 'Email is exist')) {
               
                modalMsgHandler('modal', 1, oneTerm(this.langid,'registrationFailedMailboxHasBeenUsed')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });


            } else {
                
                modalMsgHandler('modal', 1, oneTerm(this.langid,'registrationFailedPleaseContactTheAdministrator')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });


            }
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

    addStore() {

        console.log("addStore");
        $('#StoreList').modal('show');

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

                    

                    console.log(this.storeSelectedBody.rows.length)

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

