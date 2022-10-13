/*eslint-disable*/
import headerHtml from '../../html/layout/header.html';
import gatewaySettingHtml from '../../html/pages/gatewaySetting.html';
import { GatewaySettingHandler } from '../library/gatewaySettingHandler.js';
import { getData } from '../library/getData.js'

export default function register() {
    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+gatewaySettingHtml;
    
    $(doc).ready(() => {

        

        console.log('gatewaySetting ready');

        // 載入資料
        let data = getData("GatewayList");
        let gatewaySelect=document.getElementById("gatewaySelect");
        data.forEach(item => {
            //console.log(item.gatewayName)
            var option = document.createElement("option");
            option.value = item.gatewayCode;
            option.text = item.gatewayCode;
            //option.mac=item.mac;
            option.setAttribute("mac",item.mac);
            option.setAttribute("firmware",item.firmware);
            option.setAttribute("gatewayName",item.gatewayName);
           
            gatewaySelect.appendChild(option);
        
        })

        const gatewaySettingHandler = new GatewaySettingHandler();

        gatewaySettingHandler.gatewaySelectEvent();
        gatewaySettingHandler.setGatewaySelectListenOnChange();

        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
        console.log(queryObject.gatewayCode);
        if (queryObject.gatewayCode){
            Array.from(document.querySelector("#gatewaySelect").options).forEach(function(option_element) {
                if (queryObject.gatewayCode==option_element.value){
                    option_element.selected=true;
                    gatewaySettingHandler.gatewaySelectEvent();
                }

            });
        }



        /*
        const account = doc.getElementById('account');
        const userName = doc.getElementById('userName');
        const alarmPhone1 = doc.getElementById('alarmPhone1');
        const alarmPhone2 = doc.getElementById('alarmPhone2');
        const alarmEmail1 = doc.getElementById('alarmEmail1');
        const alarmEmail2 = doc.getElementById('alarmEmail2');
        const isMainPhoneEnabled = doc.getElementById('isMainPhoneEnabled');
        const isSecondaryPhoneEnabled = doc.getElementById('isSecondaryPhoneEnabled');
        const isMainEmailEnabled = doc.getElementById('isMainEmailEnabled');
        const isSecondaryEmailEnabled = doc.getElementById('isSecondaryEmailEnabled');

        const promise = $.ajax({
            type: 'GET',
            url: '/UserAPI/User/',
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });
        promise.done((response) => {
           console.log(response[0])
            const {
                UserName,
                MainEmail,
                SecondaryEmail,
                MainPhone,
                SecondaryPhone,
                IsMainPhoneEnabled,
                IsSecondaryPhoneEnabled,
                IsMainEmailEnabled,
                IsSecondaryEmailEnabled,
            } = response[0];

            isMainPhoneEnabled.checked = IsMainPhoneEnabled;
            isSecondaryPhoneEnabled.checked = IsSecondaryPhoneEnabled;
            isMainEmailEnabled.checked = IsMainEmailEnabled;
            isSecondaryEmailEnabled.checked = IsSecondaryEmailEnabled;

            if (UserName) {
                userName.placeholder = UserName;
            }

            if (MainEmail) {
                account.placeholder = MainEmail;
                alarmEmail1.placeholder = MainEmail;
            }

            if (MainPhone) {
                alarmPhone1.placeholder = MainPhone;
            }

            if (SecondaryPhone) {
                alarmPhone2.placeholder = SecondaryPhone;
            }

            if (SecondaryEmail) {
                alarmEmail2.placeholder = SecondaryEmail;
            }
        });
        promise.fail((e) => {
            console.log(e.responseText)
            popMsgHandler('popmsg', 1, `Get user data Fail. `).then((timeout) => {
                clearTimeout(timeout);
            });

        });
        

        const submitBtn = doc.getElementById('submitBtn');
        const submitBtnHandler = function () {


            
            const data = {};

            data.IsMainPhoneEnabled = isMainPhoneEnabled.checked ? 1 : 0;
            data.IsSecondaryPhoneEnabled = isSecondaryPhoneEnabled.checked ? 1 : 0;
            data.IsMainEmailEnabled = isMainEmailEnabled.checked ? 1 : 0;
            data.IsSecondaryEmailEnabled = isSecondaryEmailEnabled.checked ? 1 : 0;

            if (userName.value.length != 0) {
                if (userName.value.indexOf(' ') != -1) {
                    popMsgHandler('popmsg', 1, '使用者名稱不得包含空白字元').then((timeout) => {
                        clearTimeout(timeout);
                    });
                    return;
                } else {
                    data.UserName = userName.value;
                }
            } else {
                data.UserName = userName.placeholder;
            }

            if (validator.isMobilePhone(alarmPhone1.value, ['zh-TW'])) {
                data.MainPhone = alarmPhone1.value;
            } else {
                data.MainPhone = alarmPhone1.placeholder;
            }

            if (validator.isMobilePhone(alarmPhone2.value, ['zh-TW'])) {
                data.SecondaryPhone = alarmPhone2.value;
            } else {
                data.SecondaryPhone = alarmPhone2.placeholder;
            }

            if (validator.isEmail(alarmEmail2.value)) {
                data.SecondaryEmail = alarmEmail2.value;
            } else {
                data.SecondaryEmail = alarmEmail2.placeholder;
            }

            const promise = $.ajax({
                type: 'PATCH',
                url: '/UserAPI/User/',
                async: true,
                crossDomain: true,
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                }
            });
            promise.done(async (response) => {

                popMsgHandler('popmsg', 0, '更新成功').then((timeout) => {
                    clearTimeout(timeout);

                    window.location = '/userSetting';
                });
                console.log(response)

            });
            promise.fail((e) => {
                console.log(e.responseText)

                popMsgHandler('popmsg', 1, `更新失敗`).then((timeout) => {
                    clearTimeout(timeout);
                });
            });
            console.log('data: ', data);
        };

        submitBtn.removeEventListener('click', submitBtnHandler);
        submitBtn.addEventListener('click', submitBtnHandler);
        */

      

        /*
        $(function () {
            $('input,textarea').focus(function () {
                $(this).data('placeholder', $(this).attr('placeholder'))
                       .attr('placeholder', '');
            }).blur(function () {
                $(this).attr('placeholder', $(this).data('placeholder'));
            });
        });
        */

    });
}