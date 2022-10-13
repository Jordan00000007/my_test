/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import manageSensorEdit from '../../html/pages/manageSensorEdit.html';
import { ImgToSvg,getUserInfo } from '../library/common';
import { ManageSensorEditHandler } from '../library/manageSensorEditHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';

export default function home() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml + manageSensorEdit;

    const manageSensorEditHandler = new ManageSensorEditHandler();
    
    $(doc).ready(async () => {

        let {groupId,langId}=await getUserInfo($.cookie('token'));

        if ($.cookie("langId")) langId=parseInt($.cookie("langId"));
        let rule='@media only screen and (max-width: 760px),(min-device-width: 768px) and (max-device-width: 1024px)  {';
        rule+=`.astore td:nth-of-type(1):before {content: "${oneTerm(langId,'store')}";}`;
        rule+=`.astore td:nth-of-type(2):before {content: "${oneTerm(langId,'address')}";}`;
        rule+=`.astore td:nth-of-type(3):before {content: "${oneTerm(langId,'action')}";}`;
        rule+='}';
        document.styleSheets[0].insertRule(rule,1);

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('manageSensor');
        commonFunctionHandler.setLang();

        if (groupId==4){
          
            $('#submit').attr('disabled', true);
            $('#mac').attr('disabled', true);
            $('#name').attr('disabled', true);
            $('#OT').attr('disabled', true);
            $('#UT').attr('disabled', true);
            $('#LBATT').attr('disabled', true);
            $('#A').attr('disabled', true);
            $('#B').attr('disabled', true);
            $('#EXP_D').attr('disabled', true);
            $('#EXP_H').attr('disabled', true);
            $('#EXP_M').attr('disabled', true);
            $('#Company').attr('disabled', true);
            $('#StoreSubmit').attr('disabled', true);
            $('#DeleteSubmit').attr('disabled', true);
           
        }

        ImgToSvg();    

        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
        const id=queryObject.id;
        
        manageSensorEditHandler.setId(id);
        manageSensorEditHandler.setLangId(langId);
        manageSensorEditHandler.setGroupId(groupId);
        manageSensorEditHandler.setCompanyList();
        manageSensorEditHandler.setExpList();
        manageSensorEditHandler.setModeOption();
        manageSensorEditHandler.setSubmitButtonClickEvent();
        manageSensorEditHandler.setDeleteConfirmButtonClickEvent();
        manageSensorEditHandler.setAddStoreButtonClickEvent();
        manageSensorEditHandler.setDeleteSubmitButtonClickEvent();
        manageSensorEditHandler.setStoreSubmitButtonClickEvent();
        manageSensorEditHandler.setPictureButtonEvent();
        manageSensorEditHandler.setCompanyChangeEvent();
        manageSensorEditHandler.setConfigQueryEvent();


    });

}
