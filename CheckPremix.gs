function CheckPremixed(data) {
    var ORDER_FLOW = {
        hasNegative: data.hasNegative,
        LOGARR: [],
        USAGE: {},
        LOG: [],
        NEGATIVELOG: [],
    }
    try {

        var suffix = data.batch.substr(-1);
        var for_premixed_stock = suffix == PREMIX_STOCK_SUFFIX ? true : false;

        if (!data.used) {
            data.used = new Array();
        }
        var order = base.getData('Orders/' + data.batch);
        var premix = getPremixSKU(data, false);

        if (!for_premixed_stock) {
            toProduction(data);
            ORDER_FLOW.USAGE.Caps = {
                sku: data.lidSKU,
                name: data.lid,
                qty: data.bottles,
            };
            var obj = {
                displayGroup: 'Caps',
                tab: 'Lids',
                sku: data.lidSKU,
                name: data.lid,
                value: data.bottles
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['Sent to Production:', data.bottles]);
            data.used.push(['Lids/', data.lidSKU, data.bottles]);
            var neg = fromRunningtoReserved('Lids/' + data.lidSKU, data.bottles);
            ORDER_FLOW.LOGARR.push([data.lidSKU, data.bottles]);
           if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }

            ORDER_FLOW.USAGE.Bottles = {
                sku: data.botSKU,
                name: data.btype,
                qty: data.bottles,
            };
            data.used.push(['BottleTypes/', data.botSKU, data.bottles]);
            var neg = fromRunningtoReserved('BottleTypes/' + data.botSKU, data.bottles);
            var obj = {
                displayGroup: 'Bottles',
                tab: 'BottleTypes',
                sku: data.botSKU,
                name: data.btype,
                value: data.bottles
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push([data.botSKU, data.bottles]);
            if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }
        }
        if (data.recipe.Color) {
            ORDER_FLOW.USAGE.Color = {
                sku: data.recipe.Color.sku,
                name: data.recipe.Color.name,
                qty: data.QTY * 10 * data.recipe.Color.val,
            };
            data.used.push(['Color/', data.recipe.Color.sku, data.QTY * 10 * data.recipe.Color.val]);
            var obj = {
                displayGroup: 'Colors',
                tab: 'Color',
                sku: data.recipe.Color.sku,
                name: data.recipe.Color.name,
                value: data.QTY * 10 * data.recipe.Color.val
            }
            ORDER_FLOW.LOG.push(obj);
            LOGARR.push(['Color:', data.QTY * 10 * data.recipe.Color.val]);
            var neg = fromRunningtoReserved('Color/' + data.recipe.Color.sku, data.QTY * 10 * data.recipe.Color.val);
            if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }
            toPremixColoring(data);
        }


        var premixstock = base.getData("PremixesTypes/" + premix);
        var pom1 = premixstock.Reserved;

        if (premixstock.Running === undefined || premixstock.Running < 0) {
            premixstock.Running = 0;
        }
        var helper = premixstock.Running - data.QTY;
        if (helper == 0) {
            var dat3 = {
                premixed: premixstock.Running

            }
            premixstock.Running = 0;
            premixstock.Reserved = pom1 + data.QTY;

            ORDER_FLOW.USAGE.Premix = {
                sku: premix,
                name: premixstock.name,
                qty: data.QTY,
            };
            var obj = {
                displayGroup: 'Premix',
                tab: 'PremixesTypes',
                sku: premix,
                name: premixstock.name,
                value: data.QTY
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['Premix:', data.QTY]);
            if (dat3.premixed === undefined) {
                dat3.premixed = 0;
            }
            if (order.premixed) {
                dat3.premixed = dat3.premixed + order.premixed;
            }
            base.updateData('Orders/' + data.batch, dat3)
            base.updateData('PremixesTypes/' + premix, premixstock);
            data.tomixing = 0;



        } else if (helper > 0) {

            var dat3 = {
                premixed: data.QTY

            }
            premixstock.Running = helper;
            premixstock.Reserved = pom1 + data.QTY;
            ORDER_FLOW.USAGE.Premix = {
                sku: premix,
                name: premixstock.name,
                qty: data.QTY,
            };

            var obj = {
                displayGroup: 'Premix',
                tab: 'PremixesTypes',
                sku: premix,
                name: premixstock.name,
                value: data.QTY
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['Premix:', data.QTY]);
            if (dat3.premixed === undefined) {
                dat3.premixed = 0;
            }
            if (order.premixed) {
                dat3.premixed = dat3.premixed + order.premixed;
            }
            base.updateData('PremixesTypes/' + premix, premixstock);
            base.updateData('Orders/' + data.batch, dat3);
            data.tomixing = 0;



        } else if (helper < 0) {
            var dat3 = {
                premixed: premixstock.Running

            }
            premixstock.Reserved = pom1 + premixstock.Running;
            premixstock.Running = 0;
            ORDER_FLOW.USAGE.Premix = {
                sku: premix,
                name: premixstock.name,
                qty: dat3.premixed,
            };
            data.used.push(['PremixesTypes/', premix, dat3.premixed]);
            var obj = {
                displayGroup: 'Premix',
                tab: 'PremixesTypes',
                sku: premix,
                name: premixstock.name,
                value: dat3.premixed
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['Premix:', dat3.premixed]);
            if (dat3.premixed === undefined) {
                dat3.premixed = 0;
            }
            if (order.premixed) {
                dat3.premixed = dat3.premixed + order.premixed;
            }




            var newmixvol = data.QTY - dat3.premixed;
            base.updateData('PremixesTypes/' + premix, premixstock);
            base.updateData('Orders/' + data.batch, dat3)

            data.QTY = newmixvol;
            data.tomixing = 'Sent';
            var RU = getRoundups()[0];
            if (data.Nico || data.Nicosalts) {
                var rounded = Math.ceil(data.QTY / RU.nic) * RU.nic;

            } else {
                var rounded = Math.ceil(data.QTY / RU.cbd) * RU.cbd;

            }
            var order = base.getData('Orders/' + data.batch);
            if (data.QTY == 0 && order.premixed == 0 && order.unbranded == 0 && order.branded == 0 && order.backtubed == 0) {
                //returnData(data,0) 
                ORDER_FLOW.hasNegative = true;
                ORDER_FLOW.LOGARR.push(['ERROR WITH ORDER', data.QTY]);
                ORDER_FLOW.LOGARR.push(['ERROR WITH QTY', order.QTY]);
                ORDER_FLOW.LOGARR.push(['ERROR WITH premixed', order.premixed]);
                ORDER_FLOW.LOGARR.push(['ERROR WITH unbranded', order.unbranded]);
                ORDER_FLOW.LOGARR.push(['ERROR WITH branded', order.branded]);
                ORDER_FLOW.LOGARR.push(['ERROR WITH backtubed', order.backtubed]);
                ORDER_FLOW.LOGARR.push(['FAILED', 'DATA IS NULLED']);
            }

            var forpremix = rounded - data.QTY;



            if (forpremix > 0) {
                data.QTY = rounded;
                data.haspremix = true;
                data.dudpremixCode = data.batch + "RU";
                data.forpremix = forpremix;
                ORDER_FLOW.LOGARR.push(['Rounded with:', forpremix]);
            } else {

                data.haspremix = false;
            }

            ORDER_FLOW.USAGE.Flavour = {
                sku: data.flavour.sku,
                name: data.flavour.name,
                qty: data.flavvalue * data.QTY / 1000,
            };
            data.used.push(['Flavours/', data.flavour.sku, data.flavvalue * data.QTY / 1000]);
            var obj = {
                displayGroup: 'Flavours',
                tab: 'Flavours',
                sku: data.flavour.sku,
                name: data.flavour.name,
                value: data.flavvalue * data.QTY / 1000
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['Flavour:', data.flavvalue * data.QTY / 1000]);
            var flavourNeeded = +(data.flavvalue * data.QTY / 1000).toFixed(12)
            var neg = fromRunningtoReserved('Flavours/' + data.flavour.sku, flavourNeeded);
            var flavourValue = Math.abs(+(neg).toFixed(12));
          var flavourToReturn =+(flavourNeeded > flavourValue? flavourNeeded - flavourValue :flavourValue-  flavourNeeded).toFixed(12) ;
            if (neg < 0) {
                   
                  var baseFlavour = base.getData('Flavours/' + data.flavour.sku);
                  if(baseFlavour){
                    if(baseFlavour.type === 'mix'){
                      data.flavourMixPartsMissing =false;
                      data.isFlavourMix = true;
                       
                      data.mixAmountNeeded =parseFloat((parseFloat(flavourValue)*1000).toFixed(2)); 
                      obj.displayGroup = 'Flavour Mix'
                   
                      ORDER_FLOW.hasNegative = true;
                      var newObj = JSON.parse(JSON.stringify(obj))
                      newObj.value = neg;
                      ORDER_FLOW.NEGATIVELOG.push(newObj);
                      
                       var flavourMix = base.getData('FlavourMixes/' + data.flavour.sku);
                      if(flavourMix){
                       
                        var flavourList = JSONtoARR(flavourMix.flavours);
                           var flavourMixCodes = getFlavourMixCodes();
                        for(var f = 0; f < flavourList.length ;f++){
                          var rawValue = (flavourValue * ( flavourList[f].val/10))
                          var listItemValue =  parseFloat(parseFloat(rawValue).toFixed(2));
                          ORDER_FLOW.USAGE['Flavour_Mix_Item_'+(f+1)] = {
                            sku: flavourList[f].sku,
                            name: flavourList[f].name,
                            qty: listItemValue,
                          };
                          data.used.push(['Flavours/',flavourList[f].sku,listItemValue]);
                          var obj = {
                            displayGroup: 'Flavours',
                            tab: 'Flavours',
                            sku: flavourList[f].sku,
                            name: flavourList[f].name,
                            value: listItemValue
                          }
                          ORDER_FLOW.LOG.push(obj);
                          ORDER_FLOW.LOGARR.push(['Flavour:', listItemValue]);
                          var neg = fromRunningtoReserved('Flavours/' + flavourList[f].sku, listItemValue);
                          
                          if (neg < 0) {
                            data.flavourMixPartsMissing = true;
                            ORDER_FLOW.hasNegative = true;
                            var newObj = JSON.parse(JSON.stringify(obj))
                            newObj.value = neg;
                            ORDER_FLOW.NEGATIVELOG.push(newObj);
                          }else{
                            //TODO FIX DISPLAYED VALUE TO MATCH MG
                            // CHECK IF Showing missing flav mix, flavour
                            data[flavourMixCodes[f].name] = flavourList[f].name;
                            data[flavourMixCodes[f].sku] = flavourList[f].sku;
                            data[flavourMixCodes[f].val] =  parseFloat((parseFloat(rawValue)*1000).toFixed(2));
                          }
                        }
                        
                      }else{
                      
                      throw new Error('Flavour Mix '+data.flavour.sku+' not in database!'); 
                      }
                        
                      
                    }else{
                       ORDER_FLOW.hasNegative = true;
                      var newObj = JSON.parse(JSON.stringify(obj))
                      newObj.value = neg;
                      ORDER_FLOW.NEGATIVELOG.push(newObj);
               
                    }
                    
                  }
            }


            ORDER_FLOW.USAGE.Mixing = {
                vg: data.VGval * data.QTY,
            };

            data.used.push(['Misc/VG', '', data.VGval * data.QTY]);
            var obj = {
                displayGroup: 'Misc',
                tab: 'Misc',
                sku: 'VG',
                name: 'VG',
                value: data.VGval * data.QTY
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['VG:', data.VGval * data.QTY]);
            var neg = fromRunningtoReserved("Misc/VG", data.VGval * data.QTY);
           if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }
            ORDER_FLOW.USAGE.Mixing.pg = data.PGval * data.QTY;

            data.used.push(['Misc/PG', '', data.PGval * data.QTY]);
            var obj = {
                displayGroup: 'Misc',
                tab: 'Misc',
                sku: 'PG',
                name: 'PG',
                value: data.PGval * data.QTY
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['PG:', data.PGval * data.QTY]);
            var neg = fromRunningtoReserved("Misc/PG", data.PGval * data.QTY);
           if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }

            if (isNaN(data.AGval)) {
                data.AGval = 0;
            }

            ORDER_FLOW.USAGE.Mixing.ag = data.AGval * data.QTY;
            data.used.push(['Misc/AG', '', data.AGval * data.QTY]);
            var obj = {
                displayGroup: 'Misc',
                tab: 'Misc',
                sku: 'AG',
                name: 'AG',
                value: data.AGval * data.QTY
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['AG:', data.AGval * data.QTY]);
            var neg = fromRunningtoReserved("Misc/AG", data.AGval * data.QTY);
           if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }


            if (isNaN(data.MCTval)) {
                data.MCTval = 0;
            }
            ORDER_FLOW.USAGE.Mixing.mct = data.MCTval * data.QTY;
            data.used.push(['Misc/MCT', '', data.MCTval * data.QTY]);

            var obj = {
                displayGroup: 'Misc',
                tab: 'Misc',
                sku: 'MCT',
                name: 'MCT',
                value: data.MCTval * data.QTY
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['MCT:', data.MCTval * data.QTY]);
            var neg = fromRunningtoReserved("Misc/MCT", data.MCTval * data.QTY);
            if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }

            if (data.Nico) {
                ORDER_FLOW.USAGE.Mixing.nic = data.Nico * data.QTY;
                data.used.push(['Misc/Nicotine', '', data.Nico * data.QTY]);

                var obj = {
                    displayGroup: 'Misc',
                    tab: 'Misc',
                    sku: 'Nicotine',
                    name: 'Nicotine',
                    value: data.Nico * data.QTY
                }
                ORDER_FLOW.LOG.push(obj);


                ORDER_FLOW.LOGARR.push(['Nicotine:', data.Nico * data.QTY]);
                var neg = fromRunningtoReserved("Misc/Nicotine", data.Nico * data.QTY);
               if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }

            }

            if (data.Nicosalts) {
                ORDER_FLOW.USAGE.Mixing.nicsalt = data.Nicosalts * data.QTY;
                data.used.push(['Misc/Nicotine Salts', '', data.Nicosalts * data.QTY]);
                var obj = {
                    displayGroup: 'Misc',
                    tab: 'Misc',
                    sku: 'Nicotine Salts',
                    name: 'Nicotine Salts',
                    value: data.Nicosalts * data.QTY
                }
                ORDER_FLOW.LOG.push(obj);
                ORDER_FLOW.LOGARR.push(['Nicotine Salts:', data.Nicosalts * data.QTY]);
                var neg = fromRunningtoReserved("Misc/Nicotine Salts", data.Nicosalts * data.QTY);
                if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }

            }
            if (data.CBDvalue) {
                ORDER_FLOW.USAGE.Mixing.cbd = data.CBDvalue * data.QTY;
                data.used.push(['Misc/CBD', '', data.CBDvalue * data.QTY]);
                var obj = {
                    displayGroup: 'Misc',
                    tab: 'Misc',
                    sku: 'CBD',
                    name: 'CBD',
                    value: data.CBDvalue * data.QTY
                }
                ORDER_FLOW.LOG.push(obj);
                ORDER_FLOW.LOGARR.push(['CBD:', data.CBDvalue * data.QTY]);
                var neg = fromRunningtoReserved("Misc/CBD", data.CBDvalue * data.QTY);
                if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }


            }

          if(!ORDER_FLOW.hasNegative){
            ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(createMixOrder(data));
          }else if(ORDER_FLOW.hasNegative && data.isFlavourMix && data.isFlavourMix && data.flavourMixPartsMissing == false){
            var negativeItems = ORDER_FLOW.NEGATIVELOG.filter(function(obj){
              return obj.tab !== 'Flavours';
            });
            if(negativeItems.length === 0){
              
                 fromReservedToRunning('Flavours/' + data.flavour.sku, flavourNeeded);
              fromRunningtoReserved('Flavours/' + data.flavour.sku, flavourToReturn);
             ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(createMixOrder(data));
            }
          }

            //DUD Premix ORDER
            if (forpremix > 0 && !ORDER_FLOW.hasNegative) {
                var object = {
                    batch: data.batch + "RU",

                    orderdate: data.orderdate,
                    productcode: data.productcode,
                    productdescription: data.productdescription,
                    priority: data.priority,
                    customer: '',
                    brand: '',
                    flavour: data.flavour,
                    bottles: 0,
                    stocking: forpremix,
                    btype: '',
                    lid: '',
                    botSKU: '',
                    lidSKU: '',
                    packaging: '',
                    packagingType: {
                        name: '',
                        sku: '',
                    },
                    orderID: '',
                    fill: data.fill,
                };
                object.recipe = data.recipe;
                object.final_status = 'started';
                saveOrder(object);

            }
        }


        return ORDER_FLOW;
    } catch (e) {
        var dat1 = {
            final_status: 0,
            runtime: "",
            unbranded: 0,
            branded: 0,
            premixed: 0,
            coloredpremix: 0,
            mixing: 0,
            backtubed: 0,
        }

        base.updateData('Orders/' + data.batch, dat1);
        ORDER_FLOW.hasNegative = true;
        ORDER_FLOW.hasFailed = true;
        ORDER_FLOW.LOGARR.push(['FAILED', e.message]);
        return ORDER_FLOW;

    }

}

