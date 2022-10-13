/*eslint-disable*/
import headerHtml from '../../html/layout/header.html';
import userTreeViewHtml from '../../html/pages/userTreeView.html';
import { getData } from '../library/getData.js'


export default function logs() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+userTreeViewHtml;
    $(doc).ready(async () => {

        
        
        // 載入資料
        var menuItems = await getData("AccountData");
        console.log(menuItems);
        var url = "#";
        

        function makeNode(Name,ID){
            let s='';
            s+='<div class="btn-group">'
            s+=`<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${Name}</button>`
            s+='<div class="dropdown-menu">'
            s+='<a class="dropdown-item" href="userSetting">編輯</a>'
            s+='<a class="dropdown-item" href="#">刪除</a>'
            s+='<a class="dropdown-item" href="#">新增子帳號</a>'
            s+='</div>'
            s+='</div>'
            return s;
        }



        function recurseMenu(parent) {
            var s = '<ul>';
            for (var x in menuItems) {

                console.log(x);

                if (menuItems[x].PID == parent) {

                    if (parent=="0"){
                        s += '<li class="root">'+makeNode(menuItems[x].Name,menuItems[x].ID);
                    }else{
                        s += '<li>'+makeNode(menuItems[x].Name,menuItems[x].ID);
                    }
                  
                    if (menuItems[x].childCount > 0) {
                        s += recurseMenu(menuItems[x].ID);
                    }
                    s += '</li>';
                }
            }
            return s + '</ul>';
        }
        
        $("#AccountTree").html(recurseMenu("0"));
        
        //console.log(recurseMenu("0"));

        $('.nav-button').click(function (e) {
            e.preventDefault();
            console.log('click');
            $('body').toggleClass('nav-open');
        });

        
    });
}
