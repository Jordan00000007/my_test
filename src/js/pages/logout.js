/*eslint-disable*/

export default function logout() {

    // $.removeCookie('token');
    // window.location = '/login';
    console.log('正在登出');

    $.cookie("SelectCompany", null, { path: '/' });
    $.removeCookie('SelectCompany', { path: '/' });

    $.ajax({
        type: 'POST',
        url: '/UserAPI/logout',
        async: true,
        crossDomain: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            token: $.cookie('token')
        },
        success: function (data, textStatus, jqXHR) {

            console.log('登出成功');
        },
        error: function (data) {
            console.log('登出失敗');
        },
        complete: function () {

            $.removeCookie('token');
            window.location = '/login';
        }
    })

}
