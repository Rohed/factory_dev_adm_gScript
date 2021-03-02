
 
function TESTPRINTNEW(){ 
var type='Selected';
var obj={
from:new Date('06/19/2018').setHours(0,0,0,0),
to:new Date('06/30/2018').setHours(0,0,0,0),
selected:['1614713316086'],
};

printSchedules(obj,type);
}

function precisionRound(number) {
  var factor = Math.pow(10, 1);
  return Math.round(number * factor) / factor;
}
function printSchedules(opt,type){
var item={};
try{
  //Today
  //FromTo
  //scheduleSelect
  var allMachines = base.getData('Machines');
  var allMachinesList = JSONtoARR(allMachines);
  var printData=[];
  var name='';
  
  if(type=='Today'){
    var printData=getTodaySchedule();
    name=formatDateDisplay(new Date().getTime());
  }else if(type=='FromTo'){
   name=formatDateDisplay(new Date(opt.from).getTime())+' - '+formatDateDisplay(new Date(opt.to).getTime())
    var printData=getFromToSchedule(opt.from,opt.to);
  }else{
  var names=[];
   for(var i=0;i<opt.selected.length;i++){
   names.push(base.getData('Schedules Reference/'+opt.selected[i].toString()+'/name'));
   }
   if(names.length>1){
   name=names.join(', ');
   }else{
   name=names[0];
   }
    var printData=getSelectedSchedules(opt.selected);
    
  }
  var toPrint=getToPrint(printData[0]);
  var simplePrint = formSimplePrint(printData[0],printData[1],allMachines);
  var startRow=3;
  var startCol=3;
  
  var folder=DriveApp.getFolderById(SCHEDULES_FOLDER);
  var create=DriveApp.getFileById(SCHEDULE_TEMPLATE).makeCopy(name+' - Schedule',folder);


  var SS=SpreadsheetApp.openById(create.getId());
  Logger.log(SS.getUrl());
  var template=SS.getSheets()[0];
  var sheet=SS.getSheets()[1];
  var simpleSheet = SS.getSheets()[2];
  simpleSheet.getRange(1, 1, simplePrint.length, simplePrint[0].length).setValues(simplePrint);
  sheet.setName('Schedule');
  var initRange= template.getRange(1, 1, template.getLastRow(), 2);
  var initCol= template.getRange(1, 3, template.getLastRow(), 1);
  var initSplit= template.getRange(1, 4, template.getLastRow(), 1);
  var toDoRange= template.getRange(1446, 2);
  initRange.copyTo(sheet.getRange(1, 1, template.getLastRow(), 2));
  sheet.getRange(2, 2).setValue(name);
  var prev='';
    var BGColors = ['#d3d3d3','#ffffff'];
    var colindex = 0;
  for(var i=0;i<printData[0].length;i++){
  if(prev==''){
  prev=printData[0][i][0];
  }
  if(prev!=printData[0][i][0]){
    initSplit.copyTo(sheet.getRange(1, startCol, template.getLastRow(), 1));
    prev=printData[0][i][0];
    startCol++;
    toDoRange.copyTo(sheet.getRange(1446, startCol-1));

  }
  var machineName=allMachines[printData[0][i][1]].name;
  printData[0][i][0]=formatDateDisplay(parseInt(printData[0][i][0],10));
  printData[0][i][1]=machineName;
   initCol.copyTo(sheet.getRange(1, startCol,template.getLastRow(), 1));
   var values=[];
   var batchandbot=[];
   
   for(var j =0;j<printData[0][i].length;j++){
    values.push([printData[0][i][j]]);
     batchandbot.push(printData[1][i][j]);
   }
   printData[0][i].map(function(item){
  
   });
 //  sheet.getRange(startRow, startCol, printData[i].length,1).setValues(values);
   var v1 = 0;
    var oldValues = JSON.parse(JSON.stringify(values))
    while(values.length>0){

      var v2=1;
      var totalBot = 0;
      var val = batchandbot[0][0];
      
      var type = typeof batchandbot[v2];
      if( type !== "undefined"){
     
      for(;val == batchandbot[v2][0] ;){
        v2++
        if(v2>=batchandbot.length){
        break;
        }
      }
      var arrtoSet =values.splice(0, v2); 
      var arrtoCombine =batchandbot.splice(0, v2); 
      if(val != "" && arrtoCombine[0][0]){
      var botcount = 0;
      arrtoCombine.map(function(item){
        botcount+=item[1];
      });
      }else{
      var botcount = 0;
      }
        botcount = precisionRound(botcount);
        //sheet.getRange(startRow+v1, startCol,v2,1).setValues(arrtoSet);
        if(v1>1 && botcount!=0){
         sheet.getRange(startRow+v1, startCol,v2,1).merge().setValue(arrtoSet[0]+' X '+botcount).setBackground(BGColors[colindex]);
        }else if(v1>1){
          sheet.getRange(startRow+v1, startCol,v2,1).merge().setValue(arrtoSet[0]).setBackground(BGColors[colindex]);
        }else{
          sheet.getRange(startRow+v1, startCol,v2,1).merge().setValue(arrtoSet[0]).setBackground(BGColors[colindex]);
        }
      }else{
        if(batchandbot.splice(0, 1)[0]){ 
          sheet.getRange(startRow+v1, startCol).setValue(values.splice(0, 1)+' X '+batchandbot.splice(0, 1)[1]).setBackground(BGColors[colindex]); 
          // values=[];
        }else{
          sheet.getRange(startRow+v1, startCol).setValue(values.splice(0, 1)).setBackground(BGColors[colindex]);
        }
      }
      v1+=v2;
      if(colindex==1){
      colindex=0;
      }else{
      colindex++;
      }
    } 
 
 
    var from =startRow+oldValues.length-v2;
    sheet.getRange(from, startCol).setValue(' '); 
   startCol++;
  }

  var values = sheet.getDataRange().getValues();
  var c=0;
  for(var j=4;j<values.length;j++) {
    var foundval = false;
    for(var k=2;k<values[j].length;k++){
      if(values[j][k]){
        foundval=true;
        break;
      }
    }
    if(foundval){
      break;
    }else{
    c++;
    }
  };
   
  if(foundval && c > 0){
    sheet.deleteRows(5,c);
  }
  var SS=SpreadsheetApp.openById(create.getId());
  var sheet=SS.getSheets()[1];
  var values = sheet.getDataRange().getValues();
 
  var c=0;
  for(var j=values.length-4;j>0;j--) {
    var foundval = false;
    for(var k=2;k<values[j].length;k++){
      if(values[j][k]){
        foundval=true;
        break;
      }
    }
    if(foundval){
      break;
    }else{
      c++;
    }
  }
  var from =values.length-c -startRow;
  var to= values.length-1;
  sheet.deleteRows(from,to-from) 
  
SS.deleteSheet(template);
item.name=SS.getName();
item.url=SS.getUrl();

}catch(e){
Logger.log(e.toString());
item.error=e.toString();
}
Logger.log(item);
return item
}

