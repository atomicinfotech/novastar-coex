# novastar-coex
A javascript library for control of NovaStar COEX video wall processors


# Usage

## Connecting Instance

```javascript
const Novastar = require("./index");
const novastar = new Novastar("10.10.10.45");

//connect to an additional instance
const novastar2 = new Novastar("10.10.10.46");
novastar2.brightness(50);

```

## Brightness Instance

Defaults to all cabinets, but you can pass a list of cabinet ids and a callback function.


```javascript
novastar.brightness(brightness, [cabinetids], [cb]);
```

```javascript
//Examples
novastar.brightness(50);
novastar.brightness(10);
novastar.brightness(.25);
novastar.brightness(0);
```

## Display Mode

Defaults to all cabinets, but you can pass a list of cabinet ids and a callback function.

```javascript
novastar.brightness(displaymode, [cb]);
```

```javascript
//Examples
novastar.displaymode(0); //normal
novastar.displaymode(1); //blackout
novastar.displaymode(2); //freeze

//Altenative syntax
novastar.normal();
novastar.blackout();
novastar.freeze();
```

## Adjust Gamma

Defaults to all cabinets, but you can pass a list of cabinet ids and a callback function.

```javascript
  // gamma 1.0 to 4.0
  // [optional] type 0 = red, 1 = blue, 2 = green, 3 = all.  Default = 3
  // [optional] array of cabinetids
  // [optional] callback function


novastar.brightness(gamma, [type], [cabinetids], [cb]);
```

```javascript
//Examples
novastar.gamma(.5);
novastar.gamma(1);
novastar.gamma(2.5);
novastar.gamma(4);
novastar.gamma(40, 2);
novastar.gamma("2g");
novastar.gamma();

```

## Adjust Color Temperature

Defaults to all cabinets, but you can pass a list of cabinet ids and a callback function.

```javascript
  // colortemp 1700 to 15000
  // [optional] array of cabinetids
  // [optional] callback function
  // returns response, error

novastar.colortemperature(colortemp, [cabinetids], [cb]);

```

```javascript
//Examples
novastar.colortemperature(5500); //daylight
novastar.colortemperature(3400); //tungsten
novastar.colortemperature("1800K");
novastar.colortemperature(20000); //capped at 15000K
novastar.colortemperature(1000); //capped at 1700K

```

## Get List of cabinets


```javascript
  // returns array of cabinets

novastar.cabinet(function (response) {
  console.log(response);
});
```

```javascript
//Sample Result
[
  {
    resolution: { width: 176, height: 176 },
    size: { width: 500, height: 500 },
    weight: 5,
    power: 12,
    gamma: { r: 2.8, g: 2.8, b: 2.8 },
    colorTemperature: 5000,
    voltage: 5,
    rvCardName: 'A4S',
    brightness: 0.16,
    customGamma: false,
    gain: { r: 43, g: 43, b: 43 },
    outputID: 2,
    index: 0,
    bunchesIndex: 0,
    id: 2238902278684672,
    moduleCount: 4,
    cabType: '',
    indicatorLightState: true,
    manufacture: '',
    pointSpacing: '',
    shortName: '',
    familyName: '',
    ncpVersion: '',
    vsFreMax: 0,
    angle: 0,
    moduleSize: { overwrite: false, moduleRow: 255, moduleCol: 255 },
    rvCardInfo: {
      firmware: '4.6.1.0',
      driverChip: '',
      decodeIc: '',
      scanNumber: 30,
      moduleResolution: [Object],
      refreshRate: 1438.5902,
      grayScale: 13
    }
]

```

## Get List of sources

```javascript
  // returns array of sources

novastar.sources(function (response) {
  console.log(response);
});
```

