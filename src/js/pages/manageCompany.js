/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import manageCompanyHtml from '../../html/pages/manageCompany.html';
import { ManageCompanyHandler } from '../library/manageCompanyHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { ImgToSvg,getUserInfo } from '../library/common';
import { oneTerm } from '../library/setTerm';

export default function manageSensor() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+manageCompanyHtml;
    
    

    $(doc).ready(async () => {

        const manageCompanyHandler = new ManageCompanyHandler();

        let {groupId,companyId,langId}=await getUserInfo($.cookie('token'));

        if ($.cookie("langId")) langId=parseInt($.cookie("langId"));
        let rule='@media only screen and (max-width: 760px),(min-device-width: 768px) and (max-device-width: 1024px)  {';
        rule+=`.muser td:nth-of-type(1):before {content: "${oneTerm(langId,'companyName')}";}`;
        rule+=`.muser td:nth-of-type(2):before {content: "${oneTerm(langId,'contactPhone')}";}`;
        rule+=`.muser td:nth-of-type(3):before {content: "${oneTerm(langId,'address')}";}`;
        rule+='}';
        document.styleSheets[0].insertRule(rule,1);

        manageCompanyHandler.setLangId(langId);
        manageCompanyHandler.setCompanyId(companyId);

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('manageCompany');
        commonFunctionHandler.setLang();

        ImgToSvg();      

        
        manageCompanyHandler.setSorting();
        manageCompanyHandler.getFilterData(companyId);
        manageCompanyHandler.getPageData(1,'PK_CompanyID','DESC');
        //manageCompanyHandler.setFilterButtonClickEvent();
        manageCompanyHandler.setSearchButtonClickEvent();
       

    });

}
