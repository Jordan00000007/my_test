/*eslint-disable*/

export const getTraceInfo = (deviceIMEI,dateStr) => {

    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `TraceAPI/Trace/${dateStr}/${deviceIMEI}`,
            //url: `http://172.21.20.57:8165/trace/${dateStr}/${deviceIMEI}`,
            //url: `http://127.0.0.1:8165/trace/${dateStr}/352753097738700`,
            //url: `http://127.0.0.1:8165/trace/${dateStr}/${deviceIMEI}`,
            //url: `http://172.21.20.57:8165/trace/${dateStr}/352753097738700`,
            //url: 'http://127.0.0.1:8165/trace/2020/05/15/352753097738700',
            //url: `http://172.21.20.57:8165/trace/${dateStr}/3527530977318`,
            //url: `http://172.21.20.201:8165/trace/${dateStr}/${deviceIMEI}`,
            
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            },
            success: function (data, textStatus, jqXHR) {

                console.log('At getTraceInfo success: ', jqXHR.status);
                if (+jqXHR.status === 200) {
                    console.log('At getTraceInfo success: ', data);
                    resolve(data);
                } else {

                    resolve(null);
                }

            },
            error: function (data) {
                console.log('At getTraceInfo error: ', data);
                resolve(null);
            }
        })
    })
}
