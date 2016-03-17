/**
 * Created by VladHome on 3/16/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="../typings/chartist.d.ts"/>
///<reference path="../typings/moment.d.ts"/>
///<reference path="../typings/underscore.d.ts"/>
///<reference path="../typings/bootstrap.v3.datetimepicker.d.ts"/>
///<reference path="../com/Registry.ts"/>
var graphs;
(function (graphs) {
    var BarChart = (function () {
        function BarChart(selector, opts) {
            this.selector = selector;
            this.opts = opts;
            this.url = 'http://front-desk.ca/mi/callcenter/rem/getBarChart.php?id=';
            this.options = {
                seriesBarDistance: 0
            };
            this.responsiveOptions = [
                ['screen and (max-width: 640px)', {
                        seriesBarDistance: 0,
                        axisX: {
                            labelInterpolationFnc: function (value) {
                                return value[0];
                            }
                        }
                    }]
            ];
            this.loadData();
        }
        BarChart.prototype.loadData = function () {
            var _this = this;
            $.get(this.url + this.opts.id).done(function (res) {
                console.log(res);
                _this.drawChart(res);
            });
        };
        BarChart.prototype.drawChart = function (data) {
            this.chart = new Chartist.Bar(this.selector, data, this.options, this.responsiveOptions);
        };
        return BarChart;
    })();
    graphs.BarChart = BarChart;
})(graphs || (graphs = {}));
//# sourceMappingURL=BarChart.js.map