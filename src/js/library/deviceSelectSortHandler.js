/*eslint-disable*/
import _ from 'lodash'

export class DeviceSelectSortHandler {
    constructor() {

        this.doc = document;
        this.deviceSelect = this.doc.getElementById('deviceSelect');

    }

    async sort(data) {

        let deviceSelectOptions = [];
        //deviceSelectOptions.push(`<option style="display: none; "value="">選擇車機</option>`);

        const sortableData = $.cookie('sortable');
        const homePageDefaultDevice = $.cookie('homePageDefaultDevice');

        
        let isFindDefaultDevice = false;

        if (sortableData) {

            let sortableArry = sortableData.split(',');

            const dataLength = data.length;

            sortableArry.forEach(sortableElement => {
                for (let i = 0; i < dataLength; i++) {

                    let dataIMEI='';
                    if (data[i].IMEI){
                        dataIMEI=data[i].IMEI.toString();
                    }

                    if (dataIMEI === sortableElement) {
                    
                        if (homePageDefaultDevice === sortableElement) {
                            deviceSelectOptions.push(`<option isDevice="true" selected="selected" value="${data[i].IMEI}">${data[i].Alias}</option>`);
                            isFindDefaultDevice = true;
                        } else {
                            deviceSelectOptions.push(`<option isDevice="true" value="${data[i].IMEI}">${data[i].Alias}</option>`);
                        }
                        data[i] = '';
                    }
                }
            });

            data = _.compact(data);
            data.forEach(element => {
                const { IMEI, Alias } = element;
                if (homePageDefaultDevice === IMEI) {
                    deviceSelectOptions.push(`<option isDevice="true" selected="selected" value="${IMEI}">${Alias}</option>`);
                    isFindDefaultDevice = true;
                } else {
                    deviceSelectOptions.push(`<option isDevice="true" value="${IMEI}">${Alias}</option>`);
                }
            });

        } else {

            data.forEach(element => {
                const { IMEI, Alias } = element;
                if (homePageDefaultDevice === IMEI) {
                    deviceSelectOptions.push(`<option isDevice="true" selected="selected" value="${IMEI}">${Alias}</option>`);
                    isFindDefaultDevice = true;
                } else {
                    deviceSelectOptions.push(`<option isDevice="true" value="${IMEI}">${Alias}</option>`);
                }
            });
        }


        deviceSelectOptions.push(`<option  value="editDevice">編輯車機</option>`);
        this.deviceSelect.innerHTML = deviceSelectOptions.join('');


        if (!isFindDefaultDevice) {
            this.deviceSelect.selectedIndex = 0;
            if (this.deviceSelect.value) {
                await $.cookie('homePageDefaultDevice', this.deviceSelect.value);
            }
        }

        deviceSelectOptions = undefined;
    }

}