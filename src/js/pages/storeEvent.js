/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import storeEventHtml from '../../html/pages/storeEvent.html';
import { ImgToSvg,getUserInfo,SvgToObj } from '../library/common';
import { StoreEventHandler } from '../library/storeEventHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { getSvg } from '../library/getSvg.js';
import { oneTerm } from '../library/setTerm';



import 'bootstrap-select/dist/js/bootstrap-select.min.js';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';

import 'tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min.js';
import 'tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css';

export default function storeEvent() {

    

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+storeEventHtml;
   
    const url = require('url');
    const queryObject = url.parse(window.location.href,true).query;
    const id=queryObject.id;
    const name=queryObject.name;
    const companyid=queryObject.companyid;
    

    $(doc).ready(async () => {

        let cdt=moment().format("YYYY-MM-DD");
        let bdt=`${cdt} 00:00:00`;
        let edt=`${cdt} 23:59:59`;
        console.log(cdt)

        $('#Filter3').val(`${bdt} - ${edt}`);
        $('#Filter3').attr('bdt',bdt);
        $('#Filter3').attr('edt',edt);

        $('#datetimepicker1').datetimepicker({
            locale: 'zh-tw',
            format: 'YYYY-MM-DD HH:mm:ss',
            ignoreReadonly: true,
            defaultDate: bdt,
            icons: {
                time: "fa fa-clock",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            },
            // debug:true,
        });

        $('#datetimepicker2').datetimepicker({
            locale: 'zh-tw',
            format: 'YYYY-MM-DD HH:mm:ss',
            ignoreReadonly: true,
            defaultDate: edt,
            icons: {
                time: "fa fa-clock",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            },
            // debug:true,
        });

        let { groupId,langId }=await getUserInfo($.cookie('token'));

        if ($.cookie("langId")) langId=parseInt($.cookie("langId"));
        let rule='@media only screen and (max-width: 760px),(min-device-width: 768px) and (max-device-width: 1024px)  {';
        rule+=`.mevent td:nth-of-type(1):before {content: "${oneTerm(langId,'event')}";}`;
        rule+=`.mevent td:nth-of-type(2):before {content: "${oneTerm(langId,'sensor')}";}`;
        rule+=`.mevent td:nth-of-type(3):before {content: "${oneTerm(langId,'time')}";}`;
        rule+='}';
        document.styleSheets[0].insertRule(rule,1);


        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('main');
        commonFunctionHandler.setLang();

        ImgToSvg(); 
        
        const storeEventHandler = new StoreEventHandler();
        storeEventHandler.setLangID(langId);
        storeEventHandler.setStoreID(id);
        storeEventHandler.setCompanyID(companyid);

        
        let a1=document.createElement("a");
        a1.setAttribute("href",`home?companyid=${companyid}`);
        a1.innerHTML=oneTerm($.cookie("langId")?parseInt($.cookie("langId")):langId,'store');
        let svg=SvgToObj(getSvg('icon_next'));
        let a2=document.createElement("a");
        a2.innerHTML=`${name}${oneTerm($.cookie("langId")?parseInt($.cookie("langId")):langId,'event')}`;

        storeEventHandler.setStoreName(name);

        $('#title').append(a1);
        $('#title').append(svg);
        $('#title').append(a2);

        storeEventHandler.getSensorList(id);
        storeEventHandler.setFilterButtonClickEvent();
        storeEventHandler.setFilter1ChangeEvent();
        storeEventHandler.setFilter2ChangeEvent();
        storeEventHandler.setCalendarButtonClickEvent();
        storeEventHandler.setDateSubmitButtonClickEvent();
        storeEventHandler.setDownloadButtonClickEvent();
        //storeEventHandler.setInitDateTimeEvent();

    });

}
