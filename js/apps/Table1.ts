/**
 * Created by Vlad on 4/27/2016.
 */

///<reference path="../base.ts"/>


$(document).ready(function(){

    var collection = new tables.AgentsCollection({
        url:'http://callcenter.front-desk.ca//dashboard2/bsd.php?',
        params:{
            report:'d'
        }
    });
    
    var t = new tables.TableView({
        container:'#AgentsList1',
        rowTempalete:'#row-template',
        collection:collection
    });
})
