function CheckUnbranded(data) {
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
        var unbranded = getUnbrandName(data);
        if (data.packagingType.sku) {
            var brandname = getBrandName(data, false);
        } else {
            var brandname = getBrandName(data, true);
        }
        var suffix = data.batch.substr(-1);

        if (suffix == 'B') {

            var packData = getPackagingData(data.packagingType, data.bottles, data.boxname.sku)

            //  var packlabel = packData.packlabel;
            var packink = packData.ink;
            var tube = packData.botperPack;
            var boxname = data.boxname.sku;



            var tubes = data.bottles / tube;

            if (data.packlabelsku != "" && data.packlabelsku != undefined) {
                if (data.ppp) {
                    ORDER_FLOW.USAGE.PrePackLabel = {
                        sku: data.packlabelsku,
                        name: data.packlabel,
                        qty: tubes
                    };
                } else {
                    ORDER_FLOW.USAGE.PackLabel = {
                        sku: data.packlabelsku,
                        name: data.packlabel,
                        qty: tubes
                    };

                }
                var numLabelsTubes = tubes;
                if (data.packlabelsku != "" && data.packlabelsku != undefined) {
                  var obj = {
                    displayGroup: 'Labels',
                    tab: 'Labels',
                    sku: data.packlabelsku,
                    name: data.packlabel,
                    value: tubes
                  }
                  ORDER_FLOW.LOG.push(obj) 
                    var neg = fromRunningtoReserved('Labels/' + data.packlabelsku, tubes);
                  
                    data.used.push(['Labels/', data.packlabelsku, tubes]);
                    ORDER_FLOW.LOGARR.push([data.packlabelsku, tubes]);
                  if (neg < 0) {
                      if(data.useBothLabels && data.ppp){
                                 var total = tubes;
                                 var remaining  = tubes+ neg
                                 var prods = base.getData('References/ProductCodes/'+data.productcode);
                                 var printPackLabelSku = prods.packlabelsku;
                                if(printPackLabelSku){
                                  var neg2 = fromRunningtoReserved('Labels/' + printPackLabelSku, remaining);
                                  
                                  if(neg2 <0){
                                  
                                  fromReservedToRunning('Labels/' + printPackLabelSku, remaining)
                                  ORDER_FLOW.hasNegative = true;
                                  var newObj = JSON.parse(JSON.stringify(obj))
                                  newObj.value = neg;
                                  ORDER_FLOW.NEGATIVELOG.push(newObj);
                                  }else{
                                    
                                      var obj = {
                                      displayGroup: 'Labels',
                                      tab: 'Labels',
                                      sku: data.packlabelsku,
                                      name: data.packlabel,
                                      value: tubes  - remaining
                                    }
                                    data.used[  data.used.length - 1] =  ['Labels/', data.packlabelsku, tubes  - remaining];
                                    ORDER_FLOW.LOG[ ORDER_FLOW.LOG.length - 1]= obj;
                                    ORDER_FLOW.LOGARR[ ORDER_FLOW.LOGARR.length - 1] = [data.packlabelsku,  tubes - remaining];
                                    
                                    
                                    
                                  data.used.push(['Labels/',printPackLabelSku, remaining]);
                                  fromReservedToRunning('Labels/' + data.packlabelsku, remaining)
                                  var obj = {
                                    displayGroup: 'Labels',
                                    tab: 'Labels',
                                    sku: printPackLabelSku,
                                    name: prods.packlabel,
                                    value: remaining
                                  }
                                  ORDER_FLOW.USAGE.PrePackLabel = {
                                    sku: data.packlabelsku,
                                    name: data.packlabel,
                                    qty:  tubes - remaining
                                  };
                                    ORDER_FLOW.USAGE.PackLabel = {
                                      sku: printPackLabelSku,
                                      name:prods.packlabel,
                                      qty: remaining
                                    };
                                  ORDER_FLOW.LOG.push(obj);
                                  ORDER_FLOW.LOGARR.push([printPackLabelSku,remaining]);
                                    var datLabels = {
                                      packlabelprintingSku:printPackLabelSku,
                                      packlabelprintingValue:remaining,
                                    }
                                    base.updateData('Orders/' + data.batch, datLabels);
                                  }
                                  
                                
                                }else{
                                   ORDER_FLOW.hasNegative = true;
                                  var newObj = JSON.parse(JSON.stringify(obj))
                                  newObj.value = neg;
                                  ORDER_FLOW.NEGATIVELOG.push(newObj);
                                }
                              }else{
                                
                                ORDER_FLOW.hasNegative = true;
                                var newObj = JSON.parse(JSON.stringify(obj))
                                newObj.value = neg;
                                ORDER_FLOW.NEGATIVELOG.push(newObj);
                             }
                }
                }
           
            } else {

                var numLabelsTubes = 0;
            }
            ORDER_FLOW.USAGE.Packages = {
                sku: data.packagingType.sku,
                name: data.packagingType.name,
                qty: tubes
            }; 
            var neg = fromRunningtoReserved('Packages/' + data.packagingType.sku, tubes);
          
            data.used.push(['Packages/', data.packagingType.sku, tubes]);
            var obj = {
                displayGroup: 'Packages',
                tab: 'Packages',
                sku: data.packagingType.sku,
                name: data.packagingType.name,
                value: tubes
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push([data.packagingType.sku, tubes]);
          if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }
            var ink = 0;

            if (!data.ppb) {
                ink += data.bottles * 0.001;
            }
            if (!data.ppb) {
                ink += packink
            }
          if(isNaN(ink)){
            ink = 0;
            }
            ORDER_FLOW.USAGE.Printing = {
                ink: ink,
            }
             
            var neg = fromRunningtoReserved("Misc/printing ink", ink);
           
            data.used.push(['Misc/printing ink', '', ink]);
            var obj = {
                displayGroup: 'Misc',
                tab: 'Misc',
                sku: 'printing ink',
                name: 'printing ink',
                value: ink
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['printing ink', ink]);

            if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }


        } else {
            var ink = 0;

            if (!data.ppb) {
                ink += data.bottles * 0.001;
            }
          if(isNaN(ink)){
            ink = 0;
            }
            ORDER_FLOW.USAGE.Printing = {
                ink: ink,
            }
            
       
              var neg = fromRunningtoReserved("Misc/printing ink", ink);
         
            data.used.push(['Misc/printing ink', '', ink]);
            var obj = {
                displayGroup: 'Misc',
                tab: 'Misc',
                sku: 'printing ink',
                name: 'printing ink',
                value: ink
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['printing ink', ink]);
            if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }
            var numLabelsTubes = 0;
        }
        var numLabelsBottles = data.bottles;
        var label = data.botlabelsku;

        if (data.ppb) {
            ORDER_FLOW.USAGE.PreBottleLabel = {
                sku: data.botlabelsku,
                name: data.botlabel,
                qty: data.bottles
            };
        } else {
            ORDER_FLOW.USAGE.BottleLabel = {
                sku: data.botlabelsku,
                name: data.botlabel,
                qty: data.bottles
            };

        }
        Logger.log("THE LABEL IS " + label);
       
        var neg = fromRunningtoReserved('Labels/' + label, data.bottles);
       
        data.used.push(['Labels/', label, data.bottles]);
        var obj = {
            displayGroup: 'Labels',
            tab: 'Labels',
            sku: label,
            name: data.botlabel,
            value: data.bottles
        }
        ORDER_FLOW.LOG.push(obj);
        ORDER_FLOW.LOGARR.push([label, data.bottles]);
        if (neg < 0) {
             if(data.useBothLabels && data.ppb){
                                 var total = data.bottles  ;
                                 var remaining  =  data.bottles   + neg
                                 var prods = base.getData('References/ProductCodes/'+data.productcode);
                                 var printBotLabelSku = prods.botlabelsku;
                                if(printBotLabelSku){
                                  var neg2 = fromRunningtoReserved('Labels/' + printBotLabelSku, remaining);
                                  
                                  if(neg2 <0){
                                  
                                  fromReservedToRunning('Labels/' + printBotLabelSku, remaining)
                                  ORDER_FLOW.hasNegative = true;
                                  var newObj = JSON.parse(JSON.stringify(obj))
                                  newObj.value = neg;
                                  ORDER_FLOW.NEGATIVELOG.push(newObj);
                                  }else{
                                    
                                    var obj = {
                                      displayGroup: 'Labels',
                                      tab: 'Labels',
                                      sku: data.botlabelsku,
                                      name: data.botlabel,
                                      value: data.bottles   - remaining
                                    }
                                    data.used[  data.used.length - 1] =  ['Labels/', label, data.bottles  - remaining];
                                    ORDER_FLOW.LOG[ ORDER_FLOW.LOG.length - 1]= obj;
                                    ORDER_FLOW.LOGARR[ ORDER_FLOW.LOGARR.length - 1] = [data.packlabelsku,  data.bottles  - remaining];
                                    
                                    
                                    
                                  data.used.push(['Labels/',printBotLabelSku, remaining]);
                                  fromReservedToRunning('Labels/' + data.botlabelsku, remaining)
                                  var obj = {
                                    displayGroup: 'Labels',
                                    tab: 'Labels',
                                    sku: printBotLabelSku,
                                    name: prods.botlabel,
                                    value: remaining
                                  }
                                  ORDER_FLOW.LOG.push(obj);
                                  ORDER_FLOW.LOGARR.push([printBotLabelSku,remaining]);
                                    
                                    ORDER_FLOW.USAGE.PreBottleLabel = {
                                      sku: data.botlabelsku,
                                      name: data.botlabel,
                                      qty: data.bottles - remaining
                                    };
                                    ORDER_FLOW.USAGE.BottleLabel = {
                                      sku: printBotLabelSku,
                                      name:prods.botlabel,
                                      qty: remaining
                                    };
                                               var datLabels = {
                                         botlabelprintingSku:printBotLabelSku,
                                         botlabelprintingValue:remaining,
                                        }
                                        base.updateData('Orders/' + data.batch, datLabels);
                                  }
                                  
                                
                                }else{
                                   ORDER_FLOW.hasNegative = true;
                                  var newObj = JSON.parse(JSON.stringify(obj))
                                  newObj.value = neg;
                                  ORDER_FLOW.NEGATIVELOG.push(newObj);
                                }
                              }else{
                                
                                ORDER_FLOW.hasNegative = true;
                                var newObj = JSON.parse(JSON.stringify(obj))
                                newObj.value = neg;
                                ORDER_FLOW.NEGATIVELOG.push(newObj);
                             }
                }
        var unbrandedstock = base.getData("UnbrandedTypes/" + unbranded);
        var pom1 = unbrandedstock.Reserved;

        if (pom1 === undefined || pom1 < 0) {
            pom1 = 0;
        }

        var helper = unbrandedstock.Running - data.bottles;
        if (helper == 0) {

            var dat3 = {
                unbranded: unbrandedstock.Running,
                mixing_status: 'Not Mixing'
            };

            unbrandedstock.Running = 0;
            unbrandedstock.Reserved = pom1 + data.bottles;

            ORDER_FLOW.USAGE.Unbranded = {
                sku: unbranded,
                name: unbrandedstock.name,
                qty: data.bottles,
            };
          
   
            base.updateData('UnbrandedTypes/' + unbranded, unbrandedstock);
           
            var obj = {
                displayGroup: 'Unbranded',
                tab: 'UnbrandedTypes',
                sku: unbranded,
                name: unbrandedstock.name,
                value: data.bottles
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['Unbranded', dat3.unbranded]);
            base.updateData('Orders/' + data.batch, dat3);
 
            base.updateData('UnbrandedTypes/' + unbranded, unbrandedstock);
          
            data.toproduction = 0;


            if (!data.ppb) {
                toPrinting(data);
            }
            if (!data.ppp) {
                toPrinting(data);
            }
        } else if (helper > 0) {
            var dat3 = {
                unbranded: data.bottles,
                mixing_status: 'Not Mixing'
            };

            unbrandedstock.Running = helper;
            unbrandedstock.Reserved = pom1 + data.bottles;

            ORDER_FLOW.USAGE.Unbranded = {
                sku: unbranded,
                name: unbrandedstock.name,
                qty: data.bottles,
            };
            var obj = {
                displayGroup: 'Unbranded',
                tab: 'UnbrandedTypes',
                sku: unbranded,
                name: unbrandedstock.name,
                value: data.bottles
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['Unbranded', data.bottles]);
            base.updateData('Orders/' + data.batch, dat3);
            base.updateData('UnbrandedTypes/' + unbranded, unbrandedstock);

            data.toproduction = 0;


            if (!data.ppb) {
                toPrinting(data);
            }
            if (!data.ppp) {
                toPrinting(data);
            }
            ORDER_FLOW.LOGARR.push(['Sent to Printing:', data.bottles]);
        } else if (helper < 0) {

            var newbottles = data.bottles - unbrandedstock.Running;

            var dat3 = {
                unbranded: unbrandedstock.Running,
                mixing_status: 'Sent'
            };

            unbrandedstock.Reserved = pom1 + unbrandedstock.Running;
            unbrandedstock.Running = 0;

            ORDER_FLOW.USAGE.Unbranded = {
                sku: unbranded,
                name: unbrandedstock.name,
                qty: dat3.unbranded
            };

            base.updateData('UnbrandedTypes/' + unbranded, unbrandedstock);




            var obj = {
                displayGroup: 'Unbranded',
                tab: 'UnbrandedTypes',
                sku: unbranded,
                name: unbrandedstock.name,
                value: dat3.unbranded
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['Unbranded', dat3.unbranded]);
            base.updateData('Orders/' + data.batch, dat3)


            data.toproduction = 'Sent';
            data.numLabelsTubes = numLabelsTubes;
            data.numLabelsBottles = numLabelsBottles;
            if (!data.ppb) {
                toPrinting(data);
            }
            if (!data.ppp) {
                toPrinting(data);
            }
            ORDER_FLOW.LOGARR.push(['Sent to Printing:', data.bottles]);

            var helper2 = (newbottles / 1000) * data.fill;
            data.QTY = helper2;
            data.bottles = newbottles;
            if (data.recipe.Color) {
                data.hasNegative = ORDER_FLOW.hasNegative;
                var COLPMIXRUN = checkColoredPremix(data);
                ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(COLPMIXRUN.LOGARR)
                ORDER_FLOW.LOG = ORDER_FLOW.LOG.concat(COLPMIXRUN.LOG)
                ORDER_FLOW.NEGATIVELOG = ORDER_FLOW.NEGATIVELOG.concat(COLPMIXRUN.NEGATIVELOG)
                ORDER_FLOW.USAGE = jsonConcat(ORDER_FLOW.USAGE, COLPMIXRUN.USAGE);
                ORDER_FLOW.hasNegative = COLPMIXRUN.hasNegative;
                ORDER_FLOW.hasFailed = COLPMIXRUN.hasFailed;
            } else {
                data.hasNegative = ORDER_FLOW.hasNegative;
                var PMIXRUN = CheckPremixed(data);
                ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(PMIXRUN.LOGARR)
                ORDER_FLOW.LOG = ORDER_FLOW.LOG.concat(PMIXRUN.LOG)
                ORDER_FLOW.NEGATIVELOG = ORDER_FLOW.NEGATIVELOG.concat(PMIXRUN.NEGATIVELOG)
                ORDER_FLOW.USAGE = jsonConcat(ORDER_FLOW.USAGE, PMIXRUN.USAGE);
                ORDER_FLOW.hasNegative = PMIXRUN.hasNegative;
                ORDER_FLOW.hasFailed = PMIXRUN.hasFailed;
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