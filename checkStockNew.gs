function checkStockNew(BATCHES,escapePrint) {
    var failMSG = '';

    Logger.log(BATCHES);

    var results = [];
//    BATCHES = ["940008"];
    var requiredFlavour = 0;
    var requiredVG = 0;
    var requiredPG = 0;
    var requiredNico = 0;
    var requiredNicosalts = 0;
    var requiredCBD = 0;
    var requiredMCT = 0;
    var requiredAG = 0;
    var requiredColors = 0;
    var requiredLids = 0;
    var requiredBottles = 0;
    var requiredPremix = 0;
    var requiredUbottles = 0;
    var requiredBbottles = 0;
    var requiredBoxes = 0;
    var requiredTubes = 0;

    var availableFlavour = 0;
    var availableVG = 0;
    var availablePG = 0;
    var availableNico = 0;
    var availableNicosalts = 0;
    var availableCBD = 0;
    var availableMCT = 0;
    var availableAG = 0;
    var availableColors = 0;
    var availableLids = 0;
    var availableBottles = 0;
    var availablePremix = 0;
    var availableUbottles = 0;
    var availableBbottles = 0;
    var availableBoxes = 0;
    var availableTubes = 0;
    var colorsArr = [];
    var flavoursArr = [];
    var LidsArr = [];
    var PremixArr = [];
    var BottlesArr = [];
    var UbottlesArr = [];
    var BbottlesArr = [];
    var BoxesArr = [];
    var PackedArr = [];
    var BoxArr = [];
    var TubesArr = [];
    var LabelsArr = [];
    var InkArr = [];

    var OrigInkArr = [];
    var OrigTubesArr = [];
    var OrigLabelsArr = [];
    var OrigBoxArr = [];
    var OrigColorsArr = [];
    var OrigFlavoursArr = [];
    var OrigPmixArr = [];
    var OrigBottlesArr = [];
    var OrigUbottlesArr = [];
    var OrigBbottlesArr = [];
    var OrigBoxesArr = [];
    var OrigPackedArr = [];
    var OrigLidsArr = [];
    var OrigPackedArr = [];

    var VGCheck = base.getData('Misc/VG');
    var PGCheck = base.getData('Misc/PG');
    var AGCheck = base.getData('Misc/AG');
    var NicotCheck = base.getData('Misc/Nicotine');
    var NicotChecksalts = base.getData('Misc/Nicotine Salts');
    var CBDCheck = base.getData('Misc/CBD');
    var MCTCheck = base.getData('Misc/MCT');
    availableVG = VGCheck.Running || 0;
    availablePG = PGCheck.Running || 0;
    availableAG = AGCheck.Running || 0;
    availableNico = NicotCheck.Running || 0;
    availableNicosalts = NicotChecksalts.Running || 0;
    availableCBD = CBDCheck.Running || 0;
    availableMCT = MCTCheck.Running || 0;
    var totalUsage = [];
    var totalMissing = [];
    for (var i = 0; i < BATCHES.length; i++) {
        try {
            var data = base.getData('Orders/' + BATCHES[i]);
            data.order = JSON.parse(JSON.stringify(data));
            var qtyMap = new qtyDatabase();
            data.qtyMap = qtyMap;

            var resp = runBatchCheckStock(data);
            totalUsage = totalUsage.concat(resp.LOG);
            totalMissing = totalMissing.concat(resp.NEGATIVELOG);
        } catch (e) {
            failMSG += "Failed for: " + BATCHES[i] + ' Reason: ' + e.toString() + '<br/>';

        }

    }
    var dataArr = [];
    var start = makeArr(5, '');
    var formattedDate = Utilities.formatDate(new Date(), "GMT", "dd-MM-yyyy");
    start[0] = 'NEW LOG ' + formattedDate + ': '+BATCHES.join();
    dataArr.push(start);
    var blankArr = makeArr(5, '');

    var renderSequence = ['Misc', 'Flavours', 'Color', 'BottleTypes', 'Lids', 'PremixesTypes', 'UnbrandedTypes', 'BrandedTypes', 'Packages', 'Boxes', 'Labels'];
   totalMissing.map(function(item){
    return item.value = Math.abs(item.value);
  })
    for (var i = 0; i < renderSequence.length; i++) {
        dataArr.push(blankArr);
        var headArr = JSON.parse(JSON.stringify(blankArr));
        headArr[0] = renderSequence[i];
        dataArr.push(headArr);
        var tabData = base.getData(renderSequence[i]);
        var usageArrResp = findUsageItemList(renderSequence[i], totalUsage);
        var usageArr = usageArrResp.filtered;
        totalUsage = usageArrResp.newArr;
        var missingArrResp = findUsageItemList(renderSequence[i], totalMissing);
        var missingArr = missingArrResp.filtered;
        totalMissing = missingArrResp.newArr;
        while (usageArr.length) {
            var row = [];
            var usageItemsResp = findUsageItem(usageArr[0].tab, usageArr[0].sku, usageArr);
            var usageItems = usageItemsResp.filtered;
            usageArr = usageItemsResp.newArr;
            row.push(usageItems[0].name);
            var totalUsageValue = usageItems.reduce(function(total, item) {
                return {
                    value: total.value + item.value
                }
            });
            var running = tabData[usageItems[0].sku] ? tabData[usageItems[0].sku].Running ? tabData[usageItems[0].sku].Running : 0 : 0;
             
            
            var missingItemsResp = findUsageItem(usageItems[0].tab, usageItems[0].sku, missingArr);
            var missingItems = missingItemsResp.filtered;
            missingArr = missingItemsResp.newArr;
            var totalMissingValue = missingItems.length ? missingItems.reduce(function(total, item) {
                return {
                    value: total.value +item.value
                }
            }) : {value:0};
          
            row.push(+(totalUsageValue.value - totalMissingValue.value).toFixed(12));
            row.push(+(running).toFixed(12));
            row.push(+(totalMissingValue.value).toFixed(12));
            row.push(+(totalUsageValue.value).toFixed(12));

            dataArr.push(row);
        }

        while (missingArr.length) {
            var row = [];
            var missingItemsResp = findUsageItem(missingArr[0].tab, missingArr[0].sku, missingArr);
            var missingItems = missingItemsResp.filtered;
            missingArr = missingItemsResp.newArr;
            var totalMissingValue = missingItems.reduce(function(total, item) {
                return {
                    value:total.value + item.value
                }
            });
            row.push(missingItems[0].name);
            var running = tabData[usageItems[0].sku] ? tabData[usageItems[0].sku].Running ? tabData[usageItems[0].sku].Running : 0 : 0;

            row.push(0);
            row.push(+(running).toFixed(12));

            row.push(+(totalMissingValue.value).toFixed(12));
            row.push(+(totalMissingValue.value).toFixed(12));
            dataArr.push(row);

        }
    }


  if(escapePrint){
  
    return {dataList:dataArr};
  }
    var sheet = SpreadsheetApp.openById(logSheet).getSheetByName('Sheet1');
    var lastRow = sheet.getLastRow() + 4;
    sheet.insertRowsAfter(sheet.getMaxRows(), dataArr.length);
    sheet.getRange(sheet.getLastRow() + 4, 1, 1, 5).setBackground('#D9A744');
    sheet.getRange(sheet.getLastRow() + 4, 1, dataArr.length, 5).setValues(dataArr);

  return {dataList:dataArr, link:SpreadsheetApp.openById(logSheet).getUrl() + '&range=A'+ lastRow};
}

