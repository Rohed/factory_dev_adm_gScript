function fromRunningtoReserved(item, value){

var orig1=base.getData(item+"/Running");
var orig2=base.getData(item+"/Reserved");

var data1={
Running:orig1-value

};
var data2={
Reserved:orig2+value

};
base.updateData(item,data1);
base.updateData(item,data2);
if(data1.Running>=0){
return 1;
}else{
return data1.Running;
}
}



function fromReservedtoCompleted(item, value){

var orig1=base.getData(item+"/Reserved");
var orig2=base.getData(item+"/Completed");

var data1={
Reserved:orig1-value

};
var data2={
Completed:orig2+value

};
base.updateData(item,data1);
base.updateData(item,data2);

}


function toRunning(page,value){


        var orig =base.getData(page+'/Running');

        var dat1={
        'Running':orig+value
        };
        base.updateData(page,dat1);
     
}

//Premix move
function PtoRunning(batch,value){


        var orig =base.getData('PremixesTypes/'+batch+'/Running');
        var dat1={
        'Running':orig+value
        };
        base.updateData('PremixesTypes/'+batch,dat1);
     
}


function PtoReserved(batch,value){

        var orig =base.getData('PremixesTypes/'+batch+'/Running');
        var dat1={
        'Running':orig-value
        };
        base.updateData('PremixesTypes/'+batch,dat1);
        
        
        var orig2 =base.getData('PremixesTypes/'+batch+'/Reserved');
        var dat2={
        'Reserved':orig2+value
        };
        base.updateData('PremixesTypes/'+batch,dat2);
     


}


function PtoComplete(batch,value){

        var orig =base.getData('PremixesTypes/'+batch+'/Reserved');
        var dat1={
        'Reserved':orig-value
        };
        base.updateData('PremixesTypes/'+batch,dat1);
        
        
        var orig2 =base.getData('PremixesTypes/'+batch+'/Completed');
        var dat2={
        'Completed':orig2+value
        };
        base.updateData('PremixesTypes/'+batch,dat2);

}


//Unbranded Move
function UtoRunning(batch,value){
        var orig =base.getData('UnbrandedTypes/'+batch+'/Running');
        var dat1={
        'Running':orig+value
        };
        base.updateData('UnbrandedTypes/'+batch,dat1);
     
}



function UtoReserved(batch,value){
        var orig =base.getData('UnbrandedTypes/'+batch+'/Running');
        var dat1={
        'Running':orig-value
        };
        base.updateData('UnbrandedTypes/'+batch,dat1);
        
        
        var orig2 =base.getData('UnbrandedTypes/'+batch+'/Reserved');
        var dat2={
        'Reserved':orig2+value
        };
        base.updateData('UnbrandedTypes/'+batch,dat2);
     

}


function UtoComplete(batch,value){
     var orig =base.getData('UnbrandedTypes/'+batch+'/Reserved');
        var dat1={
        'Reserved':orig-value
        };
        base.updateData('UnbrandedTypes/'+batch,dat1);
        
        
        var orig2 =base.getData('UnbrandedTypes/'+batch+'/Completed');
        var dat2={
        'Completed':orig2+value
        };
        base.updateData('UnbrandedTypes/'+batch,dat2);
}


function BtoRunning(batch,value){
        var orig =base.getData('BrandedTypes/'+batch+'/Running');
        if(orig){
        var dat1={
        'Running':orig+value
        };
        }else{
         var dat1={
        'Running':value
        };
        }
        base.updateData('BrandedTypes/'+batch,dat1);
     
}

function BtoReserved(batch,value){
        var orig =base.getData('BrandedTypes/'+batch+'/Running');
        var dat1={
        'Running':orig-value
        };
        base.updateData('BrandedTypes/'+batch,dat1);
        
        
        var orig2 =base.getData('BrandedTypes/'+batch+'/Reserved');
        var dat2={
        'Reserved':orig2+value
        };
        base.updateData('BrandedTypes/'+batch,dat2);
     
}


