/*eslint-disable*/
import validator from 'validator';
import addDeviceHtml from '../../html/pages/addDevice.html';
import { popMsgHandler } from '../library/common'
import HandleQuagga from '../library/HandleQuagga'

export default function addDevice() {
    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = addDeviceHtml;
    console.log('editDevice')
    $(doc).ready(async () => {

        const isHttps = doc.location.protocol.startsWith("https");

        console.log('isHttps: ', isHttps)

        if (isHttps) {

            const hasCamera = await HandleQuagga.hasCamera()
            console.log('hasCamera: ', hasCamera)

            if (hasCamera) {

                const qrcodeIcon = doc.querySelector('#qrcodeIcon');
                const handleQuagga = new HandleQuagga()

                qrcodeIcon.style.display = '';

                qrcodeIcon.addEventListener('click', () => {
                    handleQuagga.start();
                })

                doc.querySelector('#closeQRScanModal').addEventListener('click', () => {
                    handleQuagga.stop();
                })

            }
        }


        const submitBtn = doc.getElementById('submitBtn');
        const submitBtnHandler = function () {

            const deviceName = doc.getElementById('deviceName').value;
            const IMEI = doc.getElementById('IMEI').value;
            const driverName = doc.getElementById('driverName').value;
            const sensitivitySelect = doc.getElementById('sensitivitySelect').value;

            if (validator.isEmpty(deviceName, { 'ignore_whitespace': true })) {
                popMsgHandler('popmsg', 1, '車機名稱不得為空').then((timeout) => {
                    clearTimeout(timeout);
                });
                return;
            }

            if (validator.isEmpty(IMEI, { 'ignore_whitespace': true })) {
                popMsgHandler('popmsg', 1, 'IMEI不得為空').then((timeout) => {
                    clearTimeout(timeout);
                });
                return;
            }

            if (validator.isEmpty(driverName, { 'ignore_whitespace': true })) {
                popMsgHandler('popmsg', 1, '司機名稱不得為空').then((timeout) => {
                    clearTimeout(timeout);
                });
                return;
            }

            console.log(sensitivitySelect);

            const promise = $.ajax({
                type: 'POST',
                url: '/DeviceAPI/Devices/',
                async: true,
                crossDomain: true,
                data: {
                    'Alias': deviceName,
                    'DriverName': driverName,
                    'Sensitivity': sensitivitySelect,
                    'IMEI': IMEI
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: $.cookie('token')
                }
            });
            promise.done(async (response) => {

                popMsgHandler('popmsg', 0, '新增成功').then((timeout) => {
                    clearTimeout(timeout);

                    location.reload();
                });
                console.log(response)

            });
            promise.fail((e) => {
                console.log(e.responseText)


                popMsgHandler('popmsg', 1, `新增失敗`).then((timeout) => {
                    clearTimeout(timeout);
                });

            });
        };

        submitBtn.removeEventListener('click', submitBtnHandler);
        submitBtn.addEventListener('click', submitBtnHandler);


        $(function () {
            $('input,textarea').focus(function () {
                $(this).data('placeholder', $(this).attr('placeholder'))
                       .attr('placeholder', '');
            }).blur(function () {
                $(this).attr('placeholder', $(this).data('placeholder'));
            });
        });

    });
}