function findUsageItem(tab, sku, arr) {
    var filtered = arr.filter(function(item) {
        return tab == item.tab && sku == item.sku
    })
    var newArr = arr.filter(function(item) {
        return tab == item.tab && sku != item.sku
    })
    return {
        filtered: filtered,
        newArr: newArr
    };

}

function findUsageItemList(tab, arr) {
    var filtered = arr.filter(function(item) {
        return tab == item.tab
    });
    var newArr = arr.filter(function(item) {
        return tab != item.tab
    });

    return {
        filtered: filtered,
        newArr: newArr
    };

}

function makeArr(len, value) {
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(value);
    }
    return arr;
}
var qtyDatabase = function() {
    this.usage = {};
    this.data = {};
    this.missing = {};
    this.setData = function(page, value) {
        this.data[page] = value;
    }
    this.getData = function(page) {
        if (!this.data[page]) {
            var rawData = base.getData(page)
            var rawValue = rawData ? rawData.Running ? rawData.Running : 0 : 0;
            this.setData(page, rawValue);
        }
        return this.data[page]
    }
    this.setMissing = function(page, value) {
        var data = this.getData(page);
        this.missing[page] = data + Math.abs(value);
    }
    this.getNeg = function(page, value) {
        var data = this.getData(page);
        var res = data - value;
        this.setMissing(page, res);
        return res;
    }

}

