/*eslint-disable*/
import { UnixTimestamp } from './common'


export class TagSettingHandler {

    constructor() {
        this.doc = document;
        this.tagSelect = this.doc.querySelector('#tagSelect');
        this.tagName=this.doc.querySelector('#tagName');
    }

  
    async tagSelectEvent() {
        var e = document.getElementById("tagSelect");
        var option = this.tagSelect.options[this.tagSelect.selectedIndex];
        this.tagName.value=option.getAttribute("tagName");
    }

    setTagSelectListenOnChange() {

        this.tagSelect.removeEventListener('change', this.tagSelectEvent);
        this.tagSelect.addEventListener('change', this.tagSelectEvent.bind(this), false);
    }

  
   
}

