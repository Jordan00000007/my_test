/*eslint-disable*/
import headerHtml from '../../html/layout/header.html';
import tagChartHTML from '../../html/pages/tagChart.html';
import { HomePageHandler } from '../library/homePageHandler'
import { getData } from '../library/getData.js';
import 'chart.js/dist/Chart.min.css';
import 'chart.js/dist/Chart.min';
import 'moment/moment.js';

export default function tagList() {

    const doc = document;
    const view = doc.getElementById('root');
    view.innerHTML = headerHtml+tagChartHTML;
    $(doc).ready(async () => {

        // doc.body.style.backgroundImage = `url(${bg})`;
        // doc.body.style.backgroundRepeat = "no-repeat";
        // doc.body.style.backgroundSize = "cover";
        // doc.body.style.backgroundPosition = "center bottom";
        doc.body.style.zIndex = "-1";
        doc.body.style.position = "fixed";
        doc.body.style.top = "0";
        doc.body.style.width = "100%";
        doc.body.style.height = "100%";

        // 取得參數
        const url = require('url');
        const queryObject = url.parse(window.location.href,true).query;
        doc.getElementById('Title').textContent=queryObject.tagName;

        var moment = require('moment');

        function newDate(secs) {
			return moment().add(secs, 's').toDate();
		}

		function newDateString(secs) {
			return moment().add(secs, 's').format(timeFormat);
        }
        
        //var timeFormat = 'YYYY/MM/DD HH:mm:SS';
        var timeFormat = 'mm:SS';
        var Samples = global.Samples || (global.Samples = {});

        Samples.utils = {
            // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
            srand: function(seed) {
                this._seed = seed;
            },
    
            rand: function(min, max) {
                var seed = this._seed;
                min = min === undefined ? 0 : min;
                max = max === undefined ? 1 : max;
                this._seed = (seed * 9301 + 49297) % 233280;
                return min + (this._seed / 233280) * (max - min);
            },
    
            numbers: function(config) {
                var cfg = config || {};
                var min = cfg.min || 0;
                var max = cfg.max || 1;
                var from = cfg.from || [];
                var count = cfg.count || 8;
                var decimals = cfg.decimals || 8;
                var continuity = cfg.continuity || 1;
                var dfactor = Math.pow(10, decimals) || 0;
                var data = [];
                var i, value;
    
                for (i = 0; i < count; ++i) {
                    value = (from[i] || 0) + this.rand(min, max);
                    if (this.rand() <= continuity) {
                        data.push(Math.round(dfactor * value) / dfactor);
                    } else {
                        data.push(null);
                    }
                }
    
                return data;
            },
    
            labels: function(config) {
                var cfg = config || {};
                var min = cfg.min || 0;
                var max = cfg.max || 100;
                var count = cfg.count || 8;
                var step = (max - min) / count;
                var decimals = cfg.decimals || 8;
                var dfactor = Math.pow(10, decimals) || 0;
                var prefix = cfg.prefix || '';
                var values = [];
                var i;
    
                for (i = min; i < max; i += step) {
                    values.push(prefix + Math.round(dfactor * i) / dfactor);
                }
    
                return values;
            },
    
            months: function(config) {
                var cfg = config || {};
                var count = cfg.count || 12;
                var section = cfg.section;
                var values = [];
                var i, value;
    
                for (i = 0; i < count; ++i) {
                    value = MONTHS[Math.ceil(i) % 12];
                    values.push(value.substring(0, section));
                }
    
                return values;
            },
    
            color: function(index) {
                return COLORS[index % COLORS.length];
            },
    
            transparentize: function(color, opacity) {
                var alpha = opacity === undefined ? 0.5 : 1 - opacity;
                return Color(color).alpha(alpha).rgbString();
            }
        };

        window.chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };

        window.randomScalingFactor = function() {
            var num=Samples.utils.rand(0, 40);
            return Math.round(num);
        };

        Samples.utils.srand(Date.now());
        var color = Chart.helpers.color;
		var config = {
			type: 'line',
			data: {
				labels: [ // Date Objects
					newDate(0),
					newDate(1),
					newDate(2),
					newDate(3),
					newDate(4),
					newDate(5),
					newDate(6)
				],
				datasets: [{
					label: '',
					backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
					borderColor: window.chartColors.red,
					fill: false,
					data: [
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor()
					],
				}]
			},
			options: {
				title: {
					text: 'Chart.js Time Scale'
				},
				scales: {
					xAxes: [{
						type: 'time',
						time: {
							parser: timeFormat,
							// round: 'day'
							tooltipFormat: 'HH:mm'
						},
						scaleLabel: {
							display: true,
							labelString: '時間'
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: '溫度'
						}
					}]
				},
			}
		};



        var ctx = document.getElementById('canvas').getContext('2d');
        window.myLine = new Chart(ctx, config);


       

        // 載入資料
        let data = await getData("TagList");
        let TagList=document.getElementById("TagListBody");
        data.forEach(item => {
           
        
        
        })

        const homePageHandler = new HomePageHandler();
        console.log('home $(doc).ready');


        


        $('.nav-button').click(function (e) {
            e.preventDefault();
            console.log('click');
            $('body').toggleClass('nav-open');
        });
    })

}
