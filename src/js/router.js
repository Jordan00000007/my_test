/*eslint-disable*/
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'popper.js/dist/popper.min';
import 'bootstrap/dist/js/bootstrap.min';
//import '../style/css/but.css';
//import '../style/css/login.css';
//import '../style/css/style_20201224.css';
import '../style/css/style.css';
//import '../style/css/eden.css';

import 'jquery.cookie';

//import 'bootstrap-multiselect/dist/js/bootstrap-multiselect';



import { createBrowserHistory } from 'history';
import { checkToken,getUserInfo } from './library/common';




export const history = createBrowserHistory();

export default function load() {
    const doc = document;
    console.log('load');

    

    window.onpageshow = function (e) {
        if (e.persisted) {
            window.location.reload(true)
        }
    }
    // Get the current location.
    // const location = history.location;
    // console.log('location:', location)


    window.onload = async () => {

        console.log('window.onload');

        // Use push, replace, and go to navigate around.

        // doc.body.classList.add('loading');
        $(doc)
            .ajaxStart(() => {
                // ajax request went so show the loading image
                // doc.body.classList.add('loading');
            })
            .ajaxStop(() => {
                // got response so hide the loading image
                // doc.body.classList.remove('loading');
            });


        // Listen for changes to the current location
        const unlisten = history.listen(async (location, action) => {
            // location is an object like window.location
            console.log('unlisten: ', action, location.pathname, location.state);

            if (action === 'POP') {
                switch (location.pathname) {
                    case '/login':
                        if ($.cookie('token') && await checkToken($.cookie('token'))) {
                            history.forward();
                        } else {
                            $.removeCookie('token');
                            history.go(0);
                        }
                        break;
                    case '/register':
                        if ($.cookie('token') && await checkToken($.cookie('token'))) {
                            history.forward();
                        } else {
                            $.removeCookie('token');
                            history.go(0);
                        }
                        break;
                    case '/forgetPassword':
                        if ($.cookie('token') && await checkToken($.cookie('token'))) {
                            history.forward();
                        } else {
                            $.removeCookie('token');
                            history.go(0);
                        }
                        break;
                   
                    // case '/dashboard':
                    //   if ($.cookie('token') && await checkToken($.cookie('token'))) {
                    //                 // eslint-disable-next-line import/no-cycle
                    //                 await import(/* webpackChunkName: "dashboard" */ './dashboard.js').then((module) => {
                    //                   module.default();
                    //                 });
                    //   } else {
                    //     $.removeCookie('token');
                    //     history.pushState({url: '/login'}, '', '/login');
                    //     history.go(0);
                    //   }
                    //   break;
                    // case '/group':
                    //   if ($.cookie('token') && await checkToken($.cookie('token'))) {
                    //                 // eslint-disable-next-line import/no-cycle
                    //                 import(/* webpackChunkName: "group" */ './group.js').then((module) => {
                    //                   module.default();
                    //                 });
                    //   } else {
                    //     $.removeCookie('token');
                    //     history.pushState({url: '/login'}, '', '/login');
                    //     history.go(0);
                    //   }
                    //   break;
                    default:
                        break;
                }

            }
        });


        const notAuth=()=>{
            console.log('location:', history.location)
            console.log('沒有權限')
            $.removeCookie('token');

            if (history.location.pathname === '/register') {
                import(/* webpackChunkName: "register" */ './pages/register.js').then((module) => {
                    module.default();
                });
            } else if (history.location.pathname === '/forgetPassword') {
                history.push('/forgetPassword', { state: 'normal' });
                import(/* webpackChunkName: "forgetPassword" */ './pages/forgetPassword.js').then((module) => {
                    module.default();
                });
            } else {
                history.push('/login', { state: 'normal' });
                import(/* webpackChunkName: "login" */ './pages/login.js').then((module) => {
                    module.default();
                });
            }
        };


        const view = doc.getElementById('root');
        if ($.cookie('token') && await checkToken($.cookie('token'))) {

            let {groupId}=await getUserInfo($.cookie('token'));
            

            switch (history.location.pathname) {
                case '/changePassword':
                    //history.push('/changePassword', { state: 'normal' });
                    import(/* webpackChunkName: "changePassword" */ './pages/changePassword.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/changePasswordByManager':
                  
                    if ((groupId==3)||(groupId==2)){
                        import(/* webpackChunkName: "logs" */ './pages/changePasswordByManager.js').then((module) => {
                            module.default();
                        });
       
                    }else{
                        notAuth();
                    }


                    break;
                case '/userSetting':
                    //history.push('/userSetting', { state: 'normal' });
                    import(/* webpackChunkName: "userSetting" */ './pages/userSetting.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/gatewaySetting':
                    //history.push('/userSetting', { state: 'normal' });
                    import(/* webpackChunkName: "userSetting" */ './pages/gatewaySetting.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/editDevice':
                    //history.push('/editDevice', { state: 'normal' });
                    import(/* webpackChunkName: "editDevice" */ './pages/editDevice.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/addDevice':
                    //history.push('/addDevice', { state: 'normal' });
                    import(/* webpackChunkName: "addDevice" */ './pages/addDevice.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/logout':
                    //history.push('/logout', { state: 'normal' });
                    import(/* webpackChunkName: "logout" */ './pages/logout.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/bigMap':
                    //history.push('/logout', { state: 'normal' });
                    import(/* webpackChunkName: "bigMap" */ './pages/bigMap.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/routeMap':
                        //history.push('/logout', { state: 'normal' });
                        import(/* webpackChunkName: "routeMap" */ './pages/routeMap.js').then((module) => {
                            module.default();
                        });
                        break;
                case '/deviceSetting':
                    //history.push('/logout', { state: 'normal' });
                    import(/* webpackChunkName: "deviceSetting" */ './pages/deviceSetting.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/warningEvent':
                    //history.push('/warningEvent', { state: 'normal' });
                    import(/* webpackChunkName: "warningEvent" */ './pages/warningEvent.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/logs':
                    //history.push('/warningEvent', { state: 'normal' });
                    import(/* webpackChunkName: "logs" */ './pages/logs.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/problem':
                    //history.push('/warningEvent', { state: 'normal' });
                    import(/* webpackChunkName: "logs" */ './pages/problem.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/tagList':
                    //history.push('/warningEvent', { state: 'normal' });
                    import(/* webpackChunkName: "logs" */ './pages/tagList.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/tagChart':
                    //history.push('/warningEvent', { state: 'normal' });
                    import(/* webpackChunkName: "logs" */ './pages/tagChart.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/tagSetting':
                    //history.push('/warningEvent', { state: 'normal' });
                    import(/* webpackChunkName: "logs" */ './pages/tagSetting.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/eventList':
                    //history.push('/warningEvent', { state: 'normal' });
                    import(/* webpackChunkName: "logs" */ './pages/eventList.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/userTreeView':
                    //history.push('/warningEvent', { state: 'normal' });
                    import(/* webpackChunkName: "logs" */ './pages/userTreeView.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/manageStore':
                     //history.push('/warningEvent', { state: 'normal' });
                    
                    if ((groupId>=3)||(groupId==2)){
                        import(/* webpackChunkName: "logs" */ './pages/manageStore.js').then((module) => {
                            module.default();
                        });
       
                    }else{
                        notAuth();
                    }

                    break;
                case '/manageStoreAdd':
                    
                    if ((groupId>=3)||(groupId==2)){
                        import(/* webpackChunkName: "logs" */ './pages/manageStoreAdd.js').then((module) => {
                            module.default();
                        });
       
                    }else{
                        notAuth();
                    }

                    break;
                case '/manageStoreEdit':
                    
                    if ((groupId>=3)||(groupId==2)){
                        import(/* webpackChunkName: "logs" */ './pages/manageStoreEdit.js').then((module) => {
                            module.default();
                        });
       
                    }else{
                        notAuth();
                    }
                    break;
                case '/manageUser':
                    //history.push('/warningEvent', { state: 'normal' });
                    
                    if ((groupId>=3)||(groupId==2)){
                        import(/* webpackChunkName: "logs" */ './pages/manageUser.js').then((module) => {
                            module.default();
                        });
       
                    }else{
                        notAuth();
                    }
                    break;

                case '/manageUserAdd':
                    
                    if ((groupId>=3)||(groupId==2)){
                        import(/* webpackChunkName: "logs" */ './pages/manageUserAdd.js').then((module) => {
                            module.default();
                        });
       
                    }else{
                        notAuth();
                    }

                    break;
                case '/manageUserEdit':
                    
                    if ((groupId>=3)||(groupId==2)){
                        import(/* webpackChunkName: "logs" */ './pages/manageUserEdit.js').then((module) => {
                            module.default();
                        });   
                    }else{
                        notAuth();
                    }
                    break;


                case '/manageCompany':
                    //history.push('/warningEvent', { state: 'normal' });
                    
                    if (groupId>=3){
                        import(/* webpackChunkName: "logs" */ './pages/manageCompany.js').then((module) => {
                            module.default();
                        });
        
                    }else{
                        notAuth();
                    }
                    break;
                case '/manageCompanyAdd':
                    //history.push('/warningEvent', { state: 'normal' });
                    
                    if (groupId>=3){
                        import(/* webpackChunkName: "logs" */ './pages/manageCompanyAdd.js').then((module) => {
                            module.default();
                        });
        
                    }else{
                        notAuth();
                    }
                    break;
                case '/manageCompanyEdit':
                    //history.push('/warningEvent', { state: 'normal' });
                    
                    if (groupId>=3){
                        import(/* webpackChunkName: "logs" */ './pages/manageCompanyEdit.js').then((module) => {
                            module.default();
                        });
        
                    }else{
                        notAuth();
                    }
                    break;
                case '/manageSensor':
                    //history.push('/warningEvent', { state: 'normal' });
                    
                    if (groupId>=2){
                        import(/* webpackChunkName: "logs" */ './pages/manageSensor.js').then((module) => {
                            module.default();
                        });
        
                    }else{
                        notAuth();
                    }
                    break;
                case '/manageSensorAdd':
                    //history.push('/warningEvent', { state: 'normal' });
                    
                    if (groupId>=2){
                        import(/* webpackChunkName: "logs" */ './pages/manageSensorAdd.js').then((module) => {
                            module.default();
                        });
        
                    }else{
                        notAuth();
                    }
                    break;

                case '/manageSensorEdit':
                    //history.push('/warningEvent', { state: 'normal' });
                    
                    if (groupId>=2){
                        import(/* webpackChunkName: "logs" */ './pages/manageSensorEdit.js').then((module) => {
                            module.default();
                        });
        
                    }else{
                        notAuth();
                    }
                    break;
                case '/manageGateway':
                    //history.push('/warningEvent', { state: 'normal' });
                    
                    if (groupId>=3){
                        import(/* webpackChunkName: "logs" */ './pages/manageGateway.js').then((module) => {
                            module.default();
                        });
        
                    }else{
                        notAuth();
                    }
                    break;
                case '/manageGatewayAdd':
                    //history.push('/warningEvent', { state: 'normal' });
                    
                    if (groupId>=3){
                        import(/* webpackChunkName: "logs" */ './pages/manageGatewayAdd.js').then((module) => {
                            module.default();
                        });
        
                    }else{
                        notAuth();
                    }
                    break;
                case '/manageGatewayEdit':
                    //history.push('/warningEvent', { state: 'normal' });
                    
                    if (groupId>=3){
                        import(/* webpackChunkName: "logs" */ './pages/manageGatewayEdit.js').then((module) => {
                            module.default();
                        });
        
                    }else{
                        notAuth();
                    }
                    break;
                case '/feedback':
                    //history.push('/warningEvent', { state: 'normal' });
                    import(/* webpackChunkName: "logs" */ './pages/feedback.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/storeStatus':
                    //history.push('/warningEvent', { state: 'normal' });
                    import(/* webpackChunkName: "logs" */ './pages/storeStatus.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/sensorStatus':
                    //history.push('/warningEvent', { state: 'normal' });
                    import(/* webpackChunkName: "logs" */ './pages/sensorStatus.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/storeEvent':
                    //history.push('/warningEvent', { state: 'normal' });
                    import(/* webpackChunkName: "logs" */ './pages/storeEvent.js').then((module) => {
                        module.default();
                    });
                    break;
                case '/smtp':
                    //history.push('/warningEvent', { state: 'normal' });
                    if (groupId>=3){
                        import(/* webpackChunkName: "logs" */ './pages/smtp.js').then((module) => {
                            module.default();
                        });     
                    }else{
                        notAuth();
                    }
                    break;
                case '/calibration':
                    //history.push('/warningEvent', { state: 'normal' });
                    if (groupId>=2){
                        import(/* webpackChunkName: "logs" */ './pages/calibration.js').then((module) => {
                            module.default();
                        });     
                    }else{
                        notAuth();
                    }
                    break;
                case '/batchCalibration':
                    //history.push('/warningEvent', { state: 'normal' });
                    if (groupId>=3){
                        import(/* webpackChunkName: "logs" */ './pages/batchCalibration.js').then((module) => {
                            module.default();
                        });     
                    }else{
                        notAuth();
                    }
                    break;
                case '/chartCompare':
                    //history.push('/warningEvent', { state: 'normal' });
                    if (groupId>=3){
                        import(/* webpackChunkName: "logs" */ './pages/chartCompare.js').then((module) => {
                            module.default();
                        });     
                    }else{
                        notAuth();
                    }
                    break;
                case '/dashboard':
                    //history.push('/warningEvent', { state: 'normal' });
                    import(/* webpackChunkName: "logs" */ './pages/dashboard.js').then((module) => {
                        module.default();
                    });     
                    break;
                case '/userGuide':
                    //history.push('/warningEvent', { state: 'normal' });
                   
                    import(/* webpackChunkName: "logs" */ './pages/userGuide.js').then((module) => {
                        module.default();
                    });     
                 
                    break;
                case '/home':
                    
                    import(/* webpackChunkName: "logs" */ './pages/home.js').then((module) => {
                        module.default();
                    });     
                
                    break;
                   
                    
                default:

                   
                    history.push('/home', { state: 'normal' });
                    import(/* webpackChunkName: "home" */ './pages/home.js').then((module) => {
                        module.default();
                    });
                    break;
            }
            console.log('有權限')

        } else {
            
            notAuth();

        };


    }
}