function BtoComplete(batch,value){
     var orig =base.getData('BrandedTypes/'+batch+'/Reserved');
        var dat1={
        'Reserved':orig-value
        };
        base.updateData('BrandedTypes/'+batch,dat1);
        
        
        var orig2 =base.getData('BrandedTypes/'+batch+'/Completed');
        var dat2={
        'Completed':orig2+value
        };
        base.updateData('BrandedTypes/'+batch,dat2);
}
function BtoRunning1(batch,value){
batch+=' 1packed Tube';
        var orig =base.getData('BrandedTypes/'+batch+'/Running');
         if(orig){
        var dat1={
        'Running':orig+value
        };
        }else{
         var dat1={
        'Running':value
        };
        }
        base.updateData('BrandedTypes/'+batch,dat1);
     
}

function BtoReserved1(batch,value){
batch+=' 1packed Tube';
        var orig =base.getData('BrandedTypes/'+batch+'/Running');
        var dat1={
        'Running':orig-value
        };
        base.updateData('BrandedTypes/'+batch,dat1);
        
        
        var orig2 =base.getData('BrandedTypes/'+batch+'/Reserved');
        var dat2={
        'Reserved':orig2+value
        };
        base.updateData('BrandedTypes/'+batch,dat2);
     
}


function BtoComplete1(batch,value){
batch+=' 1packed Tube';

     var orig =base.getData('BrandedTypes/'+batch+'/Reserved');
       Logger.log(orig);
        var dat1={
        'Reserved':orig-value
        };
        Logger.log(dat1.Reserved);
        base.updateData('BrandedTypes/'+batch,dat1);
        
        
        var orig2 =base.getData('BrandedTypes/'+batch+'/Completed');
        var dat2={
        'Completed':orig2+value
        };
        base.updateData('BrandedTypes/'+batch,dat2);
}

function BtoRunning3(batch,value){
batch+=' 3packed Tube';
        var orig =base.getData('BrandedTypes/'+batch+'/Running');
          if(orig){
        var dat1={
        'Running':orig+value
        };
        }else{
         var dat1={
        'Running':value
        };
        }
        base.updateData('BrandedTypes/'+batch,dat1);
     
}

function BtoReserved3(batch,value){
batch+=' 3packed Tube';
        var orig =base.getData('BrandedTypes/'+batch+'/Running');
        var dat1={
        'Running':orig-value
        };
        base.updateData('BrandedTypes/'+batch,dat1);
        
        
        var orig2 =base.getData('BrandedTypes/'+batch+'/Reserved');
        var dat2={
        'Reserved':orig2+value
        };
        base.updateData('BrandedTypes/'+batch,dat2);
     
}


function BtoComplete3(batch,value){
batch+=' 3packed Tube';
     var orig =base.getData('BrandedTypes/'+batch+'/Reserved');
        var dat1={
        'Reserved':orig-value
        };
        base.updateData('BrandedTypes/'+batch,dat1);
        
        
        var orig2 =base.getData('BrandedTypes/'+batch+'/Completed');
        var dat2={
        'Completed':orig2+value
        };
        base.updateData('BrandedTypes/'+batch,dat2);
}



function BtoRunningX(batch,value){

        var orig =base.getData('BrandedTypes/'+batch+'/Running');
          if(orig){
        var dat1={
        'Running':orig+value
        };
        }else{
         var dat1={
        'Running':value
        };
        }
        base.updateData('BrandedTypes/'+batch,dat1);
     
}



function BtoCompleteX(batch,value){

     var orig =base.getData('BrandedTypes/'+batch+'/Reserved');
        var dat1={
        'Reserved':orig-value
        };
        base.updateData('BrandedTypes/'+batch,dat1);
        
        
        var orig2 =base.getData('BrandedTypes/'+batch+'/Completed');
        var dat2={
        'Completed':orig2+value
        };
        base.updateData('BrandedTypes/'+batch,dat2);
}





function fromReservedToRunning(batch,value){

var orig1=base.getData(batch+"/Running");
var orig2=base.getData(batch+"/Reserved");

var data1={
Running:orig1+value

};
var data2={
Reserved:orig2-value

};
base.updateData(batch,data1);
base.updateData(batch,data2);


}


function fromCompletedToRunning(batch,value){

var orig1=base.getData(batch+"/Running");
var orig2=base.getData(batch+"/Completed");

var data1={
Running:orig1+value

};
var data2={
Completed:orig2-value

};
base.updateData(batch,data1);
base.updateData(batch,data2);


}
function removeFromRunning(batch,value){

var orig1=base.getData(batch+"/Running");

var data1={
Running:orig1-value

};

base.updateData(batch,data1);

}