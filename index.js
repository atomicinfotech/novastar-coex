const _ = require("lodash");
const axios = require("axios");

module.exports = function (ip) {
  this.ip = ip;
  this.port = 8001;
  this.debug = false;
  this.baseurl = "http://" + this.ip + ":" + this.port + "/api/v1/device/";
  this.cache = {};

  var responseparser = function (response, callback, path) {
    data = _.get(response, "data");
    //we have an error
    if (data.code) {
      var error = {
        error : data.message
      };

      if ((error.error = "device locked")) error.note = "VMP is likely on another device. Either close VMP or run Companion on the same machine & IP address.";

      if (typeof callback == "function") return callback(false, error);
      return;
    }

    if (path) response = _.get(response, path); // return part of the response

    if (typeof callback == "function") return callback(response);

  }

  //syntax sugar for diplay modes
  this.blackout = function (cb) {
    console.log("blackout the screen");
    this.displaymode(1, cb);
  };

  this.normal = function (cb) {
    console.log("normal the screen");
    this.displaymode(0, cb);
  };

  this.freeze = function (cb) {
    console.log("freeze the screen");
    this.displaymode(2, cb);
  };

  // can also take a list of cabinet ids
  // PUT /api/v1/device/cabinet/brightness
  this.brightness = function (brightness, cabinetids, cb) {
    if (typeof cabinetids == "function") {
      cb = cabinetids;
      cabinetids = null;
    }

    //if no cabinet value is provided send 16777215 which will adjust all
    if(!cabinetids) cabinetids = [16777215];

    if (brightness > 1) brightness = brightness / 100; // most likely is a percentage
    console.log("adjust brightness of the screen ", brightness);

    var url = this.baseurl + "cabinet/brightness";
    var payload = {
      ratio: brightness,
      idList: cabinetids,
    };

    // console.log(url);
    // console.log(payload);

    axios
      .put(url, payload)
      .then(function (response) {
        responseparser(response, cb);
      })
      .catch(function (error) {
        console.log(error);
        if (typeof cb == "function") return cb(false, error);
      });
  };

  // Adjust color temperature
  // can also take a list of cabinet ids
  // colortemp 1700 to 15000
  // [optional] array of cabinetids
  // [optional] callback function
  // PUT /api/v1/device/cabinet/colortemperature
  this.colortemperature = function (value, cabinetids, cb) {
     if (typeof cabinetids == "function") {
       cb = cabinetids;
       cabinetids = null;
     }

    //if no cabinet value is provided send 16777215 which will adjust all
    if (!cabinetids) cabinetids = [16777215];

    //check if is in the range of 1700-15000
    if (typeof value === "string") {
      value = parseFloat(value.replace(/[^\d.-]/g, ""));
    } //strip out extra chars

    if (value < 1700) {
      value = 1700;
    } else if (value > 15000) {
      value = 15000;
    }

    if (!value) {
      console.log("Color temperature value is required");
      if (typeof cb == "function") {
        return cb(null, "Color temperature value is required");
      }
      return false;
    }

    console.log("Adjust color temperature ", value);

    var url = this.baseurl + "cabinet/colortemperature";
    var payload = {
      value: value,
      idList: cabinetids,
    };

    // console.log(url);
    // console.log(payload);

    axios
      .put(url, payload)
      .then(function (response) {
        responseparser(response, cb);
      })
      .catch(function (error) {
        console.log(error);
        if (typeof cb == "function") return cb(false);
      });
  };

  // Adjust gamma
  // gamma 1.0 to 4.0
  // [optional] type 0 = red, 1 = blue, 2 = green, 3 = all.  Default = 3
  // [optional] array of cabinetids
  // [optional] callback function
  // PUT /api/v1/device/cabinet/colortemperature
  this.gamma = function (value, type, cabinetids, cb) {

    if (typeof cabinetids == "function") {
      cb = cabinetids;
      cabinetids = null;
    }

    if (typeof type == "function") {
      cb = type;
      type = null;
    }

    //if no cabinet value is provided send 16777215 which will adjust all
    if (!cabinetids) cabinetids = [16777215];

    //check if gamma is in the range of 1-4.
    if (typeof value === "string") {
      console.log("string");
      value = parseFloat(value.replace(/[^\d.-]/g, ""));
    } //strip out extra chars

    if (value < 1) {
      value = 1;
    } else if (value > 4) {
      value = 4;
    }

    if (!value) {
      console.log("Gamma value is required");
      if (typeof cb == "function") {
        return cb(null, "Gamma value is required");
      }
      return false;
    }

    if (!type) type = 3; // all

    var url = this.baseurl + "cabinet/gamma";
    var payload = {
      value: value,
      type: type,
      idList: cabinetids,
    };

    // console.log(url);
    // console.log(payload);

    axios
      .put(url, payload)
      .then(function (response) {
        responseparser(response, cb);
      })
      .catch(function (error) {
        console.log(error);
        if (typeof cb == "function") return cb(null, false);
      });
  };

  // PUT /api/v1/device/screen/displaymode
  this.displaymode = function (value, cb) {
    // 0 = normal
    // 1 = blackout
    // 2 = freeze
    console.log(ip);

    console.log("adjust display mode of the screen", value);
    var url = this.baseurl + "screen/displaymode";

    //console.log(url);

    axios
      .put(url, { value: value })
      .then(function (response) {
        responseparser(response, cb);
      })
      .catch(function (error) {
        console.log(error);
        if (typeof cb == "function") return cb(false);
      });
  };

  //get list of cabinet IDs
  // GET /api/v1/device/cabinet
  this.cabinet = function (cb) {
    console.log("Get list of attached cabinets");
    var url = this.baseurl + "cabinet";

    //console.log(url);

    axios
      .get(url, { value: 0 })
      .then(function (response) {
        responseparser(response, cb, "data.data");
      })
      .catch(function (error) {
        console.log(error);
        if (typeof cb == "function") return cb(false);
      });
  };

  //Summary of everything
  this.summary = function (cb) {
    //cabinets, sources

    this.cabinet(function (cabinets) {
      console.log(cabinets.length);
      //console.log("yo");
    });
  };

  //get list of sources
  // GET api/v1/device/input/sources
  this.sources = function (cb) {
    var url = this.baseurl + "input/sources";
    axios
      .get(url, { value: 0 })
      .then(function (response) {

        responseparser(response, function(data, error){
          if (error) {
            if (typeof cb == "function") return cb(false, error);
            return;
          }

          data = _.map(data, function (d) {
            d.supportFrameRate = _.split(d.supportFrameRate, "|");
            d.supportResolution = _.split(d.supportResolution, "|");
            return d;
          });

          if (typeof cb == "function") return cb(data);

        }, "data.data");        
      })
      .catch(function (error) {
        console.log(error);
        if (typeof cb == "function") return cb(false, error);
      });
  };

  //set input
  // PUT /api/v1/device/screen/input
  this.input = function (input, cb) {
    var baseurl = this.baseurl;

    this.sources(function (sources) {
      var lookup = {};

      _.each(sources, function (source) {
        lookup[source.name] = source.groupId;
        lookup[source.groupId] = source.groupId;
      });

      //console.log(lookup);

      var groupId = null;
      groupId = lookup[input];

      if (!groupId) {
        if (typeof cb == "function") return cb(null, "Unknown input");
        return;
      }

      var url = baseurl + "screen/input";
      var payload = { groupId: groupId };

      axios
        .put(url, payload)
        .then(function (response) {

          responseparser(
            response,
            function (data, error) {
              if (error) {
                if (typeof cb == "function") return cb(false, error);
                return;
              }
               var data = { input: input, groupId: groupId };
              
              if (typeof cb == "function") return cb(data);
            },
            "data.data"
          );  
        })
        .catch(function (error) {
          console.log(error);
          if (typeof cb == "function") return cb(false, error);
        });
    });
  };

  //GET /api/v1/device/preset
  this.presets = function (cb) {
    var url = this.baseurl + "preset";
    axios
      .get(url)
      .then(function (response) {
        responseparser(response, cb, "data.data");
      })
      .catch(function (error) {
        console.log(error);
        if (typeof cb == "function") return cb(false);
      });
  };

  //PUT /api/v1/device/currentpreset
  this.preset = function (preset, cb) {
    console.log("select preset", preset);

    var baseurl = this.baseurl;

    this.presets(function (presets) {
      var lookup = {};

      _.each(presets, function (preset) {
        lookup[preset.name] = preset.sequenceNumber;
        lookup[preset.sequenceNumber] = preset.sequenceNumber;
      });

      var sequenceNumber = null;
      sequenceNumber = lookup[preset];

      if (!sequenceNumber) {
        if (typeof cb == "function") return cb(null, "Unknown preset");
        return;
      }

      var url = baseurl + "currentpreset";
      var payload = { sequenceNumber: sequenceNumber };

      axios
        .put(url, payload)
        .then(function (response) {
           responseparser(response, cb, "data.data");
        })
        .catch(function (error) {
          console.log(error);
          if (typeof cb == "function") return cb(false, error);
        });
    });
  };

  //get/set HDR per input
  //PUT api/v1/device/input/{id}/hdrmode
  this.hdr = function (input, hdr) {
    console.log(ip);
    console.log("adjust display HDR of the screen", value);
  };

  //set dynamic boost
  // three endpoints need to be hit
  // PUT api/v1/device/processing/imagequality/ede/enable
  // PUT /api/v1/device/processing/imagequality/abl/enable
  // PUT /api/v1/device/processing/imagequality/itmo/enable
  this.dynamicboost = function (input, hdr) {
    console.log(ip);
    console.log("adjust dynamic boost", value);
  };

  //Color Space
  // PUT /api/v1/device/correctionop/cabinets/gamut

  /*
  Request parameter(json format)
	{ "name": “” //Original }
	Name parameter meaning
	From input:"From input"
	Original:""
	Rec.709:"Rec.709"
	DCI-P3:"DCI-P3"
	Rec.2020:"Rec.2020"
	Custom:"Custom"
  */

  this.colorspace = function (input, hdr) {
    console.log(ip);
    console.log("adjust colorspace", value);
  };

  //Working Mode
  //PUT /api/v1/device/hw/mode
  this.workingmode = function (value, cb) {
    // 2 : Send Only
    // 3 : All-in-one
    console.log("adjust working mode of the controller", value);
    var url = this.baseurl + "hw/mode";

    //console.log(url);
    axios
      .put(url, { value: value })
      .then(function (response) {
         responseparser(response, cb);
      })
      .catch(function (error) {
        console.log(error);
        if (typeof cb == "function") return cb(null, error);
      });
  };

  // Adjust test pattern
  // mode
    // 0: Pure color (the color is controlled by the red, green and blue component values below)
    // 16: Horizontal stripes to the bottom
    // 17: Horizontal stripes to the right
    // 18: Slashes
    // 19: Backslashes
    // 20: Grid to the bottom right
    // 21: Grid to the right
    // 32: Left-to-right red gradient
    // 33: Left-to-right green gradient
    // 34: Left-to-right blue gradient
    // 35: Left-to-right gray gradient
    // 36: Top-to-bottom red gradient
    // 37: Top-to-bottom green gradient
    // 38: Top-to-bottom blue gradient
    // 39: Top-to-bottom gray gradient
    // 48: Lightning
  // parameters
    // {
    //   red: 0-4095,
    //   green: 0-4095,
    //   blue: 0-4095,
    //   gray: 0-4095,
    //   gridWidth: 1,
    //   moveSpeed: 0-100,
    //   gradientStretch : 1-20,
    //   state : 0-1
    // }
  // [optional] callback function
  // PUT /api/v1/device/screen/controller/pattern/test
  this.testpattern = function (value, params, cb) {

    switch (value) {
      // case "white":
      //   var mode = 0;
      //   params = {
      //     red: 4095,
      //     green: 4095,
      //     blue: 4095,
      //     gray: 4095,
      //   };
      //   break;
      // case "black":
      //   var mode = 0;
      //   params = {
      //     red: 0,
      //     green: 0,
      //     blue: 0,
      //     gray: 0,
      //   };
      //   break;
      // case "red":
      //   var mode = 0;
      //   params = {
      //     red: 255,
      //     green: 0,
      //     blue: 0,
      //     gray: 0,
      //     gridWidth: 16,
      //     moveSpeed: 0,
      //     gradientStretch: 1,
      //     state: 1,
      //   };
      //   break;
      // case "green":
      //   var mode = 0;
      //   params = {
      //     red: 0,
      //     green: 4095,
      //     blue: 0,
      //     gray: 0,
      //   };
      //   break;
      // case "blue":
      //   var mode = 0;
      //   params = {
      //     red: 0,
      //     green: 0,
      //     blue: 4095,
      //     gray: 0
      //   };
      //   break;
      case 0:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
      case 21:
      case 32:
      case 33:
      case 34:
      case 35:
      case 36:
      case 37:
      case 38:
      case 39:
      case 48:
        //check params

        if(!params) {
          params = {
            red: 4095,
            green: 4095,
            blue: 4095,
            gray: 255,
            gridWidth: 255,
            moveSpeed: 100,
            gradientStretch: 1,
            state: 1,
          };
        }

        mode = value;
        break;
      default:
        if (typeof cb == "function") {
          return cb(null, "Invalid mode");
        }
        return false;
        break;
    }


    var url = this.baseurl + "screen/controller/pattern/test";
    var payload = {
      mode: mode
    };

    if (params) payload.parameters = params;

    // console.log(url);
    // console.log(payload);

    axios
      .put(url, payload)
      .then(function (response) {
        responseparser(response, cb);
      })
      .catch(function (error) {
        console.log(error);
        if (typeof cb == "function") return cb(null, false);
      });
  };
};
