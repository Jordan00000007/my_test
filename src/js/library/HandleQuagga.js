/*eslint-disable*/

import Quagga from 'quagga';
import '../../style/css/quaggaJS.css'

export default class HandleQuagga {

    static hasCamera() {
        // note that enumerateDevices can always be called and does not prompt the user for permission. However, device
        // labels are only readable if served via https and an active media stream exists or permanent permission is
        // given. That doesn't matter for us though as we don't require labels.
        return navigator.mediaDevices.enumerateDevices()
            .then(devices => devices.some(device => device.kind === 'videoinput'))
            .catch(() => false);
    }

    constructor() {

        this.state = {
            inputStream: {
                type: 'LiveStream',
                constraints: {
                    // width: { ideal: 3024 },
                    // height: { ideal: 3024 },
                    // width: { ideal: 480 },
                    // height: { ideal: 640 },
                    width: 480,
                    height: 640,
                    facingMode: 'environment',
                    //aspectRatio: { min: 1, max: 2 },
                },
                target: document.querySelector('#interactive'),
            },
            locator: {
                patchSize: 'x-small',
                halfSample: true,
            },
            numOfWorkers: 2,
            frequency: 60,
            locate:true,
			debug: true,
            decoder: {
                readers: [{
                    format: 'code_128_reader',
                    config: {},
                }],
                debug: {
                    drawBoundingBox: true,
                    showFrequency: false,
                    drawScanline: true,
                    showPattern: false
                },
                multiple: false
            },
            
        };

        this.quagga = Quagga;

        this.quagga.onDetected(this.handleOnDetected.bind(this));

        this.quagga.onProcessed(this.handleProcessed.bind(this))


        
    }


    start() {
        this.quagga.init(this.state, this.handleInit.bind(this));
    }

    handleInit(err) {
        if (err) {
            console.log('At this.quagga.init: ', err)
            return;
        }
        this.quagga.start();
    }

    stop() {
        this.quagga.stop();
    }

    handleOnDetected(result) {

        const code = result.codeResult.code;

        if (code.length === 15) {
            document.querySelector('#mac').value = code
            $('#QRScanModal').modal('hide');
            this.stop()
        }

    }

    handleProcessed(result){

        var drawingCtx = Quagga.canvas.ctx.overlay, drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                return box !== result.box;
                }).forEach(function (box) {
                Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
        }
  }

}
