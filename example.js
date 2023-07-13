const Novastar = require("./index");

const novastar = new Novastar("10.9.10.54");

//novastar.brightness(100);

//novastar.displaymode(0);

//novastar.blackout();

// novastar.cabinet(function (response) {
//   //console.log(response);
// });

novastar.sources(function (sources) {
  console.log(sources);
});

// novastar.sources(function (inputs) {
//   console.log(inputs);
// });

// novastar.summary(function (response) {
//   console.log(response);
// });

// const novastar2 = new Novastar("172.16.1.1");
// novastar2.brightness(50);

// {
// 	"value": 0
// }
