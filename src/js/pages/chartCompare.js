/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import chartCompareHtml from '../../html/pages/chartCompare.html';
import { ImgToSvg,getUserInfo,SvgToObj } from '../library/common';
import { getSvg } from '../library/getSvg.js';


import 'tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min.js';
import 'tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css';
import { ChartCompareHandler } from '../library/chartCompareHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';



export default function home() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+chartCompareHtml;

    const chartCompareHandler = new ChartCompareHandler();
  

    let cdt=moment().format("YYYY-MM-DD");
    let bdt=`${cdt} 00:00:00`;
    let edt=`${cdt} 23:59:59`;
    console.log(cdt)

        $('#Filter1').val(`${cdt} - ${cdt}`);
        $('#Filter1').attr('bdt',bdt);
        $('#Filter1').attr('edt',edt);

        
    

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

        $('#datetimepicker1').datetimepicker({
            locale: localStr,
            format: 'YYYY-MM-DD',
            ignoreReadonly: true,
            defaultDate: bdt,
            icons: {
                time: "fa fa-clock",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            },
            debug:true,
        });

        $('#datetimepicker2').datetimepicker({
            locale: localStr,
            format: 'YYYY-MM-DD',
            ignoreReadonly: true,
            defaultDate: edt,
            icons: {
                time: "fa fa-clock",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            },
            debug:true,
        });


        $("#datetimepicker1").on("change.datetimepicker", function (e) {
            $('#datetimepicker2').datetimepicker('date', e.date);
        });

        

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('chartCompare');
        commonFunctionHandler.setLang();
        
        ImgToSvg();   
      
        chartCompareHandler.setLangId(langId);
        //chartCompareHandler.drawChart();
        // chartCompareHandler.setCalendarButtonClickEvent();
        // chartCompareHandler.setDateSubmitButtonClickEvent();
        // chartCompareHandler.setCalculateButtonClickEvent();
        chartCompareHandler.setDownloadButtonClickEvent();
        // chartCompareHandler.setUploadConfigButtonClickEvent();
        chartCompareHandler.setCompanyList();
        chartCompareHandler.setButtonClickEvent();
        chartCompareHandler.setChartInit();
        // chartCompareHandler.setT1ButtonClickEvent();
        // chartCompareHandler.setT2ButtonClickEvent();

        
    });

}
