/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import manageUserHtml from '../../html/pages/manageUser.html';
import { ManageUserHandler } from '../library/manageUserHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { ImgToSvg,getUserInfo } from '../library/common';
import { oneTerm } from '../library/setTerm';

export default function manageUser() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+manageUserHtml;
    
    const manageUserHandler = new ManageUserHandler();

    $(doc).ready(async () => {

        let {groupId,companyId,langId}=await getUserInfo($.cookie('token'));

        if ($.cookie("langId")) langId=parseInt($.cookie("langId"));
        let rule='@media only screen and (max-width: 760px),(min-device-width: 768px) and (max-device-width: 1024px)  {';
        rule+=`.muser td:nth-of-type(1):before {content: "${oneTerm(langId,'user')}";}`;
        rule+=`.muser td:nth-of-type(2):before {content: "${oneTerm(langId,'account')}";}`;
        rule+=`.muser td:nth-of-type(3):before {content: "${oneTerm(langId,'phone')}";}`;
        rule+=`.muser td:nth-of-type(4):before {content: "${oneTerm(langId,'role')}";}`;
        rule+='}';
        document.styleSheets[0].insertRule(rule,1);

        manageUserHandler.setLangId(langId);

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('manageUser');
        commonFunctionHandler.setLang();

        ImgToSvg();      

        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
        let companyid=queryObject.companyid;

        if ($.cookie("SelectCompany")){
            companyid=$.cookie("SelectCompany");
        }

        if (companyid){
            manageUserHandler.getPageDataByCompany(companyid);
            if (groupId==3){
                $('#FilterPanel').removeClass('hidden');
                manageUserHandler.getFilterData(companyid);
            }
            $('#UserAdd').attr("href",`manageUserAdd?companyid=${companyid}`);
            
        }else{
            manageUserHandler.getPageData(1,'UserName','ASC');
            if (groupId==3){
                $('#FilterPanel').removeClass('hidden');
                manageUserHandler.getFilterData(companyId);
            }
            $('#UserAdd').attr("href",`manageUserAdd?companyid=${companyId}`);
        }

        manageUserHandler.setSorting();
        //manageUserHandler.setFilterButtonClickEvent();
       

    });

}
