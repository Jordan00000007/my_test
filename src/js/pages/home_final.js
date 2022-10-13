/*eslint-disable*/

import homeHtml from '../../html/pages/home.html';
//require('../library/websocketHandler');
import { HomePageHandler } from '../library/homePageHandler'
import { getData } from '../library/getData.js'
import bg from '../../assets/bg.png'

export default function home() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = homeHtml;
    $(doc).ready(async () => {

        //doc.body.style.backgroundImage = `url(${bg})`;
        //doc.body.style.backgroundImage= require("../../assets/bg.png");
        doc.body.style.backgroundImage= `url(${require('../../assets/bg.png')})`;
        doc.body.style.backgroundRepeat = "no-repeat";
        doc.body.style.backgroundSize = "cover";
        doc.body.style.backgroundPosition = "center bottom";
        doc.body.style.zIndex = "-1";
        doc.body.style.position = "fixed";
        doc.body.style.top = "0";
        doc.body.style.width = "100%";
        doc.body.style.height = "100%";

        // 載入資料
        let data = await getData("TrackData");
        
        data.forEach(item => {
            var div = document.createElement("div");
            div.setAttribute("class","BadgeDiv");
            var table = document.createElement("table");
            table.setAttribute("class","BadgeItem");
            var tr1 = document.createElement("tr");
            var td1 = document.createElement("td");
            td1.innerHTML="<font class='BadgeTitle'>"+item.Name+"</font>";
            //td1.setAttribute("colspan","2");
            tr1.appendChild(td1);
            var td2 = document.createElement("td");
            var img= document.createElement("img");
            img.width=64;
            img.height=64;
            img.setAttribute("class","LockIcon");
            var br= document.createElement("br");
            var lbl= document.createElement("label");
            if (item.Lock=="1"){
                img.src= require("../../assets/lock01.png");
                lbl.innerText="鎖定";
            }else{
                img.src= require("../../assets/unlock01.png");
                lbl.innerText="解除";
            }
            
            td2.appendChild(img);
            td2.appendChild(br);
            td2.appendChild(lbl);
            td2.setAttribute("rowspan","3");
            td2.setAttribute("class","BadgeLock");
            tr1.appendChild(td2);
            var tr2 = document.createElement("tr");
            var td3 = document.createElement("td");
            td3.innerHTML=item.Location;
            //td3.setAttribute("colspan","2");
            td3.setAttribute("class","BadgeMiddle");
            tr2.appendChild(td3);
            var tr3 = document.createElement("tr");
            var td4 = document.createElement("td");
            td4.setAttribute("class","BadgeDown");
            //url:require("../../assets/StartPoint.svg")

            var img1= document.createElement("img");
            img1.width=24;
            img1.height=24;
            var lbl1= document.createElement("label");
            if (item.Status=="1"){
                
                img1.src= require("../../assets/BallGreen.svg");
                //img1.src= require("../../assets/ball_green.png");
               
                lbl1.innerHTML="&nbsp;&nbsp;啟動"+" - "+item.Time;
                
               
            }else if (item.Status=="2"){
                img1.src= require("../../assets/BallGray.svg");
                //img1.src= require("../../assets/ball_white.png");
               
                lbl1.innerHTML="&nbsp;&nbsp;靜止"+" - "+item.Time;;
                
            }
            else{
                img1.src= require("../../assets/BallRed.svg");
                //img1.src= require("../../assets/ball_orange.png");
                lbl1.innerHTML="&nbsp;&nbsp;告警"+" - "+item.Time;;
                
            }
            td4.appendChild(img1);
            td4.appendChild(lbl1);
           
            tr3.appendChild(td4);
            // var td5 = document.createElement("td");
            // td5.setAttribute("class","BadgeTime");
            // td5.innerHTML=item.Time;
            // tr3.appendChild(td5);
            table.appendChild(tr1);
            table.appendChild(tr2);
            table.appendChild(tr3);
            div.appendChild(table)
            DataList.appendChild(div);
        
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
