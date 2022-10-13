/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import manageGatewayAddHtml from '../../html/pages/manageGatewayAdd.html';
import { ImgToSvg,getUserInfo } from '../library/common';
import { ManageGatewayAddHandler } from '../library/manageGatewayAddHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';


import 'tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min.js';
import 'tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css';



export default function manageGatewayAdd() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+manageGatewayAddHtml;
    
   

    $(doc).ready(async () => {

        let {groupId,companyId,langId}=await getUserInfo($.cookie('token'));

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
        commonFunctionHandler.setFunctionGroup('manageGateway');
        commonFunctionHandler.setLang();

        ImgToSvg();    

        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
        const companyid=queryObject.companyid;
        
        const manageGatewayAddHandler = new ManageGatewayAddHandler();
        manageGatewayAddHandler.setLangId(langId);
        manageGatewayAddHandler.setCompanyList();
        manageGatewayAddHandler.setCompanyChangeEvent();
        manageGatewayAddHandler.setSubmitButtonClickEvent();

        if (groupId==4){
          
            $('#GatewayMac').attr('disabled', true);
            $('#GatewayName').attr('disabled', true);
            $('#Company').attr('disabled', true);
            $('#submit').attr('disabled', true);
           
        }

        if (companyid){
            manageGatewayAddHandler.setCompanyId(companyid);
            $('#cancel').attr("onclick",`javascript:location.href='manageGateway?companyid=${companyid}'`)
        }else{
            manageGatewayAddHandler.setCompanyId(companyId);
        }


    });

}
