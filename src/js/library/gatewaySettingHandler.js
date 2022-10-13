/*eslint-disable*/
import { UnixTimestamp } from './common'


export class GatewaySettingHandler {

    constructor() {
        this.doc = document;
        this.gatewaySelect = this.doc.querySelector('#gatewaySelect');
        this.firmware=this.doc.querySelector('#firmware');
        this.mac=this.doc.querySelector('#mac');
        this.gatewayName=this.doc.querySelector('#gatewayName');
    }

  
    async gatewaySelectEvent() {
        var e = document.getElementById("gatewaySelect");
        var option = this.gatewaySelect.options[this.gatewaySelect.selectedIndex];
        this.firmware.value=option.getAttribute("firmware");
        this.mac.value=option.getAttribute("mac");
        this.gatewayName.value=option.getAttribute("gatewayName");
    }

    setGatewaySelectListenOnChange() {

        this.gatewaySelect.removeEventListener('change', this.gatewaySelectEvent);
        this.gatewaySelect.addEventListener('change', this.gatewaySelectEvent.bind(this), false);
    }

  
   
}

