/*eslint-disable*/
import { UnixTimestamp,modalMsgHandler,ImgToSvg,SvgToObj } from './common';
import { getSvg } from '../library/getSvg.js';
import { oneTerm } from '../library/setTerm';


export class StoreStatusHandler {

    constructor() {
        this.doc = document;
        this.tbody = this.doc.querySelector('#tbody');
        this.pagelist= this.doc.querySelector('#PageList');
        this.title=this.doc.querySelector('#title');
        this.download=this.doc.querySelector('#download');
        this.col1=this.doc.querySelector('#col1');
        this.col2=this.doc.querySelector('#col2');
        this.col3=this.doc.querySelector('#col3');
        this.col4=this.doc.querySelector('#col4');
        this.col5=this.doc.querySelector('#col5');
        this.storeid=0;
        this.storename='';
        this.sort='Name';
        this.arrow='ASC';
        this.macarr='';
        this.page=1;
        this.svg1=this.doc.querySelector('#svg1');
        this.svg2=this.doc.querySelector('#svg2');
        this.svg3=this.doc.querySelector('#svg3');
        this.svg4=this.doc.querySelector('#svg4');
        this.svg5=this.doc.querySelector('#svg5');
        this.address='';
        this.phone='';
        this.person='';
        this.langid=1;

    }

