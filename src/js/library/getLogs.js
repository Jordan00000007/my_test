/*eslint-disable*/

export const getLogs = (deviceIMEI) => {

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



