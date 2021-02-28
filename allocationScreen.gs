function getBatchesForAllocation() {
  var busyOrders = searchFor([['Orders',{equalTo: "In Progress",
                                         orderBy: "final_status"}]])
  var orderData = fetchOrderStatusesByPage(busyOrders[1]);
  
   return [orderData,'AllocationScreen']; 
}


function fetchOrderStatusesByPage(ordersList){
  var data = [];
  var batchList = ordersList.map(function(item){ return item.batch}).join('|');
  var rawSearch = [['Orders',{equalTo: "Not Run",
                                         orderBy: "final_status"}],['Orders',{equalTo: batchList,
                                         orderBy: "word"}]];
  
var pages=['Mixing','MixingTeam','PremixColoring','Production','Printing','Labelling','Packaging'];
  for(var i = 0 ; i < pages.length; i++){
    var searchParam = rawSearch;
    searchParam[0][0] = pages[i];
    searchParam[1][0] = pages[i];
    var batches = searchFor(searchParam);
    data.push({page:pages[i],batches:batches[1]});
  }

  
  return data;

}

function updateBatchVisibility(page,batch,isShown){
  
  try{
isShown = !isShown;
 var item = base.getData(page+'/'+batch);
 item.isShown = isShown;
 base.updateData(page+'/'+batch,item);
 
    return {isShown:isShown,page:page,batch:batch};
  }catch(e){
    return {error:e.message};
  }
}

function toggleAllAllocation(orders){
  var resp ={};
  orders.map(function(item){
    var result = updateBatchVisibility(item.page,item.batch,item.action)
    if(result.error){
      resp.error = true;
      resp.msg += result.error + '<br>'; 
    }
  });
  
  return resp;
}