    setLangID(id){
       
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
        }
    }


    setStoreID(StoreID){
        this.storeid=StoreID;
    }

    setStoreName(Name){
        this.storename=Name;
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
        svg2.removeEventListener('click', this.sortByStatus);
        svg2.addEventListener('click', this.sortByStatus.bind(this), false);
        this.col2.appendChild(svg2);

        let svg3=SvgToObj(getSvg('icon_sorting'));
        svg3.setAttribute("class","cursor");
        svg3.setAttribute("id","svg3");
        svg3.removeEventListener('click', this.sortByTemp);
        svg3.addEventListener('click', this.sortByTemp.bind(this), false);
        this.col3.appendChild(svg3);

        let svg4=SvgToObj(getSvg('icon_sorting'));
        svg4.setAttribute("class","cursor");
        svg4.setAttribute("id","svg4");
        svg4.removeEventListener('click', this.sortByBatt);
        svg4.addEventListener('click', this.sortByBatt.bind(this), false);
        this.col4.appendChild(svg4);

        let svg5=SvgToObj(getSvg('icon_sorting'));
        svg5.setAttribute("class","cursor");
        svg5.setAttribute("id","svg5");
        svg5.removeEventListener('click', this.sortByExp);
        svg5.addEventListener('click', this.sortByExp.bind(this), false);
        this.col5.appendChild(svg5);

    }

    resetArrow(){
        $('#svg1').removeClass("svg-arrow");
        $('#svg2').removeClass("svg-arrow");
        $('#svg3').removeClass("svg-arrow");
        $('#svg4').removeClass("svg-arrow");
        $('#svg5').removeClass("svg-arrow");
       
        $('#svg1').removeClass("svg-arrow-up");
        $('#svg2').removeClass("svg-arrow-up");
        $('#svg3').removeClass("svg-arrow-up");
        $('#svg4').removeClass("svg-arrow-up");
        $('#svg5').removeClass("svg-arrow-up");
        
        $('#svg1').removeClass("svg-arrow-down");
        $('#svg2').removeClass("svg-arrow-down");
        $('#svg3').removeClass("svg-arrow-down");
        $('#svg4').removeClass("svg-arrow-down");
        $('#svg5').removeClass("svg-arrow-down");
       
        $('#svg1').addClass("svg-arrow");
        $('#svg2').addClass("svg-arrow");
        $('#svg3').addClass("svg-arrow");
        $('#svg4').addClass("svg-arrow");
        $('#svg5').addClass("svg-arrow");
        
    }

    sortByName(){

        this.resetArrow();

        console.log('sortByName');
        console.log(this.sort)
        console.log(this.arrow)
        if (this.sort=='Name'){
            if (this.arrow=='ASC'){
                this.arrow='DESC';
                $('#svg1').removeClass("svg-arrow");
                $('#svg1').removeClass("svg-arrow-up");
                $('#svg1').addClass("svg-arrow-down");
            }else{
                this.arrow='ASC';
                $('#svg1').removeClass("svg-arrow");
                $('#svg1').removeClass("svg-arrow-down");
                $('#svg1').addClass("svg-arrow-up");
            }

        }else{
            this.sort='Name';
            this.arrow='ASC';
            $('#svg1').removeClass("svg-arrow");
            $('#svg1').removeClass("svg-arrow-down");
            $('#svg1').addClass("svg-arrow-up");
        }
        console.log(this.sort)
        console.log(this.arrow)

        this.getPageData(this.storeid,this.page,this.sort,this.arrow)
    }

    sortByStatus(){

        this.resetArrow();

        console.log('sortByStatus');
        console.log(this.sort)
        console.log(this.arrow)
        if (this.sort=='LastStatus'){
            if (this.arrow=='ASC'){
                this.arrow='DESC';
                $('#svg2').removeClass("svg-arrow");
                $('#svg2').removeClass("svg-arrow-down");
                $('#svg2').addClass("svg-arrow-up");
            }else{
                this.arrow='ASC';
                $('#svg2').removeClass("svg-arrow");
                $('#svg2').removeClass("svg-arrow-up");
                $('#svg2').addClass("svg-arrow-down");
            }

        }else{
            this.sort='LastStatus';
            this.arrow='ASC';
            $('#svg2').removeClass("svg-arrow");
            $('#svg2').removeClass("svg-arrow-up");
            $('#svg2').addClass("svg-arrow-down");
        }
        console.log(this.sort)
        console.log(this.arrow)

        this.getPageData(this.storeid,this.page,this.sort,this.arrow)
    }

    sortByTemp(){

        this.resetArrow();

        console.log('sortByTemp');
        console.log(this.sort)
        console.log(this.arrow)
        if (this.sort=='LastTemp'){
            if (this.arrow=='ASC'){
                this.arrow='DESC';
                $('#svg3').removeClass("svg-arrow");
                $('#svg3').removeClass("svg-arrow-up");
                $('#svg3').addClass("svg-arrow-down");
            }else{
                this.arrow='ASC';
                $('#svg3').removeClass("svg-arrow");
                $('#svg3').removeClass("svg-arrow-down");
                $('#svg3').addClass("svg-arrow-up");
            }

        }else{
            this.sort='LastTemp';
            this.arrow='ASC';
            $('#svg3').removeClass("svg-arrow");
            $('#svg3').removeClass("svg-arrow-down");
            $('#svg3').addClass("svg-arrow-up");
        }
        console.log(this.sort)
        console.log(this.arrow)

        this.getPageData(this.storeid,this.page,this.sort,this.arrow)
    }


    sortByBatt(){

        this.resetArrow();

        console.log('sortByBatt');
        console.log(this.sort)
        console.log(this.arrow)
        if (this.sort=='LastBatt'){
            if (this.arrow=='ASC'){
                this.arrow='DESC';
                $('#svg4').removeClass("svg-arrow");
                $('#svg4').removeClass("svg-arrow-up");
                $('#svg4').addClass("svg-arrow-down");
            }else{
                this.arrow='ASC';
                $('#svg4').removeClass("svg-arrow");
                $('#svg4').removeClass("svg-arrow-down");
                $('#svg4').addClass("svg-arrow-up");
            }

        }else{
            this.sort='LastBatt';
            this.arrow='ASC';
            $('#svg4').removeClass("svg-arrow");
            $('#svg4').removeClass("svg-arrow-down");
            $('#svg4').addClass("svg-arrow-up");
        }
        console.log(this.sort)
        console.log(this.arrow)

        this.getPageData(this.storeid,this.page,this.sort,this.arrow)
    }


    sortByExp(){

        this.resetArrow();

        console.log('sortByExp');
        console.log(this.sort)
        console.log(this.arrow)
        if (this.sort=='ExpDateTime'){
            if (this.arrow=='ASC'){
                this.arrow='DESC';
                $('#svg5').removeClass("svg-arrow");
                $('#svg5').removeClass("svg-arrow-up");
                $('#svg5').addClass("svg-arrow-down");
            }else{
                this.arrow='ASC';
                $('#svg5').removeClass("svg-arrow");
                $('#svg5').removeClass("svg-arrow-down");
                $('#svg5').addClass("svg-arrow-up");
            }

        }else{
            this.sort='ExpDateTime';
            this.arrow='ASC';
            $('#svg5').removeClass("svg-arrow");
            $('#svg5').removeClass("svg-arrow-down");
            $('#svg5').addClass("svg-arrow-up");
        }
        console.log(this.sort)
        console.log(this.arrow)

        this.getPageData(this.storeid,this.page,this.sort,this.arrow)
    }
    

    async fillTable(ans){

        console.log("----------ans------------")
        console.log(ans)

        let Arr=[];
        if (ans[0].length>0){
            ans[0].forEach(item => {
            Arr.push(item);
            });
        }

        $('#tbody').empty();

        let macArr=[];

        Arr.forEach(item => {

            macArr.push(item.MAC);

            let tr = document.createElement("tr");
            tr.setAttribute("class","cursor");
            tr.setAttribute("onclick",`javascript:location.href='sensorStatus?storeid=${this.storeid}&sensorid=${item.PK_SensorID}';`)
            tr.setAttribute("id",`Row${item.MAC}`)
            let td1 = document.createElement("td");
            let div= document.createElement("div");
            div.innerText=(item.Name==null)?(item.MAC).slice(-4):item.Name;
            //td1.innerHTML= item.Name;
            let svg=SvgToObj(getSvg('icon_edit'));
            svg.setAttribute("class","svg-lightgray cursor")
            
            div.appendChild(svg);
            td1.appendChild(div);
            td1.setAttribute("store_id",item.PK_StoreID);
           
            let td3 = document.createElement("td");

            console.log('-------- item ------------');
            console.log(item);

            //let TempStr='N/A';
            let TempStr= `<div data-html='true' rel='tooltip' style='vertical-align:middle;'><i class="fas fa-question-circle fa-fw fa-2x mr-1 msg-gray-noline"></i>N/A</div>`;

            
           
            let ot=item.OT;
            let ut=item.UT;
            //TempStr=`<div style='vertical-align:middle;'><i class="fas fa-thermometer-half fa-fw fa-2x msg-green-noline" ></i><span>${item.LastTemp} °C </span></div>`;
            TempStr= `<div data-html='true' rel='tooltip' style='vertical-align:middle;'><i class="fas fa-question-circle fa-fw fa-2x mr-1 msg-gray-noline"></i>N/A</div>`;
            if (item.LastTemp){

                if (item.LastTemp<1840){
                    let LastDateTime=moment(item.LastDateTime).format("YYYY-MM-DD HH:mm:ss");
                    TempStr=`<div data-html='true' rel='tooltip' style='vertical-align:middle;' title='${LastDateTime}'><i class="fas fa-thermometer-half fa-fw fa-2x msg-green-noline" ></i><span>${item.LastTemp} °C </span></div>`;
                    if (item.LastTemp>ot){
                        
                        //TempStr=`<span class="msg-red-noline">${item.LastTemp} °C ${oneTerm(this.langid,'temperatureIsTooHigh')}</span>`;
                        TempStr=`<div data-html='true' rel='tooltip' style='vertical-align:middle;' title='${LastDateTime}'><i class="fas fa-thermometer-full fa-fw fa-2x msg-red-noline"></i><span>${item.LastTemp} °C </span></div>`;
                        
                    }
                    if (item.LastTemp<ut){
                            
                        //TempStr=`<span class="msg-blue-noline">${item.LastTemp} °C ${oneTerm(this.langid,'temperatureIsTooLow')}</span>`;
                        TempStr=`<div data-html='true' rel='tooltip' style='vertical-align:middle;'  title='${LastDateTime}'><i class="fas fa-thermometer-quarter fa-fw fa-2x msg-blue-noline"></i><span>${item.LastTemp} °C </span></div>`;
                        
                    }

                }else{

                    if(item.LastTemp2){
                        let LastDateTime2=moment(item.LastDateTime2).format("YYYY-MM-DD HH:mm:ss");
                        TempStr=`<div data-html='true' rel='tooltip' style='vertical-align:middle;' title='${LastDateTime2}' ><i class="fas fa-thermometer-half fa-fw fa-2x msg-green-noline" ></i><span>${item.LastTemp2} °C </span></div>`;
                    
                        if (item.LastTemp2>ot){
                        
                            //TempStr=`<span class="msg-red-noline">${item.LastTemp} °C ${oneTerm(this.langid,'temperatureIsTooHigh')}</span>`;
                            TempStr=`<div data-html='true' rel='tooltip' style='vertical-align:middle;' title='${LastDateTime2}'><i class="fas fa-thermometer-full fa-fw fa-2x msg-red-noline"></i><span>${item.LastTemp2} °C </span></div>`;
                            
                        }
                        if (item.LastTemp2<ut){
                                
                            //TempStr=`<span class="msg-blue-noline">${item.LastTemp} °C ${oneTerm(this.langid,'temperatureIsTooLow')}</span>`;
                            TempStr=`<div data-html='true' rel='tooltip' style='vertical-align:middle;' title='${LastDateTime2}'><i class="fas fa-thermometer-quarter fa-fw fa-2x msg-blue-noline"></i><span>${item.LastTemp2} °C </span></div>`;
                            
                        }

                    }else{
                        TempStr= `<div data-html='true' rel='tooltip' style='vertical-align:middle;'><i class="fas fa-question-circle fa-fw fa-2x mr-1 msg-gray-noline"></i>N/A</div>`;
                    }

                }

            
               
            }
            else{

                TempStr= `<div style='vertical-align:middle;'><i class="fas fa-question-circle fa-fw fa-2x mr-1 msg-gray-noline"></i>N/A</div>`;

            }


            td3.innerHTML= TempStr;
                      
            let td2 = document.createElement("td");
            if (item.LastLost=='1'){
                td2.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-power-off fa-2x mr-2 msg-red-noline"></i>${oneTerm(this.langid,'lost')}</div>`;
            }else if(item.LastStatus=='Idle'){
                td2.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-power-off fa-2x mr-2 msg-yellow-noline"></i>${oneTerm(this.langid,'idle')}</div>`;
            }
            else{
                td2.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-power-off fa-2x mr-2 msg-blue-noline"></i>${oneTerm(this.langid,'working')}</div>`;
            
            }


            let td4 = document.createElement("td");
            if (item.LastBatt){
               
                if (item.LastBatt>=3){
                    td4.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-battery-full fa-fw fa-2x mr-2 msg-blue-noline"></i>${item.LastBatt} V</div>`;
                }else if (item.LastBatt>=2.2){
                    td4.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-battery-three-quarters fa-fw fa-2x mr-2 msg-green-noline"></i>${item.LastBatt} V</div>`;
                }else{
                    td4.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-battery-empty fa-fw fa-2x mr-2 msg-red-noline"></i>${item.LastBatt} V</div>`;
                }
                
            }else{
                td4.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-question-circle fa-fw fa-2x mr-2 msg-gray-noline"></i>N/A</div>`;
            }
            

            let td5 = document.createElement("td");
          
            if (item.ExpDateTime){

                let ExpDateTime=moment(item.ExpDateTime).unix();
                let CurrentDateTime=moment().unix();
                let ExpTime=ExpDateTime-CurrentDateTime;  
                let min=Math.floor(parseInt(ExpTime)/60);
                if (min<0){
                    //td5.innerHTML= `<span class='msg-delete'>${oneTerm(this.langid,'expired')}</span>`;
                    td5.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-calendar-times fa-fw fa-2x mr-2 msg-red-noline"></i>${oneTerm(this.langid,'expired')}</div>`;
                }else{
                    let hour=Math.floor(min/60);
                    min=min%60
                    let day=Math.floor(hour/24);
                    hour=hour%24;
                    // console.log(min);
                    // console.log(hour);
                    // console.log(day);
                    
                    if (day==0){
                        td5.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-calendar-minus fa-fw fa-2x msg-yellow-noline"></i>${('0'+day).slice(-2)}d:${('0'+hour).slice(-2)}h:${('0'+min).slice(-2)}m</div>`;
                    }else{
                        td5.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-calendar-check fa-fw fa-2x msg-blue-noline"></i>${('0'+day).slice(-2)}d:${('0'+hour).slice(-2)}h:${('0'+min).slice(-2)}m</div>`;
                    }
                    
                }


                //td4.innerHTML= ExpTime;


            }else{

                td5.innerHTML= `<div style='vertical-align:middle;'><i class="fas fa-question-circle fa-fw fa-2x mr-1 msg-gray-noline"></i>N/A</div>`;
                    

            }
          
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
           
            this.tbody.appendChild(tr);
                    
                    
        });
        this.setPagination(ans[1]);

        ImgToSvg(); 

        

        // $('#tbody').tooltip({
        //     selector: "[rel=tooltip]",
        //     template:'<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
        // })
        

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
        i2.setAttribute("class","fas fa-chevron-right cursor");
        i2.setAttribute("page",(ThePage+1).toString());
        gt.appendChild(i2);
        ul.appendChild(gt);

        this.pagelist.innerHTML="";
        this.pagelist.appendChild(ul);
        this.page=ThePage;
    }

    async changePage(e){
      
        let page=parseInt(e.target.getAttribute("page"));
        $.cookie("page",page);
        $.cookie("sort",this.sort);
        $.cookie("arrow",this.arrow);

        this.getPageData(this.storeid,page,this.sort,this.arrow);
    }
    
    async updatePageData(){
        console.log("updatePageData---")
        console.log(this.macarr)
        // this.getSensorStatus(this.macarr);
        // this.getSensorTemp(this.macarr);
        // this.getSensorExpTime(this.macarr);
        this.getPageData(this.storeid,this.page,this.sort,this.arrow)
    }

    async getPageData(id,page,sort,arrow){

        this.page=page;
        this.sort=sort;
        this.arrow=arrow;

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/SensorStatusListByStoreByPageBySort/${id}/${page}/${sort}/${arrow}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {

            console.log("==== Get Page Data ====");
            console.log(response);

           
            this.fillTable(response);
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, '查詢失敗,請聯絡管理員').then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });

    }

    async getFullData(id){

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/SensorStatusListAllByStore/${id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {
            console.log("==== get Export Data ====");
            console.log(response)
            
            let data=[];
            for(var p in response[0]){

                console.log('--------------P--------------');
                console.log(response[0][p]);
               
                let sItem=response[0][p];
                let tItem=`{"${oneTerm(this.langid,'sensor')}":"","${oneTerm(this.langid,'status')}":"","${oneTerm(this.langid,'temperature')}":"","${oneTerm(this.langid,'expiredDate')}":""}`;
                tItem=JSON.parse(tItem);
                //tItem[oneTerm(this.langid,'sensor')]=sItem[oneTerm(this.langid,'sensor')];
                tItem[oneTerm(this.langid,'sensor')]=sItem['Name'];
                let status='';
                switch(sItem['_StatusCode']) {
                    case 0:
                      status=oneTerm(this.langid,'lost');
                      break;
                    case 1:
                        status=oneTerm(this.langid,'working');
                      break;
                    case 3:
                        status=oneTerm(this.langid,'idle');
                    break;
                    default:
                        status='N/A';
                }
              
                tItem[oneTerm(this.langid,'status')]=status;
                let tempstr=sItem['_TempStr'];
                
                if (sItem['_TempStr']!='N/A'){
                    let ct=parseFloat(sItem['_TempStr']);
                    let ot=sItem.OT;
                    let ut=sItem.UT;
                    let flag=0;
                    if (ot){
                        if (ct>ot){
                            
                            tempstr=`${tempstr}°C ${oneTerm(this.langid,'temperatureIsTooHigh')}`;
                            flag=1;
                        }
                    }
                    if (ut){
                        if (ct<ut){
                            
                            tempstr=`${tempstr}°C ${oneTerm(this.langid,'temperatureIsTooLow')}`;
                            flag=1;
                        }
                    }
                    if (flag==0){
                        tempstr=`${tempstr}°C`;
                    }

                }
                // temp=temp.replace("溫度過高",oneTerm(this.langid,'temperatureIsTooHigh'))
                // temp=temp.replace("溫度過低",oneTerm(this.langid,'temperatureIsTooLow'))
                tItem[oneTerm(this.langid,'temperature')]=tempstr;
                let exp='';
                sItem['_LEXP'];
                if (sItem['_LEXP']=="N/A"){
                    exp='N/A';
                }else{
                   
                    let min=Math.floor(parseInt(sItem['_LEXP'])/60);
                    if (min<0){
                        exp=oneTerm(this.langid,'expired');
                    }else{
                            let hour=Math.floor(min/60);
                            min=min%60
                            let day=Math.floor(hour/24);
                            hour=hour%24;
                            exp= `${('0'+day).slice(-2)}d ${('0'+hour).slice(-2)}h ${('0'+min).slice(-2)}m`;
                    }
                }
                tItem[oneTerm(this.langid,'expiredDate')]=exp;
                data.push(tItem);

            }
            this.exportExcel(data)
          
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, '查詢失敗,請聯絡管理員').then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });

    }

    downloadData(){

        console.log('download data...');
        this.getFullData(this.storeid);
    }

    exportExcel(jsonData){

       
        let storeData=`[{"${oneTerm(this.langid,'branchName')}":"${this.storename}","${oneTerm(this.langid,'address')}":"${this.address}","${oneTerm(this.langid,'contactPerson')}":"${this.person}","${oneTerm(this.langid,'contactPhone')}":"${this.phone}"}]`;
        console.log(storeData)
        storeData=JSON.parse(storeData);
        console.log(storeData)
        const xlsx = require('xlsx');
        // 將資料轉成workSheet
        //let arrayWorkSheet = xlsx.utils.aoa_to_sheet(arrayData);
        let jsonWorkSheet = xlsx.utils.json_to_sheet(jsonData);
        let jsonWorkSheet2 = xlsx.utils.json_to_sheet(storeData);
        // console.log(arrayWorkSheet);
        // console.log(jsonWorkSheet);
        // 構造workBook
        //let data=`{"${oneTerm(this.langid,'sensorList')}":"aa","${oneTerm(this.langid,'branchInformation')}","bb"}`;
        let data=`{"${oneTerm(this.langid,'sensorList')}":"","${oneTerm(this.langid,'branchInformation')}":""}`;
        data=JSON.parse(data);
        data[oneTerm(this.langid,'sensorList')]=jsonWorkSheet;
        data[oneTerm(this.langid,'branchInformation')]=jsonWorkSheet2;
        
        let workBook = {
            SheetNames: [oneTerm(this.langid,'sensorList'),oneTerm(this.langid,'branchInformation')],
            Sheets: data,
        };
        // 將workBook寫入檔案
        xlsx.writeFile(workBook, `${this.storename}.xlsx`);
    }

    async getStoreData(id){

        const promise = $.ajax({
            type: 'GET',
            url: `/StoreAPI/StoreByStore/${id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
        });

        promise.done(async (response) => {
            
            const{
                Address,Name,Phone,Person,FK_CompanyID,MacArr
            }=response[0][0];

            let a1=this.doc.createElement("a");
            let a2=this.doc.createElement("a");
            a1.innerHTML=oneTerm(this.langid,'store')
           
            a1.href=`home?companyid=${FK_CompanyID}`;
            let svg=SvgToObj(getSvg('icon_next'));
            a2.innerText=Name;
            this.setStoreName(Name);
            this.title.appendChild(a1);
            this.title.appendChild(svg);
            this.title.appendChild(a2);
            
            $('#detail').html(`${oneTerm(this.langid,'address')}:${Address}&nbsp;&nbsp;&nbsp;&nbsp;${oneTerm(this.langid,'contactPerson')}:${Person}&nbsp;&nbsp;&nbsp;&nbsp;${oneTerm(this.langid,'contactPhone')}:${Phone}`);

            this.address=Address;
            this.person=Person;
            this.phone=Phone;

            //console.log(MacArr)

            if (MacArr!=null){
                this.macarr=MacArr;
            }

           
            //this.fillTable(response);
        });

        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, '查詢失敗,請聯絡管理員').then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
                
            });
      
        });

    }

    setDownloadButtonClickEvent() {

        this.download.removeEventListener('click', this.downloadData);
        this.download.addEventListener('click', this.downloadData.bind(this), false);

    }

}

