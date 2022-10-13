/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import manageStoreEditHtml from '../../html/pages/manageStoreEdit.html';
import { ImgToSvg,getUserInfo } from '../library/common';
import { ManageStoreEditHandler } from '../library/manageStoreEditHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';


import 'tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min.js';
import 'tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css';



export default function manageStoreEdit() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+manageStoreEditHtml;
   
  
    function removeGateway(id){
        alert(id);
    }
    

    $(doc).ready(async () => {

        let {groupId,companyId,langId}=await getUserInfo($.cookie('token'));

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
     
        $('#expireDate').datetimepicker({
            locale: localStr,
            format: 'YYYY-MM-DD',
            ignoreReadonly: true,
            icons: {
                time: "fa fa-clock",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            },
            debug:true,
        });

        let rule='@media only screen and (max-width: 760px),(min-device-width: 768px) and (max-device-width: 1024px)  {';
        rule+=`.mgateway td:nth-of-type(1):before {content: "MAC";}`;
        rule+=`.mgateway td:nth-of-type(2):before {content: "${oneTerm(langId,'status')}";}`;
        rule+=`.mgateway td:nth-of-type(3):before {content: "${oneTerm(langId,'version')}";}`;
        rule+=`.mgateway td:nth-of-type(4):before {content: "${oneTerm(langId,'action')}";}`;
        rule+=`.msensor td:nth-of-type(1):before {content: "${oneTerm(langId,'sensor')}";}`;
        rule+=`.msensor td:nth-of-type(2):before {content: "MAC";}`;
        rule+=`.msensor td:nth-of-type(3):before {content: "${oneTerm(langId,'status')}";}`;
        rule+=`.msensor td:nth-of-type(4):before {content: "${oneTerm(langId,'action')}";}`;
        rule+='}';
        document.styleSheets[0].insertRule(rule,1);
        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('manageStore');
        commonFunctionHandler.setLang();

        if (groupId<3){
            $('#SensorPanel').addClass('hidden');
            
        }

        if (groupId==4){
            $('#name').attr('disabled', true);
            $('#address').attr('disabled', true);
            $('#person').attr('disabled', true);
            $('#phone').attr('disabled', true);
            $('#GatewaySubmit').attr('disabled', true);
            $('#SensorSubmit').attr('disabled', true);
            $('#submit').attr('disabled', true);
            $('#StoreDelete').attr('disabled', true);
            
        }

        $('#div_expire').addClass('hidden');
        

        ImgToSvg();    

        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
        const id=queryObject.id;
        const name=queryObject.name;
        const manageStoreEditHandler = new ManageStoreEditHandler();
        manageStoreEditHandler.setId(id);
        manageStoreEditHandler.setLangId(langId);
        manageStoreEditHandler.setGroupId(groupId);
       
        const getStore = $.ajax({
            type: 'GET',
            url: `/StoreAPI/StoreListByStore/${id}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            success: function (data, textStatus, jqXHR) {

                if (+jqXHR.status === 204) {
                    console.log('No device data');
                    
                } else {

                    if ($.cookie("langId")){
                        langId=parseInt($.cookie("langId"));
                    }



                    console.log(data[0][0]);

                    let d1=moment(data[0][0].ExpireDateTime).format('YYYY-MM-DD');
                    $('#expireDate').datetimepicker('date', d1);
                    $('#StoreName').html(data[0][0].Name);
                    $('#name').val(data[0][0].Name);
                    $('#address').val(data[0][0].Address);
                    $('#phone').val(data[0][0].Phone);
                    $('#person').val(data[0][0].Person);
                    $('#latitude').val(data[0][0].Lat);
                    $('#longitude').val(data[0][0].Lng);
                    $('#confirmString').html(`${oneTerm(langId,'confirmDelete')} ${data[0][0].Name}?`);

                    $('#cancel').attr("onclick",`javascript:location.href='manageStore'`);
                    manageStoreEditHandler.setCompanyId(data[0][0].FK_CompanyID);


                }
            },
            error: function (data) {
                console.log(data.responseText)
                if (+data.status === 401) {
                    window.location.reload();
                }
                
            },
            
        });

        manageStoreEditHandler.setGatewayList();
        manageStoreEditHandler.setSensorList();
        manageStoreEditHandler.setConfirmButtonClickEvent();
        
        manageStoreEditHandler.setSubmitButtonClickEvent();
        manageStoreEditHandler.setGatewayButtonClickEvent();
        manageStoreEditHandler.setSensorButtonClickEvent();
        manageStoreEditHandler.setGatewaySubmitClickEvent();
        manageStoreEditHandler.setSensorSubmitClickEvent();
       
        

        manageStoreEditHandler.setMap();
        manageStoreEditHandler.setAddLocationClickEvent();
        manageStoreEditHandler.setGoLocationClickEvent();

        if (groupId<=3){
            manageStoreEditHandler.setDeleteButtonClickEvent();
        }



    });

}