function getTodayScheduleNew(){
  var orders=base.getData('Production');
  var arr=[];
  var existingTimes = [];
  for (var i = 0; i <1440; i++) {
    existingTimes.push(i);
  }
  var botandbatchLarge = [];
  var date= new Date().setUTCHours(0,0,0,0);
  var dateSTR = date.toString();
  var schedules = base.getData('Schedules');
  if(schedules){
    var keys=Object.keys(schedules);
    schedules = {};
    for(var i=0;i<keys.length;i++){
      var searchSTR  = keys[i];
      if(parseInt(searchSTR,10)>=date && parseInt(searchSTR,10)<=date){
        var item=base.getData('Schedules/'+searchSTR);
        
        if(item){
          item.id=date;
          var machineKeys=Object.keys(item.Machines);
          for(var j=0;j<machineKeys.length;j++){
            var machineTimes=item.Machines[machineKeys[j]];
            var machineTimesKeys=Object.keys(machineTimes);  
            var arrToPush=[date,machineKeys[j]];
            var botandbatch = [[1],[2]];
            for(var mt=0;mt<existingTimes.length;mt++){
              if(machineTimes[mt]){
                var batch=Object.keys(machineTimes[mt]);
                arrToPush.push(orders[batch[0]].orderID+'/'+batch[0]+' '+orders[batch[0]].productdescription);
                botandbatch.push([batch[0],machineTimes[mt][batch[0]].bottles]);
              }else{
                arrToPush.push('');
                botandbatch.push([]);
              }
            }
            arr.push(arrToPush);
            botandbatchLarge.push(botandbatch)
          }
          break;
        }
      }
    }
  }
  

   return [arr,botandbatchLarge];
}
function getFromToScheduleNew(from,to){
  var orders=base.getData('Production');
  var arr=[];
  var existingTimes = [];
  for (var i = 0; i <1440; i++) {
    existingTimes.push(i);
  }
    var botandbatchLarge = [];

  var one_day=60*60*1000*24;
  var schedules = base.getData('Schedules');
  if(schedules){
  var keys=Object.keys(schedules);
  schedules = {};
  for(var i=0;i<keys.length;i++){
    var searchSTR  = keys[i];
    if(parseInt(searchSTR,10)>=from && parseInt(searchSTR,10)<=to){
    var item=base.getData('Schedules/'+searchSTR);
    if(item){
      item.id= keys[i];
      var machineKeys=Object.keys(item.Machines);
      for(var j=0;j<machineKeys.length;j++){
      var machineTimes=item.Machines[machineKeys[j]];
      var machineTimesKeys=Object.keys(machineTimes);  
       var arrToPush=[ keys[i],machineKeys[j]];
       var botandbatch = [[1],[2]]; 
        for(var mt=0;mt<existingTimes.length;mt++){
          if(machineTimes[mt]){
            var batch=Object.keys(machineTimes[mt]);
            arrToPush.push(orders[batch[0]].orderID+'/'+batch[0]+' '+orders[batch[0]].productdescription);
            botandbatch.push([batch[0],machineTimes[mt][batch[0]].bottles]);
          }else{
            arrToPush.push('');
            botandbatch.push([]);
          }
        }
      arr.push(arrToPush);
        botandbatchLarge.push(botandbatch);
      }
    }
    }
  }
    }
  
    return [arr,botandbatchLarge];
  
}

