/*eslint-disable*/

import homeHtml from '../../html/pages/home.html';
//require('../library/websocketHandler');
import { HomePageHandler } from '../library/homePageHandler'
import { getData } from '../library/getData.js'

export default function home() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = homeHtml;
    $(doc).ready(async () => {

        // doc.body.style.backgroundImage = `url(${bg})`;
        // doc.body.style.backgroundRepeat = "no-repeat";
        // doc.body.style.backgroundSize = "cover";
        // doc.body.style.backgroundPosition = "center bottom";
        doc.body.style.zIndex = "-1";
        doc.body.style.position = "fixed";
        doc.body.style.top = "0";
        doc.body.style.width = "100%";
        doc.body.style.height = "100%";

        // 載入資料
        let data = await getData("GatewayList");
        let GatewayList=document.getElementById("GatewayList");
        data.forEach(item => {
           
            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            td1.innerHTML=`<a href='gatewaySetting?gatewayCode=${item.gatewayCode}'> ${item.gatewayName} </a>`;
            tr.appendChild(td1);
            var td2 = document.createElement("td");
            td2.innerHTML=`<a href='tagList?gatewayCode=${item.gatewayCode}&gatewayName=${item.gatewayName}'> ${item.tagNum} </a>`;
            tr.appendChild(td2);
            var td3 = document.createElement("td");
            td3.innerHTML=`<a href='eventList?gatewayCode=${item.gatewayCode}'> ${item.alertNum} </a>`;
            tr.appendChild(td3);
            GatewayList.appendChild(tr);
        
        })

        const homePageHandler = new HomePageHandler();
        console.log('home $(doc).ready');

        $('.nav-button').click(function (e) {
            e.preventDefault();
            console.log('click');
            $('body').toggleClass('nav-open');
        });

        

       

    });

}
