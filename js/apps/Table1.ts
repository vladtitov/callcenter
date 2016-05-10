/**
 * Created by Vlad on 4/27/2016.
 */

///<reference path="../base.ts"/>


$(document).ready(function(){

    var collection = new tables.AgentsCollection({
        url:'http://callcenter.front-desk.ca//dashboard2/bsd.php',
        params:{
            report:'d'
        }
    });
    
    var t = new tables.TableView({
        container:'#AgentsList1',
        rowTempalete:'#row-template',
        collection:collection
    });

    var collectionTwo = new tablesTwo.AgentsCollection({
        url:'http://front-desk.ca/mi/callcenter/rem/getagents',
        params:{
            date:'2016-03-15T10:58:34'
        }
    });

    var dd = new tablesTwo.TableView({
        container:'#AgentsList2',
        rowTempalete:'#row-template2',
        collection:collectionTwo
    });
})
