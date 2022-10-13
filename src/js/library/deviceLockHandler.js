/*eslint-disable*/

import lock01 from '../../assets/lock01.png'
import unLock01 from '../../assets/unLock01.png'

import lock02 from '../../assets/lock02.png'
import unLock02 from '../../assets/unLock02.png'
export class DeviceLockHandler {

    constructor() {

        // this.doc = document;
        // this.lockCheckbox = this.doc.querySelector('#lockCheckbox');
        // this.isLockedMsg = this.doc.querySelector('#isLockedMsg');
    }

    isDeviceLocked(IMEI) {

        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: `/DeviceAPI/DeviceLockStatus/${IMEI}`,
                async: true,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                },
                success: function (data, textStatus, jqXHR) {

                    console.log('At DeviceLockHandler isDeviceLocked jqXHR.status: ', jqXHR.status);
                    if (+jqXHR.status === 200) {
                        const { IsLock } = data[0]
                        console.log('At DeviceLockHandler isDeviceLocked success: ', IsLock);
                        resolve(IsLock);
                    } else {

                        resolve(null);
                    }

                },
                error: function (data) {
                    console.log('At DeviceLockHandler isDeviceLocked error: ', data);
                    resolve(null);
                }
            })
        })
    }

    /**
     * 
     * @param {*} IMEI 
     * @param {*} status  1 or 0
     */
    changeDeviceLockStatus(IMEI, status) {

        console.log(status)
        this.doc = document;
        this.switchDiv = this.doc.querySelector('#switchDiv');
        if (status === 1) {
            this.switchDiv.style.backgroundImage = `url(${unLock02})`;
        } else {
            this.switchDiv.style.backgroundImage = `url(${lock02})`;
        }


        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'PATCH',
                url: `/DeviceAPI/DeviceLockStatus/${IMEI}`,
                async: true,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                },
                data: {
                    LockStatus: status
                },
                success: function (data, textStatus, jqXHR) {

                    console.log('At DeviceLockHandler changeDeviceLockStatus jqXHR.status: ', jqXHR.status);
                    console.log(`Set ${IMEI} LockStatus to ${status}`);

                    if (+jqXHR.status === 200) {
                        const { LockStatus } = data[0];
                        console.log('At DeviceLockHandler changeDeviceLockStatus success: ', LockStatus);
                        resolve(LockStatus);
                    } else {

                        resolve(null);
                    }
                },
                error: function (data) {
                    console.log('At DeviceLockHandler changeDeviceLockStatus error: ', data);
                    resolve(null);
                }
            })
        })
    }

    /**
     * 
     * @param {} status on or off
     */
    setCheckBox(status) {

        this.doc = document;
        this.lockCheckbox = this.doc.querySelector('#lockCheckbox');
        this.isLockedMsg = this.doc.querySelector('#isLockedMsg');
        this.switchDiv = this.doc.querySelector('#switchDiv');

        console.log('At DeviceLockHandler setCheckBox ');
        console.log(`Set setCheckBox to ${status}`);

        this.lockCheckbox.value = status;

        if (status === 'on') {

            //this.switchDiv.classList = 'switch switchbut2';
            this.switchDiv.style.backgroundImage = `url(${lock01})`;
            this.isLockedMsg.innerHTML = '防盜告警系統已啟動';
        } else {
            //this.switchDiv.classList = 'switch switchbut';
            this.switchDiv.style.backgroundImage = `url(${unLock01})`;
            this.isLockedMsg.innerHTML = '防盜告警系統已關閉';
        }

        this.doc = undefined;
        this.lockCheckbox = undefined;
        this.isLockedMsg = undefined;
    }
}