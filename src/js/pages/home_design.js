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
        let data = await getData("TrackData");
        let GatewayList=document.getElementById("GatewayList");
        data.forEach(item => {
           
            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            td1.innerHTML=item.Name;
            tr.appendChild(td1);
            var td2 = document.createElement("td");
            td2.innerHTML=item.Time;
            tr.appendChild(td2);
            var td3 = document.createElement("td");
            td3.innerHTML=item.Location;
            tr.appendChild(td3);
            var td4 = document.createElement("td");
            var img= document.createElement("img");
            img.setAttribute("height", "30px");
            img.setAttribute("width", "30px");
            //url:require("../../assets/StartPoint.svg")
            if (item.Status=="1"){
                img.src=require("../../assets/LightGreen.svg");
               
            }else{
                img.src=require("../../assets/LightRed.svg");
            }
            td4.appendChild(img);
            tr.appendChild(td4);
            var td5 = document.createElement("td");
            var img2= document.createElement("img");
            img2.setAttribute("height", "36px");
            img2.setAttribute("width", "36px");
            if (item.Lock=="1"){
                img2.src=require("../../assets/Lock01.png");
               
            }else{
                img2.src=require("../../assets/unLock01.png");
            }
            td5.appendChild(img2);
            tr.appendChild(td5);
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
