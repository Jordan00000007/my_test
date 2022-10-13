/*eslint-disable*/

export const getDeviceLocation = (deviceIMEI) => {

    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `/DeviceAPI/DeviceCoordinate/${deviceIMEI}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            success: function (data, textStatus, jqXHR) {

                console.log('At getDeviceLocation success: ', jqXHR.status);
                if (+jqXHR.status === 200) {
                    console.log('At getDeviceLocation success: ', data);
                    resolve(data);
                } else {

                    resolve(null);
                }

            },
            error: function (data) {
                console.log('At getDeviceLocation error: ', data);
                resolve(null);
            }
        })
    })
}



