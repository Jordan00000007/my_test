/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import manageCompanyEdit from '../../html/pages/manageCompanyEdit.html';
import { ImgToSvg,getUserInfo } from '../library/common';
import { ManageCompanyEditHandler } from '../library/manageCompanyEditHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';

import 'tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min.js';
import 'tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css';

export default function home() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml + manageCompanyEdit;

    const manageCompanyEditHandler = new ManageCompanyEditHandler();
    
    $(doc).ready(async () => {

        let {groupId,langId}=await getUserInfo($.cookie('token'));

        if ($.cookie("langId")) langId=parseInt($.cookie("langId"));


        let localStr='zh-tw';
        switch (langId) {
            case 1:
                localStr='zh-tw';
                break;
            case 2:
                localStr='en-us';
                break;
            case 3:
                localStr='ja';
                break;
            default:
                localStr='zh-tw';
        }
     
        $('#expireDate').datetimepicker({
            locale: localStr,
            format: 'YYYY-MM-DD',
            ignoreReadonly: true,
            icons: {
                time: "fa fa-clock",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            },
            debug:true,
        });





        let rule='@media only screen and (max-width: 760px),(min-device-width: 768px) and (max-device-width: 1024px)  {';
        rule+=`.astore td:nth-of-type(1):before {content: "${oneTerm(langId,'store')}";}`;
        rule+=`.astore td:nth-of-type(2):before {content: "${oneTerm(langId,'address')}";}`;
        rule+=`.astore td:nth-of-type(3):before {content: "${oneTerm(langId,'action')}";}`;
        rule+='}';
        document.styleSheets[0].insertRule(rule,1);

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('manageCompany');
        commonFunctionHandler.setLang();

        if (groupId==4){
          
            $('#CompanyName').attr('disabled', true);
            $('#Address').attr('disabled', true);
            $('#Phone').attr('disabled', true);
            $('#expireDateStr').attr('disabled', true);
            $('#submit').attr('disabled', true);
            $('#DeleteSubmit').attr('disabled', true);
          
        }

        ImgToSvg();    

        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
        const id=queryObject.id;
        
        manageCompanyEditHandler.setId(id);
        manageCompanyEditHandler.setLangId(langId);
        
        
        manageCompanyEditHandler.setCompanyData();
        manageCompanyEditHandler.setSubmitButtonClickEvent();
        manageCompanyEditHandler.setDeleteConfirmButtonClickEvent();
        // manageSensorEditHandler.setAddStoreButtonClickEvent();
        manageCompanyEditHandler.setDeleteSubmitButtonClickEvent();
        // manageSensorEditHandler.setStoreSubmitButtonClickEvent();
       

    });

}