function getSelectedSchedules(selected){
  var active=[];
  var batches=[];
  var existingTimes = [];
  for (var i = 0; i < 1440; i++) {
    existingTimes.push(i );
  }
  //sortSchedulesArr
  var orders=base.getData('Production');
  var schedules=base.getData('Schedules');
  for(var s=0;s<selected.length;s++){
    var item=base.getData('Schedules Reference/'+selected[s]);
    var BatchKeys=Object.keys(item.Batches);
    for(var b=0;b<BatchKeys.length;b++){
      var BatchItem=item.Batches[BatchKeys[b]];
      var scheduleIDs=BatchItem.schedule_ID;
      scheduleIDs=scheduleIDs.split(',');
      for(var i=0;i<scheduleIDs.length;i++){
        active.push(parseInt(scheduleIDs[i],10))
       
      }
     batches.push(BatchKeys[b]);
    }
    
  }
  active=uniq(active);
  active=active.sort();
 
  batches=uniq(batches);
  var arr=[];
    var botandbatchLarge = [];
  for(var a=0;a<active.length;a++){
  var item=schedules[active[a].toString()];
    if(item){
    item.id=active[a];
    var machineKeys=Object.keys(item.Machines);
    for(var j=0;j<machineKeys.length;j++){
      var machineTimes=item.Machines[machineKeys[j]];
      var machineTimesKeys=Object.keys(machineTimes);  
      var arrToPush=[active[a],machineKeys[j]];
      var botandbatch = [[1],[2]]; 
      for(var mt=0;mt<existingTimes.length;mt++){
        if(machineTimes[mt]){
          var batch=Object.keys(machineTimes[mt]);
          if(batches.indexOf(batch[0])>=0){
          arrToPush.push(orders[batch[0]].orderID+'/'+batch[0]+' '+orders[batch[0]].productdescription);
           botandbatch.push([batch[0],machineTimes[mt][batch[0]].bottles]);
          }else{
           arrToPush.push('');
           botandbatch.push([]);
          }
        }else{
          arrToPush.push('');
          botandbatch.push([]);
        }
      }
      arr.push(arrToPush);
       botandbatchLarge.push(botandbatch);
    }
  }
  }
  
  
  return [arr,botandbatchLarge];
  
}


function formSimplePrint(printKeys,printValues,allMachines){
  var header = ['Date','Machine','Info','Bottles Total','Time']
  var data = [header];
  printKeys.map(function(item,index){
    var date = item[0];
    var machineID = item[1];
    var formatDate = formatDateDisplay(parseInt(date,10));
    var machineName = allMachines[item[1]] ? allMachines[item[1]].name : '';
    var itemValues =  JSON.parse(JSON.stringify(item)).slice(2, item.length);
    var printValuesSub = JSON.parse(JSON.stringify(printValues[index])).slice(2, item.length);
    var groups = {};
    var timeFrom = 0;
    var timeTo = 0;
    var currentItem = null;
    itemValues.map(function(val,ind){
       if(val){
    if(!groups[val]){
    groups[val] = {
    timeFrom:timeFrom,
        minTotal:1,
    name:val,
    bottles:printValuesSub[ind][1],
    times:[ind]
  }
                }else{
               groups[val].bottles += printValuesSub[ind][1]
                 groups[val].minTotal ++;
                  groups[val].times.push(ind);
                }
    
    
           
       }
    timeFrom++;
    });
  
  Object.keys(groups).map(function(key){
    var row = [formatDate,machineName,key,groups[key].bottles,formTimeForGroup(groups[key].timeFrom,groups[key].minTotal,groups[key].times)];
    data.push(row)
  })
  })
  return data;
}

function formTimeForGroup(from,mins,times){
var date= new Date().setUTCHours(0,0,0,0);

var groupedTimes = groupSequentialTimes (times)
var times = groupedTimes.map(function(timesList){
  var startData= new Date(date);
  var ds = new Date(startData);
  ds.setMinutes( ds.getMinutes() + timesList[0] );
  
  var de = new Date(startData);
  de.setMinutes( de.getMinutes() + timesList[timesList.length-1] );
  return formatAMPM2(ds)+' - '+formatAMPM2(de)
}).join(', ');
 return times;
}


function groupSequentialTimes (times) {
  return times.reduce(function (memo, time, i) {
    if (i === 0) {
      memo.push([time])
      return memo
    }
    if (times[i - 1] + 1 !== time) memo.push([])
    memo[memo.length - 1].push(time)
    return memo
  }, [])
}

