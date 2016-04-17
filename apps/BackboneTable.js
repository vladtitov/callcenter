///<reference path="../typings/jquery.d.ts"/>
///<reference path="../typings/underscore.d.ts"/>
///<reference path="../typings/backbone-global.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VOAgent = (function () {
    function VOAgent() {
    }
    return VOAgent;
}());
var AgentM = (function (_super) {
    __extends(AgentM, _super);
    function AgentM() {
        _super.apply(this, arguments);
    }
    AgentM.prototype.defaults = function () {
        return {
            stamp: 0,
            id: 3,
            fa: '',
            name: '',
            time: 0,
            aux: ''
        };
    };
    return AgentM;
}(Backbone.Model));
var Row = (function (_super) {
    __extends(Row, _super);
    function Row(options) {
        _super.call(this, options);
        this.template = _.template($('#row-template').html());
        // this.model.bind('change', ()=>this.render());
        // this.model.bind('destroy',()=>this.destroy());
        // this.model.bind('remove',()=>this.remove());
        //  this.model.bind('add',()=>this.add());
    }
    Row.prototype.render = function () {
        console.log(this.model);
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    };
    Row.prototype.remove = function () {
        var _this = this;
        this.$el.fadeOut(function () {
            _super.prototype.remove.call(_this);
        });
        return this;
    };
    Row.prototype.add = function () {
        console.log('add');
    };
    Row.prototype.destroy = function () {
        console.log('destroy');
    };
    return Row;
}(Backbone.View));
var AppModel = (function (_super) {
    __extends(AppModel, _super);
    function AppModel() {
        _super.apply(this, arguments);
    }
    return AppModel;
}(Backbone.Model));
var AgentsC = (function (_super) {
    __extends(AgentsC, _super);
    function AgentsC(options) {
        _super.call(this, options);
        this.model = AgentM;
        this.url = options.url;
    }
    AgentsC.prototype.parse = function (res) {
        // this.data = res;
        var stamp = Date.now();
        _.map(res.result.list, function (item) {
            item.stamp = stamp;
            item.icon = 'fa fa-' + item.fa;
        });
        // console.log(res.result.list.length);
        //  console.log(res);
        return res.result.list;
    };
    return AgentsC;
}(Backbone.Collection));
var TableView = (function (_super) {
    __extends(TableView, _super);
    function TableView(options) {
        var _this = this;
        _super.call(this, options);
        this.setElement($("#TableList"), true);
        // collection.bind('reset', this.render);
        this.collection = options.collection;
        this.collection.bind('remove', function (evt) {
            console.log('remove', evt);
        }, this);
        this.collection.bind("add", function (evt) {
            console.log('add', evt);
            var row = new Row({ model: evt, tagName: 'tr' });
            _this.$el.append(row.render().el);
        }, this);
        this.render = function () {
            console.log(this);
            return this;
        };
        this.collection.fetch();
        setInterval(function () {
            _this.collection.fetch();
        }, 5000);
    }
    TableView.prototype.render = function () {
        console.log('render');
        return this;
    };
    return TableView;
}(Backbone.View));
//# sourceMappingURL=BackboneTable.js.map