/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import manageUserEditHtml from '../../html/pages/manageUserEdit.html';
import { ImgToSvg,getUserInfo } from '../library/common';
import { ManageUserEditHandler } from '../library/manageUserEditHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';

export default function home() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml + manageUserEditHtml;

    const manageUserEditHandler = new ManageUserEditHandler();
    
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
        commonFunctionHandler.setFunctionGroup('manageUser');
        commonFunctionHandler.setLang();

        if (groupId==4){
            $('#account').attr('disabled', true);
            $('#password').attr('disabled', true);
            $('#username').attr('disabled', true);
            $('#address').attr('disabled', true);
            $('#phone').attr('disabled', true);
            $('#submit').attr('disabled', true);
            $('#DeleteSubmit').attr('disabled', true);
            $('#StoreSubmit').attr('disabled', true);
        }

        ImgToSvg();    

        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
        const id=queryObject.id;
        
        manageUserEditHandler.setId(id);
        manageUserEditHandler.setLangId(langId);
        manageUserEditHandler.setGroupId(groupId);
        manageUserEditHandler.getOptionData();
        manageUserEditHandler.setStoreList();
        manageUserEditHandler.setSubmitButtonClickEvent();
        manageUserEditHandler.setDeleteConfirmButtonClickEvent();
        manageUserEditHandler.setAddStoreButtonClickEvent();
        manageUserEditHandler.setDeleteSubmitButtonClickEvent();
        manageUserEditHandler.setStoreSubmitButtonClickEvent();


    });

}
