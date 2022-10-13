/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import userSettingHtml from '../../html/pages/userSetting.html';
import { ImgToSvg,getUserInfo } from '../library/common';
import { UserSettingHandler } from '../library/userSettingHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';
import { oneTerm } from '../library/setTerm';


export default function home() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+userSettingHtml;

    const userSettingHandler = new UserSettingHandler();
   
    $(doc).ready(async () => {

        let {groupId,langId,userId}=await getUserInfo($.cookie('token'));
        userSettingHandler.setLangId(langId);
        userSettingHandler.setUserId(userId);
        userSettingHandler.setGroupList();

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('userSetting');
        commonFunctionHandler.setLang();

        if (groupId!=3){
            $('#notifyPhoneSetting').attr('style','display:none;')
        }

        if (groupId==4){
          
            $('#UserName').attr('disabled', true);
            $('#Account').attr('disabled', true);
            $('#CompanyName').attr('disabled', true);
            $('#Phone').attr('disabled', true);
            $('#Submit').attr('disabled', true);
            $('#TestEmailString').attr('disabled', true);
            $('#TestLineString').attr('disabled', true);
            $('#SubmitEmailTest').attr('disabled', true);
            $('#SubmitLineTest').attr('disabled', true);
           
        }

        ImgToSvg();    

        
       

        userSettingHandler.setSubmitButtonClickEvent();
        userSettingHandler.setLineSubscriptionClickEvent();

    });

}
