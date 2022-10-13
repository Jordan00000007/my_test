import menuListGroup4Html from '../../html/pages/menuListGroup4.html';
import menuListGroup3Html from '../../html/pages/menuListGroup3.html';
import menuListGroup2Html from '../../html/pages/menuListGroup2.html';
import menuListGroup1Html from '../../html/pages/menuListGroup1.html';
import { setTerm } from '../library/setTerm';

export class CommonFunctionHandler {

    constructor() {
        this.doc = document; 
        this.menulist= this.doc.querySelector('#menuList');
        this.sidebartoggle=this.doc.querySelector('#SidebarToggle');
        this.togglecht= this.doc.querySelector('#toggleCht');
        this.toggleeng= this.doc.querySelector('#toggleEng');
        this.togglejpn= this.doc.querySelector('#toggleJpn');
        this.selectlang= this.doc.querySelector('#selectLang');
        this.logo= this.doc.querySelector('#logo');
        this.functiongroup='';
        this.groupid=1;
        this.langid=1;
    }

    setGroupId(id){
        this.groupid=id;
    }

    setLangId(id){
        if ($.cookie("langId")){
            this.langid=parseInt($.cookie("langId"));
        }else{
            this.langid=parseInt(id);
        }
    }

    setFunctionGroup(name){
        this.functiongroup=name;
    }

    setMenuList(){
 
        switch(this.groupid) {
            case 1:
                this.menulist.innerHTML=menuListGroup1Html;
                break;
            case 2:
                this.menulist.innerHTML=menuListGroup2Html;
                $('#UploadConfig').prop('disabled',false);
                $('#EXP_day').prop('disabled',false);
                $('#EXP_hour').prop('disabled',false);
                $('#EXP_min').prop('disabled',false);
                $('#Parameter_UT').prop('disabled',false);
                $('#Parameter_OT').prop('disabled',false);
                break;
            case 3:
                this.menulist.innerHTML=menuListGroup3Html;
                $('#UploadConfig').prop('disabled',false);
                $('#Parameter_A').prop('disabled',false);
                $('#Parameter_B').prop('disabled',false);
                $('#EXP_day').prop('disabled',false);
                $('#EXP_hour').prop('disabled',false);
                $('#EXP_min').prop('disabled',false);
                $('#Parameter_LBATT').prop('disabled',false);
                $('#Parameter_UT').prop('disabled',false);
                $('#Parameter_OT').prop('disabled',false);
                $('#Parameter_Mode').prop('disabled',false);
                $('#Parameter_Inaction').prop('disabled',false);
                $('#Parameter_Logfreq').prop('disabled',false);
                break;
            case 4:
                this.menulist.innerHTML=menuListGroup4Html;
                $('#UploadConfig').prop('disabled',false);
                $('#Parameter_A').prop('disabled',false);
                $('#Parameter_B').prop('disabled',false);
                $('#EXP_day').prop('disabled',false);
                $('#EXP_hour').prop('disabled',false);
                $('#EXP_min').prop('disabled',false);
                $('#Parameter_LBATT').prop('disabled',false);
                $('#Parameter_UT').prop('disabled',false);
                $('#Parameter_OT').prop('disabled',false);
                break;
            default:
                this.menulist.innerHTML=menuListGroup1Html;
                break;
        }

        $(`#li_${this.functiongroup}`).addClass('active');
    }

    toggleSideBar(){
        $('#sidebar').toggleClass('active');
    }

    showMenu(){
        $('#sidebar').addClass('active');
    }

    toggleCht(){
        
        this.toggleLang(1);
    }

    toggleEng(){
        
        this.toggleLang(2);
    }

    toggleJpn(){
        
        this.toggleLang(3);
    }

    toggleLang(langId){

        const promise = $.ajax({
            type: 'PATCH',
            url: `/UserAPI/UserLang/${langId}`,
            async: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: $.cookie('token')
            }
        });
        promise.done(async (response) => {


            $.cookie("langId", langId);
            window.location.reload();
            

        });
        promise.fail((e) => {
            
            modalMsgHandler('modal', 1, '更新失敗,請聯絡管理員').then((timeout) => {
                $('#modal').modal('show');
                setTimeout(()=>{ 
                    $('#modal').modal('hide');
                    $('#modal').remove();
                }, timeout);
            });


        });
    }

    toggleLoginLang(langId){

        $.cookie("langId", langId);
        window.location.reload();
    }

    selectLang(event){

        //let langid=this.getAttribute('data-value');
        console.log(event.target.getAttribute('data-value'));
        let id=event.target.getAttribute('data-value');
        this.toggleLang(id);
        // let langid=parseInt($('#selectLang').val());
        // this.toggleLang(langid);
       
    }

    selectLoginLang(event){

        //let langid=this.getAttribute('data-value');
        console.log(event.target.getAttribute('data-value'));
        let id=event.target.getAttribute('data-value');
        $.cookie("langId", id);
        window.location.reload();
       
    }

    goHome(){

        window.location='home';
    }

    async setLang(){

       
        this.sidebartoggle.removeEventListener('click', this.toggleSideBar);
        this.sidebartoggle.addEventListener('click', this.toggleSideBar.bind(this), false);

        // this.logo.removeEventListener('mouseover', this.showMenu);
        // this.logo.addEventListener('mouseover', this.showMenu.bind(this), false);

        // this.logo.removeEventListener('click', this.goHome);
        // this.logo.addEventListener('click', this.goHome.bind(this), false);

        this.setMenuList();

        let langid=$.cookie("langId")?parseInt($.cookie("langId")):parseInt(this.langid);
        setTerm(langid);
       
        document.querySelector('.cus-select-wrapper').addEventListener('click', function() {
            this.querySelector('.cus-select').classList.toggle('open');
        })


        switch (langid) {
            case 1:
                $('#theLang').html('中文');
                $('#lang001').addClass("selected");
                break;
            case 2:
                $('#theLang').html('English');
                $('#lang002').addClass("selected");
                break;
            case 3:
                $('#theLang').html('日本語');
                $('#lang003').addClass("selected");
                break;
            default:
                $('#theLang').html('中文');
                $('#lang001').addClass("selected");
                break;
        }
          
        

        for (const option of document.querySelectorAll(".cus-option")) {
           
            option.addEventListener('click', this.selectLang.bind(this), false);
        }
    }

    async setLoginLang(){

        
        $('#SidebarToggle').attr('style','display:none');

        let langid=$.cookie("langId")?parseInt($.cookie("langId")):1;
        setTerm(langid);

        document.querySelector('.cus-select-wrapper').addEventListener('click', function() {
            this.querySelector('.cus-select').classList.toggle('open');
        })


        switch (langid) {
            case 1:
                $('#theLang').html('中文');
                $('#lang001').addClass("selected");
                break;
            case 2:
                $('#theLang').html('English');
                $('#lang002').addClass("selected");
                break;
            case 3:
                $('#theLang').html('日本語');
                $('#lang003').addClass("selected");
                break;
            default:
                $('#theLang').html('中文');
                $('#lang001').addClass("selected");
                break;
        }
          
        

        for (const option of document.querySelectorAll(".cus-option")) {
           
            option.addEventListener('click', this.selectLoginLang.bind(this), false);
        }

        
    }

}