```javascript
//Sample Result
[
  {
    id: 0,
    type: 9,
    name: '12G-SDI',
    step: 0,
    supportFrameRate: [
      '23.98',  '24.00',  '25.00',
      '29.97',  '30.00',  '47.95',
      '48.00',  '50.00',  '59.94',
      '60.00',  '71.93',  '72.00',
      '75.00',  '100.00', '119.88',
      '120.00', '143.86', '144.00',
      '240.00'
    ],
    supportResolution: [ '3840*2160' ],
    maxwidth: 4096,
    maxheight: 4096,
    minwidth: 800,
    minheight: 600,
    actualResolution: { height: 2160, width: 3840 },
    actualRefreshRate: 60,
    bitDepth: 0,
    colorSpace: 'RGB 4:4:4',
    dynamicRange: 'SDR',
    gamut: '',
    range: 0,
    scanMode: 0,
    inPhase: false,
    defaultEDID: { resolution: [Object], refreshRate: 60 },
    usable: true,
    groupId: 72,
    isSupportHDR: true,
    isSupportMetaData: false,
    isSupportEDID: false,
    isSupportInputOverride: true,
    isSupportColorAdjust: true,
    sourceChannel: 7,
    metaData: {
      minMasterDisplayLight: 0,
      maxMasterDisplayLight: 0,
      maxContentLight: 0,
      maxFrameAvgLight: 0,
      whitePointX: 0,
      whitePointY: 0
    },
    hDRParams: {
      overrideHdrType: 2,
      pqMode: 0,
      pqMaxCllChecked: true,
      pqMaxCll: 1000,
      realHdrType: 2
    },
    isSupportHDRParams: true,
    isSupportPQMaxCllChecked: false,
    hdrList: [ 0, 1, 2 ]
  },
]

```

## Change Input

Change the input.  Currently only works if processor is in "Send Only" Working mode.

```javascript
  // input Text name or groupId of source
  // [optional] callback function
  // returns response, error

novastar.input(input, [cb]);

```

```javascript
//Examples

novastar.input("DP1.2", function (response, error) {
  console.log(response);
});

novastar.input("12G-SDI");
novastar.input(40); // DP1.2 groupId on MX40 Pro

```


## List Presets 

```javascript
  // cb callback function
  // returns response, error

novastar.presets(cb);

```

```javascript
//Examples

novastar.presets(function (presets) {
  console.log(presets);
});

//Result
[
  {
    sequenceNumber: 1,
    time: '2022.12.13 09:58:28.414 Tue',
    name: 'Preset 1 Calibrated',
    sourceData: true,
    outputData: true,
    screenData: true,
    processingData: true
  },
]
```

## Change Preset

Change the processor preset.  Optional callback function.

```javascript
  // preset Text name or sequenceId of the preset
  // [optional] callback function
  // returns response, error

novastar.input(preset, [cb]);

```

```javascript
//Examples
novastar.preset('Preset 1 Calibrated', function (response) {
  console.log(response);
});

novastar.preset(11, function (response) {
  console.log(response);
});

```

## Change Workingmode

Change working mode between "Send Only" (Mode 2) and "All-in-One" Advanced Mode (Mode 3).  "Send Only" has reduced latency but only a single video layer.

```javascript
  // workingmode 2 = "Send Only, 3 = "All-in-One"
  // [optional] callback function
  // returns response, error

novastar.input(workingmode, [cb]);

```

```javascript
//Examples
novastar.workingmode(2, function (response) { //send only
  console.log(response);
});

novastar.workingmode(3, function (response) { //all-in-one
  console.log(response);
});

```


## Change Internal Test Pattern



```javascript
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
    //   red: 0-255,
    //   green: 0-255,
    //   blue: 0-255,
    //   gray: 0-255,
    //   gridWidth: 1,
    //   moveSpeed: 0-100,
    //   gradientStretch : 1-20,
    //   state : 0-1
    // }
  // [optional] callback function

novastar.testpattern(mode, parameters, [cb]);

```

```javascript
//Examples
novastar.testpattern(32, function (response, error) {
  console.log(response);
});

novastar.testpattern(16);

```



# Known Issues

1. Input selection currently only works when processor is in "Send Only" working mode.  Input selection on layers when in All in One mode is not yet supported.  As soon as the API supports it, and we get documentation, it will be implemented.

2. Setting working mode to 3 (All-In-One) doesn't work.

