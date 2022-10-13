/*eslint-disable*/
import headerHtml from '../../html/layout/header.html';
import problemHtml from '../../html/pages/problem.html';
//import { HomePageHandler } from '../library/homePageHandler'

export default function problem() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+problemHtml;
    $(doc).ready(async () => {

        // doc.body.style.backgroundImage = `url(${bg})`;
        // doc.body.style.backgroundRepeat = "no-repeat";
        // doc.body.style.backgroundSize = "cover";
        // doc.body.style.backgroundPosition = "center bottom";
		
		
		/*
        doc.body.style.zIndex = "-1";
        doc.body.style.position = "fixed";
        doc.body.style.top = "0";
        doc.body.style.width = "100%";
        doc.body.style.height = "100%";
		*/
        
        

        //const homePageHandler = new HomePageHandler();
        

        

        console.log('$(doc).ready');

        $('.nav-button').click(function (e) {
            e.preventDefault();
            console.log('click');
            $('body').toggleClass('nav-open');
        });

        

       

    });

}
