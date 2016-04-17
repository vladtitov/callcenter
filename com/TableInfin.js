/**
 * Created by VladHome on 3/19/2016.
 */
///<reference path="base.ts"/>
///<reference path="Collection.ts"/>
var table;
(function (table) {
    /////////////////////////////////////////////////////////////////////////////////////////////
    //  setInterval(function(){ CellValue.disp.triggerHandler('time',-1)},1000);
    var TableInfinController = (function () {
        function TableInfinController(listid, options) {
            this.listid = listid;
            this.options = options;
            this.ON_SCROLL_FULL = 'ON_SCROLL_FULL';
            this.ON_SCROLL_0 = 'ON_SCROLL_0';
            this.$disp = $({});
            this.toprow = 0;
            this.currentScroll = 0;
            this.timer = 0;
            this.ontop = 0;
            this.getparams = '2016-03-15T7:58:34';
            this.geturl = 'http://front-desk.ca/mi/callcenter/rem/getagents?date=';
            for (var str in options)
                this[str] = options[str];
            this.db = new table.DataCollection();
            this.refreshWave = new RefreshWave();
            // setInterval(()=>{this.scrollOneUp()},1000);
            /* this.$disp.on(this.ON_SCROLL_FULL,(evt)=>{
                // this.scrollFullUp();
             });
             this.$disp.on(this.ON_SCROLL_0,(evt)=>{
                 this.toprow = 0;
                 this.currentScroll = 0;
             });*/
        }
        TableInfinController.prototype.onData = function (data) {
            this.getparams = data.stamp;
            console.log(this.getparams);
            var ar = data.result.list;
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                item.key = item.id;
                item.icon = 'fa fa-' + item.fa;
                item.aux_color = (item.color == 'green' ? '' : item.color);
            }
            this.setData(ar);
        };
        TableInfinController.prototype.scrollStart = function () {
            var _this = this;
            if (this.timer !== 0)
                return;
            this.timer = setInterval(function () { return _this.scrollNext(); }, 2000);
        };
        TableInfinController.prototype.scrollstop = function (reason) {
            console.log('stop scroll ' + reason);
            clearInterval(this.timer);
            this.timer = 0;
        };
        TableInfinController.prototype.scrollNext = function () {
            var _this = this;
            var h = this.$tbody.children(0).height();
            if (this.ontop === 0)
                this.ontop = 1;
            else
                this.ontop = 0;
            this.addRow();
            this.$nanoContent.animate({ 'scrollTop': this.ontop ? h : h * 2 }, 500, function () {
                // console.log('done');
                if (_this.ontop === 0) {
                    var item = _this.rows.shift();
                    item.remove(null);
                    var item = _this.rows.shift();
                    item.remove(null);
                    _this.$nanoContent.scrollTop(0);
                }
                _this.current = -1;
                _this.fillTable();
            });
            //console.log(item);
        };
        TableInfinController.prototype.init = function () {
            this.$view = $(this.listid);
            this.$tbody = this.$view.find('[data-id=list]:first');
            this.$nano = this.$view.find('.nano:first');
            this.template = this.$view.find('[data-id=template]').html();
        };
        TableInfinController.prototype.loadData = function () {
            var _this = this;
            this.getparams;
            var url = this.geturl + this.getparams;
            $.get(url).done(function (data) {
                //   console.log(data);
                _this.onData(data);
                // this.setData(data);
            }).fail(function (reason) {
                console.log(reason);
            });
        };
        TableInfinController.prototype.setDataDone = function () {
            if (this.timer === 0)
                this.scrollStart();
            // console.log('setdatadone');
        };
        TableInfinController.prototype.refreshExists = function () {
            var ar = this.db.getExists();
            this.refreshWave.refresh(ar);
            /* ar.forEach(function(item){
               // console.log(item);
                 if(item.mounted) item.render();
  
             })*/
        };
        TableInfinController.prototype.initContenet = function () {
            this.$nanoContent = this.$nano.find('.nano-content');
            this.height = this.$nanoContent.height();
            this.rows = [];
            this.current = -1;
            this.fillTable();
        };
        TableInfinController.prototype.setData = function (data) {
            this.db.parseData(data);
            console.log('new data ' + this.db.newdata.length + ' ols data ' + this.db.olddata.length + ' data ' + this.db.length);
            if (!this.$nanoContent)
                this.initContenet();
            this.refreshExists();
        };
        TableInfinController.prototype.setStamp = function (stamp) {
        };
        TableInfinController.prototype.addRow = function () {
            var row = this.db.getNext();
            if (row.mounted) {
                console.log('mounted');
            }
            else {
                row.template = this.template;
                row.appendTo(this.$tbody);
                this.rows.push(row);
            }
        };
        TableInfinController.prototype.fillTable = function () {
            var _this = this;
            this.current++;
            if (this.current >= this.db.length) {
                this.setDataDone();
                return;
            }
            this.addRow();
            if (this.$tbody.height() > this.height)
                this.setDataDone();
            else
                setTimeout(function () { _this.fillTable(); }, 20);
        };
        return TableInfinController;
    }());
    table.TableInfinController = TableInfinController;
    var RefreshWave = (function () {
        function RefreshWave() {
        }
        RefreshWave.prototype.refresh = function (data) {
            var _this = this;
            this.data = data;
            this.counter = -1;
            this.stop();
            this.timer = setInterval(function () { _this.doNext(); }, 60);
        };
        RefreshWave.prototype.stop = function () {
            clearInterval(this.timer);
        };
        RefreshWave.prototype.doNext = function () {
            this.counter++;
            if (this.counter >= this.data.length)
                this.stop();
            else {
                var item = this.data[this.counter];
                if (item.mounted)
                    item.render();
                else
                    this.doNext();
            }
        };
        return RefreshWave;
    }());
    table.RefreshWave = RefreshWave;
})(table || (table = {}));
$(document).ready(function () {
    var options = {
        geturl: 'http://callcenter.front-desk.ca/service/get-agents-all?date=',
        getparams: '2016-03-15T7:58:34',
        list: '[data-id=list]:first'
    };
    var list = new table.TableInfinController('#Table1', options);
    list.init();
    list.loadData();
    setInterval(function () {
        list.loadData();
    }, 5000);
    setInterval(function () {
        //	list.scrollUp();
    }, 6000);
});
//# sourceMappingURL=TableInfin.js.map