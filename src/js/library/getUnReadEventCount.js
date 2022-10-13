/*eslint-disable*/

export const getUnReadEventCount = () => {

    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `/EventAPI/UnReadEventCount`,
            async: true,
            crossDomain: true,
            //cache: false,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            success: function (data, textStatus, jqXHR) {

                console.log('At getUnReadEventCount success: ', jqXHR.status);
                if (+jqXHR.status === 200) {
                    console.log('At getUnReadEventCount success: ', data);
                    resolve(data);
                } else {

                    resolve(null);
                }

            },
            error: function (data) {
                console.log('At getUnReadEventCount error: ', data);
                resolve(null);
            }
        })
    })
}



