/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import sensorStatusHtml from '../../html/pages/sensorStatus.html';
import { ImgToSvg,getUserInfo } from '../library/common';

import 'tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min.js';
import 'tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css';
import { SensorStatusHandler } from '../library/sensorStatusHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';
import 'textillate/assets/animate.css';
import 'textillate/jquery.textillate.js';
import 'textillate/assets/jquery.fittext.js';
import 'textillate/assets/jquery.lettering.js';




export default function home() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+sensorStatusHtml;

    const sensorStatusHandler = new SensorStatusHandler();
    const url = require('url');
    const queryObject = url.parse(window.location.href,true).query;
    const storeid=queryObject.storeid;
    const sensorid=queryObject.sensorid;
    sensorStatusHandler.setStoreId(storeid);
    sensorStatusHandler.setSensorId(sensorid);


    let cdt=moment().format("YYYY-MM-DD");
    let bdt=`${cdt} 00:00:00`;
    let edt=`${cdt} 23:59:59`;

    console.log(cdt)

    $('#Filter1').val(`${cdt} - ${cdt}`);
    $('#Filter1').attr('bdt',bdt);
    $('#Filter1').attr('edt',edt);

        
    

    $(doc).ready(async () => {

        $('#tbody').tooltip({
            selector: "[rel=tooltip]",
            template:'<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
        })

        console.log(`last page=${$.cookie("page")}`);
        console.log(`last sort=${$.cookie("sort")}`);
        console.log(`last arrow=${$.cookie("arrow")}`);


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



        let rule='@media only screen and (max-width: 760px),(min-device-width: 768px) and (max-device-width: 1024px)  {';
        rule+=`.sensor td:nth-of-type(1):before {content: "${oneTerm(langId,'sensor')}";}`;
        rule+=`.sensor td:nth-of-type(2):before {content: "MAC";}`;
        rule+=`.sensor td:nth-of-type(3):before {content: "${oneTerm(langId,'status')}";}`;
        rule+=`.sensor td:nth-of-type(4):before {content: "${oneTerm(langId,'temp')}";}`;
        rule+=`.sensor td:nth-of-type(5):before {content: "${oneTerm(langId,'expiredTime')}";}`;
        rule+=`.sensor td:nth-of-type(6):before {content: "${oneTerm(langId,'settings')}";}`;
        rule+='}';
        document.styleSheets[0].insertRule(rule,1);
        
        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('main');
        commonFunctionHandler.setLang();

        sensorStatusHandler.setGroupId(groupId);
        sensorStatusHandler.setLangId(langId);
        sensorStatusHandler.setLangId(langId);
        sensorStatusHandler.setModeOption();

        ImgToSvg();   

        // if (groupId==4){

        //     $('#Parameter_OT').attr('disabled', true);
        //     $('#Parameter_UT').attr('disabled', true);
        //     $('#EXP_day').attr('disabled', true);
        //     $('#EXP_hour').attr('disabled', true);
        //     $('#EXP_min').attr('disabled', true);
        //     $('#Parameter_LBATT').attr('disabled', true);
        //     $('#Parameter_A').attr('disabled', true);
        //     $('#Parameter_B').attr('disabled', true);
        //     $('#Parameter_Mode').attr('disabled', true);
        //     $('#Parameter_Inaction').attr('disabled', true);
        //     $('#Parameter_Logfreq').attr('disabled', true);
        //     $('#UploadConfig').attr('disabled', true);
            
            
        // }
                

        sensorStatusHandler.getSensorBasicData();
        //sensorStatusHandler.getSensorTempData();
        sensorStatusHandler.setEditNameSubmitButtonClickEvent();
        sensorStatusHandler.setCalendarButtonClickEvent();
        sensorStatusHandler.setDateSubmitButtonClickEvent();
        sensorStatusHandler.setDownloadButtonClickEvent();
        sensorStatusHandler.setUploadConfigButtonClickEvent();
        sensorStatusHandler.setExpOption();
        //sensorStatusHandler.setSensorNameClickEvent();
        //sensorStatusHandler.drawChart();
        
        window.setInterval(function(){
            
            sensorStatusHandler.checkSensorStatus();
            // let d0=moment().format('YYYY-MM-DD');
            // let d1=$('#datetimepicker1').datetimepicker('viewDate').format('YYYY-MM-DD');
            // let d2=$('#datetimepicker2').datetimepicker('viewDate').format('YYYY-MM-DD');
            // // console.log(`d0=${d0}`)
            // // console.log(`d1=${d1}`)
            // // console.log(`d2=${d2}`)
            // if ((d0==d1)&&(d0==d2)){
            //     sensorStatusHandler.dateSubmit();
            // }




        }, 30000);

    });

}
