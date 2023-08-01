const _ = require("lodash");
const axios = require("axios");

module.exports = function (ip) {
  this.ip = ip;
  this.port = 8001;
  this.debug = false;
  this.baseurl = "http://" + this.ip + ":" + this.port + "/api/v1/device/";

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
  this.brightness = function (value) {
    //if no cabinet value is provided send 16777215 which will adjust all cabs.

    console.log(ip);
    console.log("adjust brightness of the screen", value);
  };

  // PUT /api/v1/device/screen/displaymode
  this.displaymode = function (value, cb) {
    // 0 = normal
    // 1 = blackout
    // 2 = freeze?
    console.log(ip);

    console.log("adjust display mode of the screen", value);
    var url = this.baseurl + "screen/displaymode";

    //console.log(url);

    axios
      .put(url, { value : value })
      .then(function (response) {
        if (typeof cb == "function") return cb(response);
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

    console.log(url);

    axios
      .get(url, { value: 0 })
      .then(function (response) {
        data = _.get(response, "data.data");
        if (typeof cb == "function") return cb(data);
      })
      .catch(function (error) {
        console.log(error);
        if (typeof cb == "function") return cb(false);
      });
  };

  //connect and cache data

  //Summary of everything
  this.summary = function (cb) {
    this.cabinet(function (cabinets) {
      console.log(cabinets.length);
      console.log("yo");
    });
  };

  //get list of sources
  // GET api/v1/device/input/sources
  this.sources = function (cb) {
    var url = this.baseurl + "input/sources";
    axios
      .get(url, { value: 0 })
      .then(function (response) {
        data = _.get(response, "data.data");

        data = _.map(data, function (d) {
          d.supportFrameRate = _.split(d.supportFrameRate, "|");
          d.supportResolution = _.split(d.supportResolution, "|");
          return d;
        });

        if (typeof cb == "function") return cb(data);
      })
      .catch(function (error) {
        console.log(error);
        if (typeof cb == "function") return cb(false);
      });
  };

  //set input
  // PUT /api/v1/device/screen/input
  this.input = function (input, cb) {

    this.sources(function(sources) {

      // _.find(sources, function()
      // //get list of valid groupIds
      // //get list of valid names
      // var names = _.map(sources, function(source) {
        
      // });




    });
    //input in format of groupID or the name
    //if no input, returns the current input

    var url = this.baseurl + "screen/input";
    axios
      .get(url, { value: 0 })
      .then(function (response) {
        data = _.get(response, "data.data");

        //  data = _.map(data, function (d) {
        //    d.supportFrameRate = _.split(d.supportFrameRate, "|");
        //    d.supportResolution = _.split(d.supportResolution, "|");
        //    return d;
        //  });

        if (typeof cb == "function") return cb(data);
      })
      .catch(function (error) {
        console.log(error);
        if (typeof cb == "function") return cb(false);
      });
  };

  //GET /api/v1/device/preset
  this.presets = function () {
    console.log(ip);
    console.log("adjust display mode of the screen", value);
  };

  //PUT /api/v1/device/currentpreset
  this.preset = function () {
    console.log(ip);
    console.log("adjust display mode of the screen", value);
  };

  //get/set HDR per input
  //PUT api/v1/device/input/{id}/hdrmode
  this.hdr = function (input, hdr) {
    console.log(ip);
    console.log("adjust display mode of the screen", value);
  };

  //set dynamic boost
  // three endpoints need to be hit
  // PUT api/v1/device/processing/imagequality/ede/enable
  // PUT /api/v1/device/processing/imagequality/abl/enable
  // PUT /api/v1/device/processing/imagequality/itmo/enable
  this.hdr = function (input, hdr) {
    console.log(ip);
    console.log("adjust display mode of the screen", value);
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

  this.hdr = function (input, hdr) {
    console.log(ip);
    console.log("adjust display mode of the screen", value);
  };
};
