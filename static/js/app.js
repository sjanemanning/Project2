

 var stateurl = '/stateprofit';
d3.json(stateurl).then(function(statedata) {
  console.log(statedata)
}); 


var shipurl = '/shipprofit';
d3.json(shipurl).then(function(shipdata) {
  console.log(shipdata)
});

var categoryurl = '/categoryprofit';
d3.json(categoryurl).then(function(categorydata) {
  console.log(categorydata)
});