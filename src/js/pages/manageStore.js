/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import manageStoreHtml from '../../html/pages/manageStore.html';
import { ImgToSvg,getUserInfo } from '../library/common';
import { ManageStoreHandler } from '../library/manageStoreHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';

export default function manageStore() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+manageStoreHtml;

    $(doc).ready(async () => {

        let {groupId,companyId,langId}=await getUserInfo($.cookie('token'));

        if (groupId<=2){
            $('#filter').attr("style","visibility:hidden")
            
        }

        if ($.cookie("langId")) langId=parseInt($.cookie("langId"));
        let rule='@media only screen and (max-width: 760px),(min-device-width: 768px) and (max-device-width: 1024px)  {';
        rule+=`.mstore td:nth-of-type(1):before {content: "${oneTerm(langId,'store')}";}`;
        rule+=`.mstore td:nth-of-type(2):before {content: "${oneTerm(langId,'address')}";}`;
        rule+=`.mstore td:nth-of-type(3):before {content: "${oneTerm(langId,'person')}";}`;
        rule+=`.mstore td:nth-of-type(4):before {content: "${oneTerm(langId,'phone')}";}`;
        rule+='}';
        document.styleSheets[0].insertRule(rule,1);
      
        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('manageStore');
        commonFunctionHandler.setLang();

        ImgToSvg();     
        
        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
        let companyid=queryObject.companyid;
        const manageStoreHandler = new ManageStoreHandler();

        if ($.cookie("SelectCompany")){
            companyid=$.cookie("SelectCompany");
        }

        console.log(`group id=${groupId}`)

        if (companyid){

            manageStoreHandler.setCompanyId(companyid);
            
            if (groupId==3){
                manageStoreHandler.getPageDataByCompany(companyid);
                $('#FilterPanel').removeClass('hidden');
                manageStoreHandler.getFilterData(companyid);
            }else{
                manageStoreHandler.getPageDataByUser(1,'Name','ASC');
                //manageStoreHandler.getPageDataByCompany(companyid);
                //manageStoreHandler.getFilterData(companyid);
            }

            $('#StoreAdd').attr("href",`manageStoreAdd?companyid=${companyid}`);
            
        }else{
            manageStoreHandler.getPageDataByUser(1,'Name','ASC');
            if (groupId==3){
                $('#FilterPanel').removeClass('hidden');
                manageStoreHandler.getFilterData(companyId);
            }
            $('#StoreAdd').attr("href",`manageStoreAdd?companyid=${companyId}`);
        }

        

        manageStoreHandler.setSorting();
        //manageStoreHandler.setFilterButtonClickEvent();
       
    });

}
