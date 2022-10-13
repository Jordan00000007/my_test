/*eslint-disable*/
import { UnixTimestamp,modalMsgHandler,SvgToObj } from './common';
import { getSvg } from '../library/getSvg.js';
import { oneTerm } from '../library/setTerm';
import { now } from 'moment';

export class HomePageHandler {

    constructor() {
        this.doc = document;
        this.tbody = this.doc.querySelector('#tbody');
        this.pagelist= this.doc.querySelector('#PageList');
        this.col1=this.doc.querySelector('#col1');
        this.col2=this.doc.querySelector('#col2');
        this.col3=this.doc.querySelector('#col3');
        this.filter=this.doc.querySelector('#filter');
        this.company=this.doc.querySelector('#Company');
        this.download=this.doc.querySelector('#download');
        this.companyid=0;
        this.page=1;
        this.sort='Name';
        this.arrow='ASC';
        this.langid=1;
       
    }

    setLangID(id){
       
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
        }
    }

    setCompanyId(id){
        this.companyid=id;
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
            //td1.innerHTML= item.Name;
           
            if (item.SensorCount>0){
                td1.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-store fa-fw fa-2x mr-2 msg-blue-noline"></i>${item.Name}</div>`;
            }else{
                td1.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-store fa-fw fa-2x mr-2 msg-gray-noline"></i>${item.Name}</div>`;
            }



            let td2 = document.createElement("td");
            let LostStr='';
            if (parseInt(item.LostCount)>0){
                
                LostStr=` <span class='msg-warnning'>(${oneTerm(this.langid,'lost')} ${item.LostCount})</span>`;
            }
            td2.innerHTML= `<a href='storeStatus?id=${item.PK_StoreID}&companyid=${item.FK_CompanyID}'>${item.SensorCount==null?0:item.SensorCount}<span id='LCount${item.PK_StoreID}'>${LostStr}</span></a>`;
            td2.setAttribute("onclick",`javascript:location.href='storeStatus?id=${item.PK_StoreID}&companyid=${item.FK_CompanyID}';`);
            td2.setAttribute("class","cursor");
            let td3 = document.createElement("td");
            if (item.EventCount>0){
                td3.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-bell fa-fw fa-2x mr-2 msg-red-noline"></i><a href='storeEvent?id=${item.PK_StoreID}&name=${item.Name}&companyid=${item.FK_CompanyID}'><span id='ECount${item.PK_StoreID}'>${item.EventCount}</span></a></div>`; 
            }else{
                td3.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-bell fa-fw fa-2x mr-2 msg-gray-noline"></i><a href='storeEvent?id=${item.PK_StoreID}&name=${item.Name}&companyid=${item.FK_CompanyID}'><span id='ECount${item.PK_StoreID}'>${item.EventCount}</span></a></div>`;
            }
            td3.setAttribute("onclick",`javascript:location.href='storeEvent?id=${item.PK_StoreID}&name=${item.Name}&companyid=${item.FK_CompanyID}';`);
            td3.setAttribute("class","cursor");

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);


            // let expireDateTime=moment(item.ExpireDateTime).unix();
            // let currentDateTime=moment().unix();
            // console.log(`expireDateTime=${expireDateTime}`);
            // console.log(`currentDateTime=${currentDateTime}`);
            
            // if (currentDateTime>expireDateTime){
               
            //     tr.classList.add("row-hidden");
            // }else{
            //     tr.classList.remove("row-hidden");
            // }
            this.tbody.appendChild(tr);
        
                    
        });
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
        
        let page=parseInt(e.target.getAttribute("page"));
        this.page=page;
       

        if (this.companyid=='0'){
            this.getPageDataByUser(this.page,this.sort,this.arrow);
        }else{
            this.getPageDataByCompany(this.companyid);
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

            res[0].forEach(item => {

                let opt=document.createElement("option");
                opt.text=item.Name;
                opt.value=item.PK_CompanyID;
                if (item.PK_CompanyID==companyid) opt.setAttribute("selected","true");
                $('#Company').append(opt);
          
            });

            this.company.removeEventListener('change', this.changeCompany);
            this.company.addEventListener('change', this.changeCompany.bind(this), false);

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

    changeCompany(){
       
        this.companyid=$('#Company').val();
        let company=$('#Company').val();
        $.cookie("SelectCompany", company);

        this.page=1;
        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/CompanyStatusListByCompanyByPageBySort/${company}/${this.page}/${this.sort}/${this.arrow}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {
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

    async getPageDataByUser(page,sort,arrow){

        console.log('getPageDataByUser');

        this.page=page;
        this.sort=sort;
        this.arrow=arrow;

        const promise = $.ajax({
            type: 'GET',
            //url: `/StoreAPI/StoreListByUserByPageBySort/${page}/${sort}/${arrow}`,
            url: `/StoreAPI/CompanyStatusListByUserByPageBySort/${page}/${sort}/${arrow}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {

            console.log(response)
           
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

    async getPageDataByCompany(companyid){

        console.log('getPageDataByCompany');

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/CompanyStatusListByCompanyByPageBySort/${companyid}/${this.page}/${this.sort}/${this.arrow}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {

            console.log(response)
            
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
        svg2.removeEventListener('click', this.sortBySensorCount);
        svg2.addEventListener('click', this.sortBySensorCount.bind(this), false);
        this.col2.appendChild(svg2);

        let svg3=SvgToObj(getSvg('icon_sorting'));
        svg3.setAttribute("class","cursor");
        svg3.setAttribute("id","svg3");
        svg3.removeEventListener('click', this.sortByEventCount);
        svg3.addEventListener('click', this.sortByEventCount.bind(this), false);
        this.col3.appendChild(svg3);

      

    }

    resetArrow(){
        $('#svg1').removeClass("svg-arrow");
        $('#svg2').removeClass("svg-arrow");
        $('#svg3').removeClass("svg-arrow");
       
        $('#svg1').removeClass("svg-arrow-up");
        $('#svg2').removeClass("svg-arrow-up");
        $('#svg3').removeClass("svg-arrow-up");
        
        $('#svg1').removeClass("svg-arrow-down");
        $('#svg2').removeClass("svg-arrow-down");
        $('#svg3').removeClass("svg-arrow-down");
       
        $('#svg1').addClass("svg-arrow");
        $('#svg2').addClass("svg-arrow");
        $('#svg3').addClass("svg-arrow");
        
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
       
        

        if (this.companyid=='0'){
            this.getPageDataByUser(this.page,this.sort,this.arrow);
        }else{
            this.getPageDataByCompany(this.companyid);
        }

    }

    sortBySensorCount(){

        console.log('sortBySensorCount');
        
        this.resetArrow();

        if (this.sort=='_SensorCount'){
            if (this.arrow=='ASC'){
                this.arrow='DESC';
               
                $('#svg2').addClass("svg-arrow-down");
            }else{
                this.arrow='ASC';
                
                $('#svg2').addClass("svg-arrow-up");
            }

        }else{
            this.sort='_SensorCount';
            this.arrow='ASC';
           
            $('#svg2').addClass("svg-arrow-up");
        }
       
        if (this.companyid=='0'){
            this.getPageDataByUser(this.page,this.sort,this.arrow);
        }else{
            this.getPageDataByCompany(this.companyid);
        }

    }

    sortByEventCount(){
        console.log('sortByAbnormalCount');
        
        this.resetArrow();

        if (this.sort=='_EventCount'){
            if (this.arrow=='ASC'){
                this.arrow='DESC';
               
                $('#svg3').addClass("svg-arrow-down");
            }else{
                this.arrow='ASC';
                
                $('#svg3').addClass("svg-arrow-up");
            }

        }else{
            this.sort='_EventCount';
            this.arrow='ASC';
           
            $('#svg3').addClass("svg-arrow-up");
        }
 
        if (this.companyid=='0'){
            this.getPageDataByUser(this.page,this.sort,this.arrow);
        }else{
            this.getPageDataByCompany(this.companyid);
        }

        
    }

    showFilter(){
        console.log('toggle filter');
        $('#Company').toggleClass('hidden');
    }

    setFilterButtonClickEvent(){
        this.filter.removeEventListener('click', this.showFilter);
        this.filter.addEventListener('click', this.showFilter.bind(this), false);
    }

    updatePageData(){
        console.log('update Page Data');

        if (this.companyid!=0){
            console.log('getPageDataByCompany')
            this.getPageDataByCompany(this.companyid)
        }else{
            console.log('getPageDataByUser')
            this.getPageDataByUser(this.page,this.sort,this.arrow);
        }
        
    }

    downloadData(){

        console.log('download data...');

        if (this.companyid=='0'){

            console.log(`/StoreAPI/StoreListByUserBySort/${this.sort}/${this.arrow}`)

            const promise = $.ajax({
                type: 'GET',
                url: `/StoreAPI/StoreListByUserBySort/${this.sort}/${this.arrow}`,
                async: true,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                },
            });

            promise.done(async (response) => {

                
                let Arr=[];
                if (response[0].length>0){
                    response[0].forEach(item => {
                
                        if (item.LostCount>0){
                            let data=`{"${oneTerm(this.langid,'storeName')}":"${item.Name}","${oneTerm(this.langid,'sensor')}":"${item.SensorCount} (${oneTerm(this.langid,'lost')} ${item.LostCount})","${oneTerm(this.langid,'event')}":"${item.AbnormalCount}"}`;
                            data=JSON.parse(data);
                            Arr.push(data);
                        }else{
                            let data=`{"${oneTerm(this.langid,'storeName')}":"${item.Name}","${oneTerm(this.langid,'sensor')}":"${item.SensorCount}","${oneTerm(this.langid,'event')}":"${item.AbnormalCount}"}`;
                            data=JSON.parse(data);
                            Arr.push(data);
                        }

                       

                    });
                }

                // console.log(Arr);

                this.exportExcel(Arr);

                
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


        }else{


            console.log(`/StoreAPI/StoreListByCompanyBySort/${this.companyid}/${this.sort}/${this.arrow}`)

            const promise = $.ajax({
                type: 'GET',
                url: `/StoreAPI/StoreListByCompanyBySort/${this.companyid}/${this.sort}/${this.arrow}`,
                async: true,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                },
            });

            promise.done(async (response) => {

                let Arr=[];
                if (response[0].length>0){
                    response[0].forEach(item => {

                        let storeName=oneTerm(this.langid,'storeName');
                
                    
                        if (item.LostCount>0){
                            let data=`{"${oneTerm(this.langid,'storeName')}":"${item.Name}","${oneTerm(this.langid,'sensor')}":"${item.SensorCount} (${oneTerm(this.langid,'lost')} ${item.LostCount})","${oneTerm(this.langid,'event')}":"${item.AbnormalCount}"}`;
                            data=JSON.parse(data);
                            Arr.push(data);
                        }else{
                            let data=`{"${oneTerm(this.langid,'storeName')}":"${item.Name}","${oneTerm(this.langid,'sensor')}":"${item.SensorCount}","${oneTerm(this.langid,'event')}":"${item.AbnormalCount}"}`;
                            data=JSON.parse(data);
                            Arr.push(data);
                        }

                    });
                }

                console.log(Arr);

                this.exportExcel(Arr);

                //this.fillTable(response);
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

    exportExcel(jsonData){

        const xlsx = require('xlsx');
        // 將資料轉成workSheet
        //let arrayWorkSheet = xlsx.utils.aoa_to_sheet(arrayData);
        let jsonWorkSheet = xlsx.utils.json_to_sheet(jsonData);

        let data=`{"${oneTerm(this.langid,'storeList')}":""}`;
        data=JSON.parse(data);
        data[oneTerm(this.langid,'storeList')]=jsonWorkSheet;
        
        let workBook = {
            SheetNames: [oneTerm(this.langid,'storeList')],
            Sheets: data,
        };

        // 將workBook寫入檔案
        xlsx.writeFile(workBook, `${oneTerm(this.langid,'store')}.xlsx`);


    }
    
    setDownloadButtonClickEvent(){

        this.download.removeEventListener('click', this.downloadData);
        this.download.addEventListener('click', this.downloadData.bind(this), false);

    }

    

}

