/*eslint-disable*/

import { googleMapHandler } from './googleMapHandler';
import { UnixTimestamp } from './common'

const protocol = document.location.protocol.startsWith("https") ? "wss://" : "ws://";

//const wsUri = `${protocol}182.234.47.145:8164/ws/WebServiceAPI/OhMyGod?token=${$.cookie('token')}` //home

//const wsUri = `${protocol + window.location.hostname}/ws/WebServiceAPI/OhMyGod?token=${$.cookie('token')}` //部屬時

//const wsUri = `${protocol}172.16.36.55:8164/ws/WebServiceAPI/OhMyGod?token=${$.cookie('token')}` //office

const wsUri = `${protocol}172.21.20.201:8164/ws/WebServiceAPI/OhMyGod?token=${$.cookie('token')}` //antzer office

// const wsUri = `ws://172.16.36.108/ws/DashboardAPI/Bar?token=${$.cookie('token')}`

function connect() {
    const websocket = new WebSocket(wsUri);

    const heartCheck = {
        timeout: 120000,//60ms
        timeoutObj: null,
        reset: function () {
            clearTimeout(this.timeoutObj);
            this.start();
        },
        start: function () {
            this.timeoutObj = setTimeout(function () {
                websocket.send("HeartBeat");
            }, this.timeout)
        }
    }

    websocket.onopen = function (event) {
        console.log('opened connection to ');
        console.log(' websocket.onopen', event)
        heartCheck.start();
    };
    websocket.onclose = function (event) {
        console.log('closed connection from ', event);
    };
    websocket.onmessage = async function (event) {

        heartCheck.reset();

        const data = JSON.parse(event.data);

        console.log(' window.location.pathname', window.location.pathname)

        const { IMEI, Type } = data;

        switch (window.location.pathname) {
            case '/bigMap':
                console.log(' At /bigMap');
                if ($.cookie('homePageDefaultDevice') === IMEI && Type === 'Coordinate') {
                    const { LT, LN } = data;
                    googleMapHandler.updateMarker({ lat: +LT, lng: +LN })
                }
                break;
            case '/home':
                console.log(' At /home');

                const doc = document;
                const timestamp = doc.querySelector('#timestamp');
                const addressText = doc.querySelector('#addressText');

                if (Type === 'Coordinate' && $.cookie('homePageDefaultDevice') === IMEI) {
                    const { LT, LN, Time } = data;
                    googleMapHandler.updateMarker({ lat: +LT, lng: +LN });
                    timestamp.innerHTML = UnixTimestamp(Time);
                    addressText.innerHTML = await googleMapHandler.getAddress();
                } else if (Type === 'LifeStatus' && $.cookie('homePageDefaultDevice') === IMEI) {
                    const deviceStatusText = doc.querySelector('#deviceStatusText');
                    const { Connected } = data;
                    if (+Connected === 1) {
                        deviceStatusText.innerHTML = '車輛發動中';
                    } else {
                        deviceStatusText.innerHTML = '車輛靜止中';
                    }
                } else if (Type === 'UnReadEventCount') {
                    const { UnReadEventCount } = data;
                    doc.querySelector('#eventCount').innerHTML = UnReadEventCount;
                }
                break;
        }
        console.log(' websocket.onmessage', event);

    };
    websocket.onerror = function (event) {
        console.log('error:', event);
    };
    return websocket;
}

export let websocket = connect();