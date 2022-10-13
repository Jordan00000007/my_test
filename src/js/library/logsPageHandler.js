/*eslint-disable*/
import { popMsgHandler, UnixTimestamp } from './common'
import { googleMapHandler } from './googleMapHandler'

export class LogsPageHandler {

    constructor() {
        this.doc = document;

        this.deviceSelect = this.doc.querySelector('#deviceSelect');
        this.deleteEventBtn = this.doc.querySelector('#deleteEventBtn');
        this.eventUL = this.doc.querySelector('#eventUL');

    }

    getLogs(deviceIMEI) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: `/EventAPI/logs/${deviceIMEI}`,
                async: true,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                },
                success: function (data, textStatus, jqXHR) {

                    console.log('At getLogs success: ', jqXHR.status);
                    if (+jqXHR.status === 200) {
                        console.log('At getLogs success: ', data);

                        //data = { "Logs": [{ "DateTime": "2019-12-09 08:18:50 UTC", "Message": "Main power low voltage off event", "LN": "121.549022", "LT": "25.0453888" }, { "DateTime": 1573132060678, "Message": "Main power low voltage on event", "LN": "121.649022", "LT": "25.0453888" }] }

                        resolve(data);
                    } else {

                        resolve(null);
                    }

                },
                error: function (data) {
                    console.log('At getLogs error: ', data);
                    resolve(null);
                }
            })
        })
    }

    async setLogs() {

        const IMEI = this.deviceSelect.value;
        if (IMEI === 'editDevice') {
            window.location = '/editDevice';
        } else {

            console.log('At setLogs ');
            console.log('裝置IMEI: ', IMEI);
            await $.cookie('homePageDefaultDevice', IMEI);


            const logs = await this.getLogs(IMEI);
            let Logs = '';

            if (logs) {
                Logs = logs['Logs'];
            }

            let logsLiArry = [];

            if (Logs) {

                Logs.forEach(element => {

                    const { Time, Message, LN, LT } = element;
                    logsLiArry.push(` <li LN=${LN} LT=${LT}>
                <span class="warnIcon">
                    <i class="fas fa-search"></i>
                </span>
                <span class="warnTime">
                    ${UnixTimestamp(Time)}
                </span>
                <span class="warnConten">
                    ${Message}
                </span>
            </li>`);

                });

                this.eventUL.innerHTML = logsLiArry.join('');
                logsLiArry = undefined;

                this.deleteEventBtn.disabled = false;
            } else {
                this.eventUL.innerHTML = '查無紀錄';
                this.deleteEventBtn.disabled = true;
            }
        }
    }

    setDeviceSelectListenOnChange() {

        this.deviceSelect.removeEventListener('change', this.setLogs);
        this.deviceSelect.addEventListener('change', this.setLogs.bind(this), false);
    }

    deleteLogs(deviceIMEI) {
        //const deviceIMEI =  await $.cookie('homePageDefaultDevice');
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'DELETE',
                url: `/EventAPI/logs/${deviceIMEI}`,
                async: true,
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                },
                success: function (data, textStatus, jqXHR) {

                    console.log('At deleteLogs success: ', jqXHR.status);
                    resolve(1);
                },
                error: function (data) {
                    console.log('At deleteLogs error: ', data);
                    resolve(null);
                }
            })
        })
    }

    async setDeleteLogs() {

        const deviceIMEI = await $.cookie('homePageDefaultDevice');
        const result = await this.deleteLogs(deviceIMEI);

        if (result) {
            this.setLogs();
        } else {
            popMsgHandler('popmsg', 1, '清除失敗').then((timeout) => {
                clearTimeout(timeout);
            });
        }
    }

    setDeleteEventListenOnClick() {

        this.deleteEventBtn.removeEventListener('click', this.setDeleteLogs);
        this.deleteEventBtn.addEventListener('click', this.setDeleteLogs.bind(this), false);
    }


    handleEventULClick(e) {

        const element = e.target.closest('LI');
        googleMapHandler.updateMarker({ lat: +element.getAttribute('lt'), lng: +element.getAttribute('ln') });
        $('#eventMapModal').modal('show')

    }

    addEventULClickEvent() {

        this.eventUL.removeEventListener('click', this.handleEventULClick);
        this.eventUL.addEventListener('click', this.handleEventULClick);
    }

}