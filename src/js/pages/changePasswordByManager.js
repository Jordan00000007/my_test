/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import validator from 'validator';
import changePasswordByManagerHtml from '../../html/pages/changePasswordByManager.html';
import { modalMsgHandler,getUserInfo,ImgToSvg } from '../library/common';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';
import { SvgToObj } from '../library/common';
import { getSvg } from '../library/getSvg.js';

export default function register() {
    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+changePasswordByManagerHtml;
    console.log('changePassword');

    $(doc).ready(async () => {

        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
        const id=queryObject.id;
        const name=queryObject.name;

        $('#Cancel').attr('onclick',`javascript:location.href='manageUserEdit?id=${id}'`);


        let svg=SvgToObj(getSvg('icon_next'));
        let title=document.getElementById('title');

        title.insertBefore(svg, title.firstChild);
        let span=document.createElement('span');
        span.innerHTML=name;
        title.insertBefore(span, title.firstChild);
       

        let {groupId,langId}= await getUserInfo($.cookie('token'));

        console.log('groupId='+groupId)
        console.log('langId='+langId)

        if ($.cookie("langId")) langId=parseInt($.cookie("langId"));

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('manageUser');
        commonFunctionHandler.setLang();

        if (groupId==4){
          
            $('#inputNewPassWord').attr('disabled', true);
            $('#Submit').attr('disabled', true);
           
        }

        ImgToSvg();

        const submitBtn = doc.getElementById('Submit');
        const submitBtnHandler = function () {

            
            $('#inputNewPassWord').removeClass("invalid");
            const inputNewPassWord = doc.getElementById('inputNewPassWord').value;
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

           

            const promise = $.ajax({
                type: 'PATCH',
                url: '/UserAPI/PasswordByManager/',
                async: true,
                crossDomain: true,
                data: {
                    UserID: id,
                    Password: inputNewPassWord
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
                        window.location = `/manageUserEdit?id=${id}`;
                    }, timeout);
                });


                //console.log(response)

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