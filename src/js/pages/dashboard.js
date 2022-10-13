/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import dashboardHtml from '../../html/pages/dashboard.html';
import { ImgToSvg,getUserInfo } from '../library/common';
import { DashboardHandler } from '../library/dashboardHandler';
import { googleMapHandler } from '../library/googleMapHandler';
import { leafletMapHandler } from '../library/leafletMapHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_continentsLow from "@amcharts/amcharts4-geodata/continentsLow";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";




export default function dashboard() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+dashboardHtml;

    const colorOnline='#02C874';
    const colorOffline='#FF2D2D';
    const colorIdle='#EA7500';

    const url = require('url');
    const queryObject = url.parse(window.location.href,true).query;
    let companyid=queryObject.companyid;
    
    $(doc).ready(async () => {

        $.cookie("page",1);
        $.cookie("sort","PK_SensorID");
        $.cookie("arrow","DESC");

        let {groupId,companyId,langId}=await getUserInfo($.cookie('token'));

        const dashboardHandler = new DashboardHandler();
        dashboardHandler.setLangID(langId);
        //dashboardHandler.setFilterButtonClickEvent();

        if ($.cookie("SelectCompany")){
            companyid=$.cookie("SelectCompany");
        }

        if (companyid){

            dashboardHandler.setCompanyId(companyid);

            if (groupId==3){
                
                dashboardHandler.getFilterData(companyid);
                $('#FilterPanel').removeClass('hidden');
            }
        }else{
            
            if (groupId==3){
                $('#FilterPanel').removeClass('hidden');
                dashboardHandler.getFilterData(companyId);
                this.companyId=companyId;
            }
            
        }

        


        am4core.ready(function() {
        
            am4core.useTheme(am4themes_animated);
            am4core.options.autoDispose = true;

            // -------- chart 2 -------
            
            if (companyid){

                dashboardHandler.updateChart1(companyid);
                dashboardHandler.updateChart2(companyid);
                dashboardHandler.updateChart3(companyid);
                dashboardHandler.updateChart4(companyid);

            }else{
                dashboardHandler.updateChart1(companyId);
                dashboardHandler.updateChart2(companyId);
                dashboardHandler.updateChart3(companyId);
                dashboardHandler.updateChart4(companyId);
                
            }
    
            window.setInterval(function(){
            
                
                dashboardHandler.updateChart4Refresh();
               
                
    
              }, 30000);

           


           
        })

        if ($.cookie("langId")) langId=parseInt($.cookie("langId"));

        dashboardHandler.setLangID(langId);

        let rule='@media only screen and (max-width: 760px),(min-device-width: 768px) and (max-device-width: 1024px)  {';
        rule+=`.home td:nth-of-type(1):before {content: "${oneTerm(langId,'store')}";}`;
        rule+=`.home td:nth-of-type(2):before {content: "${oneTerm(langId,'sensor')}";}`;
        rule+=`.home td:nth-of-type(3):before {content: "${oneTerm(langId,'event')}";}`;
        rule+='}';
        document.styleSheets[0].insertRule(rule,1);

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('dashboard');
        commonFunctionHandler.setLang();

        ImgToSvg(); 
        
        if ($.cookie("SelectCompany")){
            companyid=$.cookie("SelectCompany");
        }

       
       
      
        
    });

}
