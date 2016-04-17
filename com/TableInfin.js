/**
 * Created by VladHome on 3/19/2016.
 */
///<reference path="base.ts"/>
var table;
(function (table) {
    var TableRow = table2.ListRow;
    var TableInfin = (function () {
        function TableInfin(listid, options) {
            var _this = this;
            this.listid = listid;
            this.options = options;
            this.ON_SCROLL_FULL = 'ON_SCROLL_FULL';
            this.ON_SCROLL_0 = 'ON_SCROLL_0';
            this.onData = function (data) {
                console.log(data);
            };
            this.$disp = $({});
            this.toprow = 0;
            this.currentScroll = 0;
            this.getparams = '2016-03-15T7:58:34';
            this.collection = {};
            this.geturl = 'http://front-desk.ca/mi/callcenter/rem/getagents?date=';
            for (var str in options)
                this[str] = options[str];
            setInterval(function () { _this.scrollOneUp(); }, 1000);
            this.$disp.on(this.ON_SCROLL_FULL, function (evt) {
                _this.scrollFullUp();
            });
            this.$disp.on(this.ON_SCROLL_0, function (evt) {
                _this.toprow = 0;
                _this.currentScroll = 0;
            });
        }
        TableInfin.prototype.scrollOneUp = function () {
            if (!this.$nanoContent)
                this.$nanoContent = this.$nano.find('.nano-content');
            if (this.$nanoContent.length === 0) {
                console.log('error no nanocontent ');
                return;
            }
            var len = this.$tbody.children().length;
            var h = this.$tbody.children(this.toprow++).height();
            this.currentScroll += h;
            var max = this.$nanoContent[0].scrollHeight - this.$nanoContent.height();
            console.log('this.currentScroll   ' + this.currentScroll + ' max  ' + max);
            if (this.currentScroll > max)
                this.$disp.triggerHandler(this.ON_SCROLL_FULL);
            else
                this.$nanoContent.animate({ 'scrollTop': this.currentScroll }, 500);
            //  console.log(this.$nanoContent[0].scrollHeight-this.$nanoContent.height());
        };
        TableInfin.prototype.scrollFullUp = function () {
            var _this = this;
            //jQuery.fx.interval = 50;
            if (!this.$nanoContent)
                this.$nanoContent = this.$nano.find('.nano-content');
            this.$nanoContent.animate({ 'scrollTop': 0 }, 1000, null, function () {
                _this.$disp.triggerHandler(_this.ON_SCROLL_0);
            });
        };
        TableInfin.prototype.init = function () {
            this.$view = $(this.listid);
            this.$tbody = this.$view.find('[data-id=list]:first');
            this.$nano = this.$view.find('.nano:first');
            this.template = this.$view.find('[data-id=template]').html();
        };
        TableInfin.prototype.loadData = function () {
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
        TableInfin.prototype.setDataDone = function () {
            // this.removeItems();
        };
        TableInfin.prototype.setData = function (data) {
            var newInd = _.indexBy(data, 'key');
            var oldInd = this.dataInd;
            if (oldInd) {
                //  console.log(this.data.length+' new '+data.length);
                var oldAr = [];
                _.map(this.data, function (val) { if (!newInd[val.key])
                    oldAr.push(val); });
                // console.log('old',oldAr);
                var newAr = [];
                _.map(data, function (val) { if (!oldInd[val.key])
                    newAr.push(val); });
            }
            this.data = data;
            this.dataInd = newInd;
            this.rows = [];
            this.current = -1;
            this.lastNumber = -1;
            this.renderData();
            if (!this.$nanoContent)
                this.$nanoContent = this.$nano.find('.nano-content');
            this.height = this.$nanoContent.height();
            //console.log('this.height '+this.height);
        };
        TableInfin.prototype.removeOld = function (newData) {
            var stamp = Date.now();
            var old = _.sortBy(this.data, 'key');
            _.map(newData, function (val) { if (old[val.key])
                old[val.key].stamp = stamp; });
        };
        TableInfin.prototype.setStamp = function (stamp) {
        };
        TableInfin.prototype.renderData = function () {
            var _this = this;
            this.current++;
            this.lastNumber++;
            if (this.current >= this.data.length) {
                this.setDataDone();
                return;
            }
            // console.log(this);
            var ar = this.data;
            var coll = this.collection;
            // for (var i = 0, n = ar.length; i < n; i++) {
            var item = ar[this.current];
            item.stamp = this.current;
            if (coll[item.key])
                coll[item.key].setData(item);
            else {
                coll[item.key] = new TableRow(item, this.template);
                coll[item.key].appendTo(this.$tbody);
            }
            this.rows.push(coll[item.key]);
            if (this.$tbody.height() > this.height)
                this.setDataDone();
            else
                setTimeout(function () { _this.renderData(); }, 20);
            //coll[item.key].insertAt(this.$tbody, this.current) ;
            // }
        };
        TableInfin.prototype.removeItemsDone = function () {
            this.current = -1;
            this.sortOrder();
        };
        TableInfin.prototype.sortOrderDone = function () {
        };
        TableInfin.prototype.sortOrder = function () {
            var _this = this;
            this.current++;
            if (this.current >= this.rows.length) {
                this.sortOrderDone();
                return;
            }
            // this.views;
            var ar = this.rows;
            var item = ar[this.current];
            if (item.order != this.current) {
                item.insertAt(this.$tbody, this.current);
                setTimeout(function () { return _this.sortOrder(); }, 2);
            }
        };
        TableInfin.prototype.removeItems = function () {
            var ar = this.data;
            var coll = this.collection;
            // console.log(coll);
            for (var str in coll) {
                if (coll[str] && coll[str].stamp !== this.stamp) {
                    coll[str].remove();
                }
            }
            this.removeItemsDone();
        };
        return TableInfin;
    }());
    table.TableInfin = TableInfin;
})(table || (table = {}));
//# sourceMappingURL=TableInfin.js.map