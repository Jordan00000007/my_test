/*eslint-disable*/
import validator from 'validator';
import registerHtml from '../../html/pages/register.html';
import { popMsgHandler } from '../library/common'

export default function register() {
    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = registerHtml;
    console.log('register')
    $(doc).ready(() => {

        const registerBtn = doc.getElementById('registerBtn');

        const registerBtnHandler = function () {


            const inputName = doc.getElementById('inputName').value;
            const inputEmail = doc.getElementById('inputEmail').value;
            const inputPhone = doc.getElementById('inputPhone').value;
            const inputPassword = doc.getElementById('inputPassword').value;
            const inputConfirmPassword = doc.getElementById('inputConfirmPassword').value;


            if (validator.isEmpty(inputName, { 'ignore_whitespace': true })) {
                popMsgHandler('popmsg', 1, '使用者名稱格式錯誤').then((timeout) => {
                    clearTimeout(timeout);
                });
                return;
            }

            if (!validator.isEmail(inputEmail)) {
                popMsgHandler('popmsg', 1, '信箱格式錯誤').then((timeout) => {
                    clearTimeout(timeout);
                });
                return;
            }

            if (!validator.isMobilePhone(inputPhone, ['zh-TW'])) {
                popMsgHandler('popmsg', 1, '手機格式錯誤').then((timeout) => {
                    clearTimeout(timeout);
                });
                return;
            }

            if (validator.isEmpty(inputPassword, { 'ignore_whitespace': true })) {
                popMsgHandler('popmsg', 1, '密碼格式錯誤').then((timeout) => {
                    clearTimeout(timeout);
                });
                return;
            }

            if (!(inputPassword === inputConfirmPassword)) {
                popMsgHandler('popmsg', 1, '密碼與確認密碼不同').then((timeout) => {
                    clearTimeout(timeout);
                });
                return;
            }


            console.log('驗證通過')

            const promise = $.ajax({
                type: 'POST',
                url: '/UserAPI/User',
                async: true,
                crossDomain: true,
                data: {
                    Account: inputEmail,
                    Password: inputPassword,
                    UserName: inputName,
                    Phone: inputPhone,
                    Address: '',
                    FK_GroupID: 1
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            promise.done(async (response) => {

                popMsgHandler('popmsg', 0, '註冊成功').then((timeout) => {
                    clearTimeout(timeout);
                    window.location = '/login';
                });
                console.log(response)

            });
            promise.fail((e) => {
                console.log(e.responseText)

                if (validator.contains(e.responseText, 'Email is exist')) {
                    popMsgHandler('popmsg', 1, `註冊失敗 信箱已被使用`).then((timeout) => {
                        clearTimeout(timeout);
                    });
                } else {
                    popMsgHandler('popmsg', 1, '註冊失敗').then((timeout) => {
                        clearTimeout(timeout);
                    });
                }
            });
        };

        registerBtn.removeEventListener('click', registerBtnHandler);
        registerBtn.addEventListener('click', registerBtnHandler);

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