function checkColoredPremix(data) {
    var ORDER_FLOW = {
        hasNegative: false,
        LOGARR: [],
        USAGE: {},
        LOG: [],
        NEGATIVELOG: [],
    }
    try {

        if (!data.used) {
            data.used = new Array();
        }



        var premix = getPremixSKU(data, true);




        var premixstock = base.getData("PremixesTypes/" + premix);
        var pom1 = premixstock.Reserved;
        if (pom1 === undefined || pom1 < 0) {
            pom1 = 0;
        }

        var helper = premixstock.Running - data.QTY;
        if (helper == 0) {

            var dat3 = {
                premixed: premixstock.Running,
                coloredpremix: premixstock.Running,
            }
            ORDER_FLOW.USAGE.ColoredPremix = {
                sku: premix,
                name: premixstock.name,
                qty: data.QTY,
            };

            premixstock.Running = 0;
            premixstock.Reserved = pom1 + data.QTY;

            base.updateData('PremixesTypes/' + premix, premixstock);

            var obj = {
                displayGroup: 'Colored Premix',
                tab: 'PremixesTypes',
                sku: premix,
                name: premixstock.name,
                value: data.QTY
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['Premix:', dat3.Running]);
            if (dat3.premixed === undefined) {
                dat3.premixed = 0;
            }
            base.updateData('Orders/' + data.batch, dat3)

            data.tomixing = 0;



        } else if (helper > 0) {
            var dat3 = {
                premixed: data.QTY,
                coloredpremix: data.QTY,
            }
            ORDER_FLOW.USAGE.ColoredPremix = {
                sku: premix,
                name: premixstock.name,
                qty: data.QTY,
            };
            premixstock.Running = helper;
            premixstock.Reserved = pom1 + data.QTY;
            var obj = {
                displayGroup: 'Colored Premix',
                tab: 'PremixesTypes',
                sku: premix,
                name: premixstock.name,
                value: data.QTY
            }
            ORDER_FLOW.LOG.push(obj);
            base.updateData('PremixesTypes/' + premix, premixstock);


            ORDER_FLOW.LOGARR.push(['Premix:', data.QTY]);
            if (dat3.premixed === undefined) {
                dat3.premixed = 0;
            }
            base.updateData('Orders/' + data.batch, dat3)
            data.tomixing = 0;



        } else if (helper < 0) {
            var dat3 = {
                premixed: premixstock.Running

            }
            premixstock.Reserved = pom1 + premixstock.Running;
            premixstock.Running = 0;
            ORDER_FLOW.USAGE.Premix = {
                sku: premix,
                name: premixstock.name,
                qty: dat3.premixed,
            };

            var obj = {
                displayGroup: 'Colored Premix',
                tab: 'PremixesTypes',
                sku: premix,
                name: premixstock.name,
                value: dat3.premixed
            }
            ORDER_FLOW.LOG.push(obj);
            base.updateData('PremixesTypes/' + premix, premixstock);

            data.used.push(['PremixesTypes/', premix, dat3.premixed]);
            ORDER_FLOW.LOGARR.push(['Premix:', dat3.premixed]);
            if (dat3.premixed === undefined) {
                dat3.premixed = 0;
            }




            var newmixvol = data.QTY - dat3.premixed;
            base.updateData('Orders/' + data.batch, dat3)
            data.QTY = newmixvol;
            data.hasNegative = ORDER_FLOW.hasNegative;
            var PMIXRUN = CheckPremixed(data);
            ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(PMIXRUN.LOGARR)
            ORDER_FLOW.LOG = ORDER_FLOW.LOG.concat(PMIXRUN.LOG)
            ORDER_FLOW.NEGATIVELOG = ORDER_FLOW.NEGATIVELOG.concat(PMIXRUN.NEGATIVELOG)
            ORDER_FLOW.USAGE = jsonConcat(ORDER_FLOW.USAGE, PMIXRUN.USAGE);
            ORDER_FLOW.hasNegative = PMIXRUN.hasNegative;
            ORDER_FLOW.hasFailed = PMIXRUN.hasFailed;
        }


        return ORDER_FLOW;

    } catch (e) {
        var dat1 = {
            final_status: 0,
            runtime: "",
            unbranded: 0,
            branded: 0,
            premixed: 0,
            coloredpremix: 0,
            mixing: 0,
            backtubed: 0,
        }

        base.updateData('Orders/' + data.batch, dat1);
        ORDER_FLOW.hasNegative = true;
        ORDER_FLOW.hasFailed = true;
        ORDER_FLOW.LOGARR.push(['FAILED', e.message]);
        return ORDER_FLOW;

    }



}


function returnData2(data, neg) {
    var LOGARR = [];
    for (var i = 0; i < data.length; i++) {
        fromReservedToRunning(data[i][0] + data[i][1], data[i][2]);
        LOGARR.push(['To Running: ' + data[i][0] + data[i][1], data[i][2]]);
    }
    var name = base.getData(data[data.length - 1][0] + data[data.length - 1][1] + '/name');

    LOGARR.push(['WENT NEGATIVE', Math.abs(neg) + ' - ' + data[data.length - 1][0] + data[data.length - 1][1] + ' - ' + name])

    return LOGARR;
}