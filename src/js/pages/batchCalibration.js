/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import batchCalibrationHtml from '../../html/pages/batchCalibration.html';
import { ImgToSvg,getUserInfo,SvgToObj } from '../library/common';
import { getSvg } from '../library/getSvg.js';


import 'tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min.js';
import 'tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css';
import { CalibrationHandler } from '../library/batchCalibrationHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';



export default function home() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+batchCalibrationHtml;

    const calibrationHandler = new CalibrationHandler();
  

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

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('calibration');
        commonFunctionHandler.setLang();

        if (groupId==4){
        
            // $('#calculate').attr('disabled', true);
            // $('#upload').attr('disabled', true);
            // $('#Par_A1').attr('disabled', true);
            // $('#Par_B1').attr('disabled', true);
            // $('#Par_T1').attr('disabled', true);
            // $('#Par_T2').attr('disabled', true);
            // $('#Par_T3').attr('disabled', true);
            // $('#Par_T4').attr('disabled', true);
            // $('#Par_A2').attr('disabled', true);
            // $('#Par_B2').attr('disabled', true);
            
        }
    
        
        ImgToSvg();   
      
        calibrationHandler.setLangId(langId);
        calibrationHandler.setCalculateButtonClickEvent();
        calibrationHandler.setUploadConfigButtonClickEvent();
       

        
    });

}