function runBatchCheckStock(data) {
    try {
        var ORDER_FLOW = {
            hasNegative: false,
            LOGARR: [],
            USAGE: {},
            LOG: [],
            NEGATIVELOG: [],
        }

        var suffix = data.batch.substr(-1);
        var for_premixed_stock = suffix == PREMIX_STOCK_SUFFIX ? true : false;
        var for_unbranded_stock = suffix == UNBRANDED_STOCK_SUFFIX ? true : false;
        if (!for_unbranded_stock) {
            suffix = data.batch.substr(-2);
            for_unbranded_stock = suffix == UNBRANDED_STOCK_SUFFIX2 ? true : false;
        }
        var for_branded_stock = suffix == BRANDED_STOCK_SUFFIX ? true : false;

        if (for_premixed_stock) {


            if (data.checkUncolored) {
                var PMIXRUN = CheckPremixedStock(data);
                ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(PMIXRUN.LOGARR)
                ORDER_FLOW.LOG = ORDER_FLOW.LOG.concat(PMIXRUN.LOG)
                ORDER_FLOW.NEGATIVELOG = ORDER_FLOW.NEGATIVELOG.concat(PMIXRUN.NEGATIVELOG)
                ORDER_FLOW.USAGE = jsonConcat(ORDER_FLOW.USAGE, PMIXRUN.USAGE);
                ORDER_FLOW.hasNegative = PMIXRUN.hasNegative;
                ORDER_FLOW.hasFailed = PMIXRUN.hasFailed;
            } else {
                if (data.recipe.Color) {
                    ORDER_FLOW.USAGE.Color = {
                        sku: data.recipe.Color.sku,
                        name: data.recipe.Color.name,
                        qty: data.colorval,
                    };
                    var obj = {
                        displayGroup: 'Colors',
                        tab: 'Color',
                        sku: data.recipe.Color.sku,
                        name: data.recipe.Color.name,
                        value: data.colorval
                    }
                    ORDER_FLOW.LOG.push(obj);
                    ORDER_FLOW.LOGARR.push(['Color - ' + data.recipe.Color.sku, data.colorval]);
                    var neg = data.qtyMap.getNeg("Color/" + data.recipe.Color.sku, data.colorval)

                    if (neg < 0) {
                        ORDER_FLOW.hasNegative = true;
                        var newObj = JSON.parse(JSON.stringify(obj))
                        newObj.value = neg;
                        ORDER_FLOW.NEGATIVELOG.push(newObj);
                    }
                }
                ORDER_FLOW.LOGARR.push(['Order Type:', 'Premix Stock']);

                ORDER_FLOW.USAGE.Mixing = {
                    vg: data.VGrecipe,
                    pg: data.PGrecipe,
                    mct: data.MCTrecipe,
                    nic: data.Nicotrecipe,
                    nicsalt: data.Nicotrecipesalts,
                    cbd: data.CBDrecipe,
                };
                ORDER_FLOW.USAGE.Flavour = {
                    sku: data.flavour.sku,
                    name: data.flavour.name,
                    qty: data.flavrecipe,
                };
                var obj = {
                    displayGroup: 'Flavours',
                    tab: 'Flavours',
                    sku: data.flavour.sku,
                    name: data.flavour.name,
                    value: data.flavrecipe
                }
                ORDER_FLOW.LOG.push(obj);
                var neg = data.qtyMap.getNeg('Flavours/' + data.flavour.sku, data.flavrecipe);
                if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }
                ORDER_FLOW.LOGARR.push(['Flavour ' + data.flavour.sku, data.flavrecipe]);
                if (neg < 0) {
                    var baseFlavour = base.getData('Flavours/' + data.flavour.sku);
                    if (baseFlavour) {
                        if (baseFlavour.type === 'mix') {
                            obj.displayGroup = 'Flavour Mix'
                            ORDER_FLOW.hasNegative = true;
                            var newObj = JSON.parse(JSON.stringify(obj))
                            newObj.value = neg;
                            ORDER_FLOW.NEGATIVELOG.push(newObj);

                            var flavourMix = base.getData('FlavourMixes/' + data.flavour.sku);
                            if (flavourMix) {
                                var flavourValue = Math.abs(neg);
                                var flavourList = JSONtoARR(flavourMix.flavours);
                                for (var f = 0; f < flavourList.length; f++) {
                                    var rawValue = (flavourValue * (flavourList[f].val / 10))
                                    var listItemValue = parseFloat(parseFloat(rawValue).toFixed(2));
                                    ORDER_FLOW.USAGE.Flavour = {
                                        sku: flavourList[f].sku,
                                        name: flavourList[f].name,
                                        qty: listItemValue,
                                    };
                                    data.used.push(['Flavours/', flavourList[f].sku, listItemValue]);
                                    var obj = {
                                        displayGroup: 'Flavours',
                                        tab: 'Flavours',
                                        sku: flavourList[f].sku,
                                        name: flavourList[f].name,
                                        value: listItemValue
                                    }
                                    ORDER_FLOW.LOG.push(obj);
                                    ORDER_FLOW.LOGARR.push(['Flavour:', listItemValue]);
                                    var neg = data.qtyMap.getNeg('Flavours/' + flavourList[f].sku, listItemValue);

                                    if (neg < 0) {
                                        ORDER_FLOW.hasNegative = true;
                                        var newObj = JSON.parse(JSON.stringify(obj))
                                        newObj.value = neg;
                                        ORDER_FLOW.NEGATIVELOG.push(newObj);
                                    }
                                }

                            }


                        } else {
                            ORDER_FLOW.hasNegative = true;
                            var newObj = JSON.parse(JSON.stringify(obj))
                            newObj.value = neg;
                            ORDER_FLOW.NEGATIVELOG.push(newObj);

                        }

                    }
                }

                var obj = {
                    displayGroup: 'Misc',
                    tab: 'Misc',
                    sku: 'VG',
                    name: 'VG',
                    value: data.VGrecipe
                }
                ORDER_FLOW.LOG.push(obj);
                var neg = data.qtyMap.getNeg("Misc/VG", data.VGrecipe);
                if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }
                ORDER_FLOW.LOGARR.push(['VG:', data.VGrecipe]);
                var obj = {
                    displayGroup: 'Misc',
                    tab: 'Misc',
                    sku: 'PG',
                    name: 'PG',
                    value: data.PGrecipe
                }
                ORDER_FLOW.LOG.push(obj);
                var neg = data.qtyMap.getNeg("Misc/PG", data.PGrecipe);
                if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }
                ORDER_FLOW.LOGARR.push(['PG:', data.PGrecipe]);

                var obj = {
                    displayGroup: 'Misc',
                    tab: 'Misc',
                    sku: 'MCT',
                    name: 'MCT',
                    value: data.MCTrecipe
                }
                ORDER_FLOW.LOG.push(obj);
                var neg = data.qtyMap.getNeg("Misc/MCT", data.MCTrecipe);
                if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }
                ORDER_FLOW.LOGARR.push(['MCT:', data.MCTrecipe]);
                var obj = {
                    displayGroup: 'Misc',
                    tab: 'Misc',
                    sku: 'AG',
                    name: 'AG',
                    value: data.AGrecipe
                }
                ORDER_FLOW.LOG.push(obj);
                var neg = data.qtyMap.getNeg("Misc/AG", data.AGrecipe);
                if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }
                ORDER_FLOW.LOGARR.push(['AG:', data.AGrecipe]);
                if (data.Nicotrecipe) {
                    ORDER_FLOW.LOGARR.push(['Nicotine:', data.Nicotrecipe]);
                    var obj = {
                        displayGroup: 'Misc',
                        tab: 'Misc',
                        sku: 'Nicotine',
                        name: 'Nicotine',
                        value: data.Nicotrecipe
                    }
                    ORDER_FLOW.LOG.push(obj);
                    var neg = data.qtyMap.getNeg("Misc/Nicotine", data.Nicotrecipe);
                    if (neg < 0) {
                        ORDER_FLOW.hasNegative = true;
                        var newObj = JSON.parse(JSON.stringify(obj))
                        newObj.value = neg;
                        ORDER_FLOW.NEGATIVELOG.push(newObj);
                    }
                }

                if (data.Nicotrecipesalts) {
                    ORDER_FLOW.LOGARR.push(['Nicotine Salts:', data.Nicotrecipesalts]);
                    var obj = {
                        displayGroup: 'Misc',
                        tab: 'Misc',
                        sku: 'Nicotine Salts',
                        name: 'Nicotine Salts',
                        value: data.Nicotrecipesalts
                    }
                    ORDER_FLOW.LOG.push(obj);
                    var neg = data.qtyMap.getNeg("Misc/Nicotine Salts", data.Nicotrecipesalts);
                    if (neg < 0) {
                        ORDER_FLOW.hasNegative = true;
                        var newObj = JSON.parse(JSON.stringify(obj))
                        newObj.value = neg;
                        ORDER_FLOW.NEGATIVELOG.push(newObj);
                    }
                }
                if (data.CBDrecipe) {
                    ORDER_FLOW.LOGARR.push(['CBD:', data.CBDrecipe]);
                    var obj = {
                        displayGroup: 'Misc',
                        tab: 'Misc',
                        sku: 'CBD',
                        name: 'CBD',
                        value: data.CBDrecipe
                    }
                    ORDER_FLOW.LOG.push(obj);
                    var neg = data.qtyMap.getNeg("Misc/CBD", data.CBDrecipe);
                    if (neg < 0) {
                        ORDER_FLOW.hasNegative = true;
                        var newObj = JSON.parse(JSON.stringify(obj))
                        newObj.value = neg;
                        ORDER_FLOW.NEGATIVELOG.push(newObj);
                    }
                }


            }



        } else if (for_unbranded_stock) {
            ORDER_FLOW.LOGARR.push(['Order Type:', 'Unbranded Stock']);

            //Check premix
            //If premix == curent, move to production
            //if premix < current, move premix to preduction, createMixOrder(required-premixed)
            //If premix > current, moce premix-required to production, substract required from premix
            //checkpremix(current_row,recipe,flavour,order_date,required,original_required,order_batch,priority,bottles,order_bottle_type,order_cap_type,packaging,customer,order_brand,last_unbranded_bottlestock_row,last_branded_bottlestock_row,flavvalue,vg,pg,nicot);

            var PMIXRUN = CheckPremixedStock(data);
            ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(PMIXRUN.LOGARR)
            ORDER_FLOW.LOG = ORDER_FLOW.LOG.concat(PMIXRUN.LOG)
            ORDER_FLOW.NEGATIVELOG = ORDER_FLOW.NEGATIVELOG.concat(PMIXRUN.NEGATIVELOG)
            ORDER_FLOW.USAGE = jsonConcat(ORDER_FLOW.USAGE, PMIXRUN.USAGE);
            ORDER_FLOW.hasNegative = PMIXRUN.hasNegative;
            ORDER_FLOW.hasFailed = PMIXRUN.hasFailed;
            //  LOGARR = LOGARR.concat(CheckPremixed(data));

        } else if (for_branded_stock) {
            ORDER_FLOW.LOGARR.push(['Order Type:', 'Branded Stock']);



            //checkunbranded(current_row,recipe,flavour,order_date,required,original_required,order_batch,priority,bottles,order_bottle_type,order_cap_type,packaging,customer,order_brand,last_unbranded_bottlestock_row,last_branded_bottlestock_row,flavvalue,vg,pg,nicot);
            ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(generateForSingleBrand2(data.productcode, data.productdescription));
            var UNBRRUN = CheckUnbrandedStock(data);
            ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(UNBRRUN.LOGARR)
            ORDER_FLOW.LOG = ORDER_FLOW.LOG.concat(UNBRRUN.LOG)
            ORDER_FLOW.NEGATIVELOG = ORDER_FLOW.NEGATIVELOG.concat(UNBRRUN.NEGATIVELOG)
            ORDER_FLOW.USAGE = jsonConcat(ORDER_FLOW.USAGE, UNBRRUN.USAGE);
            ORDER_FLOW.hasNegative = UNBRRUN.hasNegative;
            ORDER_FLOW.hasFailed = UNBRRUN.hasFailed;
            //LOGARR = LOGARR.concat(CheckUnbranded(data));

        } //end for branded stock
        else {
            ORDER_FLOW.LOGARR.push(['Order Type:', 'Customer Order']);


            ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(generateForSingleBrand2(data.productcode, data.productdescription));
            var BRRUN = CheckBrandedStock(data);
            ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(BRRUN.LOGARR)
            ORDER_FLOW.LOG = ORDER_FLOW.LOG.concat(BRRUN.LOG)
            ORDER_FLOW.NEGATIVELOG = ORDER_FLOW.NEGATIVELOG.concat(BRRUN.NEGATIVELOG)
            ORDER_FLOW.USAGE = jsonConcat(ORDER_FLOW.USAGE, BRRUN.USAGE);
            ORDER_FLOW.hasNegative = BRRUN.hasNegative;
            ORDER_FLOW.hasFailed = BRRUN.hasFailed;

        } //end custom 
        //return 'success';
        return ORDER_FLOW;
    } catch (e) {
        ORDER_FLOW.LOGARR.push(['FAILED', e.message]);
        return ORDER_FLOW;

    }
}