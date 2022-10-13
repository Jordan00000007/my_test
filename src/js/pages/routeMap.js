/*eslint-disable*/

import routeMapHtml from '../../html/pages/routeMap.html';
import { googleMapHandler } from '../library/googleMapHandler'
import { RouteMapPageHandler } from '../library/routeMapHandler'
import { DeviceSelectSortHandler } from '../library/deviceSelectSortHandler'

export default function routeMap() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = routeMapHtml;
    $(doc).ready(async () => {

        const routeMapPageHandler = new RouteMapPageHandler();
        const deviceSelectSortHandler = new DeviceSelectSortHandler();

        await googleMapHandler.initMap({ lat: 24.0453888, lng: 121.549022 });
        //await googleMapHandler.initMap({ lat: -1, lng: -1 });

        $('.nav-button').click(function (e) {
            e.preventDefault();
            $('body').toggleClass('nav-open');
        });

        let i;
        let dateString='';
        let dt=new Date();
        for (i = 0; i < 31; i++) {
            if (i>0){
                dt.setDate(dt.getDate() -1);
            }
            var mm = dt.getMonth() + 1; // getMonth() is zero-based
            var dd = dt.getDate();
            var formatdate=[dt.getFullYear(),'/',(mm>9 ? '' : '0') + mm,'/',(dd>9 ? '' : '0') + dd].join('');
            dateString+='<option value="'+formatdate+'">'+formatdate+'</option>';

        }

        doc.getElementById('dateSelect').innerHTML=dateString;

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
                routeMapPageHandler.setMapRoute();
            }
        })

        routeMapPageHandler.setDeviceSelectListenOnChange();
        routeMapPageHandler.setDateSelectListenOnChange();
    });
}
