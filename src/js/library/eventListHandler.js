/*eslint-disable*/
import { UnixTimestamp } from './common'
import { getData } from '../library/getData.js'


export class EventListHandler {

    constructor() {
        this.doc = document;
        this.gatewaySelect = this.doc.querySelector('#gatewaySelect');
        this.tagSelect = this.doc.querySelector('#tagSelect');
        this.eventList = this.doc.querySelector('#eventList');
       
    }

  
   

    async tagSelectEvent() {

    
  

        console.log("tagSelectEvent");
        var option = this.tagSelect.options[this.tagSelect.selectedIndex];
        let TagCode=option.value;

        var option2 = this.gatewaySelect.options[this.gatewaySelect.selectedIndex];
        let gatewayCode=option2.value;
        //console.log(TagCode);
        
        
        // empty options
        while ((this.eventList.lastChild)&&(this.eventList.childElementCount>1)) {
            this.eventList.removeChild(this.eventList.lastChild);
        }

        let getEventName=function(code){
            let CodeList = getData("CodeList");
            let Ans=code;
            CodeList.forEach(item => {
                if (item.Code==code){
                    Ans=item.Message;
                }
            });
            return Ans;
        }

        let getTagName=function(code){
            let GatewayList = getData("GatewayList");
            let Ans=code;
            GatewayList.forEach(item => {
                item.tagList.forEach(item2 => {
                    if(item2.tagCode==code){
                        Ans=item2.tagName;
                    }
                });

            });
            return Ans;
        }

        let getGatewayName=function(code){
            let GatewayList = getData("GatewayList");
            let Ans="";
            GatewayList.forEach(item => {
                item.tagList.forEach(item2 => {
                    if(item2.tagCode==code){
                        Ans=item.gatewayName;
                    }
                });

            });
            return Ans;
        }

        let getGatewayCode=function(code){
            let GatewayList = getData("GatewayList");
            let Ans="";
            GatewayList.forEach(item => {
                item.tagList.forEach(item2 => {
                    if(item2.tagCode==code){
                        Ans=item.gatewayCode;
                    }
                });

            });
            return Ans;
        }


        let data = await getData("EventList");
        data.forEach(item => {

            if(TagCode=="all"){
                if(gatewayCode==getGatewayCode(item.Tag)){
                    let tr=document.createElement("tr");
                    //let td1=document.createElement("td");
                    //td1.innerHTML=getGatewayName(item.Tag);
                    //tr.appendChild(td1);
                    let td2=document.createElement("td");
                    td2.innerHTML=getTagName(item.Tag);
                    tr.appendChild(td2);
                    let td3=document.createElement("td");
                    td3.innerHTML=item.Time;
                    tr.appendChild(td3);
                    let td4=document.createElement("td");
                    td4.innerHTML=getEventName(item.Code);
                    tr.appendChild(td4);
                    this.eventList.appendChild(tr);
                }
            }
            else if(TagCode==item.Tag){
                let tr=document.createElement("tr");
                //let td1=document.createElement("td");
                //td1.innerHTML=getGatewayName(item.Tag);
                //tr.appendChild(td1);
                let td2=document.createElement("td");
                td2.innerHTML=getTagName(item.Tag);
                tr.appendChild(td2);
                let td3=document.createElement("td");
                td3.innerHTML=item.Time;
                tr.appendChild(td3);
                let td4=document.createElement("td");
                td4.innerHTML=getEventName(item.Code);
                tr.appendChild(td4);
                this.eventList.appendChild(tr);
            }
            
          
        
        })
    
    }

    async gatewaySelectEvent(tagCode) {
        var e = document.getElementById("gatewaySelect");
        
        var option = this.gatewaySelect.options[this.gatewaySelect.selectedIndex];
        var tagList=JSON.parse(option.getAttribute("tagList"));

        // empty options
        while (this.tagSelect.lastChild) {
            this.tagSelect.removeChild(this.tagSelect.lastChild);
        }
        

        for(var i in tagList) {

            console.log(tagList[i].tagName)
            var option = document.createElement("option");
            option.text=tagList[i].tagName;
            option.value=tagList[i].tagCode;
            this.tagSelect.appendChild(option);
   
        }

        var option = document.createElement("option");
        option.text="全部";
        option.value="all";
        this.tagSelect.appendChild(option);

        for(var i=0; i < tagSelect.length; i++)
        {
            if (tagCode==this.tagSelect.options[i].value){
                this.tagSelect.options[i].selected=true;
            }
        }

       
        this.tagSelectEvent();

      
       
    }

    setGatewaySelectListenOnChange() {

        this.gatewaySelect.removeEventListener('change', this.gatewaySelectEvent);
        this.gatewaySelect.addEventListener('change', this.gatewaySelectEvent.bind(this), false);
    }

    setTagSelectListenOnChange() {

        this.tagSelect.removeEventListener('change', this.tagSelectEvent);
        this.tagSelect.addEventListener('change', this.tagSelectEvent.bind(this), false);
    }


  
   
}

