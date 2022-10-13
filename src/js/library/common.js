/*eslint-disable*/

import svg_error from '../../assets/icon_error.svg';
import svg_check from '../../assets/icon_check.svg';


import moment from 'moment';

export function checkToken(token) {
    return new Promise((resolve, reject) => {
        const promose = $.ajax({
            type: 'GET',
            url: '/AuthenticationAPI/TokenChecker',
            async: true,
            crossDomain: true,
            headers: {
                token,
            },
        });
        promose.done((r) => {

            resolve(true);
        });
        promose.fail((err) => {
            resolve(false);
        });
    });
}

export function getUserInfo(token) {
    return new Promise((resolve, reject) => {
        const promose = $.ajax({
            type: 'GET',
            url: '/AuthenticationAPI/TokenChecker',
            async: true,
            crossDomain: true,
            headers: {
                token,
            },
        });
        promose.done((r) => {

            resolve(r);
            //return r;

        });
        promose.fail((err) => {

            resolve(err);
            //return 'err';

        });
    });
}

/**
 * 
 * @param {string} divId 
 * @param {number} msgType 0 is success / 1 is Error
 * @param {string} msgText 
 */
export function popMsgHandler(divId, msgType, msgText) {
    return new Promise((resolve, reject) => {

        let popMsgDiv = document.getElementById(divId);
        let popMsgTimeout;

        popMsgDiv.style.display = "";

        if (msgType === 0) {

            let div=document.createElement("div");
            div.setAttribute("class","msg-success");
            div.setAttribute("style","padding:0px;vertical-align:middle;height:44px;display:flex;justify-content:left;align-items:center;");
            let span= document.createElement("span");
            span.setAttribute("style","padding-left:40px;");
            span.innerHTML=`${msgText ? msgText : 'Setup successful.'}`;
            div.appendChild(span);
            popMsgDiv.appendChild(div);

        } else if (msgType === 1) {

            let div=document.createElement("div");
            div.setAttribute("class","msg-error");
            div.setAttribute("style","padding:0px;vertical-align:middle;height:44px;display:flex;justify-content:left;align-items:center;");
            let span= document.createElement("span");
            span.setAttribute("style","padding-left:40px;");
            span.innerHTML=`${msgText ? msgText : 'Setup failed.'}`;
            div.appendChild(span);
            popMsgDiv.appendChild(div);
            
        }

        popMsgTimeout = setTimeout(() => {

            popMsgDiv.innerHTML = "";
            popMsgDiv.style.display = "none";
            resolve(popMsgTimeout);
        }, 15000)
    })
}

/**
 * 
 * @param {string} divId 
 * @param {number} msgType 0 is success / 1 is Error
 * @param {string} msgText 
 */
export function modalMsgHandler(divId, msgType, msgText) {
    return new Promise((resolve, reject) => {

        let div=document.createElement("div");
        div.setAttribute("class","modal");
        div.setAttribute("tabindex","-1");
        div.setAttribute("role","dialog");
        div.setAttribute("id",divId);


        let icon_check=`<svg class="svg-check" viewbox="11,11,22,22" preserveAspectRatio="xMaxYMax" width="61px" height="61px" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="44" height="44" viewBox="0 0 44 44">
        <defs>
          <clipPath id="clip-icon_check">
            <rect width="44" height="44"/>
          </clipPath>
        </defs>
        <g id="icon_check" clip-path="url(#clip-icon_check)">
          <g id="icon_check-2" data-name="icon_check">
            <rect id="bk" width="44" height="44" fill="none"/>
            <path id="check-circle-solid" d="M26,17a9,9,0,1,1-9-9A9,9,0,0,1,26,17ZM15.959,21.765l6.677-6.677a.581.581,0,0,0,0-.821l-.821-.821a.581.581,0,0,0-.821,0l-5.446,5.446-2.542-2.542a.581.581,0,0,0-.821,0l-.821.821a.581.581,0,0,0,0,.821l3.774,3.774a.581.581,0,0,0,.821,0Z" transform="translate(5 5)" fill="#112b4e"/>
          </g>
        </g>
      </svg>`;

      let icon_error=`<svg class="svg-error" viewbox="11,11,22,22" preserveAspectRatio="xMaxYMax" width="61px" height="61px" preserveAspectRatio="xMidYMid slice"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="44" height="44" viewBox="0 0 44 44">
      <defs>
        <clipPath id="clip-icon_error">
          <rect width="44" height="44"/>
        </clipPath>
      </defs>
      <g id="icon_error" clip-path="url(#clip-icon_error)">
        <g id="icon_error-2" data-name="icon_error">
          <rect id="bk" width="44" height="44" fill="none"/>
          <path id="exclamation-circle-solid" d="M26,17a9,9,0,1,1-9-9A9,9,0,0,1,26,17Zm-9,1.815a1.669,1.669,0,1,0,1.669,1.669A1.669,1.669,0,0,0,17,18.815Zm-1.585-6,.269,4.935a.435.435,0,0,0,.435.412h1.762a.435.435,0,0,0,.435-.412l.269-4.935a.435.435,0,0,0-.435-.459h-2.3A.435.435,0,0,0,15.415,12.814Z" transform="translate(5 5)" fill="#112b4e"/>
        </g>
      </g>
    </svg>`;

        if (msgType === 0) {

            div.innerHTML=`
                <div class="modal-dialog modal-md" role="document">
                    <div class="modal-content no-border">
                        <div class="modal-body no-border text-center" height="500px">
                            ${icon_check}<br/>
                            <label id="msg" class="modal-msg">${msgText}</label>
                        </div>
                    </div>
                </div>`;
            
        } else if (msgType === 1) {

            div.innerHTML=`
                <div class="modal-dialog modal-md" role="document">
                    <div class="modal-content no-border">
                        <div class="modal-body no-border text-center" height="500px" >
                            ${icon_error}<br/>
                            <label id="msg" class="modal-msg">${msgText}</label>
                        </div>
                    </div>
                </div>`;

        }

        $("body").append(div);
        resolve(1000);
        
    })
}



