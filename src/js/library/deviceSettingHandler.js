/*eslint-disable*/
import { popMsgHandler } from './common'
import validator from 'validator';
export class DeviceSettingHandler {

    constructor() {

        this.doc = document;
        this.titleName = this.doc.querySelector('#titleName');
        this.deviceName = this.doc.querySelector('#deviceName');
        this.driverName = this.doc.querySelector('#driverName');
        this.sensitivitySelect = this.doc.getElementById('sensitivitySelect');
        this.expiryDate = this.doc.querySelector('#expiryDate');
        this.deleteDeviceBtn = this.doc.querySelector('#deleteDeviceBtn');
        this.saveDeviceBtn = this.doc.querySelector('#saveDeviceBtn');
        this.imei = this.doc.querySelector('#imei')
    }

    async getDeviceInfo() {
        return new Promise((resolve, reject) => {

            $.ajax({
                type: 'GET',
                url: `/DeviceAPI/Devices/${$.cookie('editDevice')}`,
                async: true,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                },
                success: function (data, textStatus, jqXHR) {

                    if (+jqXHR.status === 200) {

                        console.log(data)
                        resolve(data);

                    } else {
                        resolve(null);
                        console.log('No device data')
                    }
                },
                error: function (data) {
                    console.log(data.responseText)
                    resolve(null);
                }
            })
        })
    }

    async setDeviceInfo() {

        const diviceInfo = await this.getDeviceInfo();

        if (diviceInfo) {

            const { Alias, DriverName, ExpiryDate, IMEI, Sensitivity } = diviceInfo[0];

            this.imei.placeholder = IMEI;
            this.titleName.innerHTML = Alias;
            this.deviceName.placeholder = Alias;
            this.driverName.placeholder = DriverName;
            this.sensitivitySelect.options[+Sensitivity - 1].selected = true;
            this.expiryDate.placeholder = new Date(ExpiryDate).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

        } else {

            $.cookie('editDevice', '');
            window.location.replace('editDevice');
        }
    }

    deleteDevice() {

        console.log('At deleteDevice');
        $.ajax({
            type: 'DELETE',
            url: `/DeviceAPI/Devices/${$.cookie('editDevice')}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            success: function (data, textStatus, jqXHR) {

                popMsgHandler('popmsg', 0, '刪除成功').then((timeout) => {
                    clearTimeout(timeout);
                    window.location.replace('editDevice');
                });

            },
            error: function (data) {
                console.log(data.responseText)
                popMsgHandler('popmsg', 1, '刪除失敗').then((timeout) => {
                    clearTimeout(timeout);
                    window.location.reload();
                });
            },
            complete: function () {
                $.cookie('editDevice', '');
            }
        })
    }

    addDeleteDeviceBtnEvent() {

        this.deleteDeviceBtn.removeEventListener('click', this.deleteDevice);
        this.deleteDeviceBtn.addEventListener('click', this.deleteDevice, false);
    }

    saveDevice() {
        console.log('At saveDevice');

        const data = {}
        const deviceName = this.deviceName.value;
        const driverName = this.driverName.value;
        const sensitivity = this.sensitivitySelect.value;

        if (validator.isEmpty(deviceName, { 'ignore_whitespace': true })) {
            data.Alias = this.deviceName.placeholder;
        } else {
            data.Alias = deviceName;
        }

        if (validator.isEmpty(driverName, { 'ignore_whitespace': true })) {
            data.DriverName = this.driverName.placeholder;
        } else {
            data.DriverName = driverName;
        }

        if (validator.isInt(sensitivity, { min: 1, max: 5 })) {
            data.Sensitivity = sensitivity;
        } else {
            data.Sensitivity = 1;
        }
        console.log('data: ', data);

        $.ajax({
            type: 'PATCH',
            url: `/DeviceAPI/Devices/${$.cookie('editDevice')}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            data: data,
            success: function (data, textStatus, jqXHR) {

                popMsgHandler('popmsg', 0, '更新成功').then((timeout) => {
                    clearTimeout(timeout);
                    window.location.reload();
                });

            },
            error: function (data) {
                console.log(data.responseText)
                popMsgHandler('popmsg', 1, '更新失敗').then((timeout) => {
                    clearTimeout(timeout);
                    window.location.reload();
                });
            }
        })
    }

    addSaveDeviceBtnEvent() {
        this.saveDeviceBtn.removeEventListener('click', this.saveDevice);
        this.saveDeviceBtn.addEventListener('click', this.saveDevice.bind(this), false);
    }
}