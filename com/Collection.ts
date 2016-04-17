/**
 * Created by VladHome on 4/7/2016.
 */

    ///<reference path="base.ts"/>

module table {
    import TableRow = table2.ListRow;
   export  class DataCollection {
        data:TableRow[];
        dataInd:_.Dictionary<TableRow>;
        olddata:TableRow[];
        exists:TableRow[];
        newdata:TableRow[];
        length:number;

        parseData(raw:VOItem[]):void {
            var newAr:TableRow[] = [];
            var exists:TableRow[] = [];
            var oldAr:TableRow[] = [];
            var data:TableRow[] = [];

            var newInd:_.Dictionary<VOItem> = _.indexBy(raw, 'key');

            if (this.data) {
                _.map(this.data, function (val:TableRow) {
                    if (!newInd[val.key]) {
                        oldAr.push(val)
                    }
                });
                // console.log('old',oldAr);
                var dataInd = this.dataInd;
                _.map(raw, function (val:VOItem) {
                    var row = dataInd[val.key];
                    if(row) {
                        row.setData(val);
                        exists.push(row);
                    }else {
                       row = new TableRow(val);
                        newAr.push(row);
                    }
                    data.push(row);

                });
            } else {
                data = _.map(raw, function (val) {
                    return new TableRow(val);
                });
                newAr = data;
            }
            // console.log('new',newAr);

            this.data = data;
            this.length = this.data.length;
            this.olddata = oldAr;
            this.newdata = newAr;
            this.exists = exists;
            this.dataInd = _.indexBy(data, 'key');
        }
       getRowByKey(key:string):TableRow{
           return this.dataInd[key];
       }
       getExists():TableRow[]{
           return this.exists;
       }

        newToEnd() {
            this.data = this.exists.concat(this.newdata);
        }
       current=0;
       getNext():TableRow{
           this.current++;
           if(this.current>=this.data.length) this.current=0;
           var row = this.data[this.current];
           row.i = this.current;
           return row
       }

    }
}


/*  class DataStore {
 data:VOItem[];
 dataInd:_.Dictionary<VOItem>;
 olddata:VOItem[];
 exists:VOItem[];
 newdata:VOItem[];
 length:number;

 sortData(data:VOItem[]):void {
 var newAr = [];
 var exists = [];
 var oldAr = [];
 var newInd = _.indexBy(data, 'key');
 if(this.data){
 _.map(this.data, function (val) {
 if (!newInd[val.key])oldAr.push(val)
 });
 // console.log('old',oldAr);
 var dataInd = this.dataInd;
 _.map(data, function (val) {
 if (dataInd[val.key]) exists.push(val);
 else  newAr.push(val);
 });
 }
 // console.log('new',newAr);
 //
 this.length = data.length;
 this.data = data;
 this.olddata = oldAr;
 this.newdata = newAr
 this.exists = exists;
 this.dataInd = newInd;
 }
 }*/



