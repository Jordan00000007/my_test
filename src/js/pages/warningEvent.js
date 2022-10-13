/*eslint-disable*/

import warningEventHtml from '../../html/pages/warningEvent.html';
import { UnixTimestamp } from '../library/common'
import { googleMapHandler } from '../library/googleMapHandler'

export default function warningEvent() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = warningEventHtml;
    $(doc).ready(async () => {

        $('.nav-button').click(function (e) {
            console.log('click');
            e.preventDefault();
            $('body').toggleClass('nav-open');
        });

        await googleMapHandler.initMap({ lat: -1, lng: -1 });

        const doc = document;
        const warningEventUL = doc.querySelector('#warningEventUL');
        const warningEventLi = [];

        const getUnReadEvent = $.ajax({
            type: 'GET',
            url: '/EventAPI/UnReadEvent/',
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            success: function (data, textStatus, jqXHR) {

                if (+jqXHR.status === 204) {
                    console.log('No  data');
                    warningEventUL.innerHTML = '無可顯示的事件';
                } else {

                    //data = { "Logs": [{ "DateTime": "2019-12-09 08:18:50 UTC", "Message": "Main power low voltage off event", "LN": "121.549022", "LT": "25.0453888" }, { "DateTime": 1573132060678, "Message": "Main power low voltage on event", "LN": "121.649022", "LT": "25.0453888" }] }
                    const { Logs } = data;
                    Logs.forEach(element => {
                        const { Time, Message, LN, LT } = element;
                        warningEventLi.push(`<li LN=${LN} LT=${LT}><span class="warnTime">${UnixTimestamp(Time)}</span>
                    <span class="warnConten">${Message} </span></li>`);
                    });

                    warningEventUL.innerHTML = warningEventLi.join('');

                }
            },
            error: function (data) {

                console.log(data.responseText);
                warningEventUL.innerHTML = '無可顯示的事件';
            },
            complete: function () {

                warningEventUL.addEventListener('click', (e) => {

                    const element = e.target.closest('LI');
                    googleMapHandler.updateMarker({ lat: +element.getAttribute('lt'), lng: +element.getAttribute('ln') });
                    $('#eventMapModal').modal('show')

                })
            }
        })
    });
}
