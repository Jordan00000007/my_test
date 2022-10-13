/*eslint-disable*/
import { UnixTimestamp,modalMsgHandler,SvgToObj } from './common';
import { oneTerm } from '../library/setTerm';
import { getSvg } from '../library/getSvg.js';

export class ManageGatewayHandler {

    constructor() {
        this.doc = document;
        this.tbody = this.doc.querySelector('#tbody');
        this.pagelist= this.doc.querySelector('#PageList');
        this.togglecht= this.doc.querySelector('#toggleCht');
        this.toggleeng= this.doc.querySelector('#toggleEng');
        this.togglejpn= this.doc.querySelector('#toggleJpn');
        this.searchBtn= this.doc.querySelector('#SearchBtn');
        this.col1=this.doc.querySelector('#col1');
        this.col2=this.doc.querySelector('#col2');
        this.col3=this.doc.querySelector('#col3');
        this.col4=this.doc.querySelector('#col4');
        this.filter=this.doc.querySelector('#filter');
        this.company=this.doc.querySelector('#Company');
       
        this.page=1;
        this.companyid=-1;
        this.langid=1;
        this.groupid=0;
        this.sort='PK_GatewayID';
        this.arrow='DESC';
      
    }

    setLangId(id){
       
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
        }
    }

    setCompanyId(id){
       
      this.companyid=id;
    }

    setGroupId(id){
       
        this.groupid=id;
      }
  

    async fillTable(ans){

        let Arr=[];
        if (ans[0].length>0){
            ans[0].forEach(item => {
            Arr.push(item);
            });
        }

        $('#tbody').empty();

        Arr.forEach(item => {

            let tr = document.createElement("tr");
           
            let td1 = document.createElement("td");
            //td1.innerHTML=`<a href='manageUserEdit?id=${item.PK_UserID}'>${item.UserName}</a>`;
            td1.innerHTML=item.Name?item.Name:(item.MAC).slice(-4);
            let svg=SvgToObj(getSvg('icon_edit'));
            svg.setAttribute("class","svg-lightgray")
            td1.appendChild(svg);
            td1.setAttribute("sensor_id",item.PK_SensorID);
            td1.setAttribute("class","cursor");
            td1.setAttribute("onclick",`javascript:location.href='manageGatewayEdit?id=${item.PK_GatewayID}';`);
            let td2 = document.createElement("td");
            td2.innerHTML=`${item.MAC}&nbsp;`;
            td2.setAttribute("class","cursor");
            td2.setAttribute("onclick",`javascript:location.href='manageGatewayEdit?id=${item.PK_GatewayID}';`);

            let td3 = document.createElement("td");
            td3.setAttribute("class","GatewayStatus");
            td3.setAttribute("id","gateway_id_"+item.PK_GatewayID);

            let td4 = document.createElement("td");
            td4.setAttribute("class","cursor");
            
          
            if (this.groupid<=3){

                td4.removeEventListener('click', this.deleteGatewayItem);
                td4.addEventListener('click', this.deleteGatewayItem.bind(this,item.PK_GatewayID), false);

            }

            let link=document.createElement("div");
            link.setAttribute('style','vertical-align:middle;')
            link.innerHTML= `<i class="fas fa-trash-alt fa-2x mr-2 icon-delete"></i>${oneTerm(this.langid,'delete')}`;

            td4.appendChild(link);
            
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            
          
            this.tbody.appendChild(tr);
                    
            
                    
        });
        this.updateGatewayStatus();
        this.setPagination(ans[1]);

       

    }

    async setPagination(data)
    {
        const Url="manageStore"
        const {ThePage,TotalRecord,TotalPage}=data[0];
        let ul=document.createElement("ul");
        ul.setAttribute("class","pagination justify-content-end");

        let lt=document.createElement("li");
        if (ThePage==1) {
            lt.setAttribute("class","page-link cursor disabled");
        }else{
            lt.setAttribute("class","page-link cursor");
            lt.removeEventListener('click', this.changePage);
            lt.addEventListener('click', this.changePage.bind(this), false);
        }
        lt.setAttribute("page",(ThePage-1).toString());
        let i1=document.createElement("i");
        i1.setAttribute("page",(ThePage-1).toString());
        i1.setAttribute("class","fas fa-chevron-left cursor");
        lt.appendChild(i1);
        ul.appendChild(lt);

        for (let i = 1; i <= TotalPage; i++) {
            let li=document.createElement("li");
            if (ThePage==i) {
                li.setAttribute("class","page-link cursor active");
            }else{
                li.setAttribute("class","page-link cursor");
                li.removeEventListener('click', this.changePage);
                li.addEventListener('click', this.changePage.bind(this), false);
            }
            li.setAttribute("page",i.toString());
            
            li.innerText=i.toString();
            ul.appendChild(li);
        }

        let gt=document.createElement("li");
        if (ThePage==TotalPage) {
            gt.setAttribute("class","page-link cursor disabled");
        }else{
            gt.setAttribute("class","page-link cursor");
            gt.removeEventListener('click', this.changePage);
            gt.addEventListener('click', this.changePage.bind(this), false);
        }
        gt.setAttribute("page",(ThePage+1).toString());
        let i2=document.createElement("i");
        i2.setAttribute("page",(ThePage+1).toString());
        i2.setAttribute("class","fas fa-chevron-right cursor");
        gt.appendChild(i2); 
        ul.appendChild(gt);

        this.pagelist.innerHTML="";
        this.pagelist.appendChild(ul);
    }

    async changePage(e){
        console.log("page="+e.target.getAttribute("page"));
        let page=parseInt(e.target.getAttribute("page"));
        this.getPageData(page,this.sort,this.arrow);
    }

    async getPageData(page,sort,arrow){
        
        let companyid=$('#Company').val(); 
        if (!companyid) companyid=this.companyid;
        this.companyid=companyid;
        console.log(`this.companyid=${this.companyid}`)
        if (this.companyid!='0'){
            $.cookie("SelectCompany", companyid);
        }

        //this.company=$('#Company').val();
        this.page=page;
        this.sort=sort;
        this.arrow=arrow;

        let searchstr=$('#searchString').val().trim();;
        if (searchstr==''){
            searchstr='*';
        }

        let uri= `/DeviceAPI/GatewayListByCompanyByPageBySortBySearch/${companyid}/${this.page}/${this.sort}/${this.arrow}/${searchstr}`;
        uri=encodeURI(uri);

        const promise = $.ajax({
            type: 'GET',
            url: uri,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {
            console.log(response);
            this.fillTable(response);
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

    setSorting(){

        let svg1=SvgToObj(getSvg('icon_sorting'));
        svg1.setAttribute("class","svg-arrow cursor");
        svg1.setAttribute("id","svg1");
        svg1.removeEventListener('click', this.sortByName);
        svg1.addEventListener('click', this.sortByName.bind(this), false);
        this.col1.appendChild(svg1);

        let svg2=SvgToObj(getSvg('icon_sorting'));
        svg2.setAttribute("class","cursor");
        svg2.setAttribute("id","svg2");
        svg2.removeEventListener('click', this.sortByMac);
        svg2.addEventListener('click', this.sortByMac.bind(this), false);
        this.col2.appendChild(svg2);

        

    }

    resetArrow(){
        $('#svg1').removeClass("svg-arrow");
        $('#svg2').removeClass("svg-arrow");
       
        $('#svg1').removeClass("svg-arrow-up");
        $('#svg2').removeClass("svg-arrow-up");
      
        $('#svg1').removeClass("svg-arrow-down");
        $('#svg2').removeClass("svg-arrow-down");
      
        $('#svg1').addClass("svg-arrow");
        $('#svg2').addClass("svg-arrow");
      
    }

    sortByName(){
        console.log('sortByName');
        
        this.resetArrow();

        if (this.sort=='Name'){
            if (this.arrow=='ASC'){
                this.arrow='DESC';
               
                $('#svg1').addClass("svg-arrow-down");
            }else{
                this.arrow='ASC';
                
                $('#svg1').addClass("svg-arrow-up");
            }

        }else{
            this.sort='Name';
            this.arrow='ASC';
           
            $('#svg1').addClass("svg-arrow-up");
        }
       
        this.getPageData(this.page,this.sort,this.arrow)
    }


    sortByMac(){
        
        this.resetArrow();

        if (this.sort=='MAC'){
            if (this.arrow=='ASC'){
                this.arrow='DESC';
               
                $('#svg2').addClass("svg-arrow-down");
            }else{
                this.arrow='ASC';
                
                $('#svg2').addClass("svg-arrow-up");
            }

        }else{
            this.sort='MAC';
            this.arrow='ASC';
           
            $('#svg2').addClass("svg-arrow-up");
        }
       
        this.getPageData(this.page,this.sort,this.arrow)
    }

    async getGatewayStatus(GatewayList){

        let data={};
        data.GatewayList=GatewayList;

        const promise = $.ajax({
            type: 'POST',
            url: `/DeviceAPI/GatewayStatus`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data: data,
        });

        promise.done(async (res) => {

            console.log('get gatewaystatus success')
           
            res[0].forEach(item => {

                console.log(item)
                let PK_GatewayID=item.PK_GatewayID;
                let GStatus=item.GStatus;
                console.log(PK_GatewayID)
                //$(`#gateway_id_${PK_GatewayID}`).innerHTML=GStatus;
                //$(`#gateway_id_19`).val(GStatus);
                //this.doc.getElementById(`gateway_id_${PK_GatewayID}`).innerHTML=GStatus;
                let myObj=this.doc.getElementById(`gateway_id_${PK_GatewayID}`);

                if (GStatus=='Offline'){
                    myObj.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-power-off fa-2x mr-2 msg-red-noline"></i>${oneTerm(this.langid,'offline')}</div>`;
                }
                else{
                    myObj.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-power-off fa-2x mr-2 msg-blue-noline"></i>${oneTerm(this.langid,'online')}</div>`;
                
                }
          
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

    async updateGatewayStatus(){
        console.log('update gateway status');

        var myElements = document.querySelectorAll(".GatewayStatus");
       
        let myGatewayList='';
        myElements.forEach(function(ele) {
            
            myGatewayList+=ele.getAttribute('id').replace('gateway_id_','')+',';
        });
        
        if (myGatewayList.length>0){
            myGatewayList=myGatewayList.slice(0,-1);
        }
        console.log(myGatewayList);
        if (myGatewayList.length>0){
            this.getGatewayStatus(myGatewayList);
        }
       
    }

    async getFilterData(companyid){

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

            let all=document.createElement("option");
            all.text=oneTerm(this.langid,'allItem');
            all.value='0';
            $('#Company').append(all);

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

    getPageDataByCompany(){

        let companyid=$('#Company').val();
        if (!companyid) companyid=this.companyid;
        this.companyid=companyid;

        if (this.companyid!='0'){
            $.cookie("SelectCompany", companyid);
        }
        
        let searchstr=$('#searchString').val().trim();;
        if (searchstr==''){
            searchstr='*';
        }

        $('#GatewayAdd').attr("href",`manageGatewayAdd?companyid=${companyid}`);

        let uri= `/DeviceAPI/GatewayListByCompanyByPageBySortBySearch/${companyid}/${this.page}/${this.sort}/${this.arrow}/${searchstr}`;
        uri=encodeURI(uri);

        const promise = $.ajax({
            type: 'GET',
            url: uri,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {
            console.log(response);
            this.fillTable(response);
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

    searchFilter(){

        console.log('serch')
        this.page=1;
        this.getPageDataByCompany();
    }

    changeCompany(){
        this.page=1;
        this.getPageDataByCompany();
    }

    showFilter(){
        $('#optionPanel').toggleClass('hidden');
    }

    deleteGatewayItem(GatewayID){

        const promise = $.ajax({
            type: 'delete',
            url: `/DeviceAPI/Gateway/${GatewayID}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {
            console.log(response);
            modalMsgHandler('modal', 0, oneTerm(this.langid,'success')).then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout); 
            });

            this.getPageDataByCompany();
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

    setFilterButtonClickEvent(){
        this.filter.removeEventListener('click', this.showFilter);
        this.filter.addEventListener('click', this.showFilter.bind(this), false);
    }

    setSearchButtonClickEvent(){
        this.searchBtn.removeEventListener('click', this.searchFilter);
        this.searchBtn.addEventListener('click', this.searchFilter.bind(this), false);
    }

    setCompanySelectChangeEvent(){
        this.company.removeEventListener('change', this.changeCompany);
        this.company.addEventListener('change', this.changeCompany.bind(this), false);
    }

   

   

}

