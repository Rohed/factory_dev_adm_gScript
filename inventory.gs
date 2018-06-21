function addtoQTY(item){

try{
var invData=base.getData('Inventory/'+item);
var val=invData.quantity;
var dat1={
addedtoQTY:'Added'

};
var inventory=base.getData('Inventory');

if (inventory) {
        var result = Object.keys(inventory).map(function(key) {
            return [Number(key), inventory[key]];
        });
        
        
        var Rows=[];

        for (var i = 0; i < result.length; i++) {
          Rows.push(result[i][1].row);
        }
        
        var max = Rows.reduce(function(a, b) {
              return Math.max(a, b);
          });
  var dat1={
    addedtoQTY:'Added',
    row:max+1
    };
        
          
}else{

var dat1={
addedtoQTY:'Added',
row:1
};


}







base.updateData('Inventory/'+item,dat1);
  if (invData.page == 'PremixesTypes' || invData.page == 'UnbrandedTypes' || invData.page == 'BrandedTypes'|| invData.page == 'Packages'|| invData.page == 'Boxes'|| invData.page == 'Labels') {
  
    var identifier=invData.sku;
  } else {
    var identifier=invData.desc;

  }
var orig=base.getData(invData.page+'/'+identifier+'/Running');
if(orig){
var data={
Running:orig+val
};

}else{

var data={
Running:val
};


}
base.updateData(invData.page+'/'+identifier,data);


var orig=base.getData(invData.page+'/'+identifier+'/Stock');
if(orig){
var data={
Stock:orig+val
};

}else{

var data={
Stock:val
};


}
base.updateData(invData.page+'/'+identifier,data);
return "Item "+invData.desc+" Added to QTY Running"
}catch(e){return e.message};
}

function removefromInventory(identif,page){
try{

base.removeData('Inventory/'+identif.replace(/\//g,'').replace(/\./g,'').replace(/\$/g,'').replace(/\#/g,'').replace(/\:/g,'').replace(/\//g,''));


return "Item "+identif+" Removed";
}catch(e){
return e.message;
}

}

function removefromOrders(batch){
try{
base.removeData('Orders/'+batch);
return "Batch "+batch+" Removed";
}catch(e){
return e.message;
}

}

function getItemData(item){
var oldData=base.getData('Inventory/'+item.replace(/\//g,'').replace(/\./g,'').replace(/\$/g,'').replace(/\#/g,'').replace(/\:/g,'').replace(/\//g,''));
var data=getInventoryDescription();

return [data,oldData];




}