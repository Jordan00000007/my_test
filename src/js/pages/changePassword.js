/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import validator from 'validator';
import changePasswordHtml from '../../html/pages/changePassword.html';
import { modalMsgHandler,getUserInfo,ImgToSvg } from '../library/common';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';

export default function register() {
    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+changePasswordHtml;
    console.log('changePassword');

    $(doc).ready(async () => {

        let {groupId,langId}= await getUserInfo($.cookie('token'));

        console.log('groupId='+groupId)
        console.log('langId='+langId)

        if ($.cookie("langId")) langId=parseInt($.cookie("langId"));

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('userSetting');
        commonFunctionHandler.setLang();

        if (groupId==4){
          
            $('#inputOldPassWord').attr('disabled', true);
            $('#inputNewPassWord').attr('disabled', true);
            $('#inputReNewPassWord').attr('disabled', true);
            $('#Submit').attr('disabled', true);
           
        }

        ImgToSvg();

        const submitBtn = doc.getElementById('Submit');
        const submitBtnHandler = function () {

            $('#inputOldPassWord').removeClass("invalid");
            $('#inputNewPassWord').removeClass("invalid");
            $('#inputReNewPassWord').removeClass("invalid");

            const inputOldPassWord = doc.getElementById('inputOldPassWord').value;
            const inputNewPassWord = doc.getElementById('inputNewPassWord').value;
            const inputReNewPassWord = doc.getElementById('inputReNewPassWord').value;

            if (validator.isEmpty(inputOldPassWord, { 'ignore_whitespace': true })) {
                
                modalMsgHandler('modal', 1, oneTerm(langId,'oldPasswordFormatIsWrong')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                });

                $('#inputOldPassWord').addClass("invalid");

                return;
            }

            if (validator.isEmpty(inputNewPassWord, { 'ignore_whitespace': true })) {

                modalMsgHandler('modal', 1, oneTerm(langId,'newPasswordFormatIsWrong')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                });

                $('#inputNewPassWord').addClass("invalid");

                return;
            }

            if (inputNewPassWord != inputReNewPassWord) {

                modalMsgHandler('modal', 1, oneTerm(langId,'theNewPasswordDoesNotMatchTheConfirmedPassword')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                    }, timeout);
                });

                $('#inputNewPassWord').addClass("invalid");
                $('#inputReNewPassWord').addClass("invalid");

                return;
            }

            const promise = $.ajax({
                type: 'PATCH',
                url: '/UserAPI/User/Password/',
                async: true,
                crossDomain: true,
                data: {
                    Password: inputOldPassWord,
                    NewPassword: inputNewPassWord
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                }
            });
            promise.done(async (response) => {

                
                modalMsgHandler('modal', 0, oneTerm(langId,'passwordChangedSuccessfully')).then((timeout) => {
                    $('#modal').modal('show');
                    setTimeout(()=>{ 
                        $('#modal').modal('hide');
                        $('#modal').remove();
                        window.location = '/logout';
                    }, timeout);
                });


                console.log(response)

            });
            promise.fail((e) => {
                console.log(e.responseText)

                if (validator.contains(e.responseText, 'Password is not match')) {
                    
                    modalMsgHandler('modal', 1,oneTerm(langId,'passwordChangeFailedThePasswordDoesNotMatch')).then((timeout) => {
                        $('#modal').modal('show');
                        setTimeout(()=>{ 
                            $('#modal').modal('hide');
                            $('#modal').remove();
                        }, timeout);
                    });

                    $('#inputOldPassWord').addClass("invalid");

                } else {

                    modalMsgHandler('modal', 1, '變更密碼失敗,請聯絡管理員').then((timeout) => {
                        $('#modal').modal('show');
                        setTimeout(()=>{ 
                            $('#modal').modal('hide');
                            $('#modal').remove();
                        }, timeout);
                    });


                }
            });
        };

        submitBtn.removeEventListener('click', submitBtnHandler);
        submitBtn.addEventListener('click', submitBtnHandler);
       
    });


    $("#show_hide_oldpassword").on('click', function(event) {   
        event.preventDefault();
        if($('#inputOldPassWord').attr("type") == "text"){
            $('#inputOldPassWord').attr('type', 'password');
            $('#show_hide_oldpassword').removeClass("slash");
        }else if($('#inputOldPassWord').attr("type") == "password"){
            $('#inputOldPassWord').attr('type', 'text');
            $('#show_hide_oldpassword').addClass("slash");
        }
    });

    $("#show_hide_newpassword").on('click', function(event) {   
        event.preventDefault();
        if($('#inputNewPassWord').attr("type") == "text"){
            $('#inputNewPassWord').attr('type', 'password');
            $('#show_hide_newpassword').removeClass("slash");
        }else if($('#inputNewPassWord').attr("type") == "password"){
            $('#inputNewPassWord').attr('type', 'text');
            $('#show_hide_newpassword').addClass("slash");
        }
    });

    $("#show_hide_renewpassword").on('click', function(event) {   
        event.preventDefault();
        if($('#inputReNewPassWord').attr("type") == "text"){
            $('#inputReNewPassWord').attr('type', 'password');
            $('#show_hide_renewpassword').removeClass("slash");
        }else if($('#inputReNewPassWord').attr("type") == "password"){
            $('#inputReNewPassWord').attr('type', 'text');
            $('#show_hide_renewpassword').addClass("slash");
        }
    });
}