/*eslint-disable*/

import eventListHtml from '../../html/pages/eventList.html';
import { EventListHandler } from '../library/eventListHandler'
import { UnixTimestamp } from '../library/common'
import { getData } from '../library/getData.js'


export default function eventList() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = eventListHtml;
    $(doc).ready(async () => {

        // 載入資料
        let data = await getData("GatewayList");
        let GatewaySelect=document.getElementById("gatewaySelect");
        data.forEach(item => {
           
            var option = document.createElement("option");
            option.text=item.gatewayName;
            option.value=item.gatewayCode;
            option.setAttribute("tagList",JSON.stringify(item.tagList));
            GatewaySelect.appendChild(option);
        
        })

        // 取得參數
        
        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
    
        for(var i=0; i < gatewaySelect.length; i++)
        {
            if (queryObject.gatewayCode==gatewaySelect.options[i].value){
                gatewaySelect.options[i].selected=true;
            }
        
        }

        const eventListHandler = new EventListHandler();
        eventListHandler.gatewaySelectEvent(queryObject.tagCode);

       /*
        for(var i=0; i < tagSelect.length; i++)
        {
            if (queryObject.tagCode==tagSelect.options[i].value){
                tagSelect.options[i].selected=true;
            }
            console.log("query tagCode="+queryObject.tagCode);
            console.log(tagSelect.options[i].value);
            
        }
        eventListHandler.tagSelectEvent();
*/
        eventListHandler.setGatewaySelectListenOnChange();
        eventListHandler.setTagSelectListenOnChange();

        /*
        const eventListHandler = new EventListHandler();

        eventListHandler.gatewaySelectEvent();
        eventListHandler.setGatewaySelectListenOnChange();

        eventListHandler.tagSelectEvent();
        eventListHandler.setTagSelectListenOnChange();
        */
       



        $('.nav-button').click(function (e) {
            console.log('click');
            e.preventDefault();
            $('body').toggleClass('nav-open');
        });

       

      
    });
}
