/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import userGuideHtml from '../../html/pages/userGuide.html';
import { ImgToSvg,getUserInfo } from '../library/common';
import { UserGuideHandler } from '../library/userGuideHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';

export default function userGuide() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+userGuideHtml;

    const userGuideHandler = new UserGuideHandler();
   
    $(doc).ready(async () => {

        let {groupId,langId}=await getUserInfo($.cookie('token'));
        userGuideHandler.setLangId(langId);

        console.log(`group id =${groupId}`)

        if (groupId>=3){
            $('#UploadZh').removeClass('hidden');
            $('#UploadEn').removeClass('hidden');
            $('#UploadJp').removeClass('hidden');
            if (groupId==4){
                $('#UploadZh').attr('disabled','true');
                $('#UploadEn').attr('disabled','true');
                $('#UploadJp').attr('disabled','true');
            }
           
        }

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('userGuide');
        commonFunctionHandler.setLang();

        ImgToSvg();    
        
        userGuideHandler.setButtonClickEvent();

    });

}
