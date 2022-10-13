/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import homeHtml from '../../html/pages/home.html';
import { ImgToSvg,getUserInfo } from '../library/common';
import { HomePageHandler } from '../library/homePageHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';




export default function home() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+homeHtml;

    const url = require('url');
    const queryObject = url.parse(window.location.href,true).query;
    let companyid=queryObject.companyid;
    
    $(doc).ready(async () => {

        $.cookie("page",1);
        $.cookie("sort","PK_SensorID");
        $.cookie("arrow","DESC");

        let {groupId,companyId,langId}=await getUserInfo($.cookie('token'));

        if ($.cookie("langId")) langId=parseInt($.cookie("langId"));
        let rule='@media only screen and (max-width: 760px),(min-device-width: 768px) and (max-device-width: 1024px)  {';
        rule+=`.home td:nth-of-type(1):before {content: "${oneTerm(langId,'store')}";}`;
        rule+=`.home td:nth-of-type(2):before {content: "${oneTerm(langId,'sensor')}";}`;
        rule+=`.home td:nth-of-type(3):before {content: "${oneTerm(langId,'event')}";}`;
        rule+='}';
        document.styleSheets[0].insertRule(rule,1);

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('main');
        commonFunctionHandler.setLang();

        ImgToSvg(); 
        
        const homePageHandler = new HomePageHandler();
        homePageHandler.setLangID(langId);

        if ($.cookie("SelectCompany")){
            companyid=$.cookie("SelectCompany");
        }

        if (companyid){

            homePageHandler.setCompanyId(companyid);

            if (groupId==3){
                homePageHandler.getPageDataByCompany(companyid);
                $('#FilterPanel').removeClass('hidden');
                homePageHandler.getFilterData(companyid);
            }else{
                homePageHandler.getPageDataByUser(1,'Name','ASC');
            }
        }else{
            homePageHandler.getPageDataByUser(1,'Name','ASC');
            if (groupId==3){
                $('#FilterPanel').removeClass('hidden');
                homePageHandler.getFilterData(companyId);
                this.companyId=companyId;
            }
            else{
                
            }
        }

        
        homePageHandler.setSorting();
        //homePageHandler.setFilterButtonClickEvent();
        homePageHandler.setDownloadButtonClickEvent();
      
        window.setInterval(function(){
            
            homePageHandler.updatePageData();

          }, 30000);
        
    });

}
