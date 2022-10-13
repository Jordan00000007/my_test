/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import storeStatusHtml from '../../html/pages/storeStatus.html';
import { ImgToSvg,getUserInfo } from '../library/common';
import { StoreStatusHandler } from '../library/storeStatusHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';
import Popper from "popper.js";


export default function storeStatus() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+storeStatusHtml;
      
    const url = require('url');
    const queryObject = url.parse(window.location.href,true).query;
    const id=queryObject.id;

    $(doc).ready(async () => {

        $('#tbody').tooltip({
            selector: "[rel=tooltip]",
            template:'<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
        })


        let {groupId,langId}=await getUserInfo($.cookie('token'));

        if ($.cookie("langId")) langId=parseInt($.cookie("langId"));
        let rule='@media only screen and (max-width: 760px),(min-device-width: 768px) and (max-device-width: 1024px)  {';
        rule+=`.store td:nth-of-type(1):before {content: "${oneTerm(langId,'sensor')}";}`;
        rule+=`.store td:nth-of-type(2):before {content: "${oneTerm(langId,'status')}";}`;
        rule+=`.store td:nth-of-type(3):before {content: "${oneTerm(langId,'temperature')}";}`;
        rule+=`.store td:nth-of-type(4):before {content: "${oneTerm(langId,'battery')}";}`;
        rule+=`.store td:nth-of-type(5):before {content: "${oneTerm(langId,'expiredDate')}";}`;
        rule+='}';
        document.styleSheets[0].insertRule(rule,1);

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('main');
        commonFunctionHandler.setLang();
       
        ImgToSvg(); 
        
        const storeStatusHandler = new StoreStatusHandler();
        storeStatusHandler.setStoreID(id);
        storeStatusHandler.setLangID(langId);


        storeStatusHandler.getStoreData(id);
        storeStatusHandler.getPageData(id,1,'Name','ASC');
       
        //storeStatusHandler.getPageData(id,$.cookie("page"),$.cookie("sort"),$.cookie("arrow"));
        storeStatusHandler.setDownloadButtonClickEvent();
        storeStatusHandler.setSorting();



       
       
        window.setInterval(function(){
            
            storeStatusHandler.updatePageData();

          }, 60000);


        
    });

}
