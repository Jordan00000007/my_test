/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import smtpHtml from '../../html/pages/smtp.html';
import { ImgToSvg,getUserInfo } from '../library/common';
import { SmtpHandler } from '../library/smtpHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';

export default function smtp() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+smtpHtml;

    const smtpHandler = new SmtpHandler();
   
    $(doc).ready(async () => {

        let {groupId,langId}=await getUserInfo($.cookie('token'));
        smtpHandler.setLangId(langId);

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('smtpSetting');
        commonFunctionHandler.setLang();

        if (groupId==4){
          
            $('#Host').attr('disabled', true);
            $('#Account').attr('disabled', true);
            $('#SendName').attr('disabled', true);
            $('#Port').attr('disabled', true);
            $('#Password').attr('disabled', true);
            $('#Submit').attr('disabled', true);
           
        }

        ImgToSvg();    
        
        const geSmtp = $.ajax({
            type: 'GET',
            url: `/StoreAPI/Smtp`,
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

                    const {
                        PK_SmtpID,
                        Host,
                        Port,
                        Account,
                        Password,
                        SendName,
                        EncodeTLS,
                        EncodeSSL,
                    }=data[0][0];

                    smtpHandler.setSmtpId(PK_SmtpID);
                    $('#Host').val(Host);
                    $('#Port').val(Port);
                    $('#Account').val(Account);
                    $('#Password').val(Password);
                    $('#SendName').val(SendName);
                    if (EncodeTLS==1){
                        $('#EncodeNone').attr("checked",false);
                        $('#EncodeTLS').attr("checked",true);
                        $('#EncodeSSL').attr("checked",false);
                    }

                    if (EncodeSSL==1){
                        $('#EncodeNone').attr("checked",false);
                        $('#EncodeTLS').attr("checked",false);
                        $('#EncodeSSL').attr("checked",true);
                    }

                    if ((EncodeTLS==0)&&(EncodeSSL==0)){
                        $('#EncodeNone').attr("checked",true);
                        $('#EncodeTLS').attr("checked",false);
                        $('#EncodeSSL').attr("checked",false);
                    }

                    console.log(data);

                
                }
            },
            error: function (data) {
                console.log(data.responseText)
                if (+data.status === 401) {
                    window.location.reload();
                }
                
            },
            complete: async function (data) {
                
                
            
            }
        })

        smtpHandler.setSubmitButtonClickEvent();

    });

}
