/*eslint-disable*/
import { UnixTimestamp,modalMsgHandler,SvgToObj } from './common';
import { oneTerm } from '../library/setTerm';
import { getSvg } from '../library/getSvg.js';

export class ManageUserHandler {

    constructor() {
        this.doc = document;
        this.tbody = this.doc.querySelector('#tbody');
        this.pagelist= this.doc.querySelector('#PageList');
        this.togglecht= this.doc.querySelector('#toggleCht');
        this.toggleeng= this.doc.querySelector('#toggleEng');
        this.togglejpn= this.doc.querySelector('#toggleJpn');
        this.col1=this.doc.querySelector('#col1');
        this.col2=this.doc.querySelector('#col2');
        this.col3=this.doc.querySelector('#col3');
        this.col4=this.doc.querySelector('#col4');
        this.filter=this.doc.querySelector('#filter');
        this.company=this.doc.querySelector('#Company');
        this.page=1;
        this.langid=1;
        this.sort='UserName';
        this.arrow='ASC';
      
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
        if (ans[0].length>0){
            ans[0].forEach(item => {
            Arr.push(item);
            });
        }

        $('#tbody').empty();

        Arr.forEach(item => {

            let tr = document.createElement("tr");
            tr.setAttribute("class","cursor")
            tr.setAttribute("onclick",`javascript:location.href='manageUserEdit?id=${item.PK_UserID}';`);
            let td1 = document.createElement("td");
            //td1.innerHTML=`<a href='manageUserEdit?id=${item.PK_UserID}'>${item.UserName}</a>`;
            td1.innerHTML=item.UserName;

            let svg=SvgToObj(getSvg('icon_edit'));
            svg.setAttribute("class","svg-lightgray")
            
            td1.appendChild(svg);
        
            td1.setAttribute("store_id",item.PK_UserID);
            let td2 = document.createElement("td");
            td2.innerHTML=`${item.Account}&nbsp;`;
            let td3 = document.createElement("td");
            td3.innerHTML=`${item.Phone}&nbsp;`;
            let td4 = document.createElement("td");
            let gname=item.GroupName;
            gname=gname.replace('系統管理者',oneTerm(this.langid,'systemManager'));
            gname=gname.replace('管理者',oneTerm(this.langid,'manager'));
            gname=gname.replace('使用者',oneTerm(this.langid,'user'));
            td4.innerHTML=`${gname}&nbsp;`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
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
        console.log("page="+e.target.getAttribute("page"));
        let page=parseInt(e.target.getAttribute("page"));
        this.getPageData(page,this.sort,this.arrow);
    }

    async getPageData(page,sort,arrow){

        console.log('getPageData')

        this.page=page;
        this.sort=sort;
        this.arrow=arrow;

        const promise = $.ajax({
            type: 'GET',
            url: `/UserAPI/UserListByPageBySort/${page}/${sort}/${arrow}`,
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
        svg2.removeEventListener('click', this.sortByAccount);
        svg2.addEventListener('click', this.sortByAccount.bind(this), false);
        this.col2.appendChild(svg2);

        let svg3=SvgToObj(getSvg('icon_sorting'));
        svg3.setAttribute("class","cursor");
        svg3.setAttribute("id","svg3");
        svg3.removeEventListener('click', this.sortByPhone);
        svg3.addEventListener('click', this.sortByPhone.bind(this), false);
        this.col3.appendChild(svg3);

        let svg4=SvgToObj(getSvg('icon_sorting'));
        svg4.setAttribute("class","cursor");
        svg4.setAttribute("id","svg4");
        svg4.removeEventListener('click', this.sortByGroupName);
        svg4.addEventListener('click', this.sortByGroupName.bind(this), false);
        this.col4.appendChild(svg4);

    }

    resetArrow(){
        $('#svg1').removeClass("svg-arrow");
        $('#svg2').removeClass("svg-arrow");
        $('#svg3').removeClass("svg-arrow");
        $('#svg4').removeClass("svg-arrow");
        $('#svg1').removeClass("svg-arrow-up");
        $('#svg2').removeClass("svg-arrow-up");
        $('#svg3').removeClass("svg-arrow-up");
        $('#svg4').removeClass("svg-arrow-up");
        $('#svg1').removeClass("svg-arrow-down");
        $('#svg2').removeClass("svg-arrow-down");
        $('#svg3').removeClass("svg-arrow-down");
        $('#svg4').removeClass("svg-arrow-down");
        $('#svg1').addClass("svg-arrow");
        $('#svg2').addClass("svg-arrow");
        $('#svg3').addClass("svg-arrow");
        $('#svg4').addClass("svg-arrow");
    }

    sortByName(){
        console.log('sortByName');
        
        this.resetArrow();

        if (this.sort=='UserName'){
            if (this.arrow=='ASC'){
                this.arrow='DESC';
               
                $('#svg1').addClass("svg-arrow-down");
            }else{
                this.arrow='ASC';
                
                $('#svg1').addClass("svg-arrow-up");
            }

        }else{
            this.sort='UserName';
            this.arrow='ASC';
           
            $('#svg1').addClass("svg-arrow-up");
        }
       
        if ($.cookie("SelectCompany")){
            this.getPageDataByCompany($.cookie("SelectCompany"));
        }else{
            this.getPageData(this.page,this.sort,this.arrow);
        }
        
    
    }


    sortByAccount(){
        
        this.resetArrow();

        if (this.sort=='Account'){
            if (this.arrow=='ASC'){
                this.arrow='DESC';
               
                $('#svg2').addClass("svg-arrow-down");
            }else{
                this.arrow='ASC';
                
                $('#svg2').addClass("svg-arrow-up");
            }

        }else{
            this.sort='Account';
            this.arrow='ASC';
           
            $('#svg2').addClass("svg-arrow-up");
        }
       
        if ($.cookie("SelectCompany")){
            this.getPageDataByCompany($.cookie("SelectCompany"));
        }else{
            this.getPageData(this.page,this.sort,this.arrow);
        }
    }

    sortByPhone(){
        
        this.resetArrow();

        if (this.sort=='Phone'){
            if (this.arrow=='ASC'){
                this.arrow='DESC';
               
                $('#svg3').addClass("svg-arrow-down");
            }else{
                this.arrow='ASC';
                
                $('#svg3').addClass("svg-arrow-up");
            }

        }else{
            this.sort='Phone';
            this.arrow='ASC';
           
            $('#svg3').addClass("svg-arrow-up");
        }
       
        if ($.cookie("SelectCompany")){
            this.getPageDataByCompany($.cookie("SelectCompany"));
        }else{
            this.getPageData(this.page,this.sort,this.arrow);
        }
    }

    sortByGroupName(){
        
        this.resetArrow();

        if (this.sort=='GroupName'){
            if (this.arrow=='ASC'){
                this.arrow='DESC';
               
                $('#svg4').addClass("svg-arrow-down");
            }else{
                this.arrow='ASC';
                
                $('#svg4').addClass("svg-arrow-up");
            }

        }else{
            this.sort='GroupName';
            this.arrow='ASC';
           
            $('#svg4').addClass("svg-arrow-up");
        }
       
        if ($.cookie("SelectCompany")){
            this.getPageDataByCompany($.cookie("SelectCompany"));
        }else{
            this.getPageData(this.page,this.sort,this.arrow);
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

    async getPageDataByCompany(company){

        console.log('getPageDataByCompany')


        $('#UserAdd').attr("href",`manageUserAdd?companyid=${company}`);

        const promise = $.ajax({
            type: 'GET',
            url: `/UserAPI/UserListByCompanyByPageBySort/${company}/${this.page}/${this.sort}/${this.arrow}`,
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

    changeCompany(){
        console.log('change company');
        console.log($('#Company').val());
        let company=$('#Company').val();

        $.cookie("SelectCompany", company);

        this.page=1;
        this.getPageDataByCompany(company)


    }

    showFilter(){
        console.log('toggle filter');
        $('#Company').toggleClass('hidden');
    }

    setFilterButtonClickEvent(){
        this.filter.removeEventListener('click', this.showFilter);
        this.filter.addEventListener('click', this.showFilter.bind(this), false);
    }

   

}

