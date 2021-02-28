function CheckBrandedStock(data) {
    var ORDER_FLOW = {
        hasNegative: false,
        LOGARR: [],
        USAGE: {},
        LOG: [],
        NEGATIVELOG: [],
    }
    try {
        data.used = new Array();


        var order = data.order;
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
            var neg = data.qtyMap.getNeg("Misc/printing ink", ink);
          

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
 
               // base.updateData('BrandedTypes/' + brandname, brandedstock);
              
                var obj = {
                    displayGroup: 'Branded Packaged',
                    tab: 'BrandedTypes',
                    sku: brandname,
                    name: brandedstock.name,
                    value: tubes
                }
                ORDER_FLOW.LOG.push(obj);
                ORDER_FLOW.LOGARR.push(['Branded Packaged', tubes]);

 
                data.bottles = order.bottles; 

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

 
               // base.updateData('BrandedTypes/' + brandname, brandedstock);
          
                var obj = {
                    displayGroup: 'Branded Packaged',
                    tab: 'BrandedTypes',
                    sku: brandname,
                    name: brandedstock.name,
                    value: tubes
                }
                ORDER_FLOW.LOG.push(obj);
                ORDER_FLOW.LOGARR.push(['Branded Packaged', tubes]);


                
                data.bottles = order.bottles;
            

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



               //  base.updateData('BrandedTypes/' + brandname, brandedstock);
            
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
              
               
                data.bottles = order.bottles;
                
                helper3 = helper3 * tube;
                data.bottles = helper3;
                ORDER_FLOW.USAGE.Packages = {
                    sku: data.packagingType.sku,
                    name: data.packagingType.name,
                    qty: data.bottles / tube
                };
                
                var neg = data.qtyMap.getNeg('Packages/' + data.packagingType.sku, data.bottles / tube);
               
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
 
                        var neg = data.qtyMap.getNeg('Labels/' + data.packlabelsku, data.bottles / tube);
                      

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
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }
                }


                data.numLabelsTubes = numLabelsTubes;
                data.hasNegative = ORDER_FLOW.hasNegative;
                var RUNBRAND = CheckBrandedOrigStock(data);
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

               
                var neg = data.qtyMap.getNeg('Boxes/' + boxname, box);
              

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
            var RUNBRAND = CheckBrandedOrigStock(data);
            ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(RUNBRAND.LOGARR)
            ORDER_FLOW.LOG = ORDER_FLOW.LOG.concat(RUNBRAND.LOG)
            ORDER_FLOW.NEGATIVELOG = ORDER_FLOW.NEGATIVELOG.concat(RUNBRAND.NEGATIVELOG)
            ORDER_FLOW.USAGE = jsonConcat(ORDER_FLOW.USAGE, RUNBRAND.USAGE);
            ORDER_FLOW.hasNegative = RUNBRAND.hasNegative;
            ORDER_FLOW.hasFailed = RUNBRAND.hasFailed;
            data.bottles = order.bottles;
           
           
            ORDER_FLOW.LOGARR.push(['Sent to Packaging', data.bottles]);


        }


        return ORDER_FLOW;
    } catch (e) {
        
        ORDER_FLOW.hasNegative = true;
        ORDER_FLOW.hasFailed = true;
        ORDER_FLOW.LOGARR.push(['FAILED', e.message]);
        return ORDER_FLOW;

    }
}

function CheckBrandedOrigStock(data) {
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

            //base.updateData('BrandedTypes/' + brandname, brandedstock);


            var obj = {
                displayGroup: 'Branded',
                tab: 'BrandedTypes',
                sku: brandname,
                name: brandedstock.name,
                value: data.bottles
            }
            ORDER_FLOW.LOG.push(obj);

            ORDER_FLOW.LOGARR.push(['Branded:', dat3.branded]);
           
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

           // base.updateData('BrandedTypes/' + brandname, brandedstock);



            var obj = {
                displayGroup: 'Branded',
                tab: 'BrandedTypes',
                sku: brandname,
                name: brandedstock.name,
                value: data.bottles
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['Branded:', data.bottles]);
            

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

          //  base.updateData('BrandedTypes/' + brandname, brandedstock);



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

          

            data.toPrinting = 'Sent';
            data.bottles = helper3;
            data.hasNegative = ORDER_FLOW.hasNegative;
            var UNBRRUN = CheckUnbrandedStock(data);
            ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(UNBRRUN.LOGARR)
            ORDER_FLOW.LOG = ORDER_FLOW.LOG.concat(UNBRRUN.LOG)
            ORDER_FLOW.NEGATIVELOG = ORDER_FLOW.NEGATIVELOG.concat(UNBRRUN.NEGATIVELOG)
            ORDER_FLOW.USAGE = jsonConcat(ORDER_FLOW.USAGE, UNBRRUN.USAGE);
            ORDER_FLOW.hasNegative = UNBRRUN.hasNegative;
            ORDER_FLOW.hasFailed = UNBRRUN.hasFailed;

        }



        return ORDER_FLOW;
    } catch (e) { 

        
        ORDER_FLOW.hasNegative = true;
        ORDER_FLOW.hasFailed = true;
        ORDER_FLOW.LOGARR.push(['FAILED', e.message]);
        return ORDER_FLOW;

    }
}

