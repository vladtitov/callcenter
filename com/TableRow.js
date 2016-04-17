/**
 * Created by VladHome on 4/5/2016.
 */
var table2;
(function (table2) {
    var ItemValue = table.ItemValue;
    var VOItem = (function () {
        function VOItem() {
        }
        return VOItem;
    }());
    var ListRow = (function () {
        function ListRow(item) {
            this.item = item;
            // $timeout:JQuery;
            this.current = '';
            this.timer = 0;
            this.stamp = item.stamp;
            this.id = item.id;
            this.key = item.key;
            this.order = -1;
        }
        ListRow.prototype.initView = function () {
            var $view = $(this.template);
            var $els = {};
            var values = {};
            $view.find('[data-id]').each(function (i, el) {
                _.map(el.getAttribute('data-id').split(','), function (ind) { values[ind] = new ItemValue(ind, el); });
            });
            this.values = values;
            $view.hide();
            this.$view = $view;
            var data = this.item;
        };
        ListRow.prototype.render = function () {
            this.$view.attr('data-i', this.i);
            var item = this.item;
            for (var str in item) {
                if (this.values[str])
                    var havechange = this.values[str].setValue(item[str]);
            }
            this.show();
        };
        ListRow.prototype.insertAt = function ($cont, i) {
            if (!this.$view)
                this.initView();
            var lastIndex = $cont.children().size();
            if (i < lastIndex)
                this.setOrder($cont, i);
            else
                $cont.append(this.$view);
            this.render();
            this.$view.fadeIn();
            this.mounted = true;
        };
        ListRow.prototype.appendTo = function ($cont) {
            if (!this.$view)
                this.initView();
            $cont.append(this.$view);
            this.render();
            this.$view.fadeIn();
            this.mounted = true;
        };
        ListRow.prototype.setOrder = function ($cont, i) {
            this.order = i;
            $cont.children().eq(i).before(this.$view);
        };
        ListRow.prototype.setData = function (item) {
            this.stamp = item.stamp;
            this.item = item;
            return this;
        };
        ListRow.prototype.remove = function (how) {
            //  for(var str in this.values)this.values[str].destroy();
            var _this = this;
            this.mounted = false;
            if (how) {
                this.$view.fadeOut(function () {
                    _this.order = -1;
                    _this.$view.remove();
                });
            }
            else
                this.$view.remove();
        };
        ListRow.prototype.hide = function () {
            this.visible = false;
            this.$view.fadeOut();
        };
        ListRow.prototype.show = function () {
            this.visible = true;
            this.$view.fadeIn();
        };
        ListRow.disp = $({});
        return ListRow;
    }());
    table2.ListRow = ListRow;
})(table2 || (table2 = {}));
//# sourceMappingURL=TableRow.js.map