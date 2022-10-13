/*eslint-disable*/
import { UnixTimestamp,modalMsgHandler } from './common';
import { oneTerm } from '../library/setTerm';
import validator from 'validator';

export class ManageUserEditHandler {

    constructor() {
        this.doc = document;
        this.submit = this.doc.querySelector('#submit');
        this.account=this.doc.querySelector('#account');
        this.password=this.doc.querySelector('#password');
        this.username=this.doc.querySelector('#username');
        this.groupid=this.doc.querySelector('#groupid');
        this.addbutton=this.doc.querySelector('#addStore');
        this.companyid=this.doc.querySelector('#companyid');
        this.address=this.doc.querySelector('#address');
        this.phone=this.doc.querySelector('#phone');
        this.sendnote=this.doc.querySelector('#SendNote');
        this.deleteconfirm=this.doc.querySelector('#DeleteConfirm');
        this.deletesubmit=this.doc.querySelector('#DeleteSubmit');
        this.storeAvailableList=this.doc.querySelector('#StoreAvailableList');
        this.storeSelectedBody=this.doc.querySelector('#StoreSelectedBody');
        this.storesubmit=this.doc.querySelector('#StoreSubmit');
        this.companyid=0;
        this.langid=1;
        this.groupid=1;
        this.id=0;
        
    }

    setId(id){
        this.id=id;
        
    }

    setGroupId(groupid){
        this.groupid=groupid;
    }

