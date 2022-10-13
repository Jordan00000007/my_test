/*eslint-disable*/
import headerHtml from '../../html/pages/header.html';
import feedbackHtml from '../../html/pages/feedback.html';
import { ImgToSvg,getUserInfo } from '../library/common';
import { FeedbackHandler } from '../library/feedbackHandler';
import { CommonFunctionHandler } from '../library/commonFunctionHandler';


export default function feedback() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+feedbackHtml;

    const feedbackHandler = new FeedbackHandler();
   
    
    $(doc).ready(async () => {

        let {groupId,langId}=await getUserInfo($.cookie('token'));
        feedbackHandler.setLangId(langId);
        feedbackHandler.setTypeList();

        const commonFunctionHandler = new CommonFunctionHandler();
        commonFunctionHandler.setGroupId(groupId);
        commonFunctionHandler.setLangId(langId);
        commonFunctionHandler.setFunctionGroup('feedback');
        commonFunctionHandler.setLang();

        if (groupId==4){
          
            $('#PK_TypeID').attr('disabled', true);
            $('#Comment').attr('disabled', true);
            $('#Submit').attr('disabled', true);
           
        }

        ImgToSvg();      

        feedbackHandler.setSubmitButtonClickEvent();

    });

}
