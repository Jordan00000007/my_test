/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import manageSensorAddHtml from '../../html/pages/manageSensorAdd.html';
import { ImgToSvg,getUserInfo } from '../library/common';
import { ManageSensorAddHandler } from '../library/manageSensorAddHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';
import HandleQuagga from '../library/HandleQuagga';



export default function manageSensorAdd() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+manageSensorAddHtml;
    
   

    $(doc).ready(async () => {

        // const isHttps = doc.location.protocol.startsWith("https");

        // console.log('isHttps: ', isHttps)

        // const hasCamera = await HandleQuagga.hasCamera()
        // console.log('hasCamera: ', hasCamera);

        // if (isHttps) {
        //     if (hasCamera) {

        //         const qrcodeIcon = doc.querySelector('#qrcodeIcon');
        //         const handleQuagga = new HandleQuagga()
    
        //         qrcodeIcon.style.display = '';
    
        //         qrcodeIcon.addEventListener('click', () => {
        //             handleQuagga.start();
        //         })
    
        //         doc.querySelector('#closeQRScanModal').addEventListener('click', () => {
        //             handleQuagga.stop();
        //         })
    
        //     }
        // }

       
        let {groupId,companyId,langId}=await getUserInfo($.cookie('token'));

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
        commonFunctionHandler.setFunctionGroup('manageSensor');
        commonFunctionHandler.setLang();

        if (groupId==4){
          
            $('#submit').attr('disabled', true);
            $('#mac').attr('disabled', true);
            $('#name').attr('disabled', true);
            $('#OT').attr('disabled', true);
            $('#UT').attr('disabled', true);
            $('#LBATT').attr('disabled', true);
            $('#A').attr('disabled', true);
            $('#B').attr('disabled', true);
            $('#EXP_D').attr('disabled', true);
            $('#EXP_H').attr('disabled', true);
            $('#EXP_M').attr('disabled', true);
            $('#Company').attr('disabled', true);
            $('#StoreSubmit').attr('disabled', true);
            $('#DeleteSubmit').attr('disabled', true);
           
        }

        ImgToSvg();    

        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
        const companyid=queryObject.companyid;
        
        const manageSensorAddHandler = new ManageSensorAddHandler();
        manageSensorAddHandler.setExpList();
        manageSensorAddHandler.setModeOption();
        manageSensorAddHandler.setCompanyList();
        manageSensorAddHandler.setCompanyChangeEvent();
        manageSensorAddHandler.setLangId(langId);

        if (companyid){
            manageSensorAddHandler.setCompanyId(companyid);
            $('#cancel').attr("onclick",`javascript:location.href='manageSensor?companyid=${companyid}'`)
        }else{
            manageSensorAddHandler.setCompanyId(companyId);
        }

        
        manageSensorAddHandler.setSubmitButtonClickEvent();
        manageSensorAddHandler.setAddStoreButtonClickEvent();
        manageSensorAddHandler.setSubmitStoreButtonClickEvent();


    });

}
