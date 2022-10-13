/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import validator from 'validator';
import forgetPasswordHtml from '../../html/pages/forgetPassword.html';
import { popMsgHandler, lockBtnForAWhile,ImgToSvg } from '../library/common';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';


export default function register() {
    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+forgetPasswordHtml;
    console.log('forgetPassword');

    $(doc).ready(() => {

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setLoginLang();

        let langid=$.cookie("langId")?parseInt($.cookie("langId")):1;

        $('#inputEmail').attr('placeholder',oneTerm(langid,'email'))

        ImgToSvg();

        const forgetPasswordBtn = doc.getElementById('forgetPasswordBtn');

        let errorCount = 0;
        const forgetPasswordBtnHandler = function () {

            const inputEmail = doc.getElementById('inputEmail').value;
            $('#inputEmail').removeClass("invalid");

            if (!validator.isEmail(inputEmail)) {

                
                $('#inputEmail').addClass("invalid");

                popMsgHandler('popmsg', 1, oneTerm(langid,'emailFormatError')).then((timeout) => {

                    clearTimeout(timeout);
                });
                return;
            }

            const promise = $.ajax({
                type: 'PATCH',
                url: '/UserAPI/forgetPassword',
                async: true,
                crossDomain: true,
                cache: false,
                data: {
                    Email: inputEmail,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            
            promise.done(async (response) => {
                lockBtnForAWhile('forgetPasswordBtn', 30);
                popMsgHandler('popmsg', 0,  oneTerm(langid,'theAuthenticationLetterHasBeenSuccessfullySentPleaseReturnToTheLoginPage')).then((timeout) => {
                    clearTimeout(timeout);
                });
                console.log(response)

            });
            promise.fail((e) => {
                console.log(e.responseText)

                $('#inputEmail').addClass("invalid");

              

                if (validator.contains(e.responseText, 'is not exist')) {

                    errorCount++;
                    if (errorCount === 3) {
                        lockBtnForAWhile('forgetPasswordBtn', 30);
                        errorCount = 0;
                    }

                    popMsgHandler('popmsg', 1,  oneTerm(langid,'emailDoesNotExist')).then((timeout) => {    

                        clearTimeout(timeout);
                    });
                } else {
                    popMsgHandler('popmsg', 1, oneTerm(langid,'pleaseTryLater')).then((timeout) => {
                        clearTimeout(timeout);
                    });
                }
            });
        };

        forgetPasswordBtn.removeEventListener('click', forgetPasswordBtnHandler);
        forgetPasswordBtn.addEventListener('click', forgetPasswordBtnHandler);

        $(function () {
            $('input,textarea').focus(function () {
                $(this).data('placeholder', $(this).attr('placeholder'))
                       .attr('placeholder', '');
            }).blur(function () {
                $(this).attr('placeholder', $(this).data('placeholder'));
            });
        });

    });
}