/*eslint-disable*/

import editDevicedHtml from '../../html/pages/editDevice.html';
import { EditDeviceHandler } from '../library/editDeviceHandler'

export default function editDevice() {
    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = editDevicedHtml;
    console.log('editDevice')

    $(doc).ready(() => {

        const editDeviceHandler = new EditDeviceHandler();

        editDeviceHandler.initSortable();

        $('.nav-button').click(function (e) {
            console.log('click');
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
                    console.log('No device data')
                } else {

                    editDeviceHandler.sortDeviceList(data);

                }
            },
            error: function (data) {
                console.log(data.responseText)
            },
            complete: async function (data) {

                console.log("getDeviceList complete");
                editDeviceHandler.addSortableClickEvent();

                //editDeviceHandler.enableSortable()
            }
        })



        //editDeviceHandler.disableSortable()

    });
}