/*eslint-disable*/
import _ from 'lodash'

require('../../pulgins/jquery-ui.min')
require('../../pulgins/jquery.ui.touch-punch')
export class EditDeviceHandler {
    constructor() {

        this.doc = document;
        this.$sortable = $("#sortable");

        this.sortable = this.doc.querySelector('#sortable');
        this.sortBtn = this.doc.querySelector('#sortBtn');
        this.finishSortBtn = this.doc.querySelector('#finishSortBtn');
    }

    initSortable() {


        this.$sortable.sortable({
            disabled: true,
            placeholder: "ui-state-highlight",
            axis: 'y',
            cursor: "move",
            items: "li",                        //只是li可以拖動
            opacity: 0.6,                       //拖動時，透明度為0.6
            revert: false,                      //釋放時，增加動畫
            delay: 50,
            scroll: true,
            stop: async function (event, ui) {

                const $this = $(this);
                const data = $this.sortable('toArray');

                console.log('sortable Data: ', data)
                $this.sortable('disable');
                await $.cookie('sortable', data);
                $this.sortable('enable');

                /*$.ajax({
                        data: oData,
                    type: 'POST',
                    url: '/your/url/here'
                });*/
            }
        }).disableSelection();

    }

    disableSortable() {

        this.hideFinishSortBtn()
        this.showSortBtn();

        this.$sortable.sortable("option", "disabled", true);

        this.doc.querySelectorAll('.fa-minus').forEach((element) => {
            element.style.display = 'none';
        })
    }

    enableSortable() {

        this.hideSortBtn();
        this.showFinishSortBtn();

        this.$sortable.sortable("option", "disabled", false);

        this.doc.querySelectorAll('.fa-minus').forEach((element) => {
            element.style.display = '';
        })
    }

    sortDeviceList(data) {

        const sortableData = $.cookie('sortable');
        let sortableOptions = [];
        const dataLength = data.length;

        if (dataLength > 1) {
            this.showSortBtn();
            this.addSortBtnEvent();
            this.addFinishSortBtnEvent();
        }

        if (sortableData) {

            let sortableArry = sortableData.split(',');

            sortableArry.forEach(sortableElement => {
                for (let i = 0; i < dataLength; i++) {
                    if (data[i].IMEI === sortableElement) {
                        sortableOptions.push(`<li id="${data[i].IMEI}" class="ui-state-default"><i style="display: none;" class="fas fa-minus"></i> ${data[i].Alias} </li>`);
                        data[i] = '';
                    }
                }
            });

            data = _.compact(data);
            data.forEach(element => {
                const { IMEI, Alias } = element;
                sortableOptions.push(`<li id="${IMEI}" class="ui-state-default"><i style="display: none;" class="fas fa-minus"></i> ${Alias} </li>`)
            });

        } else {
            data.forEach(element => {
                const { IMEI, Alias } = element;
                sortableOptions.push(`<li id="${IMEI}" class="ui-state-default"><i style="display: none;" class="fas fa-minus"></i> ${Alias} </li>`)
            });
        }

        // Check Item Number <=30
        console.log('number='+sortableOptions.length);
        if (sortableOptions.length>=30){
            document.getElementById("addBtn").disabled=true;
        }


        sortable.innerHTML = sortableOptions.join('');
        sortableOptions = undefined;

    }

    async sortableClickEvent(event) {

        if (event.target.tagName === 'LI') {
            console.log(event.target.id)
            await $.cookie('editDevice', event.target.id);
            window.location = 'deviceSetting'
        }
    }

    addSortableClickEvent() {

        this.sortable.removeEventListener('click', this.sortableClickEvent);
        this.sortable.addEventListener('click', this.sortableClickEvent, false);
    }

    addSortBtnEvent() {
        this.sortBtn.addEventListener('click', this.enableSortable.bind(this), false);
    }

    addFinishSortBtnEvent() {
        this.finishSortBtn.addEventListener('click', this.disableSortable.bind(this), false);
    }

    showSortBtn() {
        this.sortBtn.style.display = '';
    }

    hideSortBtn() {
        this.sortBtn.style.display = 'none';
    }

    showFinishSortBtn() {
        this.finishSortBtn.style.display = '';
    }

    hideFinishSortBtn() {
        this.finishSortBtn.style.display = 'none';
    }

}