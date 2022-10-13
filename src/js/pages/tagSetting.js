/*eslint-disable*/
import headerHtml from '../../html/layout/header.html';
import tagSettingHtml from '../../html/pages/tagSetting.html';
import { TagSettingHandler } from '../library/tagSettingHandler.js';
import { getData } from '../library/getData.js'

export default function register() {
    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+tagSettingHtml;
    
    $(doc).ready(() => {

        

        console.log('tagSetting ready');

        // 載入資料
        let data = getData("TagList");
        let tagSelect=document.getElementById("tagSelect");
        data.forEach(item => {
            //console.log(item.gatewayName)
            var option = document.createElement("option");
            option.value = item.tagCode;
            option.text = item.tagCode;
            //option.mac=item.mac;
            option.setAttribute("tagName",item.tagName);
           
           
            tagSelect.appendChild(option);
        
        })

        const tagSettingHandler = new TagSettingHandler();

        tagSettingHandler.tagSelectEvent();
       
        tagSettingHandler.setTagSelectListenOnChange();

        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
        console.log(queryObject.tagCode);
        if (queryObject.tagCode){
            Array.from(document.querySelector("#tagSelect").options).forEach(function(option_element) {
                if (queryObject.tagCode==option_element.value){
                    option_element.selected=true;
                    tagSettingHandler.tagSelectEvent();
                }

            });
        }




    });
}