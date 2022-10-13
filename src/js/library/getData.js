
export const getData = (dataType) => {

    
    switch (dataType) {

        case 'AccountData':
            return [
                {"ID":"1","Name":"Kevin","PID":"0","childCount":"2"},
                {"ID":"2","Name":"John","PID":"1","childCount":"1"},
                {"ID":"3","Name":"Mary","PID":"2","childCount":"0"},
                {"ID":"4","Name":"Jane","PID":"1","childCount":"2"},
                {"ID":"5","Name":"Jackson","PID":"4","childCount":"0"},
                {"ID":"6","Name":"Madonna","PID":"4","childCount":"0"},
             
            ];
            break;
        
        
        
        case 'TrackData':
            return [
                {"Name":"BNX-3388","Time":"2020/06/22 12:08:58","Location":"新北市汐止區大同路一段237之7號","Status":"1","Lock":"1"},
                {"Name":"ARR-6666","Time":"2020/06/22 12:08:58","Location":"新北市汐止區大同路一段237之7號","Status":"0","Lock":"0"},
                {"Name":"AJV-1688","Time":"2020/06/22 12:08:58","Location":"新北市汐止區大同路一段237之7號","Status":"2","Lock":"0"},
                {"Name":"BMW-2013","Time":"2020/06/22 12:08:58","Location":"新北市汐止區大同路一段237之7號","Status":"1","Lock":"1"}
               
                
               
            ];
            break;

        case 'EventList':
            return [
                {"Tag":"aaa","Time":"2020/6/22 下午12:08:58","Code":"1"},
                {"Tag":"bbb","Time":"2020/6/22 下午12:08:58","Code":"2"},
                {"Tag":"ccc","Time":"2020/6/22 下午12:08:58","Code":"3"},
                {"Tag":"ddd","Time":"2020/6/22 下午12:08:58","Code":"4"},
                {"Tag":"eee","Time":"2020/6/22 下午12:08:58","Code":"1"},
                {"Tag":"fff","Time":"2020/6/22 下午12:08:58","Code":"2"},
                {"Tag":"ggg","Time":"2020/6/22 下午12:08:58","Code":"3"},
                {"Tag":"hhh","Time":"2020/6/22 下午12:08:58","Code":"4"},
                {"Tag":"iii","Time":"2020/6/22 下午12:08:58","Code":"1"},
                {"Tag":"jjj","Time":"2020/6/22 下午12:08:58","Code":"2"},
                {"Tag":"kkk","Time":"2020/6/22 下午12:08:58","Code":"3"},
                {"Tag":"lll","Time":"2020/6/22 下午12:08:58","Code":"4"},
                
            ];
            break;

        case 'GatewayList':
            return [
                {"gatewayName":"南京店1","tagNum":"20","alertNum":"15","gatewayCode":"RIFA-G-EE-FF","firmware":"v1.0","mac":"aa:aa:aa:aa:aa:aa",
                    "tagList":[{"tagCode":"aaa","tagName":"冷凍1區","Expire":"10 day"},
                               {"tagCode":"bbb","tagName":"冷凍2區","Expire":"11 day"},
                               {"tagCode":"ccc","tagName":"冷藏1區","Expire":"11 day"},
                               {"tagCode":"ddd","tagName":"冷藏2區","Expire":"11 day"}]
                },
                {"gatewayName":"南京店2","tagNum":"15","alertNum":"35","gatewayCode":"RIFA-G-AA-BB","firmware":"v1.1","mac":"bb:bb:bb:bb:bb:bb",
                    "tagList":[{"tagCode":"eee","tagName":"牛奶1區","Expire":"11 day"},
                               {"tagCode":"fff","tagName":"牛奶2區","Expire":"3 day"},
                               {"tagCode":"ggg","tagName":"蔬菜1區","Expire":"12 day"},
                               {"tagCode":"hhh","tagName":"蔬菜2區","Expire":"30 day"}]
                },
                {"gatewayName":"忠孝東路","tagNum":"12","alertNum":"33","gatewayCode":"RIFA-G-CC-DD","firmware":"v1.2","mac":"cc:cc:cc:cc:cc:cc",
                    "tagList":[{"tagCode":"iii","tagName":"肉類1區","Expire":"11 day"},
                               {"tagCode":"jjj","tagName":"肉類2區","Expire":"10 day"},
                               {"tagCode":"kkk","tagName":"海鮮1區","Expire":"8 day"},
                               {"tagCode":"lll","tagName":"海鮮2區","Expire":"5 day"}]
            
                }
            ];
            break;
        case 'TagList':
            return [
                {"tagCode":"aaa","tagName":"冷凍1區","status":"使用中","temp":"3.3","Expire":"11天2小時"},
                {"tagCode":"bbb","tagName":"冷凍2區","status":"使用中","temp":"1.2","Expire":"3天23小時"},
                {"tagCode":"ccc","tagName":"冷藏1區","status":"遺失","temp":"23.5","Expire":"11天5小時"},
                {"tagCode":"ddd","tagName":"冷藏2區","status":"閒置","temp":"18.9","Expire":"16天17小時"}
            ];
            break;
        case 'CodeList':
            return [
                {"Code":"0","Message":"啟動/關閉"},
                {"Code":"1","Message":"超過溫度上限"},
                {"Code":"2","Message":"超過溫度下限"},
                {"Code":"3","Message":"超過保存時間"},
                {"Code":"4","Message":"電壓過低"},
                {"Code":"15","Message":"故障/其他錯誤"},
            ];
            break;
        // case 'CodeList':
        //     return [
        //         {"Code":"0","Message":"啟動/關閉 ON(0x1) / OFF(0x0)"},
        //         {"Code":"1","Message":"超過溫度上限 (OT - Over Temperature)"},
        //         {"Code":"2","Message":"超過溫度下限 (UT - Under Temperature)"},
        //         {"Code":"3","Message":"超過保存時間 (Expiring)"},
        //         {"Code":"4","Message":"電壓過低 (Low Battery)"},
        //         {"Code":"15","Message":"故障/其他錯誤 (Error)"},
        //     ];
        //     break;
        default:
          return [];
      }




    
    
   
        



}


