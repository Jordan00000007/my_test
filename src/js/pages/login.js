/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import loginHtml from '../../html/pages/login.html';
import validator from 'validator';
import { popMsgHandler,ImgToSvg} from '../library/common';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.js';

export default function login() {
    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+loginHtml;

    $(doc).ready(() => {

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setLoginLang();

        let langid=$.cookie("langId")?parseInt($.cookie("langId")):1;
       
        switch (langid) {
            case 1:
                document.getElementById('intro_1').src=require("../../assets/introduction_1_zh.jpg");
                document.getElementById('intro_2').src=require("../../assets/introduction_2_zh.jpg");
                document.getElementById('intro_3').src=require("../../assets/introduction_3_zh.jpg");
                break;
            case 2:
                document.getElementById('intro_1').src=require("../../assets/introduction_1_en.jpg");
                document.getElementById('intro_2').src=require("../../assets/introduction_2_en.jpg");
                document.getElementById('intro_3').src=require("../../assets/introduction_3_en.jpg");
                break;
            case 3:
                document.getElementById('intro_1').src=require("../../assets/introduction_1_jp.jpg");
                document.getElementById('intro_2').src=require("../../assets/introduction_2_jp.jpg");
                document.getElementById('intro_3').src=require("../../assets/introduction_3_jp.jpg");
            
                break;               
        }

        $('.your-class').slick({
            nfinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            centerMode: false,
            variableWidth: false,
            autoplay: true,
            autoplaySpeed: 3000
        });
        

        ImgToSvg();

        doc.body.style.backgroundColor = "transparent";
        const singInBtn = doc.getElementById('singInBtn');
        
        const singInBtnHandler = function () {

            let mainEmail = document.getElementById('userId').value;
            const password = document.getElementById('password').value;
            mainEmail = mainEmail.replace(/^\s*|\s*$/g,"");


            $('#userId').removeClass("invalid");
            $('#password').removeClass("invalid");

            if (!validator.isEmail(mainEmail)) {
                popMsgHandler('popmsg', 1, oneTerm(langid,'emailFormatError')).then((timeout) => {
                    clearTimeout(timeout);
                });
                $('#userId').addClass("invalid");
                return;
            }

            if (validator.isEmpty(password, { 'ignore_whitespace': true })) {
                popMsgHandler('popmsg', 1, oneTerm(langid,'passwordFormatError')).then((timeout) => {
                    clearTimeout(timeout);
                });

                $('#password').addClass("invalid");

                return;
            }

            $.cookie("SelectCompany", null, { path: '/' });
            $.removeCookie('SelectCompany', { path: '/' });
            

            const promise = $.ajax({
                type: 'POST',
                url: '/UserAPI/Login',
                async: true,
                crossDomain: true,
                data: {
                    MainEmail: mainEmail,
                    Password: password,
                },
            });
            promise.done(async (response) => {
                await $.cookie('token', response.Token, { expires: 7 });
                window.location = '/dashboard';

            });
            promise.fail((e) => {
                console.log(e.responseText);

                $('#userId').removeClass("invalid");
                $('#password').removeClass("invalid");

                if (validator.contains(e.responseText, 'is not exist')) {
                    popMsgHandler('popmsg', 1, oneTerm(langid,'emailNotExisted')).then((timeout) => {
                        clearTimeout(timeout);
                    });

                    $('#userId').addClass("invalid");

                } else if (validator.contains(e.responseText, 'Password is not match')) {
                    popMsgHandler('popmsg', 1,  oneTerm(langid,'passwordError')).then((timeout) => {
                        clearTimeout(timeout);
                    });

                    $('#password').addClass("invalid");

                } else if (validator.contains(e.responseText, 'is expired')) {
                    popMsgHandler('popmsg', 1, oneTerm(langid,'companyExpired')).then((timeout) => {
                        clearTimeout(timeout);
                    });

                } 
                else {
                    popMsgHandler('popmsg', 1, oneTerm(langid,'loginFailed')).then((timeout) => {
                        clearTimeout(timeout);
                    });
                }
            });
        };

        singInBtn.removeEventListener('click', singInBtnHandler);
        singInBtn.addEventListener('click', singInBtnHandler);

        $(function () {
            $('input,textarea').focus(function () {
                $(this).data('placeholder', $(this).attr('placeholder'))
                       .attr('placeholder', '');
            }).blur(function () {
                $(this).attr('placeholder', $(this).data('placeholder'));
            });
        });


    });


    
    $("#show_hide_password").on('click', function(event) {
        
        event.preventDefault();
        if($('#password').attr("type") == "text"){
            $('#password').attr('type', 'password');
            $('#show_hide_password').removeClass("slash");
        }else if($('#password').attr("type") == "password"){
            $('#password').attr('type', 'text');
            $('#show_hide_password').addClass("slash");
        }
    });

    $("#userId").attr('placeholder',oneTerm($.cookie("langId")?parseInt($.cookie("langId")):1,'account'));
    $("#password").attr('placeholder',oneTerm($.cookie("langId")?parseInt($.cookie("langId")):1,'password'));
   



    // let downloadLink=document.getElementById("userManual");
    // downloadLink.href = require('../../assets/UserGuide_zh.pdf');
    // downloadLink.target = '_self';
    // downloadLink.download = 'fileName';

    const pdf2base64 = require('pdf-to-base64');
    pdf2base64("../../assets/UserGuide_zh.pdf")
    .then(
        (response) => {
            console.log(response); //cGF0aC90by9maWxlLmpwZw==
            let downloadLink=document.getElementById("userManual");
            downloadLink.href =  `data:application/pdf;base64,${response}`;
            downloadLink.target = '_self';
            downloadLink.download = 'UserGuide.pdf';
        }
    )
    .catch(
        (error) => {
            console.log(error); //Exepection error....
        }
    )

    // $("#userManual").on('click', function(event) {

    //     console.log('click user manual');
        
      

    //     //const linkSource = `data:application/pdf;base64,${contentBase64}`;
    //     const downloadLink = document.createElement('a');
    //     document.body.appendChild(downloadLink);
    //     downloadLink.href = require('../../assets/arrow.svg');
    //     downloadLink.target = '_self';
    //     downloadLink.download = 'fileName';
    //     downloadLink.click(); 
        
    // });
    // const form = document.getElementById('login-form');
    // form.addEventListener('submit', (evt) => {
    //     evt.preventDefault(); // cancel form default event
    // });
}
