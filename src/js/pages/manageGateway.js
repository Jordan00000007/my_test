/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import manageGatewayHtml from '../../html/pages/manageGateway.html';
import { ManageGatewayHandler } from '../library/manageGatewayHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { ImgToSvg,getUserInfo } from '../library/common';
import { oneTerm } from '../library/setTerm';

export default function manageSensor() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+manageGatewayHtml;
    
    

    $(doc).ready(async () => {

        const manageGatewayHandler = new ManageGatewayHandler();

        let {groupId,companyId,langId}=await getUserInfo($.cookie('token'));

        if ($.cookie("SelectCompany")){
            companyId=$.cookie("SelectCompany");
        }

        if ($.cookie("langId")) langId=parseInt($.cookie("langId"));
        let rule='@media only screen and (max-width: 760px),(min-device-width: 768px) and (max-device-width: 1024px)  {';
        rule+=`.muser td:nth-of-type(1):before {content: "${oneTerm(langId,'sensorName')}";}`;
        rule+=`.muser td:nth-of-type(2):before {content: "MAC";}`;
        rule+='}';
        document.styleSheets[0].insertRule(rule,1);

        manageGatewayHandler.setLangId(langId);
        manageGatewayHandler.setGroupId(groupId);
        manageGatewayHandler.setCompanyId(companyId);

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('manageGateway');
        commonFunctionHandler.setLang();

        ImgToSvg();      

        
        manageGatewayHandler.setSorting();
        manageGatewayHandler.getFilterData(companyId);
        manageGatewayHandler.getPageDataByCompany();
        //manageGatewayHandler.setFilterButtonClickEvent();
        manageGatewayHandler.setCompanySelectChangeEvent();
        manageGatewayHandler.setSearchButtonClickEvent();
        
       

    });

}
