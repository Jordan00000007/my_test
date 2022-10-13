/*eslint-disable*/

import bigMapHtml from '../../html/pages/bigMap.html';
import { googleMapHandler } from '../library/googleMapHandler'
require('../library/websocketHandler')
import { BigMapPageHandler } from '../library/bigMapHandler'
import { DeviceSelectSortHandler } from '../library/deviceSelectSortHandler'

export default function bigMap() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = bigMapHtml;
    $(doc).ready(async () => {

        const bigMapPageHandler = new BigMapPageHandler();
        const deviceSelectSortHandler = new DeviceSelectSortHandler();

        //await googleMapHandler.initMap({ lat: 25.0453888, lng: 121.549022 });
        await googleMapHandler.initMap({ lat: -1, lng: -1 });

        $('.nav-button').click(function (e) {
            e.preventDefault();
            $('body').toggleClass('nav-open');
        });


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
                bigMapPageHandler.setMapMark();
            }
        })

        bigMapPageHandler.setDeviceSelectListenOnChange();
    });
}
