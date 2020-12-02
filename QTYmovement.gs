function fromRunningtoReserved(item, value) {
    if (isNaN(value)) {
        value = 0;
    }
    var orig1 = base.getData(item);
    if (orig1) {
        orig1.Running = orig1.Running - value;
        orig1.Reserved = orig1.Reserved + value;

        base.updateData(item, orig1);

        if (orig1.Running >= 0) {
            return 1;
        } else {
            return orig1.Running;
        }
    } else {
        return -404
    }
}



function fromReservedtoCompleted(item, value) {
    if (isNaN(value)) {
        value = 0;
    }
    var orig1 = base.getData(item);
    if (orig1) {
        orig1.Reserved = orig1.Reserved - value;
        orig1.Completed = orig1.Completed + value;

        base.updateData(item, orig1);
    }
}


function toRunning(page, value) {

    if (isNaN(value)) {
        value = 0;
    }
    var orig = base.getData(page);
    if (orig) {
        orig.Running = orig.Running + value;

        base.updateData(page, orig);
    }
}

//Premix move
function PtoRunning(batch, value) {

    if (isNaN(value)) {
        value = 0;
    }
    var orig = base.getData('PremixesTypes/' + batch);
    orig.Running += value;
    base.updateData('PremixesTypes/' + batch, orig);

}


function PtoReserved(batch, value) {
    if (isNaN(value)) {
        value = 0;
    }
    var orig = base.getData('PremixesTypes/' + batch);
    orig.Running -= value;
    orig.Reserved += value;

    base.updateData('PremixesTypes/' + batch, orig);

}


function PtoComplete(batch, value) {
    if (isNaN(value)) {
        value = 0;
    }
    var orig = base.getData('PremixesTypes/' + batch);
    orig.Reserved -= value;
    orig.Completed += value;

    base.updateData('PremixesTypes/' + batch, orig);


}


//Unbranded Move
function UtoRunning(batch, value) {
    if (isNaN(value)) {
        value = 0;
    }
    var orig = base.getData('UnbrandedTypes/' + batch);
    orig.Running += value;
    base.updateData('UnbrandedTypes/' + batch, orig);

}



function UtoReserved(batch, value) {
    var orig = base.getData('UnbrandedTypes/' + batch);
    orig.Running -= value;
    orig.Reserved += value;
    base.updateData('UnbrandedTypes/' + batch, orig);


}


function UtoComplete(batch, value) {
    if (isNaN(value)) {
        value = 0;
    }
    var orig = base.getData('UnbrandedTypes/' + batch);
    orig.Reserved -= value;
    orig.Completed += value;
    base.updateData('UnbrandedTypes/' + batch, orig);

}


function BtoRunning(batch, value) {
    if (isNaN(value)) {
        value = 0;
    }
    var orig = base.getData('BrandedTypes/' + batch);
    if (orig) {
        if (orig) {
            orig.Running += value;
        } else {
            orig.Running = value;
        }
        base.updateData('BrandedTypes/' + batch, orig);
    }

}

function BtoReserved(batch, value) {
    if (isNaN(value)) {
        value = 0;
    }
    var orig = base.getData('BrandedTypes/' + batch);
    if (orig) {
        orig.Running -= value;

        orig.Reserved += value;

        base.updateData('BrandedTypes/' + batch, orig);
    }
}


function BtoComplete(batch, value) {
    if (isNaN(value)) {
        value = 0;
    }
    var orig = base.getData('BrandedTypes/' + batch);
    if (orig) {
        orig.Reserved -= value;

        orig.Completed += value;

        base.updateData('BrandedTypes/' + batch, orig);
    }
}




function BtoRunningX(batch, value) {
    if (isNaN(value)) {
        value = 0;
    }
    var orig = base.getData('BrandedTypes/' + batch);
    if (orig) {
        orig.Running += value;
    } else {
        orig.Running = value;
    }
    base.updateData('BrandedTypes/' + batch, orig);

}



function BtoCompleteX(batch, value) {
    if (isNaN(value)) {
        value = 0;
    }
    var orig = base.getData('BrandedTypes/' + batch);
    if (orig) {
        orig.Reserved -= value;

        orig.Completed += value;

        base.updateData('BrandedTypes/' + batch, orig);
    }
}




function fromReservedToRunning(batch, value) {
    if (isNaN(value)) {
        value = 0;
    }
    var orig1 = base.getData(batch);
    if (orig1) {
        orig1.Running += value;
        orig1.Reserved -= value;

        base.updateData(batch, orig1);
    }

}


function fromCompletedToRunning(batch, value) {
    if (isNaN(value)) {
        value = 0;
    }
    var orig1 = base.getData(batch);
    if (orig1) {
        orig1.Running += value;
        orig1.Completed -= value;

        base.updateData(batch, orig1);
    }

}

function removeFromRunning(batch, value) {
    if (isNaN(value)) {
        value = 0;
    }
    var orig1 = base.getData(batch);
    if (orig1) {
        orig1.Running -= value;
        base.updateData(batch, orig1);
    }
}

function removeFromReserved(batch, value) {
    if (isNaN(value)) {
        value = 0;
    }
    var orig1 = base.getData(batch);
    if (orig1) {
        orig1.Reserved -= value;
        base.updateData(batch, orig1);
    }
}