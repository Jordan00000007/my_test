/*eslint-disable*/
import deviceSettingHtml from '../../html/pages/deviceSetting.html';
import { DeviceSettingHandler } from '../library/deviceSettingHandler'


export default function deviceSetting() {
    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = deviceSettingHtml;
    console.log('deviceSetting')

    $(doc).ready(() => {

        const deviceSettingHandler = new DeviceSettingHandler();

        deviceSettingHandler.setDeviceInfo();
        deviceSettingHandler.addDeleteDeviceBtnEvent();
        deviceSettingHandler.addSaveDeviceBtnEvent();
    });
}