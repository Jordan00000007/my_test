/*eslint-disable*/

import logsHtml from '../../html/pages/logs.html';
import { LogsPageHandler } from '../library/logsPageHandler'
import { DeviceSelectSortHandler } from '../library/deviceSelectSortHandler'
import { googleMapHandler } from '../library/googleMapHandler'

export default function logs() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = logsHtml;
    $(doc).ready(async () => {

        $('.nav-button').click(function (e) {
            e.preventDefault();
            console.log('click');
            $('body').toggleClass('nav-open');
        });

        const deviceSelectSortHandler = new DeviceSelectSortHandler();
        const logsPageHandler = new LogsPageHandler();

        await googleMapHandler.initMap({ lat: -1, lng: -1 });

        const getDeviceList = $.ajax({
            type: 'GET',
            url: '/DeviceAPI/Devices/',
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            success: function (data, textStatus, jqXHR) {

                if (+jqXHR.status === 204) {
                    console.log('No device data');
                    doc.getElementById('deviceSelect').innerHTML = `<option style="display: none; "value="">選擇車機</option></option><option  value="editDevice">編輯車機</option>`;
                } else {
                    deviceSelectSortHandler.sort(data);
                }
            },
            error: function (data) {
                console.log(data.responseText);
                doc.getElementById('deviceSelect').innerHTML = `<option style="display: none; "value="">選擇車機</option></option><option  value="editDevice">編輯車機</option>`;
            },
            complete: async function (data) {
                console.log("getDeviceList complete");
                logsPageHandler.setLogs();
                logsPageHandler.setDeviceSelectListenOnChange();
                logsPageHandler.setDeleteEventListenOnClick();
                logsPageHandler.addEventULClickEvent();
            }
        })
    });
}
