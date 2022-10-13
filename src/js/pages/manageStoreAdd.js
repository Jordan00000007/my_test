/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import manageStoreAddHtml from '../../html/pages/manageStoreAdd.html';
import { ImgToSvg,getUserInfo } from '../library/common';

import { ManageStoreAddHandler } from '../library/manageStoreAddHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';

import 'tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min.js';
import 'tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css';


export default function home() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+manageStoreAddHtml;
   
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
        rule+=`.mgateway td:nth-of-type(1):before {content: "MAC";}`;
        rule+=`.mgateway td:nth-of-type(2):before {content: "${oneTerm(langId,'status')}";}`;
        rule+=`.mgateway td:nth-of-type(3):before {content: "${oneTerm(langId,'version')}";}`;
        rule+=`.mgateway td:nth-of-type(4):before {content: "${oneTerm(langId,'action')}";}`;
        rule+=`.msensor td:nth-of-type(1):before {content: "${oneTerm(langId,'sensor')}";}`;
        rule+=`.msensor td:nth-of-type(2):before {content: "MAC";}`;
        rule+=`.msensor td:nth-of-type(3):before {content: "${oneTerm(langId,'status')}";}`;
        rule+=`.msensor td:nth-of-type(4):before {content: "${oneTerm(langId,'action')}";}`;
        rule+='}';
        document.styleSheets[0].insertRule(rule,1);



        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('manageStore');
        commonFunctionHandler.setLang();

        if (groupId<3){
            $('#SensorPanel').addClass('hidden');
        }

        if (groupId==4){
            $('#name').attr('disabled', true);
            $('#address').attr('disabled', true);
            $('#person').attr('disabled', true);
            $('#phone').attr('disabled', true);
            $('#GatewaySubmit').attr('disabled', true);
            $('#SensorSubmit').attr('disabled', true);
            $('#submit').attr('disabled', true);
            
        }

        ImgToSvg();    
        
        const manageStoreAddHandler = new ManageStoreAddHandler();

        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
        const companyid=queryObject.companyid;
        manageStoreAddHandler.setCompanyId(companyid);
        manageStoreAddHandler.setLangId(langId);
        manageStoreAddHandler.setSubmitButtonClickEvent();
        manageStoreAddHandler.setCancelButtonClickEvent();
        manageStoreAddHandler.setGatewayAvailableButtonClickEvent();
        manageStoreAddHandler.setSensorAvailableButtonClickEvent();
        manageStoreAddHandler.setGatewaySelectedButtonClickEvent();
        manageStoreAddHandler.setSensorSelectedButtonClickEvent();

        manageStoreAddHandler.setMap();
        manageStoreAddHandler.setAddLocationClickEvent();
        manageStoreAddHandler.setGoLocationClickEvent();


    });

}