    setLangId(id){
       
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
        }
    }

    async getOptionData(){

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

        promise.done(async (data) => {
            
            console.log(data);

            // Group
            data[1].forEach(element => {
            
                //console.log(element)
                let item =this.doc.createElement("option");
                item.value=element.PK_GroupID;
                let name=element.Name;
                name=name.replace('系統管理者',oneTerm(this.langid,'systemManager'));
                name=name.replace('管理者',oneTerm(this.langid,'manager'));
                name=name.replace('使用者',oneTerm(this.langid,'user'));
                item.text=name;
                $('#groupid').append(item);
            
            });

            this.getUserData();
            
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

    async getUserData(){

        const promise = $.ajax({
            type: 'GET',
            url: `/UserAPI/UserByUser/${this.id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });


        promise.done(async (data) => {
            
            $('#account').val(data[0].Account);
            $('#username').val(data[0].UserName);
            $('#address').val(data[0].Address);
            $('#phone').val(data[0].Phone);
            $("#groupid").val(data[0].FK_GroupID);
            $("#title").text(data[0].UserName);

            if (data[0].SendNote==1){
                $("#SendNote").prop('checked', true);
            }else{
                $("#SendNote").prop('checked', false);
            }
            
            $('#confirmString').html(`${oneTerm(this.langid,'confirmDelete')} ${data[0].UserName}?`);

            let companyid=data[0].FK_CompanyID;
            this.companyid=companyid;
             $('#cancel').attr("onclick",`javascript:location.href='manageUser?companyid=${companyid}'`)
           
             //this.getUserPassword(data[0].PK_UserID);

             $('#changePassword').attr('href',`changePasswordByManager?id=${this.id}&name=${data[0].UserName}`);
            
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

    async getUserPassword(myUserID){
        console.log(`myUserID=${myUserID}`);

        const promise = $.ajax({
            type: 'GET',
            url: `/UserAPI/PasswordByUser/${myUserID}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (res) => {
            
            console.log(res);


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

    async submitData(){

        $('#account').removeClass("invalid");
        $('#username').removeClass("invalid");
        $('#address').removeClass("invalid");
        $('#phone').removeClass("invalid");

        if (!validator.isEmail(this.account.value)) {
            $('#account').addClass("invalid");
            
            modalMsgHandler('modal', 1, '帳號不符合電子信箱格式').then((timeout) => {
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
            
            modalMsgHandler('modal', 1, '使用者名稱不得為空值').then((timeout) => {
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
        data.UserName=this.username.value;
        data.FK_GroupID=parseInt($('#groupid').val());
        data.Address = this.address.value;
        data.Phone = this.phone.value;
        data.StoreArr = StoreArr;

       
        console.log(data)


        
        const promise = $.ajax({
            type: 'PATCH',
            url: `/UserAPI/UpdateUserByUser/${this.id}`,
            async: true,
            crossDomain: true,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {


            modalMsgHandler('modal', 0, oneTerm(this.langid,'userModifiedSuccessfully')).then((timeout) => {
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
               
                modalMsgHandler('modal', 1, '註冊失敗,信箱已被使用').then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });


            } else {
                
                modalMsgHandler('modal', 1, '註冊失敗,請聯絡管理員').then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });


            }
        });

        

    }

    userDelete(){

        $('#DeleteSubmit').attr("pk_userstoreid",'0');
        $('#confirmString').html(`${oneTerm(this.langid,'confirmDelete')} ${this.username.value}?`);
        $('#ConfirmDialog').modal('show');

    }

    submitDelete(event){

        $('#ConfirmDialog').modal('hide');
        let PK_UserStoreID=event.target.parentNode.getAttribute("pk_userstoreid");

        console.log(`PK_UserStoreID=${PK_UserStoreID}`);
        console.log(`this.id=${this.id}`);

        if (!PK_UserStoreID){

            const promise = $.ajax({
                type: 'DELETE',
                url: `/UserAPI/UserByUser/${this.id}`,
                async: true,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                },
            });

            promise.done(async (response) => {
                modalMsgHandler('modal', 0, oneTerm(this.langid,'userDeletedSuccessfully')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                        window.location = `manageUser?companyid=${this.companyid}`;
                    }, timeout); 
                });
            });

            promise.fail((e) => {
                
                modalMsgHandler('modal', 1, oneTerm(this.langid,'failedToDeleteUserPleaseContactTheAdministrator')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });
            });

        }else{

            const promise = $.ajax({
                type: 'DELETE',
                url: `/StoreAPI/StoreByUserStore/${PK_UserStoreID}`,
                async: true,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                },
            });

            promise.done(async (response) => {
                this.setStoreList();
                modalMsgHandler('modal', 0, oneTerm(this.langid,'storeDeletedSuccessfully')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout); 
                });
            });

            promise.fail((e) => {
                modalMsgHandler('modal', 1, oneTerm(this.langid,'failedToDeleteStorePleaseContactTheAdministrator')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                    
                });
            });
        }

        
    }

    addStore_xx(){

        
        $('#StoreList').modal('show');

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/StoreAvailableByUser/${this.id}`,
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
                  
                    let td=this.doc.createElement("td");
                    td.innerHTML=`
                    <div>
                        <label class="cursor mb-0">
                            <input type="checkbox" class="hide store-item" id="chk${item.PK_StoreID}">
                            <i class="fa fa-fw fa-check-square chks"></i>&nbsp;${item.Name}   
                        </label>
                    </div>
                    `;
                   
                    let tr=this.doc.createElement("tr");
                    tr.appendChild(td);
                    tbody.appendChild(tr);

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

    submitStore_xx(){

        console.log("submitStore");

        $('#StoreList').modal('hide');

        var qryList = document.querySelectorAll('.store-item');
        let FK_StoreID=[]
        for (var i = 0; i < qryList.length; i++) {
            var qryItem = qryList[i];
            
            if (qryItem.checked){
                FK_StoreID.push((qryItem.id).replace("chk",""));
            }
        }

        FK_StoreID=FK_StoreID.join(",");
        console.log("FK_StoreID");
        console.log(FK_StoreID);

        let data={};
        data.FK_StoreID=FK_StoreID;

        if (FK_StoreID!=''){

            const promise = $.ajax({
                type: 'POST',
                url: `/StoreAPI/UserAddStore/${this.id}`,
                async: true,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                },
                data:data
            });

            promise.done(async (res) => {
                
                console.log(res);
                this.setStoreList();

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

    }


    setStoreList(){

        console.log('setStoreList')

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/StoreSelectedByUser/${this.id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });

        promise.done(async (res) => {
            

            if (res[0].length>0){
                $('#StoreSelectedBody').html('');
                res[0].forEach(ele =>{
                     
                    let td1=this.doc.createElement("td");
                    td1.innerHTML=ele.Name+'&nbsp;';
                    let td2=this.doc.createElement("td");
                    td2.innerHTML=ele.Address+'&nbsp;';
                    let td3=this.doc.createElement("td");
                    let a=this.doc.createElement("a");
                    a.innerText= oneTerm(this.langid,'delete');
                  

                    if (this.groupid<=3){

                        a.setAttribute("class","msg-delete");
                        a.setAttribute("PK_UserStoreID",ele.PK_UserStoreID);
                        a.removeEventListener('click', this.removeStore);
                        a.addEventListener('click', this.removeStore.bind(this), false);

                    }

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


        console.log('remove store')
        event.target.parentNode.parentNode.remove();

        if (this.storeSelectedBody.rows.length==0){
            $('#StoreSelected').addClass('hidden');
            $('#StoreLabel').removeClass('hidden');

        }
        // let StoreName=event.target.parentNode.parentNode.firstChild.innerHTML;
        // $('#DeleteSubmit').attr("pk_userstoreid",`${PK_UserStoreID}`)
        // $('#confirmString').html(`${oneTerm(this.langid,'confirmDelete')} ${StoreName}?`);
        // $('#ConfirmDialog').modal('show');
        

    }

    setSubmitButtonClickEvent() {
        this.submit.removeEventListener('click', this.submitData);
        this.submit.addEventListener('click', this.submitData.bind(this), false);
    }

    setDeleteConfirmButtonClickEvent() {
        this.deleteconfirm.removeEventListener('click', this.userDelete);
        this.deleteconfirm.addEventListener('click', this.userDelete.bind(this), false);
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
        this.storesubmit.removeEventListener('click', this.storeSubmit);
        this.storesubmit.addEventListener('click', this.storeSubmit.bind(this), false);
    }
}

