/*eslint-disable*/
import { googleMapHandler } from './googleMapHandler'
import { getDeviceLocation } from './getDeviceLocation'

export class BigMapPageHandler {

    constructor() {
        this.doc = document;
        this.deviceSelect = this.doc.querySelector('#deviceSelect');
    }

    async setMapMark() {

        const IMEI = this.deviceSelect.value;
        if (IMEI === 'editDevice') {
            window.location = '/editDevice';
        } else {

            console.log('At setMapInfo ');
            console.log('裝置IMEI: ', IMEI);
            await $.cookie('homePageDefaultDevice', IMEI);

            let location = await getDeviceLocation(IMEI);

            if (location) {
                console.log('找到座標 ')
                let { LN, LT } = location;

                // LN = '121.549022';
                // LT = '25.0453888';
                googleMapHandler.updateMarker({ lat: +LT, lng: +LN });

            } else {
                console.log('未找到座標設為預設值')
                googleMapHandler.updateMarker({ lat: -1, lng: -1 });
            }
        }
    }

    setDeviceSelectListenOnChange() {

        this.deviceSelect.removeEventListener('change', this.setMapMark);
        this.deviceSelect.addEventListener('change', this.setMapMark.bind(this), false);
    }
}