export function showMsgHandler(divId, msgType, msgText) {
    return new Promise((resolve, reject) => {

        let popMsgDiv = document.getElementById(divId);
        let popMsgTimeout;

        popMsgDiv.style.display = "";

        if (msgType === 0) {

            popMsgDiv.innerHTML = `<div style="text-align:center" class="alert alert-success" role="alert"> ${msgText ? msgText : 'Setup successful.'}</div>`;
            //popMsgDiv.innerHTML="123";

        } else if (msgType === 1) {
            popMsgDiv.innerHTML += ` <img src="${svg_error}" class="svg icon svg-error"/><div style="text-align:center" class="alert alert-danger" role="alert">${msgText ? msgText : 'Setup Failed.'}</div>`;
            //popMsgDiv.innerHTML="abc";
        }

        
    })
}

export function offMsgHandler(divId) {
    return new Promise((resolve, reject) => {

        let popMsgDiv = document.getElementById(divId);
        popMsgDiv.innerHTML = "";
        popMsgDiv.style.display = "none";

        
    })
}

/*
t type: unix time, like this '1547134990'
*/
export function UnixTimestamp(t) {

    if (('' + t).length <= 10) {
        return new Date(t * 1000).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    } else {
        return new Date(t).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    }
}

/*
t type: unix time, like this '1547134990'
*/
export function UnixTimestampFormat(t) {

    return moment.unix(t).format('YYYY-MM-DD HH:mm:ss');
    
}


/*
t type: string, like this '<svg xmlns="http://www.w3.org/2000/svg" ...'
*/
export function SvgToObj(t) {

    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(t, "text/xml");
    var svg = xmlDoc.getElementsByTagName('svg')[0];
    return svg;
}

/*
t type: UTC time, like this '2019/12/09 08:18:50 UTC'
*/
export function UTCTimestampToLocal(t) {

    return new Date(t).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
}

/*
t type: unix time, like this '1547134990'
*/
export function UnixTimestampMomentStyle(t) {

    if (('' + t).length <= 10) {
        return moment(t * 1000).format('MM/DD hh:mma');
    } else {
        return moment(t).format('MM/DD hh:mma');
    }

}

/**
 * 
 * @param {*} btnId 
 * @param {*} time 
 */
export function lockBtnForAWhile(btnId, time) {

    const btn = document.getElementById(btnId)
    btn.disabled = true;
    btn.innerHTML = time;
    let setIntervalId = setInterval(() => {

        if (time === 1) {
            clearInterval(setIntervalId)
            btn.disabled = false;
            btn.innerHTML = "確認";
            return;
        }
        time--;
        btn.innerHTML = time;
    }, 1000)
}


export function ImgToSvg() {


    jQuery('img.svg').each(function(){
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
    
        jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');
    
            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }
    
            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');
    
            // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
            if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }
    
            // Replace image with new SVG
            $img.replaceWith($svg);
    
        }, 'xml');
    
    });

}

/**
 * 
 * @param {int} ThePage 
 * @param {int} TotalRecord 
 * @param {int} TotalPage 
 * @param {string} Url 
 * 
 */
export function setPagePanel_xx(ThePage, TotalRecord, TotalPage, Url) {

    let ltDisable='';
    if (ThePage==1) ltDisable="disabled";
    let gtDisable='';
    if (ThePage==TotalPage) gtDisable="disabled";

    let out=`<li class="page-item ${ltDisable}"><a class="page-link" href="${Url+'?page='+(ThePage-1).toString()}">&lt;</a></li>`;
    for (let i = 1; i <= TotalPage; i++) {
       
        if (ThePage==i){
            out+=`<li class="page-item active"><a class="page-link" href="${Url+'?page='+i.toString()}">${i.toString()}</a></li>`
        }else{
            out+=`<li class="page-item"><a class="page-link" href="${Url+'?page='+i.toString()}">${i.toString()}</a></li>`
        }    
    }
    //out+=`<li class="page-item ${gtDisable}"><a class="page-link" href="javascript:${Url+'?page='+(ThePage+1).toString()}">&gt;</a></li>`;
    out+=`<li class="page-item ${gtDisable}"><a class="page-link" href="javascript:void(alert(${ThePage+1}));">&gt;</a></li>`;
    return out;
  
}

export function setPagePanel_xxx(ThePage, TotalRecord, TotalPage, Url) {

 
    let ul=document.createElement("ul");
    ul.setAttribute("class","pagination justify-content-end")
    for (let i = 1; i <= TotalPage; i++) {
       let li=document.createElement("li");
       li.setAttribute("class","page-item");
       let a=document.createElement("a");
       a.setAttribute("class","page-link");
       a.innerHTML=i.toString();
       li.appendChild(a);
       ul.appendChild(li);
    }
    return ul;
    
   
  
}
