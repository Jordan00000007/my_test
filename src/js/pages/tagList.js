/*eslint-disable*/
import headerHtml from '../../html/layout/header.html';
import tagListHTML from '../../html/pages/tagList.html';
//require('../library/websocketHandler');
import { HomePageHandler } from '../library/homePageHandler'
import { getData } from '../library/getData.js'

export default function tagList() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+tagListHTML;
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

        // 取得參數
        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
        console.log(queryObject.gatewayName);
        doc.getElementById('Title').textContent=queryObject.gatewayName;


        // 載入資料
        let data = await getData("TagList");
        let TagList=document.getElementById("TagListBody");
        data.forEach(item => {
           
            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            td1.innerHTML=`<a href='tagSetting?tagCode=${item.tagCode}'> ${item.tagName} </a>`;
            tr.appendChild(td1);
            var td2 = document.createElement("td");
            td2.innerHTML=item.status;
            tr.appendChild(td2);
            var td3 = document.createElement("td");
            td3.innerHTML=`<a href='tagChart?tagCode=${item.tagCode}&tagName=${item.tagName}'> ${item.temp} </a>`;
            tr.appendChild(td3);
            var td4 = document.createElement("td");
            td4.innerHTML=item.Expire;
            tr.appendChild(td4);
            TagList.appendChild(tr);
        
        })

        const homePageHandler = new HomePageHandler();
        console.log('home $(doc).ready');


        let exportExcelBtn=doc.getElementById('exportExcelBtn');
        exportExcelBtn.addEventListener("click",function(){
            const xlsx = require('xlsx');
            console.log('rrr');

            const tagList=doc.getElementById('TagList');
            let jsonData=[];
            for (var i = 0, row; row = tagList.rows[i]; i++) {
                //iterate through rows
                //rows would be accessed using the "row" variable assigned in the for loop
                for (var j = 0, col; col = row.cells[j]; j++) {
                  //iterate through columns
                  //columns would be accessed using the "col" variable assigned in the for loop
                  //console.log("-------------")
                //console.log(row.cells[j].td.innerHTML)

                }  
             }

             var table = document.getElementById("TagList");

           // var table = document.getElementById("my_table");
            var myRows = table.getElementsByTagName("tr");
            var $headers = table.getElementsByTagName("th")

          
            var myDataArr = [];
            let str="";


            let myColNameArr = [];
            $('#TagList tr').each(function(){
                $(this).find('th').each(function(){
                    myColNameArr.push($(this).text());
                });
            });

            //console.log(myDataArr)
            let myJsonStr ="";
            $('#TagList tr').each(function(){
               
                let myCellStr=""
                $(this).find('td').each(function(index){
                    if (myCellStr.length>0) myCellStr+=",";
                    myCellStr+=`"${myColNameArr[index].trim()}":"${$(this).text().trim()}"`;

                });
                if (myJsonStr.length>0) myJsonStr+=",";
                if (myCellStr.length>0) myJsonStr+=`{${myCellStr}}`;
               
            });
            myJsonStr=`[${myJsonStr}]`;
            console.log(myJsonStr);


             
              let jsonWorkSheet = xlsx.utils.json_to_sheet(JSON.parse(myJsonStr));
              let SheetName=queryObject.gatewayName;
              let workBook = {
                SheetNames: ['SheetName'],
                Sheets: {
                  
                    'SheetName' : jsonWorkSheet,
                }
              };
              // 將workBook寫入檔案
              xlsx.writeFile(workBook,`${SheetName}.xlsx`);
       // });

       

        

       

        });



        $('.nav-button').click(function (e) {
            e.preventDefault();
            console.log('click');
            $('body').toggleClass('nav-open');
        });
    })

}
