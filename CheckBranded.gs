function CheckBranded(data) {
    var ORDER_FLOW = {
        hasNegative: false,
        LOGARR: [],
        USAGE: {},
        LOG: [],
        NEGATIVELOG: [],
    }
    try {
        data.used = new Array();


        var order = base.getData('Orders/' + data.batch);
        if (data.packagingType.sku) {

            var unbrand = getUnbrandName(data);
            var brandname = getBrandName(data, false);

            var packData = getPackagingData(data.packagingType, data.bottles, data.boxname.sku)

            // var packlabel = packData.packlabel;
            var packink = packData.ink;
            var tube = packData.botperPack;
            var boxname = data.boxname.sku;



            var tubes = data.bottles / tube;

            var box = tubes / packData.divTubesForBox;
            if (!isFinite(box)) {
                box = 0;
            }

            var ink = 0;

            if (!data.ppp) {
                ink += packink;
            }
            ORDER_FLOW.USAGE.Printing = {
                ink: ink,
            }
            if(isNaN(ink)){
            ink = 0;
            } 
            var neg = fromRunningtoReserved("Misc/printing ink", ink);
          

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
            var brandedstock = base.getData('BrandedTypes/' + brandname);
            var pom1 = brandedstock.Reserved;
            if (pom1 === undefined || pom1 < 0) {
                pom1 = 0;
            }

            var helper3 = tubes - brandedstock.Running;
            var helper = brandedstock.Running - tubes;
            if (helper == 0) {
                ORDER_FLOW.USAGE.PackagedBranded = {
                    sku: brandname,
                    name: brandedstock.name,
                    qty: tubes,
                };
                var dat4 = {
                    backtubed: tubes

                }

                brandedstock.Running = 0;
                brandedstock.Reserved = pom1 + tubes;
 
                base.updateData('BrandedTypes/' + brandname, brandedstock);
              
                var obj = {
                    displayGroup: 'Branded Packaged',
                    tab: 'BrandedTypes',
                    sku: brandname,
                    name: brandedstock.name,
                    value: tubes
                }
                ORDER_FLOW.LOG.push(obj);
                ORDER_FLOW.LOGARR.push(['Branded Packaged', tubes]);



                
                base.updateData('Orders/' + data.batch, dat4)
             
                data.bottles = order.bottles;
                toPackaging(data);

            } else if (helper > 0) {
                ORDER_FLOW.USAGE.PackagedBranded = {
                    sku: brandname,
                    name: brandedstock.name,
                    qty: tubes,
                };
                var dat4 = {
                    backtubed: tubes

                }

                brandedstock.Running = helper;
                brandedstock.Reserved = pom1 + tubes;

 
                base.updateData('BrandedTypes/' + brandname, brandedstock);
          
                var obj = {
                    displayGroup: 'Branded Packaged',
                    tab: 'BrandedTypes',
                    sku: brandname,
                    name: brandedstock.name,
                    value: tubes
                }
                ORDER_FLOW.LOG.push(obj);
                ORDER_FLOW.LOGARR.push(['Branded Packaged', tubes]);


               
                base.updateData('Orders/' + data.batch, dat4)
             
                data.bottles = order.bottles;
                toPackaging(data);

            } else {
                ORDER_FLOW.USAGE.PackagedBranded = {
                    sku: brandname,
                    name: brandedstock.name,
                    qty: (brandedstock.Running ? brandedstock.Running : 0),
                };
                var dat4 = {
                    backtubed: brandedstock.Running

                }


                brandedstock.Running = 0;
                brandedstock.Reserved = pom1 + dat4.backtubed;



                 base.updateData('BrandedTypes/' + brandname, brandedstock);
            
                var obj = {
                    displayGroup: 'Branded Packaged',
                    tab: 'BrandedTypes',
                    sku: brandname,
                    name: brandedstock.name,
                    value: dat4.backtubed
                }
                ORDER_FLOW.LOG.push(obj);
                ORDER_FLOW.LOGARR.push(['Branded Packaged', dat4.backtubed]);


                data.used.push(['BrandedTypes/', brandname, dat4.backtubed]);
              
                base.updateData('Orders/' + data.batch, dat4);
               
                data.bottles = order.bottles;
                toPackaging(data);

                helper3 = helper3 * tube;
                data.bottles = helper3;
                ORDER_FLOW.USAGE.Packages = {
                    sku: data.packagingType.sku,
                    name: data.packagingType.name,
                    qty: data.bottles / tube
                };
                
                var neg = fromRunningtoReserved('Packages/' + data.packagingType.sku, data.bottles / tube);
               
                data.used.push(['Packages/', data.packagingType.sku, data.bottles / tube]);
                var obj = {
                    displayGroup: 'Packages',
                    tab: 'Packages',
                    sku: data.packagingType.sku,
                    name: data.packagingType.name,
                    value: data.bottles / tube
                }
                ORDER_FLOW.LOG.push(obj);
                ORDER_FLOW.LOGARR.push([data.packagingType.sku, data.bottles / tube]);
              if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }
                var numLabelsTubes = 0;
                if (data.packlabelsku != "" && data.packlabelsku != undefined && tube) {
                    if (data.ppp) {
                        ORDER_FLOW.USAGE.PrePackLabel = {
                            sku: data.packlabelsku,
                            name: data.packlabel,
                            qty: data.bottles / tube
                        };
                    } else {
                        ORDER_FLOW.USAGE.PackLabel = {
                            sku: data.packlabelsku,
                            name: data.packlabel,
                            qty: data.bottles / tube
                        };

                    }
                    if (data.packlabelsku != "" && data.packlabelsku != undefined) {
                      
                        var neg = fromRunningtoReserved('Labels/' + data.packlabelsku, data.bottles / tube);
                      

                        data.used.push(['Labels/', data.packlabelsku, data.bottles / tube]);

                        var obj = {
                            displayGroup: 'Labels',
                            tab: 'Labels',
                            sku: data.packlabelsku,
                            name: data.packlabel,
                            value: data.bottles / tube
                        }
                        ORDER_FLOW.LOG.push(obj);
                        ORDER_FLOW.LOGARR.push([data.packlabelsku, data.bottles / tube]);
                    }
                    numLabelsTubes = data.bottles / tube;
                   if (neg < 0) {
                     
                              if(data.useBothLabels && data.ppp){
                                 var total = data.bottles / tube;
                                 var remaining  = (data.bottles / tube) + neg
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
                                      value:(data.bottles / tube) - remaining
                                    }
                                    data.used[  data.used.length - 1] =  ['Labels/', data.packlabelsku, (data.bottles / tube)  - remaining];
                                    ORDER_FLOW.LOG[ ORDER_FLOW.LOG.length - 1]= obj;
                                    ORDER_FLOW.LOGARR[ ORDER_FLOW.LOGARR.length - 1] = [data.packlabelsku, (data.bottles / tube) - remaining];
                                    
                                    
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
                                      qty: (data.bottles / tube) - remaining
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


                data.numLabelsTubes = numLabelsTubes;
                data.hasNegative = ORDER_FLOW.hasNegative;
                var RUNBRAND = CheckBrandedOrig(data);
                ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(RUNBRAND.LOGARR)
                ORDER_FLOW.LOG = ORDER_FLOW.LOG.concat(RUNBRAND.LOG)
                ORDER_FLOW.NEGATIVELOG = ORDER_FLOW.NEGATIVELOG.concat(RUNBRAND.NEGATIVELOG)
                ORDER_FLOW.USAGE = jsonConcat(ORDER_FLOW.USAGE, RUNBRAND.USAGE);
                ORDER_FLOW.hasNegative = RUNBRAND.hasNegative;
                ORDER_FLOW.hasFailed = RUNBRAND.hasFailed;
                //        if (LOGARR[LOGARR.length - 1][0] == 'WENT NEGATIVE') {
                //          return {LogData:LOGARR,USAGE:USAGE};
                //        }
                //        
            }
            if (boxname) {
                ORDER_FLOW.USAGE.Boxes = {
                    sku: data.boxname.sku,
                    name: data.boxname.name,
                    qty: box
                };

               
                var neg = fromRunningtoReserved('Boxes/' + boxname, box);
              

                var obj = {
                    displayGroup: 'Boxes',
                    tab: 'Boxes',
                    sku: boxname,
                    name: data.boxname.name,
                    value: box
                }
                ORDER_FLOW.LOG.push(obj);
                ORDER_FLOW.LOGARR.push([boxname, box]);
               if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }
            }
        } else {
            data.hasNegative = ORDER_FLOW.hasNegative;
            var RUNBRAND = CheckBrandedOrig(data);
            ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(RUNBRAND.LOGARR)
            ORDER_FLOW.LOG = ORDER_FLOW.LOG.concat(RUNBRAND.LOG)
            ORDER_FLOW.NEGATIVELOG = ORDER_FLOW.NEGATIVELOG.concat(RUNBRAND.NEGATIVELOG)
            ORDER_FLOW.USAGE = jsonConcat(ORDER_FLOW.USAGE, RUNBRAND.USAGE);
            ORDER_FLOW.hasNegative = RUNBRAND.hasNegative;
            ORDER_FLOW.hasFailed = RUNBRAND.hasFailed;
            data.bottles = order.bottles;
           
            toPackaging(data);
             

            ORDER_FLOW.LOGARR.push(['Sent to Packaging', data.bottles]);


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

function CheckBrandedOrig(data) {
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
        var unbrand = getUnbrandName(data);
        if (data.packagingType.sku) {
            var brandname = getBrandName(data, true);
        } else {
            var brandname = getBrandName(data, false);
        }
        var brandedstock = base.getData('BrandedTypes/' + brandname);
        var pom1 = brandedstock.Reserved;

        var helper3 = data.bottles - brandedstock.Running;
        var helper = brandedstock.Running - data.bottles;
        if (helper == 0) {
            ORDER_FLOW.USAGE.Branded = {
                sku: brandname,
                name: brandedstock.name,
                qty: brandedstock.Running,
            };
            var dat3 = {
                branded: brandedstock.Running

            }
            brandedstock.Running = 0;
            brandedstock.Reserved = pom1 + data.bottles;

            base.updateData('BrandedTypes/' + brandname, brandedstock);


            var obj = {
                displayGroup: 'Branded',
                tab: 'BrandedTypes',
                sku: brandname,
                name: brandedstock.name,
                value: data.bottles
            }
            ORDER_FLOW.LOG.push(obj);

            ORDER_FLOW.LOGARR.push(['Branded:', dat3.branded]);
            base.updateData('Orders/' + data.batch, dat3)

            data.toPrinting = 0;

        } else if (helper > 0) {
            ORDER_FLOW.USAGE.Branded = {
                sku: brandname,
                name: brandedstock.name,
                qty: data.bottles,
            };
            var dat3 = {
                branded: data.bottles

            }
            brandedstock.Running = helper;
            brandedstock.Reserved = pom1 + data.bottles;

            base.updateData('BrandedTypes/' + brandname, brandedstock);



            var obj = {
                displayGroup: 'Branded',
                tab: 'BrandedTypes',
                sku: brandname,
                name: brandedstock.name,
                value: data.bottles
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['Branded:', data.bottles]);
            base.updateData('Orders/' + data.batch, dat3)


            data.toPrinting = 0;
        } else {
            ORDER_FLOW.USAGE.Branded = {
                sku: brandname,
                name: brandedstock.name,
                qty: (brandedstock.Running ? brandedstock.Running : 0),
            };
            var dat3 = {
                branded: brandedstock.Running

            }
            brandedstock.Running = 0;
            brandedstock.Reserved = pom1 + dat3.branded;

            base.updateData('BrandedTypes/' + brandname, brandedstock);



            var obj = {
                displayGroup: 'Branded',
                tab: 'BrandedTypes',
                sku: brandname,
                name: brandedstock.name,
                value: dat3.branded
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['Branded:', dat3.branded]);

            data.used.push(['BrandedTypes/', brandname, dat3.branded]);

            base.updateData('Orders/' + data.batch, dat3)


            data.toPrinting = 'Sent';
            data.bottles = helper3;
            data.hasNegative = ORDER_FLOW.hasNegative;
            var UNBRRUN = CheckUnbranded(data);
            ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(UNBRRUN.LOGARR)
            ORDER_FLOW.LOG = ORDER_FLOW.LOG.concat(UNBRRUN.LOG)
            ORDER_FLOW.NEGATIVELOG = ORDER_FLOW.NEGATIVELOG.concat(UNBRRUN.NEGATIVELOG)
            ORDER_FLOW.USAGE = jsonConcat(ORDER_FLOW.USAGE, UNBRRUN.USAGE);
            ORDER_FLOW.hasNegative = UNBRRUN.hasNegative;
            ORDER_FLOW.hasFailed = UNBRRUN.hasFailed;

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




