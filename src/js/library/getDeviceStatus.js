/*eslint-disable*/

export const getDeviceStatus = (deviceIMEI) => {

    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `/DeviceAPI/DeviceStatus/${deviceIMEI}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            success: function (data, textStatus, jqXHR) {

                console.log('At getDeviceStatus success: ', jqXHR.status);
                if (+jqXHR.status === 200) {
                    console.log('At getDeviceStatus success: ', data);
                    resolve(data);
                } else {

                    resolve(null);
                }

            },
            error: function (data) {
                console.log('At getDeviceStatus error: ', data);
                resolve(null);
            }
        })
    })
}
