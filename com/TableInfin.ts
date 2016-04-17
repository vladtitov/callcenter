/**
 * Created by VladHome on 3/19/2016.
 */
    ///<reference path="base.ts"/>
    ///<reference path="Collection.ts"/>
///<reference path="TableRow.ts"/>
    ///<reference path="ItemValue.ts"/>
    


module table {

    //import ListRow = table2.ListRow;
    declare var Formatter:any;
    import TableRow = table2.ListRow;
    import CellValue = table.ItemValue;
/////////////////////////////////////////////////////////////////////////////////////////////
      //  setInterval(function(){ CellValue.disp.triggerHandler('time',-1)},1000);



   export class TableInfinController {
        $view:JQuery;
        $tbody:JQuery;
        $nano:JQuery;
       ON_SCROLL_FULL:string='ON_SCROLL_FULL';
       ON_SCROLL_0:string='ON_SCROLL_0';

        onData(data) {
            this.getparams = data.stamp;
            console.log(this.getparams)
            var ar = data.result.list;
            for(var i=0,n=ar.length;i<n;i++){
                var item = ar[i];
                item.key=item.id;
                item.icon = 'fa fa-'+item.fa;
                item.aux_color = (item.color=='green'?'':item.color);
            }
            this.setData(ar);
        }

        private template:string;

       isUp:boolean;
       $nanoContent:JQuery;
       $disp:JQuery=$({});

       toprow:number= 0;
       currentScroll:number=0;
       db:DataCollection;
       refreshWave:RefreshWave;

        constructor(private listid:string, private options:any) {
            for (var str in options)this[str] = options[str];
            this.db = new DataCollection();
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


       timer:number=0;

       scrollStart():void{
           if(this.timer !==0)return
           this.timer = setInterval(()=>this.scrollNext(),2000);

       }
       scrollstop(reason:string):void{
           console.log('stop scroll '+reason);
           clearInterval(this.timer);
           this.timer = 0;
       }

       ontop:number=0;

       scrollNext():void{         //  console.log('next');
        var h = this.$tbody.children(0).height();

        if(this.ontop ===0 )this.ontop = 1
        else this.ontop = 0;
          this.addRow();
           this.$nanoContent.animate({'scrollTop':this.ontop?h:h*2},500,()=>{
              // console.log('done');
               if(this.ontop===0){
                   var item =   this.rows.shift();
                   item.remove(null);
                   var item =   this.rows.shift();
                   item.remove(null);
                   this.$nanoContent.scrollTop(0);
               }

               this.current=-1
               this.fillTable();


           });


           //console.log(item);


       }


       init():void{
           this.$view = $(this.listid);
           this.$tbody = this.$view.find('[data-id=list]:first');
           this.$nano = this.$view.find('.nano:first');

           this.template = this.$view.find('[data-id=template]').html();
       }

        getparams:string = '2016-03-15T7:58:34';

       // collection:_.Dictionary<TableRow> = {};
        stamp:number;
        geturl:string = 'http://front-desk.ca/mi/callcenter/rem/getagents?date=';

        loadData():void {
            this.getparams;
            var url = this.geturl + this.getparams

            $.get(url).done((data)=> {
                //   console.log(data);
                this.onData(data);
               // this.setData(data);


            }).fail((reason)=> {
                console.log(reason);
            })
        }

       rows:TableRow[];

       setDataDone():void{
           if(this.timer ===0)  this.scrollStart();
          // console.log('setdatadone');
       }

       current:number;
       height:number;
       refreshExists():void{
           var ar = this.db.getExists();
           this.refreshWave.refresh(ar);
          /* ar.forEach(function(item){
             // console.log(item);
               if(item.mounted) item.render();

           })*/
       }

       initContenet():void{
           this.$nanoContent = this.$nano.find('.nano-content');
           this.height = this.$nanoContent.height();
           this.rows=[];
           this.current=-1;
           this.fillTable();
       }
        setData(data:VOItem[]) {
            this.db.parseData(data);

            console.log('new data '+this.db.newdata.length+' ols data '+ this.db.olddata.length+' data '+this.db.length);
            if(!this.$nanoContent)this.initContenet();
            this.refreshExists();

        }
       setStamp(stamp:number):void{


       }

       addRow():void{
           var row = this.db.getNext();
           if(row.mounted){
               console.log('mounted');
           }else{
               row.template = this.template;
               row.appendTo(this.$tbody);
               this.rows.push(row);
           }

       }

       fillTable():void{
           this.current++;
           if(this.current>=this.db.length){
               this.setDataDone();
               return;
           }
           this.addRow();

           if(this.$tbody.height() > this.height) this.setDataDone();
           else setTimeout(()=>{this.fillTable()},20);

        }
    }

    export class RefreshWave{
        data:TableRow[];
        timer:number;
        counter:number;
        refresh(data:TableRow[]){
            this.data = data;
            this.counter=-1;
           this.stop();
            this.timer = setInterval(()=>{this.doNext()},60)

        }
        stop():void{
            clearInterval(this.timer);
        }
        doNext():void{
            this.counter++;
            if(this.counter>=this.data.length)this.stop();
            else{
                var item:TableRow = this.data[this.counter];
                if(item.mounted)  item.render();
                else this.doNext();

            }
        }
    }







}

$(document).ready(function(){

    var options ={
        geturl:'http://callcenter.front-desk.ca/service/get-agents-all?date=',
        getparams:'2016-03-15T7:58:34',
        list:'[data-id=list]:first'

    }

    var list = new table.TableInfinController('#Table1',options);
    list.init();
    list.loadData();


    setInterval(function(){
        list.loadData();
    },5000);

    setInterval(function(){
        //	list.scrollUp();
    },6000)

})