function CheckUnbrandedStock(data) {
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
                    var neg = data.qtyMap.getNeg('Labels/' + data.packlabelsku, tubes);
                  
                    data.used.push(['Labels/', data.packlabelsku, tubes]);
                    ORDER_FLOW.LOGARR.push([data.packlabelsku, tubes]);
                  if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
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
            var neg = data.qtyMap.getNeg('Packages/' + data.packagingType.sku, tubes);
          
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
             
            var neg = data.qtyMap.getNeg("Misc/printing ink", ink);
           
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
            
       
              var neg = data.qtyMap.getNeg("Misc/printing ink", ink);
         
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
       
        var neg = data.qtyMap.getNeg('Labels/' + label, data.bottles);
       
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
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
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
          
   
          //  base.updateData('UnbrandedTypes/' + unbranded, unbrandedstock);
           
            var obj = {
                displayGroup: 'Unbranded',
                tab: 'UnbrandedTypes',
                sku: unbranded,
                name: unbrandedstock.name,
                value: data.bottles
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['Unbranded', dat3.unbranded]);
        
 
        //    base.updateData('UnbrandedTypes/' + unbranded, unbrandedstock);
          
            data.toproduction = 0;


            if (!data.ppb) {
              //  toPrinting(data);
            }
            if (!data.ppp) {
              //  toPrinting(data);
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
             
           // base.updateData('UnbrandedTypes/' + unbranded, unbrandedstock);

            data.toproduction = 0;


            if (!data.ppb) {
            //    toPrinting(data);
            }
            if (!data.ppp) {
            //    toPrinting(data);
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

           // base.updateData('UnbrandedTypes/' + unbranded, unbrandedstock);




            var obj = {
                displayGroup: 'Unbranded',
                tab: 'UnbrandedTypes',
                sku: unbranded,
                name: unbrandedstock.name,
                value: dat3.unbranded
            }
            ORDER_FLOW.LOG.push(obj);
            ORDER_FLOW.LOGARR.push(['Unbranded', dat3.unbranded]);
           

            data.toproduction = 'Sent';
            data.numLabelsTubes = numLabelsTubes;
            data.numLabelsBottles = numLabelsBottles;
            if (!data.ppb) {
             //   toPrinting(data);
            }
            if (!data.ppp) {
             //   toPrinting(data);
            }
            ORDER_FLOW.LOGARR.push(['Sent to Printing:', data.bottles]);

            var helper2 = (newbottles / 1000) * data.fill;
            data.QTY = helper2;
            data.bottles = newbottles;
            if (data.recipe.Color) {
                data.hasNegative = ORDER_FLOW.hasNegative;
                var COLPMIXRUN = checkColoredPremixStock(data);
                ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(COLPMIXRUN.LOGARR)
                ORDER_FLOW.LOG = ORDER_FLOW.LOG.concat(COLPMIXRUN.LOG)
                ORDER_FLOW.NEGATIVELOG = ORDER_FLOW.NEGATIVELOG.concat(COLPMIXRUN.NEGATIVELOG)
                ORDER_FLOW.USAGE = jsonConcat(ORDER_FLOW.USAGE, COLPMIXRUN.USAGE);
                ORDER_FLOW.hasNegative = COLPMIXRUN.hasNegative;
                ORDER_FLOW.hasFailed = COLPMIXRUN.hasFailed;
            } else {
                data.hasNegative = ORDER_FLOW.hasNegative;
                var PMIXRUN = CheckPremixedStock(data);
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
        ORDER_FLOW.hasNegative = true;
        ORDER_FLOW.hasFailed = true;
        ORDER_FLOW.LOGARR.push(['FAILED', e.message]);
        return ORDER_FLOW;

    }
}


function CheckPremixedStock(data) {
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
        var order = data.order;
        var premix = getPremixSKU(data, false);

        if (!for_premixed_stock) { 
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
            var neg = data.qtyMap.getNeg('Lids/' + data.lidSKU, data.bottles);
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
            var neg = data.qtyMap.getNeg('BottleTypes/' + data.botSKU, data.bottles);
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
            var neg = data.qtyMap.getNeg('Color/' + data.recipe.Color.sku, data.QTY * 10 * data.recipe.Color.val);
            if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                } 
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
          //  base.updateData('PremixesTypes/' + premix, premixstock);
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
           // base.updateData('PremixesTypes/' + premix, premixstock); 
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
            //base.updateData('PremixesTypes/' + premix, premixstock);
           
            data.QTY = newmixvol;
            data.tomixing = 'Sent';
            var RU = getRoundups()[0];
            if (data.Nico || data.Nicosalts) {
                var rounded = Math.ceil(data.QTY / RU.nic) * RU.nic;

            } else {
                var rounded = Math.ceil(data.QTY / RU.cbd) * RU.cbd;

            }
            var order = data.order;
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
            var neg = data.qtyMap.getNeg('Flavours/' + data.flavour.sku, data.flavvalue * data.QTY / 1000);

            if (neg < 0) {
                 
                  var baseFlavour = base.getData('Flavours/' + data.flavour.sku);
                  if(baseFlavour){
                    if(baseFlavour.type === 'mix'){
                      obj.displayGroup = 'Flavour Mix'
                      ORDER_FLOW.hasNegative = true;
                      var newObj = JSON.parse(JSON.stringify(obj))
                      newObj.value = neg;
                      ORDER_FLOW.NEGATIVELOG.push(newObj);
                      
                       var flavourMix = base.getData('FlavourMixes/' + data.flavour.sku);
                      if(flavourMix){
                        var flavourValue = Math.abs(neg);
                        var flavourList = JSONtoARR(flavourMix.flavours);
                        ORDER_FLOW.USAGE.FlavourList = [];
                        for(var f = 0; f < flavourList.length ;f++){
                          var rawValue = (flavourValue * ( flavourList[f].val/10))
                          var listItemValue =  parseFloat(parseFloat(rawValue).toFixed(2));
                     
                          ORDER_FLOW.USAGE.FlavourList.push({
                            sku: flavourList[f].sku,
                            name: flavourList[f].name,
                            qty: listItemValue,
                          });
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
                          var neg = data.qtyMap.getNeg('Flavours/' + flavourList[f].sku, listItemValue);
                          
                          if (neg < 0) {
                            ORDER_FLOW.hasNegative = true;
                            var newObj = JSON.parse(JSON.stringify(obj))
                            newObj.value = neg;
                            ORDER_FLOW.NEGATIVELOG.push(newObj);
                          }
                        }
                        
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
            var neg = data.qtyMap.getNeg("Misc/VG", data.VGval * data.QTY);
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
            var neg = data.qtyMap.getNeg("Misc/PG", data.PGval * data.QTY);
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
            var neg = data.qtyMap.getNeg("Misc/AG", data.AGval * data.QTY);
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
            var neg = data.qtyMap.getNeg("Misc/MCT", data.MCTval * data.QTY);
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
                var neg = data.qtyMap.getNeg("Misc/Nicotine", data.Nico * data.QTY);
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
                var neg = data.qtyMap.getNeg("Misc/Nicotine Salts", data.Nicosalts * data.QTY);
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
                var neg = data.qtyMap.getNeg("Misc/CBD", data.CBDvalue * data.QTY);
                if (neg < 0) {
                    ORDER_FLOW.hasNegative = true;
                    var newObj = JSON.parse(JSON.stringify(obj))
                    newObj.value = neg;
                    ORDER_FLOW.NEGATIVELOG.push(newObj);
                }


            }

          if(!ORDER_FLOW.hasNegative){
           // ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(createMixOrder(data));
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
              //  saveOrder(object);

            }
        }


        return ORDER_FLOW;
    } catch (e) { 
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

          //  base.updateData('PremixesTypes/' + premix, premixstock);

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
           // base.updateData('PremixesTypes/' + premix, premixstock);


            ORDER_FLOW.LOGARR.push(['Premix:', data.QTY]);
            if (dat3.premixed === undefined) {
                dat3.premixed = 0;
            } 
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
            //base.updateData('PremixesTypes/' + premix, premixstock);

            data.used.push(['PremixesTypes/', premix, dat3.premixed]);
            ORDER_FLOW.LOGARR.push(['Premix:', dat3.premixed]);
            if (dat3.premixed === undefined) {
                dat3.premixed = 0;
            }




            var newmixvol = data.QTY - dat3.premixed; 
            data.QTY = newmixvol;
            data.hasNegative = ORDER_FLOW.hasNegative;
            var PMIXRUN = CheckPremixedStock(data);
            ORDER_FLOW.LOGARR = ORDER_FLOW.LOGARR.concat(PMIXRUN.LOGARR)
            ORDER_FLOW.LOG = ORDER_FLOW.LOG.concat(PMIXRUN.LOG)
            ORDER_FLOW.NEGATIVELOG = ORDER_FLOW.NEGATIVELOG.concat(PMIXRUN.NEGATIVELOG)
            ORDER_FLOW.USAGE = jsonConcat(ORDER_FLOW.USAGE, PMIXRUN.USAGE);
            ORDER_FLOW.hasNegative = PMIXRUN.hasNegative;
            ORDER_FLOW.hasFailed = PMIXRUN.hasFailed;
        }


        return ORDER_FLOW;

    } catch (e) { 
        ORDER_FLOW.hasNegative = true;
        ORDER_FLOW.hasFailed = true;
        ORDER_FLOW.LOGARR.push(['FAILED', e.message]);
        return ORDER_FLOW;

    }



}


