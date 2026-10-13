var fs = require("fs");
var http = require("http");
var path = require("path");
var url = require("url");
var memoryjs = require("memoryjs");
var jsdom = require("jsdom");
var net = require("net");
//var buffer = require("node:buffer");
//buffer.INSPECT_MAX_BYTES = 2048;
var {JSDOM} = jsdom;
var moduleObject = undefined;
var processObject = undefined;
var processList = [];
var modulesList = [];
var gameMemoryConfigFileName = "winamp_memory.json";
var gameMemory = JSON.parse(fs.readFileSync(gameMemoryConfigFileName, "utf8"));
var overlayPath = gameMemory.overlay_path;
overlayPath = overlayPath.replace(/({{path_separator}})+/ig, path.sep);
var processName = gameMemory.process_name;
var gameMemoryToDisplay = [];
var gameMemoryToOverride = [];
var webServerPort = 8080;
var tcpServerPort = 1337;
for (let gameMemoryObjectIndex = 0; gameMemoryObjectIndex < gameMemory.memory_data.length; gameMemoryObjectIndex++) {
  if (gameMemory.memory_data[gameMemoryObjectIndex].to_override == true) {
    if (gameMemory.memory_data[gameMemoryObjectIndex].module_name !== "") {
      gameMemoryToOverride.push(gameMemory.memory_data[gameMemoryObjectIndex]);
    }
  }
  if (gameMemory.memory_data[gameMemoryObjectIndex].to_display == true) {
    if (gameMemory.memory_data[gameMemoryObjectIndex].module_name !== "") {
      //console.log(gameMemory.memory_data[gameMemoryObjectIndex]);
      gameMemoryToDisplay.push(gameMemory.memory_data[gameMemoryObjectIndex]);
    }
  }
}

var baseMemoryAddress = parseInt(gameMemory.base_address, 16);
var endMemoryAddress = parseInt(gameMemory.end_address, 16);

var basePointerAddress = parseInt(gameMemory.base_pointer_address, 16);
var endPointerAddress = parseInt(gameMemory.end_pointer_address, 16);

var ajaxAmpAddress = gameMemory.ajaxamp_address;
var ajaxAmpPort = gameMemory.ajaxamp_port;

var spectrumAnalyzerMultiplier = 4;
var spectrumLowResSize = 16;
var int32SizeBytes = 4;
var bitrateKbpsName = "Bitrate kbps 1";
var bitrateKbpsObject = {};
var lengthSecondsName = "Length Seconds 1";
var lengthSecondsObject = {};
var volumeName = "Volume 1";
var volumeObject = {};
var visualizerStateName = "Visualizer State 1";
var visualizerStateObject = {};
var positionSecondsName = "Position Seconds 1";
var positionSecondsObject = {};
var audioChannelsName = "Audio Channels 2";
var audioChannelsObject = {};
var repeatName = "Repeat 1";
var repeatObject = {};
var eqAutoStateName = "EQ Auto State 1";
var eqAutoStateObject = {};
var shuffleName = "Shuffle 1";
var shuffleObject = {};
var eqStateName = "EQ State 1";
var eqStateObject = {};
var balanceName = "Balance 1";
var balanceObject = {};
var timeDisplayName = "Time Display 1";
var timeDisplayObject = {};
var sampleRateKhzName = "Sample Rate kHz 2";
var sampleRateKhzObject = {};
var sampleRateHzName = "Sample Rate Hz 2";
var sampleRateHzObject = {};
var eq70HzName = "EQ 70Hz Float 1";
var eq70HzObject = {};
var eq180HzName = "EQ 180Hz Float 1";
var eq180HzObject = {};
var eq320HzName = "EQ 320Hz Float 1";
var eq320HzObject = {};
var eq600HzName = "EQ 600Hz Float 1";
var eq600HzObject = {};
var eq1KhzName = "EQ 1kHz Float 1";
var eq1KhzObject = {};
var eq3KhzName = "EQ 3kHz Float 1";
var eq3KhzObject = {};
var eq6KhzName = "EQ 6kHz Float 1";
var eq6KhzObject = {};
var eq12KhzName = "EQ 12kHz Float 1";
var eq12KhzObject = {};
var eq14KhzName = "EQ 14kHz Float 1";
var eq14KhzObject = {};
var eq16KhzName = "EQ 16kHz Float 1";
var eq16KhzObject = {};
var windowTitleUnicodeName = "Window Title Unicode 1";
var windowTitleUnicodeObject = {};
var filenameUnicodeName = "Filename Unicode 1";
var filenameUnicodeObject = {};
var songTitleNoNumberUnicodeName = "Song Title No Number Unicode 1";
var songTitleNoNumberUnicodeObject = {};
var songTitleUnicodeName = "Song Title Unicode 1";
var songTitleUnicodeObject = {};
var spectrumAnalyzerPeakName = "Spectrum Analyzer Peak";
var spectrumAnalyzerPeakObject = {};
var spectrumAnalyzerName = "Spectrum Analyzer 3";
var spectrumAnalyzerObject = {};

var windowTitleUnicodeUtf16leBufferObject = {};
var windowTitleNoUnicodeAsciiBufferObject = {};

var filenameUnicodeUtf16leBufferObject = {};
var filenameNoUnicodeAsciiBufferObject = {};

var songTitleNoNumberUnicodeUtf16leBufferObject = {};
var songTitleNoNumberNoUnicodeAsciiBufferObject = {};

var songTitleUnicodeUtf16leBufferObject = {};
var songTitleNoUnicodeAsciiBufferObject = {};

var spectrumAnalyzerSize = 304;
var spectrumAnalyzerPeakSize = 304;
var spectrumAnalyzerPeakMax = 3837;
var spectrumAnalyzerMax = 60;
var winampDisplayDataDefaultObject = {
  bitrate_kbps: 0,
  length_seconds_total: 0,
  length_seconds: 0,
  length_minutes_1: 0,
  length_minutes_2: 0,
  length_hours_1: 0,
  length_hours_2: 0,
  length_days: 0,
  length_minutes_seconds_string: "00:00",
  length_hours_minutes_seconds_string: "00:00:00",
  length_days_hours_minutes_seconds_string: "00:00:00:00",
  volume_level: 255,
  visualizer_state: 0,
  position_seconds_total: 0,
  position_seconds: 0,
  position_minutes_1: 0,
  position_minutes_2: 0,
  position_hours_1: 0,
  position_hours_2: 0,
  position_days: 0,
  position_minutes_seconds_string: "00:00",
  position_hours_minutes_seconds_string: "00:00:00",
  position_days_hours_minutes_seconds_string: "00:00:00:00",
  remaining_seconds_total: 0,
  remaining_seconds: 0,
  remaining_minutes_1: 0,
  remaining_minutes_2: 0,
  remaining_hours_1: 0,
  remaining_hours_2: 0,
  remaining_days: 0,
  remaining_minutes_seconds_string: "00:00",
  remaining_hours_minutes_seconds_string: "00:00:00",
  remaining_days_hours_minutes_seconds_string: "00:00:00:00",
  audio_channels: 0,
  repeat_state: 1,
  eq_auto_state: 0,
  shuffle_state: 0,
  eq_state: 0,
  balance_pan: 0,
  time_display_state: 0,
  sample_rate_khz: 0,
  sample_rate_hz: 0,
  eq_70hz_float: 0,
  eq_70hz_int: 128,
  eq_180hz_float: 0,
  eq_180hz_int: 128,
  eq_320hz_float: 0,
  eq_320hz_int: 128,
  eq_600hz_float: 0,
  eq_600hz_int: 128,
  eq_1khz_float: 0,
  eq_1khz_int: 128,
  eq_3khz_float: 0,
  eq_3khz_int: 128,
  eq_6khz_float: 0,
  eq_6khz_int: 128,
  eq_12khz_float: 0,
  eq_12khz_int: 128,
  eq_14khz_float: 0,
  eq_14khz_int: 128,
  eq_16khz_float: 0,
  eq_16khz_int: 128,
  window_title_unicode_string: "Winamp",
  window_title_ascii_string: "Winamp",
  filename_unicode_string: "Winamp",
  filename_ascii_string: "Winamp",
  song_title_no_number_unicode_string: "Winamp",
  song_title_no_number_ascii_string: "Winamp",
  song_title_unicode_string: "Winamp",
  song_title_ascii_string: "Winamp",
  spectrum_analyzer_high_res_peak: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  spectrum_analyzer_low_res_peak: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  spectrum_analyzer_high_res: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  spectrum_analyzer_low_res: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};
var winampDisplayDataObject = {
  bitrate_kbps: 0,
  length_seconds_total: 0,
  length_seconds: 0,
  length_minutes_1: 0,
  length_minutes_2: 0,
  length_hours_1: 0,
  length_hours_2: 0,
  length_days: 0,
  length_minutes_seconds_string: "00:00",
  length_hours_minutes_seconds_string: "00:00:00",
  length_days_hours_minutes_seconds_string: "00:00:00:00",
  volume_level: 255,
  visualizer_state: 0,
  position_seconds_total: 0,
  position_seconds: 0,
  position_minutes_1: 0,
  position_minutes_2: 0,
  position_hours_1: 0,
  position_hours_2: 0,
  position_days: 0,
  position_minutes_seconds_string: "00:00",
  position_hours_minutes_seconds_string: "00:00:00",
  position_days_hours_minutes_seconds_string: "00:00:00:00",
  remaining_seconds_total: 0,
  remaining_seconds: 0,
  remaining_minutes_1: 0,
  remaining_minutes_2: 0,
  remaining_hours_1: 0,
  remaining_hours_2: 0,
  remaining_days: 0,
  remaining_minutes_seconds_string: "00:00",
  remaining_hours_minutes_seconds_string: "00:00:00",
  remaining_days_hours_minutes_seconds_string: "00:00:00:00",
  audio_channels: 0,
  repeat_state: 1,
  eq_auto_state: 0,
  shuffle_state: 0,
  eq_state: 0,
  balance_pan: 0,
  time_display_state: 0,
  sample_rate_khz: 0,
  sample_rate_hz: 0,
  eq_70hz_float: 0,
  eq_70hz_int: 128,
  eq_180hz_float: 0,
  eq_180hz_int: 128,
  eq_320hz_float: 0,
  eq_320hz_int: 128,
  eq_600hz_float: 0,
  eq_600hz_int: 128,
  eq_1khz_float: 0,
  eq_1khz_int: 128,
  eq_3khz_float: 0,
  eq_3khz_int: 128,
  eq_6khz_float: 0,
  eq_6khz_int: 128,
  eq_12khz_float: 0,
  eq_12khz_int: 128,
  eq_14khz_float: 0,
  eq_14khz_int: 128,
  eq_16khz_float: 0,
  eq_16khz_int: 128,
  window_title_unicode_string: "Winamp",
  window_title_ascii_string: "Winamp",
  filename_unicode_string: "Winamp",
  filename_ascii_string: "Winamp",
  song_title_no_number_unicode_string: "Winamp",
  song_title_no_number_ascii_string: "Winamp",
  song_title_unicode_string: "Winamp",
  song_title_ascii_string: "Winamp",
  spectrum_analyzer_high_res_peak: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  spectrum_analyzer_low_res_peak: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  spectrum_analyzer_high_res: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  spectrum_analyzer_low_res: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};
winampDisplayDataObject = winampDisplayDataDefaultObject;
var winampDisplayDataDefaultBuffer = Buffer.alloc(610, 0);
var winampDisplayDataBufferIndex = 0;
//console.log(winampDisplayDataBuffer);
//winampDisplayDataBuffer.writeInt32LE(0x7FFFFFFF, 0)
//winampDisplayDataDefaultBuffer[0] = 0xFF;
winampDisplayDataDefaultBuffer[0] = 0x00; // This first byte can be used to indicate register(?)
winampDisplayDataDefaultBuffer[1] = 0x00;
winampDisplayDataDefaultBuffer[2] = 0x01;
winampDisplayDataDefaultBuffer[3] = 0x23;
winampDisplayDataDefaultBuffer[4] = 0x45;
winampDisplayDataDefaultBuffer[5] = 0x67;
winampDisplayDataDefaultBuffer[6] = 0x89;
winampDisplayDataDefaultBuffer[7] = 0xAB;
winampDisplayDataDefaultBuffer[8] = 0xCD;
winampDisplayDataDefaultBuffer[9] = 0xEF; // Magic number for TCP/UDP/Serial binary communication
winampDisplayDataDefaultBuffer[10] = 0x00;
winampDisplayDataDefaultBuffer[11] = 0x00;
winampDisplayDataDefaultBuffer[12] = 0x00; // This is where data actually starts
var winampDisplayDataBuffer = winampDisplayDataDefaultBuffer;
//console.log(winampDisplayDataBuffer);

//var tcpClients = [];

var tcpServer = net.createServer(function(tcpSocket) {
  //console.log(tcpSocket);
  //console.log(new Date().toISOString() + " Client connected: tcpSocket.remoteAddress = " + tcpSocket.remoteAddress + " tcpSocket.remotePort = " + tcpSocket.remotePort);
  //let tcpClientId = tcpSocket.remoteAddress + ":" + tcpSocket.remotePort;
  //console.log(new Date().toISOString() + " A tcpSocket.remoteAddress = " + tcpSocket.remoteAddress + " tcpSocket.remotePort = " + tcpSocket.remotePort);
  //tcpClients.push(tcpSocket);
  //console.log(tcpClients);
  tcpSocket.on("data", function(data) {
    //console.log(new Date().toISOString() + " Client sent message: tcpSocket.remoteAddress = " + tcpSocket.remoteAddress + " tcpSocket.remotePort = " + tcpSocket.remotePort);
    //let tcpClientId = tcpSocket.remoteAddress + ":" + tcpSocket.remotePort;
    //console.log(new Date().toISOString() + " B tcpSocket.remoteAddress = " + tcpSocket.remoteAddress + " tcpSocket.remotePort = " + tcpSocket.remotePort);
    //console.log(new Date().toISOString() + " tcpClientId " + tcpClientId);
    //console.log("TEST A");
    //console.log(tcpSocket);
    //console.log("TEST B");
    //console.log(new Date().toISOString() + " Received from client: " + data);
    //console.log(new Date().toISOString() + " data.length = " + data.length);
    //console.log(data.byteLength); // Undefined
    //console.log(new Date().toISOString() + " [...data].length = " + [...data].length);
    //console.log([...data].byteLength); // Undefined
    //let dataStringToBuffer = Buffer.alloc(data.length, 0);
    //dataStringToBuffer.write(data, 0, data.length, "binary");
    //console.log(dataStringToBuffer);
    /*
    for (let tcpByteIndex = 0; tcpByteIndex < data.length; tcpByteIndex++) {
      console.log(new Date().toISOString() + " index " + tcpByteIndex + " = " + data[tcpByteIndex].toString(16));
    }
    */
    //console.log(new Date().toISOString() + " " + data[0].toString(16));
    //console.log(new Date().toISOString() + " " + data[1].toString(16));
    //console.log(new Date().toISOString() + " " + data[2].toString(16));
    //console.log(new Date().toISOString() + " " + data[3].toString(16));
    //console.log(new Date().toISOString() + " " + data[4].toString(16));
    //console.log(new Date().toISOString() + " " + data[5].toString(16));
    //console.log(new Date().toISOString() + " " + data[6].toString(16));
    //console.log(new Date().toISOString() + " " + data[7].toString(16));
    //console.log(new Date().toISOString() + " " + data[8].toString(16));
    //console.log(new Date().toISOString() + " " + data[9].toString(16));
    //console.log(new Date().toISOString() + " " + data[10].toString(16));
    //console.log(new Date().toISOString() + " " + data[11].toString(16));
    //console.log(new Date().toISOString() + " " + data[12].toString(16));
    if (data.length == 13) {
      //console.log(new Date().toISOString() + " A client might be requesting winamp data");
      if (data[0] == 0x01) {
        //console.log(new Date().toISOString() + " A client is definitely requesting winamp data, check the magic number");
        if (data[2] == 0x01 && data[3] == 0x23 && data[4] == 0x45 && data[5] == 0x67 && data[6] == 0x89 && data[7] == 0xAB && data[8] == 0xCD && data[9] == 0xEF) {
          //console.log(new Date().toISOString() + " Cool, magic number is valid");
          if (data[11] == 0x01) {
            //console.log(new Date().toISOString() + " Yeah confirmed, we can now send the data");
            //sendTcpMessageToClient(tcpSocket, winampDisplayDataBuffer);
            checkIfAppExists(tcpSocket);
          }
        }
      }
    }
  });
  // TODO: Send empty data when there's no Winamp running (DONE?)
  // TODO: Define default values for Winamp variables (for sending empty data) (DONE)
  // TODO: Make variable that goes from 0 to 1 (or 0 to 65535? or 0 to max int 32?) or something for progress bar (Is this really needed, I already have duration, position and remaining)
  // TODO: Clear buffer and object on every loop (DONE)
  // TODO: Check message lengths (DONE)
  tcpSocket.on("end", function() {
    //console.log(new Date().toISOString() + " Client disconnected: tcpSocket.remoteAddress = " + tcpSocket.remoteAddress + " tcpSocket.remotePort = " + tcpSocket.remotePort);
  });
  tcpSocket.on("error", function(error) {
    //console.log(new Date().toISOString() + "  TCP Error: " + error);
  });
  //tcpSocket.write("This is a test123");
  //console.log(winampDisplayDataBuffer.toString("ascii"));
  //console.log(winampDisplayDataBuffer);
  //let tcpDataToSend = Buffer.from(winampDisplayDataBuffer); // Buffer
  //tcpSocket.write(winampDisplayDataBuffer);
  //console.log(tcpDataToSend);
  //tcpSocket.pipe(tcpSocket);
});

function sendTcpMessageToClient(tcpClientObject, bufferToSend) {
  //console.log(new Date().toISOString() + " We have to send real Winamp data 1");
  if (tcpClientObject == null || tcpClientObject == undefined) {
    console.log(new Date().toISOString() + " We can't send real Winamp data because the client is invalid");
    return;
  }
  //console.log(new Date().toISOString() + " We have to send real Winamp data 2");
  //console.log(tcpClientObject);
  if (tcpClientObject != null && tcpClientObject != undefined) {
    //console.log(new Date().toISOString() + " We have to send real Winamp data 3");
    tcpClientObject.write(bufferToSend);
  }
  //
}

tcpServer.listen(tcpServerPort);

console.log(new Date().toISOString() + " TCP Server started on port " + tcpServerPort);

// TODO: Make client to test tcp and figure out how it works (DONE)

function overrideGameSettings() {
  if (gameMemory.override_game_settings == false) {
    return;
  }
  // Override some game settings to specific values when player pointer changes to a valid address
  console.log(new Date().toISOString() + " Overriding game settings");
  for (let gameMemoryToOverrideIndex = 0; gameMemoryToOverrideIndex < gameMemoryToOverride.length; gameMemoryToOverrideIndex++) {
    //console.log(new Date().toISOString() + " [" + gameMemoryToOverrideIndex + "] Overriding " + gameMemoryToOverride[gameMemoryToOverrideIndex].address_name + " with " + gameMemoryToOverride[gameMemoryToOverrideIndex].value_to_override_with)
    writeToAppMemory(gameMemoryToOverride[gameMemoryToOverrideIndex].address_name, gameMemoryToOverride[gameMemoryToOverrideIndex].value_to_override_with);
    //console.log(new Date().toISOString() + " [" + gameMemoryToOverrideIndex + "] Overrode " + gameMemoryToOverride[gameMemoryToOverrideIndex].address_name + " with " + gameMemoryToOverride[gameMemoryToOverrideIndex].value_to_override_with)
  }
  console.log(new Date().toISOString() + " Overrode game settings");
}

function ajaxAmpGetConsoleStatus() {
  //console.log(new Date().toISOString() + " [AJAXAMP] EXECUTING COMMAND ajaxAmpGetConsoleStatus()");
  let rawOutputData = "";

  let options = {
    hostname: ajaxAmpAddress,
    port: ajaxAmpPort,
    path: "/consolestatus.xml",
    method: "GET"
  };

  let req = http.request(options, function(res) {
    //console.log("statusCode: " + res.statusCode);
    res.on("data", function(d) {
      //console.log(JSON.parse(d.toString("utf8")));
      rawOutputData = rawOutputData + d.toString("utf8");
    });
    res.on("end", function() {
      //console.log(rawOutputData);
      let cleanedUpXml = rawOutputData.replace(/((\<\!\[CDATA\[)+|(\]+\>+)+)+/ig, " "); // idk why but this works
      cleanedUpXml = cleanedUpXml.trim();
      cleanedUpXml = cleanedUpXml.replace(/(\<+\s+)+/ig, "<");
      cleanedUpXml = cleanedUpXml.replace(/(\>+\s+)+/ig, ">");
      cleanedUpXml = cleanedUpXml.replace(/(\s+\>+)+/ig, ">");
      cleanedUpXml = cleanedUpXml.replace(/(\s+\<+)+/ig, "<");
      cleanedUpXml = cleanedUpXml.replace(/(\<+\/+\s+)+/ig, "<\/");
      cleanedUpXml = cleanedUpXml.trim();
      //console.log(cleanedUpXml);
      //let domString = cleanedUpXml;
      let dom = new JSDOM(cleanedUpXml);
      //console.log(domString);
      let ajaxAmpVolume = parseInt((dom.window.document.querySelector("volume").textContent).trim(), 10);
      let ajaxAmpShuffle = parseInt((dom.window.document.querySelector("shuffle").textContent).trim(), 10);
      let ajaxAmpRepeat = parseInt((dom.window.document.querySelector("repeat").textContent).trim(), 10);
      let ajaxAmpAlbum = (dom.window.document.querySelector("album").textContent).trim();
      let ajaxAmpArtist = (dom.window.document.querySelector("artist").textContent).trim();
      let ajaxAmpTitle = (dom.window.document.querySelector("title").textContent).trim();
      let ajaxAmpFilename = (dom.window.document.querySelector("filename").textContent).trim();
      let ajaxAmpLength = (dom.window.document.querySelector("length").textContent).trim();
      let ajaxAmpLengthMs = parseInt((dom.window.document.querySelector("lengthms").textContent).trim(), 10);
      let ajaxAmpBitrate = parseInt((dom.window.document.querySelector("bitrate").textContent).trim(), 10);
      let ajaxAmpPositionFloat = parseFloat((dom.window.document.querySelector("position").textContent).trim());
      //console.log(new Date().toISOString() + " " + ajaxAmpPositionFloat);
      //console.log((dom.window.document.querySelector("filename").textContent).trim()); // "Hello world"
      //console.log(new Date().toISOString() + " [AJAXAMP] SUCCESSFULLY EXECUTED COMMAND ajaxAmpGetConsoleStatus()");
    });
  });

  req.on("error", function(error) {
    console.log(new Date().toISOString() + " [AJAXAMP] ERROR EXECUTING COMMAND ajaxAmpGetConsoleStatus()");
    console.error(error);
  });
  req.end();
}

function ajaxAmpSetPositionMillis(positionMillisToSet) {
  //console.log(new Date().toISOString() + " [AJAXAMP] EXECUTING COMMAND ajaxAmpSetPositionMillis(positionMillisToSet = " + positionMillisToSet + ")");
  let rawOutputData = "";
  let positionFloatToSet = 0;

  let options = {
    hostname: ajaxAmpAddress,
    port: ajaxAmpPort,
    path: "/consolestatus.xml",
    method: "GET"
  };

  let req = http.request(options, function(res) {
    //console.log("statusCode: " + res.statusCode);
    res.on("data", function(d) {
      //console.log(JSON.parse(d.toString("utf8")));
      rawOutputData = rawOutputData + d.toString("utf8");
    });
    res.on("end", function() {
      //console.log(rawOutputData);
      let cleanedUpXml = rawOutputData.replace(/((\<\!\[CDATA\[)+|(\]+\>+)+)+/ig, " "); // idk why but this works
      cleanedUpXml = cleanedUpXml.trim();
      cleanedUpXml = cleanedUpXml.replace(/(\<+\s+)+/ig, "<");
      cleanedUpXml = cleanedUpXml.replace(/(\>+\s+)+/ig, ">");
      cleanedUpXml = cleanedUpXml.replace(/(\s+\>+)+/ig, ">");
      cleanedUpXml = cleanedUpXml.replace(/(\s+\<+)+/ig, "<");
      cleanedUpXml = cleanedUpXml.replace(/(\<+\/+\s+)+/ig, "<\/");
      cleanedUpXml = cleanedUpXml.trim();
      //console.log(cleanedUpXml);
      //let domString = cleanedUpXml;
      let dom = new JSDOM(cleanedUpXml);
      //console.log(cleanedUpXml);
      //console.log(domString);
      let ajaxAmpVolume = parseInt((dom.window.document.querySelector("volume").textContent).trim(), 10);
      let ajaxAmpShuffle = parseInt((dom.window.document.querySelector("shuffle").textContent).trim(), 10);
      let ajaxAmpRepeat = parseInt((dom.window.document.querySelector("repeat").textContent).trim(), 10);
      let ajaxAmpAlbum = (dom.window.document.querySelector("album").textContent).trim();
      let ajaxAmpArtist = (dom.window.document.querySelector("artist").textContent).trim();
      let ajaxAmpTitle = (dom.window.document.querySelector("title").textContent).trim();
      let ajaxAmpFilename = (dom.window.document.querySelector("filename").textContent).trim();
      let ajaxAmpLength = (dom.window.document.querySelector("length").textContent).trim();
      let ajaxAmpLengthMs = parseInt((dom.window.document.querySelector("lengthms").textContent).trim(), 10);
      let ajaxAmpBitrate = parseInt((dom.window.document.querySelector("bitrate").textContent).trim(), 10);
      let ajaxAmpPositionFloat = parseFloat((dom.window.document.querySelector("position").textContent).trim());
      positionFloatToSet = positionMillisToSet / ajaxAmpLengthMs;
      //console.log("positionMillisToSet = " + positionMillisToSet);
      //console.log("ajaxAmpLengthMs = " + ajaxAmpLengthMs);
      //console.log("SETTING POSITION TO " + positionFloatToSet);
      ajaxAmpSetPosition(positionFloatToSet);
      //ajaxAmpSetVolume(gameMemory.ajaxamp_max_volume);
      //console.log(new Date().toISOString() + " " + ajaxAmpPositionFloat);
      //console.log((dom.window.document.querySelector("filename").textContent).trim()); // "Hello world"
      //console.log(new Date().toISOString() + " [AJAXAMP] SUCCESSFULLY EXECUTED COMMAND ajaxAmpSetPositionMillis(positionMillisToSet = " + positionMillisToSet + ")");
    });
  });

  req.on("error", function(error) {
    console.log(new Date().toISOString() + " [AJAXAMP] ERROR EXECUTING COMMAND ajaxAmpSetPositionMillis(positionMillisToSet = " + positionMillisToSet + ")");
    console.error(error);
  });
  req.end();
}

function ajaxAmpToggleRepeat() {
  //console.log(new Date().toISOString() + " [AJAXAMP] EXECUTING COMMAND ajaxAmpToggleRepeat()");
  let rawOutputData = "";

  let options = {
    hostname: ajaxAmpAddress,
    port: ajaxAmpPort,
    path: "/togglerepeat",
    method: "POST"
  };

  let req = http.request(options, function(res) {
    //console.log("statusCode: " + res.statusCode);
    res.on("data", function(d) {
      //console.log(JSON.parse(d.toString("utf8")));
      rawOutputData = rawOutputData + d.toString("utf8");
    });
    res.on("end", function() {
      //console.log(rawOutputData);
      //console.log(new Date().toISOString() + " [AJAXAMP] SUCCESSFULLY EXECUTED COMMAND ajaxAmpToggleRepeat()");
    });
  });

  req.on("error", function(error) {
    console.log(new Date().toISOString() + " [AJAXAMP] ERROR EXECUTING COMMAND ajaxAmpToggleRepeat()");
    console.error(error);
  });
  req.end();
}

function ajaxAmpPlay() {
  //console.log(new Date().toISOString() + " [AJAXAMP] EXECUTING COMMAND ajaxAmpPlay()");
  let rawOutputData = "";

  let options = {
    hostname: ajaxAmpAddress,
    port: ajaxAmpPort,
    path: "/play",
    method: "POST"
  };

  let req = http.request(options, function(res) {
    //console.log("statusCode: " + res.statusCode);
    res.on("data", function(d) {
      //console.log(JSON.parse(d.toString("utf8")));
      rawOutputData = rawOutputData + d.toString("utf8");
    });
    res.on("end", function() {
      //console.log(rawOutputData);
      //console.log(new Date().toISOString() + " [AJAXAMP] SUCCESSFULLY EXECUTED COMMAND ajaxAmpPlay()");
    });
  });

  req.on("error", function(error) {
    console.log(new Date().toISOString() + " [AJAXAMP] ERROR EXECUTING COMMAND ajaxAmpPlay()");
    console.error(error);
  });
  req.end();
}

function ajaxAmpStop() {
  //console.log(new Date().toISOString() + " [AJAXAMP] EXECUTING COMMAND ajaxAmpStop()");
  let rawOutputData = "";

  let options = {
    hostname: ajaxAmpAddress,
    port: ajaxAmpPort,
    path: "/stop",
    method: "POST"
  };

  let req = http.request(options, function(res) {
    //console.log("statusCode: " + res.statusCode);
    res.on("data", function(d) {
      //console.log(JSON.parse(d.toString("utf8")));
      rawOutputData = rawOutputData + d.toString("utf8");
    });
    res.on("end", function() {
      //console.log(rawOutputData);
      //console.log(new Date().toISOString() + " [AJAXAMP] SUCCESSFULLY EXECUTED COMMAND ajaxAmpStop()");
    });
  });

  req.on("error", function(error) {
    console.log(new Date().toISOString() + " [AJAXAMP] ERROR EXECUTING COMMAND ajaxAmpStop()");
    console.error(error);
  });
  req.end();
}

function ajaxAmpPause() {
  //console.log(new Date().toISOString() + " [AJAXAMP] EXECUTING COMMAND ajaxAmpPause()");
  let rawOutputData = "";

  let options = {
    hostname: ajaxAmpAddress,
    port: ajaxAmpPort,
    path: "/pause",
    method: "POST"
  };

  let req = http.request(options, function(res) {
    //console.log("statusCode: " + res.statusCode);
    res.on("data", function(d) {
      //console.log(JSON.parse(d.toString("utf8")));
      rawOutputData = rawOutputData + d.toString("utf8");
    });
    res.on("end", function() {
      //console.log(rawOutputData);
      //console.log(new Date().toISOString() + " [AJAXAMP] SUCCESSFULLY EXECUTED COMMAND ajaxAmpPause()");
    });
  });

  req.on("error", function(error) {
    console.log(new Date().toISOString() + " [AJAXAMP] ERROR EXECUTING COMMAND ajaxAmpPause()");
    console.error(error);
  });
  req.end();
}

function ajaxAmpPlayFileAtSpecificPositionFloat(fileNameToPlay, positionToSpecifyFloat) {
  //console.log(new Date().toISOString() + " [AJAXAMP] EXECUTING COMMAND ajaxAmpPlayFileAtSpecificPositionFloat(fileNameToPlay = " + fileNameToPlay + ", positionToSpecifyFloat = " + positionToSpecifyFloat + ")");
  let rawOutputData = "";

  let options = {
    hostname: ajaxAmpAddress,
    port: ajaxAmpPort,
    path: "/playfile?filename=" + fileNameToPlay,
    method: "POST"
  };

  let req = http.request(options, function(res) {
    //console.log("statusCode: " + res.statusCode);
    res.on("data", function(d) {
      //console.log(JSON.parse(d.toString("utf8")));
      rawOutputData = rawOutputData + d.toString("utf8");
    });
    res.on("end", function() {
      //console.log(rawOutputData);
      //ajaxAmpSetVolume(0); // Volume is 8 bit-unsigned integer 0-255
      //ajaxAmpSetPosition(0); // Float from 0 to 1
      //ajaxAmpPause();
      ajaxAmpSetPosition(positionToSpecifyFloat);
      //console.log(new Date().toISOString() + " [AJAXAMP] SUCCESSFULLY EXECUTED COMMAND ajaxAmpPlayFileAtSpecificPositionFloat(fileNameToPlay = " + fileNameToPlay + ", positionToSpecifyFloat = " + positionToSpecifyFloat + ")");
    });
  });

  req.on("error", function(error) {
    console.log(new Date().toISOString() + " [AJAXAMP] ERROR EXECUTING COMMAND ajaxAmpPlayFileAtSpecificPositionFloat(fileNameToPlay = " + fileNameToPlay + ", positionToSpecifyFloat = " + positionToSpecifyFloat + ")");
    console.error(error);
  });
  req.end();
}

function ajaxAmpPlayFileAtSpecificPositionMillis(fileNameToPlay, positionToSpecifyMillis) {
  //console.log(new Date().toISOString() + " [AJAXAMP] EXECUTING COMMAND ajaxAmpPlayFileAtSpecificPositionMillis(fileNameToPlay = " + fileNameToPlay + ", positionToSpecifyMillis = " + positionToSpecifyMillis + ")");
  //ajaxAmpSetVolume(0);
  let rawOutputData = "";

  let options = {
    hostname: ajaxAmpAddress,
    port: ajaxAmpPort,
    path: "/playfile?filename=" + fileNameToPlay,
    method: "POST"
  };

  let req = http.request(options, function(res) {
    //console.log("statusCode: " + res.statusCode);
    res.on("data", function(d) {
      //console.log(JSON.parse(d.toString("utf8")));
      rawOutputData = rawOutputData + d.toString("utf8");
    });
    res.on("end", function() {
      //console.log(rawOutputData);
      //ajaxAmpSetVolume(0); // Volume is 8 bit-unsigned integer 0-255
      //ajaxAmpSetPosition(0); // Float from 0 to 1
      //ajaxAmpPause();
      ajaxAmpSetPositionMillis(positionToSpecifyMillis);
      //ajaxAmpSetVolume(gameMemory.ajaxamp_max_volume);
      //console.log(new Date().toISOString() + " [AJAXAMP] SUCCESSFULLY EXECUTED COMMAND ajaxAmpPlayFileAtSpecificPositionMillis(fileNameToPlay = " + fileNameToPlay + ", positionToSpecifyMillis = " + positionToSpecifyMillis + ")");
    });
  });

  req.on("error", function(error) {
    console.log(new Date().toISOString() + " [AJAXAMP] ERROR EXECUTING COMMAND ajaxAmpPlayFileAtSpecificPositionMillis(fileNameToPlay = " + fileNameToPlay + ", positionToSpecifyMillis = " + positionToSpecifyMillis + ")");
    console.error(error);
  });
  req.end();
}

function ajaxAmpPlayFile(fileNameToPlay) {
  //console.log(new Date().toISOString() + " [AJAXAMP] EXECUTING COMMAND ajaxAmpPlayFile(fileNameToPlay = " + fileNameToPlay + ")");
  let rawOutputData = "";

  let options = {
    hostname: ajaxAmpAddress,
    port: ajaxAmpPort,
    path: "/playfile?filename=" + fileNameToPlay,
    method: "POST"
  };

  let req = http.request(options, function(res) {
    //console.log("statusCode: " + res.statusCode);
    res.on("data", function(d) {
      //console.log(JSON.parse(d.toString("utf8")));
      rawOutputData = rawOutputData + d.toString("utf8");
    });
    res.on("end", function() {
      //console.log(rawOutputData);
      //console.log(new Date().toISOString() + " [AJAXAMP] SUCCESSFULLY EXECUTED COMMAND ajaxAmpPlayFile(fileNameToPlay = " + fileNameToPlay + ")");
    });
  });

  req.on("error", function(error) {
    console.log(new Date().toISOString() + " [AJAXAMP] ERROR EXECUTING COMMAND ajaxAmpPlayFile(fileNameToPlay = " + fileNameToPlay + ")");
    console.error(error);
  });
  req.end();
}

function ajaxAmpSetRepeat(repeatValue) {
  //console.log(new Date().toISOString() + " [AJAXAMP] EXECUTING COMMAND ajaxAmpSetRepeat(repeatValue = " + repeatValue + ")");
  // Parameter for repeat command actually unknown, need to find out, for now it is only being used to disable repeat
  let rawOutputData = "";

  let options = {
    hostname: ajaxAmpAddress,
    port: ajaxAmpPort,
    path: "/setrepeat?repeat=" + repeatValue,
    method: "POST"
  };

  let req = http.request(options, function(res) {
    //console.log("statusCode: " + res.statusCode);
    res.on("data", function(d) {
      //console.log(JSON.parse(d.toString("utf8")));
      rawOutputData = rawOutputData + d.toString("utf8");
    });
    res.on("end", function() {
      //console.log(rawOutputData);
      //console.log(new Date().toISOString() + " [AJAXAMP] SUCCESSFULLY EXECUTED COMMAND ajaxAmpSetRepeat(repeatValue = " + repeatValue + ")");
    });
  });

  req.on("error", function(error) {
    console.log(new Date().toISOString() + " [AJAXAMP] ERROR EXECUTING COMMAND ajaxAmpSetRepeat(repeatValue = " + repeatValue + ")");
    console.error(error);
  });
  req.end();
}

function ajaxAmpSetVolume(volumeByte) {
  //console.log(new Date().toISOString() + " [AJAXAMP] EXECUTING COMMAND ajaxAmpSetVolume(volumeByte = " + volumeByte + ")");
  let rawOutputData = "";

  let options = {
    hostname: ajaxAmpAddress,
    port: ajaxAmpPort,
    path: "/setvolume?level=" + volumeByte,
    method: "POST"
  };

  let req = http.request(options, function(res) {
    //console.log("statusCode: " + res.statusCode);
    res.on("data", function(d) {
      //console.log(JSON.parse(d.toString("utf8")));
      rawOutputData = rawOutputData + d.toString("utf8");
    });
    res.on("end", function() {
      //console.log(rawOutputData);
      //console.log(new Date().toISOString() + " [AJAXAMP] SUCCESSFULLY EXECUTED COMMAND ajaxAmpSetVolume(volumeByte = " + volumeByte + ")");
    });
  });

  req.on("error", function(error) {
    console.log(new Date().toISOString() + " [AJAXAMP] ERROR EXECUTING COMMAND ajaxAmpSetVolume(volumeByte = " + volumeByte + ")");
    console.error(error);
  });
  req.end();
}

function ajaxAmpSetPosition(positionFloat) {
  //console.log(new Date().toISOString() + " [AJAXAMP] EXECUTING COMMAND ajaxAmpSetPosition(positionFloat = " + positionFloat + ")");
  let rawOutputData = "";

  let options = {
    hostname: ajaxAmpAddress,
    port: ajaxAmpPort,
    path: "/setposition?pos=" + positionFloat,
    method: "POST"
  };

  let req = http.request(options, function(res) {
    //console.log("statusCode: " + res.statusCode);
    res.on("data", function(d) {
      //console.log(JSON.parse(d.toString("utf8")));
      rawOutputData = rawOutputData + d.toString("utf8");
    });
    res.on("end", function() {
      //console.log(rawOutputData);
      //console.log(new Date().toISOString() + " [AJAXAMP] SUCCESSFULLY EXECUTED COMMAND ajaxAmpSetPosition(positionFloat = " + positionFloat + ")");
    });
  });

  req.on("error", function(error) {
    console.log(new Date().toISOString() + " [AJAXAMP] ERROR EXECUTING COMMAND ajaxAmpSetPosition(positionFloat = " + positionFloat + ")");
    console.error(error);
  });
  req.end();
}

function invertNumberSign(number) {
  if (number >= 0) {
    number = -Math.abs(number);
    return number;
  }
  if (number < 0) {
    number = Math.abs(number);
    return number;
  }
}

//setInterval(checkIfAppExists, 0, null);

function checkIfAppExists(tcpClientObject) {
  winampDisplayDataObject = winampDisplayDataDefaultObject;
  winampDisplayDataBuffer = winampDisplayDataDefaultBuffer;
  if (processName == "") {
    io.sockets.emit("winamp_display_data", winampDisplayDataDefaultObject);
    if (tcpClientObject != null && tcpClientObject != undefined) {
      console.log(new Date().toISOString() + " We have to send default Winamp data 1");
      sendDefaultWinampData(tcpClientObject);
    }
    return;
  }
  processList = memoryjs.getProcesses();
  //console.log(processList);
  moduleObject = processList.find(element => element.szExeFile == processName);
  //console.log(moduleObject);

  //I spent way too long on the pieces of code below figuring out how to do it in the least hacky way possible
  //because I was tired as fuck and was calling a function that doesn't exist, closeProcess(processObject.handle) instead of memoryjs.closeProcess(processObject.handle)
  //I think it works pretty well
  if (moduleObject == undefined) {
    // Check if the module obtained from the list is undefined
    if (processObject != undefined) {
      // If the processObject was previously open, then we close it
      memoryjs.closeProcess(processObject.handle);
      processObject = undefined;
      modulesList = [];
      gameMemoryToDisplay = [];
      gameMemoryToOverride = [];
      io.sockets.emit("game_memory_to_display", gameMemoryToDisplay);
      io.sockets.emit("winamp_display_data", winampDisplayDataDefaultObject);
      if (tcpClientObject != null && tcpClientObject != undefined) {
        console.log(new Date().toISOString() + " We have to send default Winamp data 2");
        sendDefaultWinampData(tcpClientObject);
      }
      console.log(new Date().toISOString() + " Process " + processName + " closed");
    }
    io.sockets.emit("winamp_display_data", winampDisplayDataDefaultObject);
    if (tcpClientObject != null && tcpClientObject != undefined) {
      console.log(new Date().toISOString() + " We have to send default Winamp data 3");
      sendDefaultWinampData(tcpClientObject);
    }
    return;
  }
  if (moduleObject != undefined) {
    // Check if the module obtained from the list isn't undefined
    if (processObject == undefined) {
      // If the processObject was never opened, we open it
      gameMemory = JSON.parse(fs.readFileSync(gameMemoryConfigFileName, "utf8"));
      ajaxAmpAddress = gameMemory.ajaxamp_address;
      ajaxAmpPort = gameMemory.ajaxamp_port;
      overlayPath = gameMemory.overlay_path;
      overlayPath = overlayPath.replace(/({{path_separator}})+/ig, path.sep);
      baseMemoryAddress = parseInt(gameMemory.base_address, 16);
      endMemoryAddress = parseInt(gameMemory.end_address, 16);
      basePointerAddress = parseInt(gameMemory.base_pointer_address, 16);
      endPointerAddress = parseInt(gameMemory.end_pointer_address, 16);
      processObject = memoryjs.openProcess(processName);
      //console.log(processObject);
      modulesList = memoryjs.getModules(processObject.th32ProcessID);
      //console.log(modulesList);
      gameMemoryToDisplay = [];
      gameMemoryToOverride = [];
      /*
      for (let modulesListIndex = 0; modulesListIndex < modulesList.length; modulesListIndex++) {
        console.log(new Date().toISOString() + " modulesListIndex = " + modulesListIndex);
        console.log(modulesList[modulesListIndex]);
      }
      */
      for (let gameMemoryObjectIndex = 0; gameMemoryObjectIndex < gameMemory.memory_data.length; gameMemoryObjectIndex++) {
        if (gameMemory.memory_data[gameMemoryObjectIndex].to_override == true) {
          if (gameMemory.memory_data[gameMemoryObjectIndex].module_name !== "") {
            gameMemoryToOverride.push(gameMemory.memory_data[gameMemoryObjectIndex]);
          }
        }
        if (gameMemory.memory_data[gameMemoryObjectIndex].to_display == true) {
          if (gameMemory.memory_data[gameMemoryObjectIndex].module_name !== "") {
            //console.log(gameMemory.memory_data[gameMemoryObjectIndex]);
            gameMemoryToDisplay.push(gameMemory.memory_data[gameMemoryObjectIndex]);
          }
        }
      }
      //console.log(gameMemoryToDisplay);
      io.sockets.emit("game_memory_to_display", gameMemoryToDisplay);
      console.log(new Date().toISOString() + " Process " + processName + " opened");
    }
    winampDisplayDataBufferIndex = 0;
    //let testVar = readFromAppPointerBuffer("Player Pointer", "Player Weapon Inventory", 280).current_value;
    //let testVar = readFromAppBuffer("Player Weapon Inventory", 280).current_value;
    //let testVar = readFromAppMemory("Winamp Milliseconds");
    //console.log(new Date().toISOString() + " " + testVar.address_name + " = " + testVar.current_value + " FROM " + testVar.old_value);
    //console.log(new Date().toISOString() + " LOOP START");
    bitrateKbpsObject = readFromAppMemory(getAddressBasedOnModuleName(bitrateKbpsName));
    lengthSecondsObject = readFromAppMemory(getAddressBasedOnModuleName(lengthSecondsName));
    volumeObject = readFromAppMemory(getAddressBasedOnModuleName(volumeName));
    visualizerStateObject = readFromAppMemory(getAddressBasedOnModuleName(visualizerStateName));
    positionSecondsObject = readFromAppMemory(getAddressBasedOnModuleName(positionSecondsName));
    audioChannelsObject = readFromAppMemory(getAddressBasedOnModuleName(audioChannelsName));
    repeatObject = readFromAppMemory(getAddressBasedOnModuleName(repeatName));
    eqAutoStateObject = readFromAppMemory(getAddressBasedOnModuleName(eqAutoStateName));
    shuffleObject = readFromAppMemory(getAddressBasedOnModuleName(shuffleName));
    eqStateObject = readFromAppMemory(getAddressBasedOnModuleName(eqStateName));
    balanceObject = readFromAppMemory(getAddressBasedOnModuleName(balanceName));
    timeDisplayObject = readFromAppMemory(getAddressBasedOnModuleName(timeDisplayName));
    sampleRateKhzObject = readFromAppMemory(getAddressBasedOnModuleName(sampleRateKhzName));
    sampleRateHzObject = readFromAppMemory(getAddressBasedOnModuleName(sampleRateHzName));
    eq70HzObject = readFromAppMemory(getAddressBasedOnModuleName(eq70HzName));
    eq180HzObject = readFromAppMemory(getAddressBasedOnModuleName(eq180HzName));
    eq320HzObject = readFromAppMemory(getAddressBasedOnModuleName(eq320HzName));
    eq600HzObject = readFromAppMemory(getAddressBasedOnModuleName(eq600HzName));
    eq1KhzObject = readFromAppMemory(getAddressBasedOnModuleName(eq1KhzName));
    eq3KhzObject = readFromAppMemory(getAddressBasedOnModuleName(eq3KhzName));
    eq6KhzObject = readFromAppMemory(getAddressBasedOnModuleName(eq6KhzName));
    eq12KhzObject = readFromAppMemory(getAddressBasedOnModuleName(eq12KhzName));
    eq14KhzObject = readFromAppMemory(getAddressBasedOnModuleName(eq14KhzName));
    eq16KhzObject = readFromAppMemory(getAddressBasedOnModuleName(eq16KhzName));

    windowTitleUnicodeObject = readFromAppBuffer(getAddressBasedOnModuleName(windowTitleUnicodeName), getMemoryDataSize(windowTitleUnicodeName));
    filenameUnicodeObject = readFromAppBuffer(getAddressBasedOnModuleName(filenameUnicodeName), getMemoryDataSize(filenameUnicodeName));
    songTitleNoNumberUnicodeObject = readFromAppBuffer(getAddressBasedOnModuleName(songTitleNoNumberUnicodeName), getMemoryDataSize(songTitleNoNumberUnicodeName));
    songTitleUnicodeObject = readFromAppBuffer(getAddressBasedOnModuleName(songTitleUnicodeName), getMemoryDataSize(songTitleUnicodeName));

    //console.log("A");
    //console.log(windowTitleUnicodeObject.current_value);
    //console.log("B");
    //console.log(filenameUnicodeObject.current_value);
    //console.log("C");
    //console.log(songTitleNoNumberUnicodeObject.current_value);
    //console.log("D");
    //console.log(songTitleUnicodeObject.current_value);

    windowTitleUnicodeUtf16leBufferObject = getUtf16leStringData(windowTitleUnicodeObject.current_value);
    filenameUnicodeUtf16leBufferObject = getUtf16leStringData(filenameUnicodeObject.current_value);
    songTitleNoNumberUnicodeUtf16leBufferObject = getUtf16leStringData(songTitleNoNumberUnicodeObject.current_value);
    songTitleUnicodeUtf16leBufferObject = getUtf16leStringData(songTitleUnicodeObject.current_value);

    //console.log("START 1");
    //console.log(windowTitleUnicodeUtf16leBufferObject);
    //console.log(filenameUnicodeUtf16leBufferObject);
    //console.log(songTitleNoNumberUnicodeUtf16leBufferObject);
    //console.log(songTitleUnicodeUtf16leBufferObject);
    //console.log("END 1");

    windowTitleNoUnicodeAsciiBufferObject = convertUtf16leBufferObjectToAsciiObject(windowTitleUnicodeUtf16leBufferObject);
    filenameNoUnicodeAsciiBufferObject = convertUtf16leBufferObjectToAsciiObject(filenameUnicodeUtf16leBufferObject);
    songTitleNoNumberNoUnicodeAsciiBufferObject = convertUtf16leBufferObjectToAsciiObject(songTitleNoNumberUnicodeUtf16leBufferObject);
    songTitleNoUnicodeAsciiBufferObject = convertUtf16leBufferObjectToAsciiObject(songTitleUnicodeUtf16leBufferObject);

    //console.log("START 2");
    //console.log(windowTitleNoUnicodeAsciiBufferObject);
    //console.log(filenameNoUnicodeAsciiBufferObject);
    //console.log(songTitleNoNumberNoUnicodeAsciiBufferObject);
    //console.log(songTitleNoUnicodeAsciiBufferObject);
    //console.log("END 2");

    //console.log(audioChannelsObject);
    winampDisplayDataObject.bitrate_kbps = bitrateKbpsObject.current_value;
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 12;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.bitrate_kbps, winampDisplayDataBufferIndex);

    winampDisplayDataObject.length_seconds_total = lengthSecondsObject.current_value;

    if (winampDisplayDataObject.length_seconds_total <= 0) {
      winampDisplayDataObject.length_seconds_total = 0;
    }

    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.length_seconds_total, winampDisplayDataBufferIndex);

    let lengthDays = (parseInt(winampDisplayDataObject.length_seconds_total / 86400)).toString().padStart(2, "0");
    let lengthHours1 = (parseInt(winampDisplayDataObject.length_seconds_total / 3600) % 24).toString().padStart(2, "0");
    let lengthMinutes1 = (parseInt(winampDisplayDataObject.length_seconds_total / 60) % 60).toString().padStart(2, "0");
    let lengthSeconds = (parseInt(winampDisplayDataObject.length_seconds_total) % 60).toString().padStart(2, "0");

    let lengthHours2 = (parseInt(winampDisplayDataObject.length_seconds_total / 3600)).toString().padStart(2, "0");
    //let lengthMinutes1 = (parseInt(winampDisplayDataObject.length_seconds_total / 60) % 60).toString().padStart(2, "0");
    //let lengthSeconds = (parseInt(winampDisplayDataObject.length_seconds_total) % 60).toString().padStart(2, "0");

    let lengthMinutes2 = (parseInt(winampDisplayDataObject.length_seconds_total / 60)).toString().padStart(2, "0");
    //let lengthSeconds = (parseInt(winampDisplayDataObject.length_seconds_total) % 60).toString().padStart(2, "0");

    let lengthMinutesSecondsString = lengthMinutes2 + ":" + lengthSeconds;

    let lengthHoursMinutesSecondsString = lengthHours2 + ":" + lengthMinutes1 + ":" + lengthSeconds;

    let lengthDaysHoursMinutesSecondsString = lengthDays + ":" + lengthHours1 + ":" + lengthMinutes1 + ":" + lengthSeconds;

    winampDisplayDataObject.length_seconds = lengthSeconds;
    winampDisplayDataObject.length_minutes_1 = lengthMinutes1;
    winampDisplayDataObject.length_minutes_2 = lengthMinutes2;
    winampDisplayDataObject.length_hours_1 = lengthHours1;
    winampDisplayDataObject.length_hours_2 = lengthHours2;
    winampDisplayDataObject.length_days = lengthDays;

    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.length_seconds, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.length_minutes_1, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.length_minutes_2, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.length_hours_1, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.length_hours_2, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.length_days, winampDisplayDataBufferIndex);

    winampDisplayDataObject.length_minutes_seconds_string = lengthMinutesSecondsString;
    winampDisplayDataObject.length_hours_minutes_seconds_string = lengthHoursMinutesSecondsString;
    winampDisplayDataObject.length_days_hours_minutes_seconds_string = lengthDaysHoursMinutesSecondsString;

    let lengthMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
    let lengthMinutesSecondsStringLength = [...winampDisplayDataObject.length_minutes_seconds_string].length;
    lengthMinutesSecondsStringBuffer.write(winampDisplayDataObject.length_minutes_seconds_string, 0, lengthMinutesSecondsStringLength, "ascii");
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    lengthMinutesSecondsStringBuffer.copy(winampDisplayDataBuffer, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(lengthMinutesSecondsStringLength, winampDisplayDataBufferIndex);

    let lengthHoursMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
    let lengthHoursMinutesSecondsStringLength = [...winampDisplayDataObject.length_hours_minutes_seconds_string].length;
    lengthHoursMinutesSecondsStringBuffer.write(winampDisplayDataObject.length_hours_minutes_seconds_string, 0, lengthHoursMinutesSecondsStringLength, "ascii");
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    lengthHoursMinutesSecondsStringBuffer.copy(winampDisplayDataBuffer, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(lengthHoursMinutesSecondsStringLength, winampDisplayDataBufferIndex);

    let lengthDaysHoursMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
    let lengthDaysHoursMinutesSecondsStringLength = [...winampDisplayDataObject.length_days_hours_minutes_seconds_string].length;
    lengthDaysHoursMinutesSecondsStringBuffer.write(winampDisplayDataObject.length_days_hours_minutes_seconds_string, 0, lengthDaysHoursMinutesSecondsStringLength, "ascii");
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    lengthDaysHoursMinutesSecondsStringBuffer.copy(winampDisplayDataBuffer, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(lengthDaysHoursMinutesSecondsStringLength, winampDisplayDataBufferIndex);

    //console.log(new Date().toISOString() + " winampDisplayDataObject.length_minutes_seconds_string = " + winampDisplayDataObject.length_minutes_seconds_string);
    //console.log(new Date().toISOString() + " winampDisplayDataObject.length_hours_minutes_seconds_string = " + winampDisplayDataObject.length_hours_minutes_seconds_string);
    //console.log(new Date().toISOString() + " winampDisplayDataObject.length_days_hours_minutes_seconds_string = " + winampDisplayDataObject.length_days_hours_minutes_seconds_string);

    winampDisplayDataObject.volume_level = volumeObject.current_value;
    winampDisplayDataObject.visualizer_state = visualizerStateObject.current_value;

    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.volume_level, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.visualizer_state, winampDisplayDataBufferIndex);

    winampDisplayDataObject.position_seconds_total = positionSecondsObject.current_value;

    if (winampDisplayDataObject.position_seconds_total <= 0) {
      winampDisplayDataObject.position_seconds_total = 0;
    }

    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.position_seconds_total, winampDisplayDataBufferIndex);

    let positionDays = (parseInt(winampDisplayDataObject.position_seconds_total / 86400)).toString().padStart(2, "0");
    let positionHours1 = (parseInt(winampDisplayDataObject.position_seconds_total / 3600) % 24).toString().padStart(2, "0");
    let positionMinutes1 = (parseInt(winampDisplayDataObject.position_seconds_total / 60) % 60).toString().padStart(2, "0");
    let positionSeconds = (parseInt(winampDisplayDataObject.position_seconds_total) % 60).toString().padStart(2, "0");

    let positionHours2 = (parseInt(winampDisplayDataObject.position_seconds_total / 3600)).toString().padStart(2, "0");
    //let positionMinutes1 = (parseInt(winampDisplayDataObject.position_seconds_total / 60) % 60).toString().padStart(2, "0");
    //let positionSeconds = (parseInt(winampDisplayDataObject.position_seconds_total) % 60).toString().padStart(2, "0");

    let positionMinutes2 = (parseInt(winampDisplayDataObject.position_seconds_total / 60)).toString().padStart(2, "0");
    //let positionSeconds = (parseInt(winampDisplayDataObject.position_seconds_total) % 60).toString().padStart(2, "0");

    let positionMinutesSecondsString = positionMinutes2 + ":" + positionSeconds;

    let positionHoursMinutesSecondsString = positionHours2 + ":" + positionMinutes1 + ":" + positionSeconds;

    let positionDaysHoursMinutesSecondsString = positionDays + ":" + positionHours1 + ":" + positionMinutes1 + ":" + positionSeconds;

    winampDisplayDataObject.position_seconds = positionSeconds;
    winampDisplayDataObject.position_minutes_1 = positionMinutes1;
    winampDisplayDataObject.position_minutes_2 = positionMinutes2;
    winampDisplayDataObject.position_hours_1 = positionHours1;
    winampDisplayDataObject.position_hours_2 = positionHours2;
    winampDisplayDataObject.position_days = positionDays;

    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.position_seconds, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.position_minutes_1, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.position_minutes_2, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.position_hours_1, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.position_hours_2, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.position_days, winampDisplayDataBufferIndex);

    winampDisplayDataObject.position_minutes_seconds_string = positionMinutesSecondsString;
    winampDisplayDataObject.position_hours_minutes_seconds_string = positionHoursMinutesSecondsString;
    winampDisplayDataObject.position_days_hours_minutes_seconds_string = positionDaysHoursMinutesSecondsString;

    let positionMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
    let positionMinutesSecondsStringLength = [...winampDisplayDataObject.position_minutes_seconds_string].length;
    positionMinutesSecondsStringBuffer.write(winampDisplayDataObject.position_minutes_seconds_string, 0, positionMinutesSecondsStringLength, "ascii");
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    positionMinutesSecondsStringBuffer.copy(winampDisplayDataBuffer, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(positionMinutesSecondsStringLength, winampDisplayDataBufferIndex);

    let positionHoursMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
    let positionHoursMinutesSecondsStringLength = [...winampDisplayDataObject.position_hours_minutes_seconds_string].length;
    positionHoursMinutesSecondsStringBuffer.write(winampDisplayDataObject.position_hours_minutes_seconds_string, 0, positionHoursMinutesSecondsStringLength, "ascii");
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    positionHoursMinutesSecondsStringBuffer.copy(winampDisplayDataBuffer, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(positionHoursMinutesSecondsStringLength, winampDisplayDataBufferIndex);

    let positionDaysHoursMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
    let positionDaysHoursMinutesSecondsStringLength = [...winampDisplayDataObject.position_days_hours_minutes_seconds_string].length;
    positionDaysHoursMinutesSecondsStringBuffer.write(winampDisplayDataObject.position_days_hours_minutes_seconds_string, 0, positionDaysHoursMinutesSecondsStringLength, "ascii");
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    positionDaysHoursMinutesSecondsStringBuffer.copy(winampDisplayDataBuffer, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(positionDaysHoursMinutesSecondsStringLength, winampDisplayDataBufferIndex);

    //console.log(positionMinutesSecondsStringBuffer.toString("ascii"));
    //console.log(positionHoursMinutesSecondsStringBuffer.toString("ascii"));
    //console.log(positionDaysHoursMinutesSecondsStringBuffer.toString("ascii"));

    //console.log(new Date().toISOString() + " winampDisplayDataObject.position_minutes_seconds_string = " + winampDisplayDataObject.position_minutes_seconds_string);
    //console.log(new Date().toISOString() + " winampDisplayDataObject.position_hours_minutes_seconds_string = " + winampDisplayDataObject.position_hours_minutes_seconds_string);
    //console.log(new Date().toISOString() + " winampDisplayDataObject.position_days_hours_minutes_seconds_string = " + winampDisplayDataObject.position_days_hours_minutes_seconds_string);

    winampDisplayDataObject.remaining_seconds_total = winampDisplayDataObject.position_seconds_total - winampDisplayDataObject.length_seconds_total;
    winampDisplayDataObject.remaining_seconds_total = Math.abs(winampDisplayDataObject.remaining_seconds_total);

    if (winampDisplayDataObject.length_seconds_total <= 0) {
      winampDisplayDataObject.remaining_seconds_total = 0;
    }

    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.remaining_seconds_total, winampDisplayDataBufferIndex);

    let remainingDays = (parseInt(winampDisplayDataObject.remaining_seconds_total / 86400)).toString().padStart(2, "0");
    let remainingHours1 = (parseInt(winampDisplayDataObject.remaining_seconds_total / 3600) % 24).toString().padStart(2, "0");
    let remainingMinutes1 = (parseInt(winampDisplayDataObject.remaining_seconds_total / 60) % 60).toString().padStart(2, "0");
    let remainingSeconds = (parseInt(winampDisplayDataObject.remaining_seconds_total) % 60).toString().padStart(2, "0");

    let remainingHours2 = (parseInt(winampDisplayDataObject.remaining_seconds_total / 3600)).toString().padStart(2, "0");
    //let remainingMinutes1 = (parseInt(winampDisplayDataObject.remaining_seconds_total / 60) % 60).toString().padStart(2, "0");
    //let remainingSeconds = (parseInt(winampDisplayDataObject.remaining_seconds_total) % 60).toString().padStart(2, "0");

    let remainingMinutes2 = (parseInt(winampDisplayDataObject.remaining_seconds_total / 60)).toString().padStart(2, "0");
    //let remainingSeconds = (parseInt(winampDisplayDataObject.remaining_seconds_total) % 60).toString().padStart(2, "0");

    let remainingMinutesSecondsString = "-" + remainingMinutes2 + ":" + remainingSeconds;

    let remainingHoursMinutesSecondsString = "-" + remainingHours2 + ":" + remainingMinutes1 + ":" + remainingSeconds;

    let remainingDaysHoursMinutesSecondsString = "-" + remainingDays + ":" + remainingHours1 + ":" + remainingMinutes1 + ":" + remainingSeconds;

    winampDisplayDataObject.remaining_seconds = remainingSeconds;
    winampDisplayDataObject.remaining_minutes_1 = remainingMinutes1;
    winampDisplayDataObject.remaining_minutes_2 = remainingMinutes2;
    winampDisplayDataObject.remaining_hours_1 = remainingHours1;
    winampDisplayDataObject.remaining_hours_2 = remainingHours2;
    winampDisplayDataObject.remaining_days = remainingDays;

    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.remaining_seconds, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.remaining_minutes_1, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.remaining_minutes_2, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.remaining_hours_1, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.remaining_hours_2, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.remaining_days, winampDisplayDataBufferIndex);

    winampDisplayDataObject.remaining_minutes_seconds_string = remainingMinutesSecondsString;
    winampDisplayDataObject.remaining_hours_minutes_seconds_string = remainingHoursMinutesSecondsString;
    winampDisplayDataObject.remaining_days_hours_minutes_seconds_string = remainingDaysHoursMinutesSecondsString;

    let remainingMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
    let remainingMinutesSecondsStringLength = [...winampDisplayDataObject.remaining_minutes_seconds_string].length;
    remainingMinutesSecondsStringBuffer.write(winampDisplayDataObject.remaining_minutes_seconds_string, 0, remainingMinutesSecondsStringLength, "ascii");
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    remainingMinutesSecondsStringBuffer.copy(winampDisplayDataBuffer, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(remainingMinutesSecondsStringLength, winampDisplayDataBufferIndex);

    let remainingHoursMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
    let remainingHoursMinutesSecondsStringLength = [...winampDisplayDataObject.remaining_hours_minutes_seconds_string].length;
    remainingHoursMinutesSecondsStringBuffer.write(winampDisplayDataObject.remaining_hours_minutes_seconds_string, 0, remainingHoursMinutesSecondsStringLength, "ascii");
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    remainingHoursMinutesSecondsStringBuffer.copy(winampDisplayDataBuffer, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(remainingHoursMinutesSecondsStringLength, winampDisplayDataBufferIndex);

    let remainingDaysHoursMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
    let remainingDaysHoursMinutesSecondsStringLength = [...winampDisplayDataObject.remaining_days_hours_minutes_seconds_string].length;
    remainingDaysHoursMinutesSecondsStringBuffer.write(winampDisplayDataObject.remaining_days_hours_minutes_seconds_string, 0, remainingDaysHoursMinutesSecondsStringLength, "ascii");
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    remainingDaysHoursMinutesSecondsStringBuffer.copy(winampDisplayDataBuffer, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(remainingDaysHoursMinutesSecondsStringLength, winampDisplayDataBufferIndex);

    //console.log(new Date().toISOString() + " winampDisplayDataObject.remaining_seconds_total = " + winampDisplayDataObject.remaining_seconds_total);
    //console.log(new Date().toISOString() + " winampDisplayDataObject.remaining_minutes_seconds_string = " + winampDisplayDataObject.remaining_minutes_seconds_string);
    //console.log(new Date().toISOString() + " winampDisplayDataObject.remaining_hours_minutes_seconds_string = " + winampDisplayDataObject.remaining_hours_minutes_seconds_string);
    //console.log(new Date().toISOString() + " winampDisplayDataObject.remaining_days_hours_minutes_seconds_string = " + winampDisplayDataObject.remaining_days_hours_minutes_seconds_string);

    winampDisplayDataObject.audio_channels = audioChannelsObject.current_value;
    winampDisplayDataObject.repeat_state = repeatObject.current_value;
    winampDisplayDataObject.eq_auto_state = eqAutoStateObject.current_value;
    winampDisplayDataObject.shuffle_state = shuffleObject.current_value;
    winampDisplayDataObject.eq_state = eqStateObject.current_value;
    winampDisplayDataObject.balance_pan = balanceObject.current_value;
    winampDisplayDataObject.time_display_state = timeDisplayObject.current_value;
    winampDisplayDataObject.sample_rate_khz = sampleRateKhzObject.current_value;
    winampDisplayDataObject.sample_rate_hz = sampleRateHzObject.current_value;

    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.audio_channels, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.repeat_state, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.eq_auto_state, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.shuffle_state, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.eq_state, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt8(winampDisplayDataObject.balance_pan, winampDisplayDataBufferIndex);
    //console.log(winampDisplayDataObject.balance_pan);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.time_display_state, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.sample_rate_khz, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(winampDisplayDataObject.sample_rate_hz, winampDisplayDataBufferIndex);

    winampDisplayDataObject.eq_70hz_float = eq70HzObject.current_value;
    winampDisplayDataObject.eq_70hz_int = map(winampDisplayDataObject.eq_70hz_float, -12, 12, 0, 255);
    winampDisplayDataObject.eq_180hz_float = eq180HzObject.current_value;
    winampDisplayDataObject.eq_180hz_int = map(winampDisplayDataObject.eq_180hz_float, -12, 12, 0, 255);
    winampDisplayDataObject.eq_320hz_float = eq320HzObject.current_value;
    winampDisplayDataObject.eq_320hz_int = map(winampDisplayDataObject.eq_320hz_float, -12, 12, 0, 255);
    winampDisplayDataObject.eq_600hz_float = eq600HzObject.current_value;
    winampDisplayDataObject.eq_600hz_int = map(winampDisplayDataObject.eq_600hz_float, -12, 12, 0, 255);
    winampDisplayDataObject.eq_1khz_float = eq1KhzObject.current_value;
    winampDisplayDataObject.eq_1khz_int = map(winampDisplayDataObject.eq_1khz_float, -12, 12, 0, 255);
    winampDisplayDataObject.eq_3khz_float = eq3KhzObject.current_value;
    winampDisplayDataObject.eq_3khz_int = map(winampDisplayDataObject.eq_3khz_float, -12, 12, 0, 255);
    winampDisplayDataObject.eq_6khz_float = eq6KhzObject.current_value;
    winampDisplayDataObject.eq_6khz_int = map(winampDisplayDataObject.eq_6khz_float, -12, 12, 0, 255);
    winampDisplayDataObject.eq_12khz_float = eq12KhzObject.current_value;
    winampDisplayDataObject.eq_12khz_int = map(winampDisplayDataObject.eq_12khz_float, -12, 12, 0, 255);
    winampDisplayDataObject.eq_14khz_float = eq14KhzObject.current_value;
    winampDisplayDataObject.eq_14khz_int = map(winampDisplayDataObject.eq_14khz_float, -12, 12, 0, 255);
    winampDisplayDataObject.eq_16khz_float = eq16KhzObject.current_value;
    winampDisplayDataObject.eq_16khz_int = map(winampDisplayDataObject.eq_16khz_float, -12, 12, 0, 255);

    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.eq_70hz_int, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.eq_180hz_int, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.eq_320hz_int, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.eq_600hz_int, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.eq_1khz_int, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.eq_3khz_int, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.eq_6khz_int, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.eq_12khz_int, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.eq_14khz_int, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.eq_16khz_int, winampDisplayDataBufferIndex);

    winampDisplayDataObject.window_title_unicode_string = windowTitleUnicodeUtf16leBufferObject.utf16le_string;
    winampDisplayDataObject.window_title_ascii_string = windowTitleNoUnicodeAsciiBufferObject.ascii_string_clean;

    //winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //windowTitleNoUnicodeAsciiBufferObject.ascii_string_to_buffer.copy(winampDisplayDataBuffer, winampDisplayDataBufferIndex);
    //winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 256;
    //winampDisplayDataBuffer.writeInt32LE(windowTitleNoUnicodeAsciiBufferObject.ascii_string_clean_length, winampDisplayDataBufferIndex);

    winampDisplayDataObject.filename_unicode_string = filenameUnicodeUtf16leBufferObject.utf16le_string;
    winampDisplayDataObject.filename_ascii_string = filenameNoUnicodeAsciiBufferObject.ascii_string_clean;

    //winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //filenameNoUnicodeAsciiBufferObject.ascii_string_to_buffer.copy(winampDisplayDataBuffer, winampDisplayDataBufferIndex);
    //winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 256;
    //winampDisplayDataBuffer.writeInt32LE(filenameNoUnicodeAsciiBufferObject.ascii_string_clean_length, winampDisplayDataBufferIndex);

    winampDisplayDataObject.song_title_no_number_unicode_string = songTitleNoNumberUnicodeUtf16leBufferObject.utf16le_string;
    winampDisplayDataObject.song_title_no_number_ascii_string = songTitleNoNumberNoUnicodeAsciiBufferObject.ascii_string_clean;

    //winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //songTitleNoNumberNoUnicodeAsciiBufferObject.ascii_string_to_buffer.copy(winampDisplayDataBuffer, winampDisplayDataBufferIndex);
    //winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 256;
    //winampDisplayDataBuffer.writeInt32LE(songTitleNoNumberNoUnicodeAsciiBufferObject.ascii_string_clean_length, winampDisplayDataBufferIndex);

    winampDisplayDataObject.song_title_unicode_string = songTitleUnicodeUtf16leBufferObject.utf16le_string;
    winampDisplayDataObject.song_title_ascii_string = songTitleNoUnicodeAsciiBufferObject.ascii_string_clean;

    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
    //console.log(winampDisplayDataBufferIndex);
    songTitleNoUnicodeAsciiBufferObject.ascii_string_to_buffer.copy(winampDisplayDataBuffer, winampDisplayDataBufferIndex);
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 256;
    //console.log(winampDisplayDataBufferIndex);
    winampDisplayDataBuffer.writeInt32LE(songTitleNoUnicodeAsciiBufferObject.ascii_string_clean_length, winampDisplayDataBufferIndex);

    spectrumAnalyzerPeakSize = getMemoryDataSize(spectrumAnalyzerName);
    spectrumAnalyzerPeakObject = readFromAppBuffer(getAddressBasedOnModuleName(spectrumAnalyzerPeakName), spectrumAnalyzerPeakSize);
    spectrumAnalyzerSize = getMemoryDataSize(spectrumAnalyzerName);
    spectrumAnalyzerObject = readFromAppBuffer(getAddressBasedOnModuleName(spectrumAnalyzerName), spectrumAnalyzerSize);
    //console.log(spectrumAnalyzerPeakObject);
    //let spectrumAnalyzerObject = readFromAppMemory(getAddressBasedOnModuleName(spectrumAnalyzerName));
    //console.log(spectrumAnalyzerObject);
    for (let spectrumAnalyzerIndex = 0; spectrumAnalyzerIndex < spectrumAnalyzerSize; spectrumAnalyzerIndex+=int32SizeBytes) {
      winampDisplayDataObject.spectrum_analyzer_high_res[spectrumAnalyzerIndex / int32SizeBytes] = spectrumAnalyzerObject.current_value[spectrumAnalyzerIndex] / spectrumAnalyzerMultiplier;
      winampDisplayDataObject.spectrum_analyzer_high_res_peak[spectrumAnalyzerIndex / int32SizeBytes] = (spectrumAnalyzerPeakObject.current_value[spectrumAnalyzerIndex]) | (spectrumAnalyzerPeakObject.current_value[spectrumAnalyzerIndex + 1] << 8) | (spectrumAnalyzerPeakObject.current_value[spectrumAnalyzerIndex + 2] << 16) | (spectrumAnalyzerPeakObject.current_value[spectrumAnalyzerIndex + 3] << 24);
      winampDisplayDataObject.spectrum_analyzer_high_res_peak[spectrumAnalyzerIndex / int32SizeBytes] = map(winampDisplayDataObject.spectrum_analyzer_high_res_peak[spectrumAnalyzerIndex / int32SizeBytes], 0, spectrumAnalyzerPeakMax, 0, spectrumAnalyzerMax);
      // (spectrumAnalyzerPeakObject.current_value[spectrumAnalyzerIndex] << 24) | (spectrumAnalyzerPeakObject.current_value[spectrumAnalyzerIndex + 1] << 16) | (spectrumAnalyzerPeakObject.current_value[spectrumAnalyzerIndex + 2] << 8) | (spectrumAnalyzerPeakObject.current_value[spectrumAnalyzerIndex + 3])
      //console.log(new Date().toISOString() + " spectrumAnalyzerIndex = " + spectrumAnalyzerIndex + " contains " + spectrumAnalyzerObject.current_value[spectrumAnalyzerIndex]);
      //console.log(spectrumAnalyzerObject.current_value[spectrumAnalyzerIndex]);
      //  
    }
    winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
    //console.log(winampDisplayDataBufferIndex);
    //console.log(winampDisplayDataBufferIndex + " " + winampDisplayDataBuffer[winampDisplayDataBufferIndex]);
    for (let spectrumAnalyzerIndex = 0; spectrumAnalyzerIndex < spectrumAnalyzerSize; spectrumAnalyzerIndex+=spectrumLowResSize) {
      winampDisplayDataObject.spectrum_analyzer_low_res[spectrumAnalyzerIndex / spectrumLowResSize] = spectrumAnalyzerObject.current_value[spectrumAnalyzerIndex] / spectrumAnalyzerMultiplier;
      winampDisplayDataObject.spectrum_analyzer_low_res_peak[spectrumAnalyzerIndex / spectrumLowResSize] = (spectrumAnalyzerPeakObject.current_value[spectrumAnalyzerIndex]) | (spectrumAnalyzerPeakObject.current_value[spectrumAnalyzerIndex + 1] << 8) | (spectrumAnalyzerPeakObject.current_value[spectrumAnalyzerIndex + 2] << 16) | (spectrumAnalyzerPeakObject.current_value[spectrumAnalyzerIndex + 3] << 24);
      winampDisplayDataObject.spectrum_analyzer_low_res_peak[spectrumAnalyzerIndex / spectrumLowResSize] = map(winampDisplayDataObject.spectrum_analyzer_low_res_peak[spectrumAnalyzerIndex / spectrumLowResSize], 0, spectrumAnalyzerPeakMax, 0, spectrumAnalyzerMax);

      winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
      //console.log(winampDisplayDataBufferIndex);
      //console.log(winampDisplayDataBufferIndex + " " + winampDisplayDataBuffer[winampDisplayDataBufferIndex]);
      winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.spectrum_analyzer_low_res[spectrumAnalyzerIndex / spectrumLowResSize], winampDisplayDataBufferIndex);
      winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
      //console.log(winampDisplayDataBufferIndex);
      //console.log(winampDisplayDataBufferIndex + " " + winampDisplayDataBuffer[winampDisplayDataBufferIndex]);
      winampDisplayDataBuffer.writeUInt8(winampDisplayDataObject.spectrum_analyzer_low_res_peak[spectrumAnalyzerIndex / spectrumLowResSize], winampDisplayDataBufferIndex);
      // The spectrum analyzer and spectrum analyzer peaks are alternated in the buffer
    }

    //console.log(new Date().toISOString() + " winampDisplayDataBufferIndex = " + winampDisplayDataBufferIndex);
    //console.log(winampDisplayDataBuffer);
    //console.log(spectrumAnalyzerObject);
    //console.log(new Date().toISOString());
    //console.log(winampDisplayDataObject);
    io.sockets.emit("winamp_display_data", winampDisplayDataObject);
    if (tcpClientObject != null && tcpClientObject != undefined) {
      //console.log(new Date().toISOString() + " We have to send real Winamp data 4");
      sendTcpMessageToClient(tcpClientObject, winampDisplayDataBuffer);
    }
    /*
    for (let gameMemoryToDisplayIndex = 0; gameMemoryToDisplayIndex < gameMemoryToDisplay.length; gameMemoryToDisplayIndex++) {

      //let objectToReadFromMemory = gameMemoryToDisplay[gameMemoryToDisplayIndex];
      //gameMemoryToDisplay[gameMemoryToDisplayIndex] = objectToReadFromMemory;
      //gameMemoryToDisplay[gameMemoryToDisplayIndex].current_value = 0;

      //let gameMemoryObjectWithNewAddress = getAddressBasedOnModuleName(gameMemoryToDisplay[gameMemoryToDisplayIndex]);
      //console.log(gameMemoryObjectWithNewAddress);
      //console.log(gameMemoryToDisplay[0]);
      //let objectToReadFromMemory = readFromAppMemory(gameMemoryToDisplay[gameMemoryToDisplayIndex].address_name);
      //let objectToReadFromMemory = readFromAppMemory(gameMemoryObjectWithNewAddress.address_name);
      let objectToReadFromMemory = readFromAppMemory(getAddressBasedOnModuleName(gameMemoryToDisplay[gameMemoryToDisplayIndex]).address_name);
      //console.log(new Date().toISOString() + " gameMemoryToDisplayIndex = " + gameMemoryToDisplayIndex);
      //console.log(objectToReadFromMemory);
      io.sockets.emit("game_memory_to_display_to_update", objectToReadFromMemory, gameMemoryToDisplayIndex);
      
      if (objectToReadFromMemory.current_value !== objectToReadFromMemory.old_value) {
        //console.log("Data updated at gameMemoryToDisplayIndex = " + gameMemoryToDisplayIndex);
        //console.log(new Date().toISOString() + " " + objectToReadFromMemory.address_name + " = " + objectToReadFromMemory.current_value + " FROM " + objectToReadFromMemory.old_value);
        io.sockets.emit("game_memory_to_display_to_update", objectToReadFromMemory, gameMemoryToDisplayIndex);
        //console.log(gameMemoryToDisplay[0]);
      }
    }
    */
    //console.log(new Date().toISOString() + " LOOP END");
    return;
  }
}

//The functions below were written to make my life easy, they may not look pretty but they do help a lot

function checkIfValueChanged(addressName) {
  let memoryIndex = gameMemory.memory_data.findIndex(element => element.address_name == addressName);
  if (memoryIndex == -1) {
    return "Invalid memory name";
  }
  //gameMemory.memory_data[memoryIndex].current_value = readFromCustomMemoryAddress(parseInt(gameMemory.memory_data[memoryIndex].memory_address, 16), baseMemoryAddress, gameMemory.memory_data[memoryIndex].data_type, memoryIndex);
  if (gameMemory.memory_data[memoryIndex].current_value != gameMemory.memory_data[memoryIndex].old_value) {
    //console.log(gameMemory.memory_data[memoryIndex].address_name + " Value changed " + gameMemory.memory_data[memoryIndex].current_value + " Old " + gameMemory.memory_data[memoryIndex].old_value);
  }
  //console.log(gameMemory.memory_data[memoryIndex].address_name + " H " + gameMemory.memory_data[memoryIndex].current_value + " Old " + gameMemory.memory_data[memoryIndex].old_value)
  gameMemory.memory_data[memoryIndex].old_value = gameMemory.memory_data[memoryIndex].current_value;
  return gameMemory.memory_data[memoryIndex];
}

function writeToAppPointerBuffer(pointerName, offsetName, buffer) {
  if (processObject == undefined) {
    return "Game is not running!";
  }
  // The code below is an unreadable mess
  let pointerIndex = gameMemory.memory_data.findIndex(element => element.address_name == pointerName);
  let offsetIndex = gameMemory.memory_data.findIndex(element => element.address_name == offsetName);
  if (pointerIndex == -1 || offsetIndex == -1) {
    return "Invalid pointer name or offset name";
  }
  if (gameMemory.memory_data[pointerIndex].pointer_type == "none" || gameMemory.memory_data[offsetIndex].offset_type == "none") {
    return "Pointer address provided is not a pointer or offset address provided is not an offset";
  }
  if (gameMemory.memory_data[offsetIndex].is_writeable == false) {
    gameMemory.memory_data[offsetIndex].current_value = "This offset is marked as Read Only";
    return gameMemory.memory_data[offsetIndex];
  }
  gameMemory.memory_data[pointerIndex].current_value = readFromCustomMemoryAddress(parseInt(gameMemory.memory_data[pointerIndex].memory_address, 16), baseMemoryAddress, gameMemory.memory_data[pointerIndex].data_type, pointerIndex);
  if (gameMemory.memory_data[pointerIndex].current_value == 0) {
    gameMemory.memory_data[offsetIndex].memory_address = "0x0";
    gameMemory.memory_data[offsetIndex].current_value = -1;
    return gameMemory.memory_data[offsetIndex];
  }
  gameMemory.memory_data[offsetIndex].memory_address = "0x" + (parseInt(gameMemory.memory_data[offsetIndex].offset, 16) + gameMemory.memory_data[pointerIndex].current_value).toString(16);
  gameMemory.memory_data[offsetIndex].current_value = writeToCustomMemoryAddressBuffer(parseInt(gameMemory.memory_data[offsetIndex].memory_address, 16), baseMemoryAddress, buffer, offsetIndex);
  return gameMemory.memory_data[offsetIndex];
}

function readFromAppPointerBuffer(pointerName, offsetName, size) {
  if (processObject == undefined) {
    return "Game is not running!";
  }
  // The code below is an unreadable mess
  let pointerIndex = gameMemory.memory_data.findIndex(element => element.address_name == pointerName);
  let offsetIndex = gameMemory.memory_data.findIndex(element => element.address_name == offsetName);
  if (pointerIndex == -1 || offsetIndex == -1) {
    return "Invalid pointer name or offset name";
  }
  if (gameMemory.memory_data[pointerIndex].pointer_type == "none" || gameMemory.memory_data[offsetIndex].offset_type == "none") {
    return "Pointer address provided is not a pointer or offset address provided is not an offset";
  }
  gameMemory.memory_data[pointerIndex].current_value = readFromCustomMemoryAddress(parseInt(gameMemory.memory_data[pointerIndex].memory_address, 16), baseMemoryAddress, gameMemory.memory_data[pointerIndex].data_type, pointerIndex);
  if (gameMemory.memory_data[pointerIndex].current_value == 0) {
    gameMemory.memory_data[offsetIndex].memory_address = "0x0";
    gameMemory.memory_data[offsetIndex].current_value = -1;
    return gameMemory.memory_data[offsetIndex];
  }
  gameMemory.memory_data[offsetIndex].memory_address = "0x" + (parseInt(gameMemory.memory_data[offsetIndex].offset, 16) + gameMemory.memory_data[pointerIndex].current_value).toString(16);
  gameMemory.memory_data[offsetIndex].current_value = readFromCustomMemoryAddressBuffer(parseInt(gameMemory.memory_data[offsetIndex].memory_address, 16), baseMemoryAddress, size, offsetIndex);
  return gameMemory.memory_data[offsetIndex];
}

function writeToAppBuffer(addressName, buffer) {
  if (processObject == undefined) {
    return "Game is not running!";
  }
  let memoryIndex = gameMemory.memory_data.findIndex(element => element.address_name == addressName);
  if (memoryIndex == -1) {
    return "Invalid memory name";
  }
  if (gameMemory.memory_data[memoryIndex].is_writeable == false) {
    gameMemory.memory_data[memoryIndex].current_value = "This address is marked as Read Only";
    return gameMemory.memory_data[memoryIndex];
  }
  gameMemory.memory_data[memoryIndex].current_value = writeToCustomMemoryAddressBuffer(parseInt(gameMemory.memory_data[memoryIndex].memory_address, 16), baseMemoryAddress, buffer, memoryIndex);
  return gameMemory.memory_data[memoryIndex];
}

function readFromAppBuffer(addressName, size) {
  if (processObject == undefined) {
    return "Game is not running!";
  }
  let memoryIndex = gameMemory.memory_data.findIndex(element => element.address_name == addressName);
  if (memoryIndex == -1) {
    return "Invalid memory name";
  }
  gameMemory.memory_data[memoryIndex].current_value = readFromCustomMemoryAddressBuffer(parseInt(gameMemory.memory_data[memoryIndex].memory_address, 16), baseMemoryAddress, size, memoryIndex);
  return gameMemory.memory_data[memoryIndex];
}

function writeToCustomMemoryAddressBuffer(address, offset, buffer, index) {
  if (processObject == undefined) {
    return "Game is not running!";
  }
  // Read and Write sync are faster than async by about 50000~60000 nanoseconds
  let valueChanged = false;
  if (index <= -1) {
    index = undefined;
  }
  if (index == undefined) {
    memoryjs.writeBuffer(processObject.handle, address + offset, buffer);
    return readFromCustomMemoryAddressBuffer(address, offset, buffer.byteLength, index);
  }
  memoryjs.writeBuffer(processObject.handle, address + offset, buffer);
  if (gameMemory.memory_data[index].current_value != gameMemory.memory_data[index].old_value) {
    //console.log(gameMemory.memory_data[index].current_value + " A " + gameMemory.memory_data[index].old_value);
    valueChanged = true;
  }
  gameMemory.memory_data[index].old_value = gameMemory.memory_data[index].current_value;
  return readFromCustomMemoryAddressBuffer(address, offset, buffer.byteLength, index); // Just doing this to make sure the memory was written correctly
}

function readFromCustomMemoryAddressBuffer(address, offset, size, index) {
  if (processObject == undefined) {
    return "Game is not running!";
  }
  // Read and Write sync are faster than async by about 50000~60000 nanoseconds
  let valueChanged = false;
  if (index <= -1) {
    index = undefined;
  }
  if (index == undefined) {
    return memoryjs.readBuffer(processObject.handle, address + offset, size);
  }
  if (gameMemory.memory_data[index].current_value != gameMemory.memory_data[index].old_value) {
    //console.log(gameMemory.memory_data[index].current_value + " B " + gameMemory.memory_data[index].old_value);
    valueChanged = true;
  }
  gameMemory.memory_data[index].old_value = gameMemory.memory_data[index].current_value;
  return memoryjs.readBuffer(processObject.handle, address + offset, size);
}

function writeToCustomMemoryAddress(address, offset, value, dataType, index) {
  if (processObject == undefined) {
    return "Game is not running!";
  }
  // Read and Write sync are faster than async by about 50000~60000 nanoseconds
  let valueChanged = false;
  if (index <= -1) {
    index = undefined;
  }
  if (index == undefined) {
    memoryjs.writeMemory(processObject.handle, address + offset, value, dataType);
    return readFromCustomMemoryAddress(address, offset, dataType, index);
  }
  memoryjs.writeMemory(processObject.handle, address + offset, value, dataType);
  if (gameMemory.memory_data[index].current_value != gameMemory.memory_data[index].old_value) {
    //console.log(gameMemory.memory_data[index].current_value + " A " + gameMemory.memory_data[index].old_value);
    valueChanged = true;
  }
  gameMemory.memory_data[index].old_value = gameMemory.memory_data[index].current_value;
  return readFromCustomMemoryAddress(address, offset, dataType, index); // Just doing this to make sure the memory was written correctly
}

function readFromCustomMemoryAddress(address, offset, dataType, index) {
  if (processObject == undefined) {
    return "Game is not running!";
  }
  // Read and Write sync are faster than async by about 50000~60000 nanoseconds
  let valueChanged = false;
  if (index <= -1) {
    index = undefined;
  }
  if (index == undefined) {
    return memoryjs.readMemory(processObject.handle, address + offset, dataType);
  }
  if (gameMemory.memory_data[index].current_value != gameMemory.memory_data[index].old_value) {
    valueChanged = true;
  }
  gameMemory.memory_data[index].old_value = gameMemory.memory_data[index].current_value;
  return memoryjs.readMemory(processObject.handle, address + offset, dataType);
}

function writeToAppMemory(addressName, value) {
  if (processObject == undefined) {
    return "Game is not running!";
  }
  let memoryIndex = gameMemory.memory_data.findIndex(element => element.address_name == addressName);
  if (memoryIndex == -1) {
    return "Invalid memory name";
  }
  if (gameMemory.memory_data[memoryIndex].is_writeable == false) {
    gameMemory.memory_data[memoryIndex].current_value = "This address is marked as Read Only";
    return gameMemory.memory_data[memoryIndex];
  }
  gameMemory.memory_data[memoryIndex].current_value = writeToCustomMemoryAddress(parseInt(gameMemory.memory_data[memoryIndex].memory_address, 16), baseMemoryAddress, value, gameMemory.memory_data[memoryIndex].data_type, memoryIndex);
  return gameMemory.memory_data[memoryIndex];
}

function readFromAppMemory(addressName) {
  if (processObject == undefined) {
    return "Game is not running!";
  }
  let memoryIndex = gameMemory.memory_data.findIndex(element => element.address_name == addressName);
  if (memoryIndex == -1) {
    return "Invalid memory name";
  }
  gameMemory.memory_data[memoryIndex].current_value = readFromCustomMemoryAddress(parseInt(gameMemory.memory_data[memoryIndex].memory_address, 16), baseMemoryAddress, gameMemory.memory_data[memoryIndex].data_type, memoryIndex);
  return gameMemory.memory_data[memoryIndex];
}

function readFromAppPointer(pointerName, offsetName) {
  if (processObject == undefined) {
    return "Game is not running!";
  }
  // The code below is an unreadable mess
  let pointerIndex = gameMemory.memory_data.findIndex(element => element.address_name == pointerName);
  let offsetIndex = gameMemory.memory_data.findIndex(element => element.address_name == offsetName);
  if (pointerIndex == -1 || offsetIndex == -1) {
    return "Invalid pointer name or offset name";
  }
  if (gameMemory.memory_data[pointerIndex].pointer_type == "none" || gameMemory.memory_data[offsetIndex].offset_type == "none") {
    return "Pointer address provided is not a pointer or offset address provided is not an offset";
  }
  gameMemory.memory_data[pointerIndex].current_value = readFromCustomMemoryAddress(parseInt(gameMemory.memory_data[pointerIndex].memory_address, 16), baseMemoryAddress, gameMemory.memory_data[pointerIndex].data_type, pointerIndex);
  if (gameMemory.memory_data[pointerIndex].current_value == 0) {
    gameMemory.memory_data[offsetIndex].memory_address = "0x0";
    gameMemory.memory_data[offsetIndex].current_value = -1;
    return gameMemory.memory_data[offsetIndex];
  }
  gameMemory.memory_data[offsetIndex].memory_address = "0x" + (parseInt(gameMemory.memory_data[offsetIndex].offset, 16) + gameMemory.memory_data[pointerIndex].current_value).toString(16);
  gameMemory.memory_data[offsetIndex].current_value = readFromCustomMemoryAddress(parseInt(gameMemory.memory_data[offsetIndex].memory_address, 16), baseMemoryAddress, gameMemory.memory_data[offsetIndex].data_type, offsetIndex);
  return gameMemory.memory_data[offsetIndex];
}

function writeToAppPointer(pointerName, offsetName, value) {
  if (processObject == undefined) {
    return "Game is not running!";
  }
  // The code below is an unreadable mess
  let pointerIndex = gameMemory.memory_data.findIndex(element => element.address_name == pointerName);
  let offsetIndex = gameMemory.memory_data.findIndex(element => element.address_name == offsetName);
  if (pointerIndex == -1 || offsetIndex == -1) {
    return "Invalid pointer name or offset name";
  }
  if (gameMemory.memory_data[pointerIndex].pointer_type == "none" || gameMemory.memory_data[offsetIndex].offset_type == "none") {
    return "Pointer address provided is not a pointer or offset address provided is not an offset";
  }
  if (gameMemory.memory_data[offsetIndex].is_writeable == false) {
    gameMemory.memory_data[offsetIndex].current_value = "This offset is marked as Read Only";
    return gameMemory.memory_data[offsetIndex];
  }
  gameMemory.memory_data[pointerIndex].current_value = readFromCustomMemoryAddress(parseInt(gameMemory.memory_data[pointerIndex].memory_address, 16), baseMemoryAddress, gameMemory.memory_data[pointerIndex].data_type, pointerIndex);
  if (gameMemory.memory_data[pointerIndex].current_value == 0) {
    gameMemory.memory_data[offsetIndex].memory_address = "0x0";
    gameMemory.memory_data[offsetIndex].current_value = -1;
    return gameMemory.memory_data[offsetIndex];
  }
  gameMemory.memory_data[offsetIndex].memory_address = "0x" + (parseInt(gameMemory.memory_data[offsetIndex].offset, 16) + gameMemory.memory_data[pointerIndex].current_value).toString(16);
  gameMemory.memory_data[offsetIndex].current_value = writeToCustomMemoryAddress(parseInt(gameMemory.memory_data[offsetIndex].memory_address, 16), baseMemoryAddress, value, gameMemory.memory_data[offsetIndex].data_type, offsetIndex);
  return gameMemory.memory_data[offsetIndex];
}

function getMemoryDataSize(addressName) {
  if (processObject == undefined) {
    return "Game is not running!";
  }
  let memoryIndex = gameMemory.memory_data.findIndex(element => element.address_name == addressName);
  if (memoryIndex == -1) {
    return "Invalid memory name";
  }
  return gameMemory.memory_data[memoryIndex].size;
}

var server = http.createServer(handleRequest);
server.listen(webServerPort);

console.log(new Date().toISOString() + " Web Server started on port " + webServerPort);

function handleRequest(req, res) {
  // What did we request?
  var pathname = req.url;

  // If blank let's ask for index.html
  pathname = pathname.replace(/\/+/ig, "\/"); // Remove multiple slashes (if accidentally typed or whatever)
  if (pathname === "/") {
    pathname = "/index.html";
    //console.log(new Date().toISOString() + " Did we request " + pathname + "?");
  }
  if (pathname === "/jsonamp") {
    //console.log(new Date().toISOString() + " Did we request " + pathname + "?");
  }
  if (pathname === "/binamp") {
    //console.log(new Date().toISOString() + " Did we request " + pathname + "?");
  }


  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".ttf": "font/ttf",
    ".ico": "image/vnd.microsoft.icon",
    ".mp3": "audio/mpeg",
    ".png": "image/png",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".json": "application/json",
    ".txt": "text/plain"
  };

  // What is it?  Default to plain text
  var contentType = typeExt[ext] || "text/plain";

  // User file system module
  fs.readFile(__dirname + pathname,
    // Callback function for reading
    function(err, data) {
      // if there is an error
      if (err && pathname === "/jsonamp") {
        //console.log(new Date().toISOString() + " ERROR AND PATHNAME IS /jsonamp YOOOOOOOOOOOOOOOOOOO");
        let payloadToSend = Buffer.from(JSON.stringify(winampDisplayDataObject)); // Buffer
        let payloadToSendSize = Buffer.byteLength(JSON.stringify(winampDisplayDataObject)); // Buffer size in bytes
        res.writeHead(200, {
          "Content-Type": "text/plain",
          "Content-Length": payloadToSendSize
        });
        return res.end(payloadToSend);
      }
      if (err && pathname === "/binamp") {
        //console.log(new Date().toISOString() + " ERROR AND PATHNAME IS /binamp YOOOOOOOOOOOOOOOOOOO");
        let payloadToSend = winampDisplayDataBuffer; // Buffer
        console.log(payloadToSend);
        let payloadToSendSize = winampDisplayDataBuffer.length; // Buffer size in bytes
        res.writeHead(200, {
          "Content-Type": "text/plain",
          "Content-Length": payloadToSendSize
        });
        return res.end(payloadToSend);
      }
      if ((err) && (pathname !== "/jsonamp" || pathname !== "/binamp")) {
        console.log(new Date().toISOString() + " ERROR AND PATHNAME NOT /jsonamp OR /binamp");
        res.writeHead(500);
        return res.end("Error loading " + pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200, {
        "Content-Type": contentType
      });
      return res.end(data);
    }
  );
}


// WebSocket Portion
// WebSockets work with the HTTP server
//var io = require("socket.io").listen(server);
var io = require("socket.io")(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on("connection",
  // We are given a websocket object in our function
  function(socket) {
    gameMemory = JSON.parse(fs.readFileSync(gameMemoryConfigFileName, "utf8"));
    console.log(new Date().toISOString() + " We have a new client: " + socket.id);
    if (processObject == undefined) {
      console.log(new Date().toISOString() + " Client connected, app NOT running");
      processObject = undefined;
      modulesList = [];
      gameMemoryToDisplay = [];
      gameMemoryToOverride = [];
      io.sockets.emit("game_memory_to_display", gameMemoryToDisplay);
    }
    if (processObject != undefined) {
      console.log(new Date().toISOString() + " Client connected, app running");
      gameMemory = JSON.parse(fs.readFileSync(gameMemoryConfigFileName, "utf8"));
      ajaxAmpAddress = gameMemory.ajaxamp_address;
      ajaxAmpPort = gameMemory.ajaxamp_port;
      overlayPath = gameMemory.overlay_path;
      overlayPath = overlayPath.replace(/({{path_separator}})+/ig, path.sep);
      baseMemoryAddress = parseInt(gameMemory.base_address, 16);
      endMemoryAddress = parseInt(gameMemory.end_address, 16);
      basePointerAddress = parseInt(gameMemory.base_pointer_address, 16);
      endPointerAddress = parseInt(gameMemory.end_pointer_address, 16);
      processObject = memoryjs.openProcess(processName);
      //console.log(processObject);
      modulesList = memoryjs.getModules(processObject.th32ProcessID);
      //console.log(modulesList);
      gameMemoryToDisplay = [];
      gameMemoryToOverride = [];
      for (let gameMemoryObjectIndex = 0; gameMemoryObjectIndex < gameMemory.memory_data.length; gameMemoryObjectIndex++) {
        if (gameMemory.memory_data[gameMemoryObjectIndex].to_override == true) {
          if (gameMemory.memory_data[gameMemoryObjectIndex].module_name !== "") {
            //gameMemoryToOverride.push(gameMemory.memory_data[gameMemoryObjectIndex]);
          }
        }
        if (gameMemory.memory_data[gameMemoryObjectIndex].to_display == true) {
          if (gameMemory.memory_data[gameMemoryObjectIndex].module_name !== "") {
            //console.log(gameMemory.memory_data[gameMemoryObjectIndex]);
            gameMemoryToDisplay.push(gameMemory.memory_data[gameMemoryObjectIndex]);
          }
        }
      }
      //console.log(gameMemoryToDisplay);
      io.sockets.emit("game_memory_to_display", gameMemoryToDisplay);
    }
    socket.on("disconnect", function() {
      console.log(new Date().toISOString() + " Client has disconnected: " + socket.id);
    });
  }
);

function getUtf16leStringData(utf16leBuffer) {
  //console.log("TEST");
  //console.log(utf16leBuffer);
  let utf16leBufferLength = utf16leBuffer.length;
  let foundUtf16leNullTerminator = false;
  let utf16leNullTerminatorIndex = -1;
  let utf16leString = utf16leBuffer.toString("utf16le", 0, utf16leBufferLength);
  let utf16leStringLength = [...utf16leString].length;
  let utf16leStringToBuffer = Buffer.alloc(utf16leBufferLength, 0);
  utf16leStringToBuffer.write(utf16leString, 0, utf16leBufferLength, "utf16le");
  let utf16leStringToBufferLength = utf16leStringToBuffer.length;
  let utf16leObjectToReturn = {
    original_utf16le_buffer: utf16leBuffer,
    original_utf16le_buffer_length: utf16leBufferLength,
    found_utf16_null_terminator: foundUtf16leNullTerminator,
    utf16le_null_terminator_index: utf16leNullTerminatorIndex,
    utf16le_string: utf16leString,
    utf16le_string_length: utf16leStringLength,
    utf16le_string_to_buffer: utf16leStringToBuffer,
    utf16le_string_to_buffer_length: utf16leStringToBufferLength
  };
  // Using for loop instead of while loop so it doesn't get stuck on infinite loop for whatever reason
  for (let utf16leBufferIndex = 0; utf16leBufferIndex < utf16leBufferLength; utf16leBufferIndex+=2) {
    //console.log("TEST = " + utf16leBufferIndex);
    if (foundUtf16leNullTerminator == false) {
      if (utf16leBuffer[utf16leBufferIndex] == 0x00 && utf16leBuffer[utf16leBufferIndex + 1] == 0x00) {
        //console.log(utf16leBufferIndex);
        //console.log(utf16leBuffer[utf16leBufferIndex]);
        foundUtf16leNullTerminator = true;
        utf16leNullTerminatorIndex = utf16leBufferIndex;
        utf16leString = utf16leBuffer.toString("utf16le", 0, utf16leNullTerminatorIndex);
        utf16leStringLength = [...utf16leString].length;
        utf16leStringToBuffer = Buffer.alloc(utf16leNullTerminatorIndex, 0);
        utf16leStringToBuffer.write(utf16leString, 0, utf16leNullTerminatorIndex, "utf16le");
        utf16leStringToBufferLength = utf16leStringToBuffer.length;
        utf16leObjectToReturn = {
          original_utf16le_buffer: utf16leBuffer,
          original_utf16le_buffer_length: utf16leBufferLength,
          found_utf16_null_terminator: foundUtf16leNullTerminator,
          utf16le_null_terminator_index: utf16leNullTerminatorIndex,
          utf16le_string: utf16leString,
          utf16le_string_length: utf16leStringLength,
          utf16le_string_to_buffer: utf16leStringToBuffer,
          utf16le_string_to_buffer_length: utf16leStringToBufferLength
        };
        return utf16leObjectToReturn;
      }
    }
  }
  foundUtf16leNullTerminator = false;
  utf16leNullTerminatorIndex = utf16leBufferLength;
  utf16leString = utf16leBuffer.toString("utf16le", 0, utf16leNullTerminatorIndex);
  utf16leStringLength = [...utf16leString].length;
  utf16leStringToBuffer = Buffer.alloc(utf16leNullTerminatorIndex, 0);
  utf16leStringToBuffer.write(utf16leString, 0, utf16leNullTerminatorIndex, "utf16le");
  utf16leStringToBufferLength = utf16leStringToBuffer.length;
  utf16leObjectToReturn = {
    original_utf16le_buffer: utf16leBuffer,
    original_utf16le_buffer_length: utf16leBufferLength,
    found_utf16_null_terminator: foundUtf16leNullTerminator,
    utf16le_null_terminator_index: utf16leNullTerminatorIndex,
    utf16le_string: utf16leString,
    utf16le_string_length: utf16leStringLength,
    utf16le_string_to_buffer: utf16leStringToBuffer,
    utf16le_string_to_buffer_length: utf16leStringToBufferLength
  };
  return utf16leObjectToReturn;
}

function getAddressBasedOnModuleName(gameMemoryObject) {
  gameMemoryObject.memory_address = "0x00000000";
  if (gameMemoryObject.module_name == "") {
    return gameMemoryObject;
  }
  let moduleIndex = modulesList.findIndex(element => element.szModule == gameMemoryObject.module_name);
  if (moduleIndex == -1) {
    return gameMemoryObject;
  }
  let newAddress = modulesList[moduleIndex].modBaseAddr + parseInt(gameMemoryObject.offset, 16);
  gameMemoryObject.memory_address = "0x" + (newAddress).toString(16);
  return gameMemoryObject;
}

function map(value, inMin, inMax, outMin, outMax) {
  // Round up before returning
  let mappedValue = (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  let mappedValueRoundedUp = Math.ceil(mappedValue);
  return mappedValueRoundedUp;
}

function convertUtf16leBufferObjectToAsciiObject(utf16leBufferObject) {

  let processedMessage = utf16leBufferObject.utf16le_string;
  processedMessage = processedMessage.normalize("NFD").replace(/[\u007E-\uFFFF]+/ig, "");
  processedMessage = processedMessage.substring(0, 255);
  processedMessage = processedMessage.trim();
  processedMessage = processedMessage.replace(/\s+/ig, " ");
  processedMessage = processedMessage.replace(/[\u0000-\u001F]+/ig, "");
  processedMessage = processedMessage.replace(/[\u007E-\uFFFF]+/ig, "");
  processedMessage = processedMessage.substring(0, 255);
  processedMessage = processedMessage.trim();

  let inputString = processedMessage;
  let inputStringLength = inputString.length;

  let asciiBuffer = Buffer.alloc(255, 0);
  asciiBuffer.write(inputString, 0, 255, "ascii");
  let asciiBufferLength = asciiBuffer.length;
  let asciiString = asciiBuffer.toString("ascii", 0, asciiBufferLength);
  let asciiStringLength = [...asciiString].length;
  let asciiStringToBuffer = Buffer.alloc(asciiBufferLength, 0);
  asciiStringToBuffer.write(asciiString, 0, asciiStringLength, "ascii");
  let asciiStringToBufferLength = asciiStringToBuffer.length;

  let asciiStringClean = asciiString;
  asciiStringClean = asciiStringClean.normalize("NFD").replace(/[\u007E-\uFFFF]+/ig, "");
  asciiStringClean = asciiStringClean.substring(0, 255);
  asciiStringClean = asciiStringClean.trim();
  asciiStringClean = asciiStringClean.replace(/\s+/ig, " ");
  asciiStringClean = asciiStringClean.replace(/[\u0000-\u001F]+/ig, "");
  asciiStringClean = asciiStringClean.replace(/[\u007E-\uFFFF]+/ig, "");
  asciiStringClean = asciiStringClean.substring(0, 255);
  asciiStringClean = asciiStringClean.trim();

  let asciiStringCleanLength = asciiStringClean.length;

  let utf16leBuffer = utf16leBufferObject.utf16le_string_to_buffer;
  let utf16leBufferLength = utf16leBuffer.length;
  let utf16leString = utf16leBuffer.toString("utf16le", 0, utf16leBufferLength);
  let utf16leStringLength = [...utf16leString].length;
  let utf16leStringToBuffer = Buffer.alloc(utf16leBufferLength, 0);
  utf16leStringToBuffer.write(utf16leString, 0, utf16leBufferLength, "utf16le");
  let utf16leStringToBufferLength = utf16leStringToBuffer.length;

  let asciiObjectToReturn = {
    input_string: inputString,
    input_string_length: inputStringLength,
    original_ascii_buffer: asciiBuffer,
    original_ascii_buffer_length: asciiBufferLength,
    ascii_string: asciiString,
    ascii_string_length: asciiStringLength,
    ascii_string_to_buffer: asciiStringToBuffer,
    ascii_string_to_buffer_length: asciiStringToBufferLength,
    ascii_string_clean: asciiStringClean,
    ascii_string_clean_length: asciiStringCleanLength,
    original_utf16le_buffer: utf16leBuffer,
    original_utf16le_buffer_length: utf16leBufferLength,
    utf16le_string: utf16leString,
    utf16le_string_length: utf16leStringLength,
    utf16le_string_to_buffer: utf16leStringToBuffer,
    utf16le_string_to_buffer_length: utf16leStringToBufferLength
  };

  return asciiObjectToReturn;
}

function sendDefaultWinampData(tcpClientObject) {
  console.log(new Date().toISOString() + " We have to send default Winamp data 4");
  if (tcpClientObject == null || tcpClientObject == undefined) {
    console.log(new Date().toISOString() + " We can't send default Winamp data because the client is invalid");
    return;
  }
  console.log(new Date().toISOString() + " We have to send default Winamp data 5");
  // This function is called when Winamp is not running, sends default data (default values) to the clients
  winampDisplayDataBufferIndex = 0;

  windowTitleUnicodeUtf16leBufferObject = getUtf16leStringData(winampDisplayDataDefaultObject.window_title_unicode_string);
  filenameUnicodeUtf16leBufferObject = getUtf16leStringData(winampDisplayDataDefaultObject.filename_unicode_string);
  songTitleNoNumberUnicodeUtf16leBufferObject = getUtf16leStringData(winampDisplayDataDefaultObject.song_title_no_number_unicode_string);
  songTitleUnicodeUtf16leBufferObject = getUtf16leStringData(winampDisplayDataDefaultObject.song_title_unicode_string);
  windowTitleNoUnicodeAsciiBufferObject = convertUtf16leBufferObjectToAsciiObject(windowTitleUnicodeUtf16leBufferObject);
  filenameNoUnicodeAsciiBufferObject = convertUtf16leBufferObjectToAsciiObject(filenameUnicodeUtf16leBufferObject);
  songTitleNoNumberNoUnicodeAsciiBufferObject = convertUtf16leBufferObjectToAsciiObject(songTitleNoNumberUnicodeUtf16leBufferObject);
  songTitleNoUnicodeAsciiBufferObject = convertUtf16leBufferObjectToAsciiObject(songTitleUnicodeUtf16leBufferObject);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 12;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.bitrate_kbps, winampDisplayDataBufferIndex);
  if (winampDisplayDataDefaultObject.length_seconds_total <= 0) {
    winampDisplayDataDefaultObject.length_seconds_total = 0;
  }
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.length_seconds_total, winampDisplayDataBufferIndex);
  let lengthDays = (parseInt(winampDisplayDataDefaultObject.length_seconds_total / 86400)).toString().padStart(2, "0");
  let lengthHours1 = (parseInt(winampDisplayDataDefaultObject.length_seconds_total / 3600) % 24).toString().padStart(2, "0");
  let lengthMinutes1 = (parseInt(winampDisplayDataDefaultObject.length_seconds_total / 60) % 60).toString().padStart(2, "0");
  let lengthSeconds = (parseInt(winampDisplayDataDefaultObject.length_seconds_total) % 60).toString().padStart(2, "0");
  let lengthHours2 = (parseInt(winampDisplayDataDefaultObject.length_seconds_total / 3600)).toString().padStart(2, "0");
  //let lengthMinutes1 = (parseInt(winampDisplayDataDefaultObject.length_seconds_total / 60) % 60).toString().padStart(2, "0");
  //let lengthSeconds = (parseInt(winampDisplayDataDefaultObject.length_seconds_total) % 60).toString().padStart(2, "0");
  let lengthMinutes2 = (parseInt(winampDisplayDataDefaultObject.length_seconds_total / 60)).toString().padStart(2, "0");
  //let lengthSeconds = (parseInt(winampDisplayDataDefaultObject.length_seconds_total) % 60).toString().padStart(2, "0");
  let lengthMinutesSecondsString = lengthMinutes2 + ":" + lengthSeconds;
  let lengthHoursMinutesSecondsString = lengthHours2 + ":" + lengthMinutes1 + ":" + lengthSeconds;
  let lengthDaysHoursMinutesSecondsString = lengthDays + ":" + lengthHours1 + ":" + lengthMinutes1 + ":" + lengthSeconds;
  winampDisplayDataDefaultObject.length_seconds = lengthSeconds;
  winampDisplayDataDefaultObject.length_minutes_1 = lengthMinutes1;
  winampDisplayDataDefaultObject.length_minutes_2 = lengthMinutes2;
  winampDisplayDataDefaultObject.length_hours_1 = lengthHours1;
  winampDisplayDataDefaultObject.length_hours_2 = lengthHours2;
  winampDisplayDataDefaultObject.length_days = lengthDays;
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.length_seconds, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.length_minutes_1, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.length_minutes_2, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.length_hours_1, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.length_hours_2, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.length_days, winampDisplayDataBufferIndex);
  winampDisplayDataDefaultObject.length_minutes_seconds_string = lengthMinutesSecondsString;
  winampDisplayDataDefaultObject.length_hours_minutes_seconds_string = lengthHoursMinutesSecondsString;
  winampDisplayDataDefaultObject.length_days_hours_minutes_seconds_string = lengthDaysHoursMinutesSecondsString;
  let lengthMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
  let lengthMinutesSecondsStringLength = [...winampDisplayDataDefaultObject.length_minutes_seconds_string].length;
  lengthMinutesSecondsStringBuffer.write(winampDisplayDataDefaultObject.length_minutes_seconds_string, 0, lengthMinutesSecondsStringLength, "ascii");
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  lengthMinutesSecondsStringBuffer.copy(winampDisplayDataDefaultBuffer, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
  winampDisplayDataDefaultBuffer.writeInt32LE(lengthMinutesSecondsStringLength, winampDisplayDataBufferIndex);
  console.log("lengthMinutesSecondsStringLength = " + lengthMinutesSecondsStringLength);
  let lengthHoursMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
  let lengthHoursMinutesSecondsStringLength = [...winampDisplayDataDefaultObject.length_hours_minutes_seconds_string].length;
  lengthHoursMinutesSecondsStringBuffer.write(winampDisplayDataDefaultObject.length_hours_minutes_seconds_string, 0, lengthHoursMinutesSecondsStringLength, "ascii");
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  lengthHoursMinutesSecondsStringBuffer.copy(winampDisplayDataDefaultBuffer, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
  winampDisplayDataDefaultBuffer.writeInt32LE(lengthHoursMinutesSecondsStringLength, winampDisplayDataBufferIndex);
  let lengthDaysHoursMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
  let lengthDaysHoursMinutesSecondsStringLength = [...winampDisplayDataDefaultObject.length_days_hours_minutes_seconds_string].length;
  lengthDaysHoursMinutesSecondsStringBuffer.write(winampDisplayDataDefaultObject.length_days_hours_minutes_seconds_string, 0, lengthDaysHoursMinutesSecondsStringLength, "ascii");
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  lengthDaysHoursMinutesSecondsStringBuffer.copy(winampDisplayDataDefaultBuffer, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
  winampDisplayDataDefaultBuffer.writeInt32LE(lengthDaysHoursMinutesSecondsStringLength, winampDisplayDataBufferIndex);

  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.volume_level, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.visualizer_state, winampDisplayDataBufferIndex);
  if (winampDisplayDataDefaultObject.position_seconds_total <= 0) {
    winampDisplayDataDefaultObject.position_seconds_total = 0;
  }
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.position_seconds_total, winampDisplayDataBufferIndex);
  let positionDays = (parseInt(winampDisplayDataDefaultObject.position_seconds_total / 86400)).toString().padStart(2, "0");
  let positionHours1 = (parseInt(winampDisplayDataDefaultObject.position_seconds_total / 3600) % 24).toString().padStart(2, "0");
  let positionMinutes1 = (parseInt(winampDisplayDataDefaultObject.position_seconds_total / 60) % 60).toString().padStart(2, "0");
  let positionSeconds = (parseInt(winampDisplayDataDefaultObject.position_seconds_total) % 60).toString().padStart(2, "0");
  let positionHours2 = (parseInt(winampDisplayDataDefaultObject.position_seconds_total / 3600)).toString().padStart(2, "0");
  //let positionMinutes1 = (parseInt(winampDisplayDataDefaultObject.position_seconds_total / 60) % 60).toString().padStart(2, "0");
  //let positionSeconds = (parseInt(winampDisplayDataDefaultObject.position_seconds_total) % 60).toString().padStart(2, "0");
  let positionMinutes2 = (parseInt(winampDisplayDataDefaultObject.position_seconds_total / 60)).toString().padStart(2, "0");
  //let positionSeconds = (parseInt(winampDisplayDataDefaultObject.position_seconds_total) % 60).toString().padStart(2, "0");
  let positionMinutesSecondsString = positionMinutes2 + ":" + positionSeconds;
  let positionHoursMinutesSecondsString = positionHours2 + ":" + positionMinutes1 + ":" + positionSeconds;
  let positionDaysHoursMinutesSecondsString = positionDays + ":" + positionHours1 + ":" + positionMinutes1 + ":" + positionSeconds;
  winampDisplayDataDefaultObject.position_seconds = positionSeconds;
  winampDisplayDataDefaultObject.position_minutes_1 = positionMinutes1;
  winampDisplayDataDefaultObject.position_minutes_2 = positionMinutes2;
  winampDisplayDataDefaultObject.position_hours_1 = positionHours1;
  winampDisplayDataDefaultObject.position_hours_2 = positionHours2;
  winampDisplayDataDefaultObject.position_days = positionDays;
  winampDisplayDataDefaultObject.position_minutes_seconds_string = positionMinutesSecondsString;
  winampDisplayDataDefaultObject.position_hours_minutes_seconds_string = positionHoursMinutesSecondsString;
  winampDisplayDataDefaultObject.position_days_hours_minutes_seconds_string = positionDaysHoursMinutesSecondsString;
  let positionMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
  let positionMinutesSecondsStringLength = [...winampDisplayDataDefaultObject.position_minutes_seconds_string].length;
  positionMinutesSecondsStringBuffer.write(winampDisplayDataDefaultObject.position_minutes_seconds_string, 0, positionMinutesSecondsStringLength, "ascii");
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  positionMinutesSecondsStringBuffer.copy(winampDisplayDataDefaultBuffer, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
  winampDisplayDataDefaultBuffer.writeInt32LE(positionMinutesSecondsStringLength, winampDisplayDataBufferIndex);
  let positionHoursMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
  let positionHoursMinutesSecondsStringLength = [...winampDisplayDataDefaultObject.position_hours_minutes_seconds_string].length;
  positionHoursMinutesSecondsStringBuffer.write(winampDisplayDataDefaultObject.position_hours_minutes_seconds_string, 0, positionHoursMinutesSecondsStringLength, "ascii");
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  positionHoursMinutesSecondsStringBuffer.copy(winampDisplayDataDefaultBuffer, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
  winampDisplayDataDefaultBuffer.writeInt32LE(positionHoursMinutesSecondsStringLength, winampDisplayDataBufferIndex);
  let positionDaysHoursMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
  let positionDaysHoursMinutesSecondsStringLength = [...winampDisplayDataDefaultObject.position_days_hours_minutes_seconds_string].length;
  positionDaysHoursMinutesSecondsStringBuffer.write(winampDisplayDataDefaultObject.position_days_hours_minutes_seconds_string, 0, positionDaysHoursMinutesSecondsStringLength, "ascii");
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  positionDaysHoursMinutesSecondsStringBuffer.copy(winampDisplayDataDefaultBuffer, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
  winampDisplayDataDefaultBuffer.writeInt32LE(positionDaysHoursMinutesSecondsStringLength, winampDisplayDataBufferIndex);

  winampDisplayDataDefaultObject.remaining_seconds_total = winampDisplayDataDefaultObject.position_seconds_total - winampDisplayDataDefaultObject.length_seconds_total;
  if (winampDisplayDataDefaultObject.length_seconds_total <= 0) {
    winampDisplayDataDefaultObject.remaining_seconds_total = 0;
  }
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.remaining_seconds_total, winampDisplayDataBufferIndex);
  let remainingDays = (parseInt(winampDisplayDataDefaultObject.remaining_seconds_total / 86400)).toString().padStart(2, "0");
  let remainingHours1 = (parseInt(winampDisplayDataDefaultObject.remaining_seconds_total / 3600) % 24).toString().padStart(2, "0");
  let remainingMinutes1 = (parseInt(winampDisplayDataDefaultObject.remaining_seconds_total / 60) % 60).toString().padStart(2, "0");
  let remainingSeconds = (parseInt(winampDisplayDataDefaultObject.remaining_seconds_total) % 60).toString().padStart(2, "0");
  let remainingHours2 = (parseInt(winampDisplayDataDefaultObject.remaining_seconds_total / 3600)).toString().padStart(2, "0");
  //let remainingMinutes1 = (parseInt(winampDisplayDataDefaultObject.remaining_seconds_total / 60) % 60).toString().padStart(2, "0");
  //let remainingSeconds = (parseInt(winampDisplayDataDefaultObject.remaining_seconds_total) % 60).toString().padStart(2, "0");
  let remainingMinutes2 = (parseInt(winampDisplayDataDefaultObject.remaining_seconds_total / 60)).toString().padStart(2, "0");
  //let remainingSeconds = (parseInt(winampDisplayDataDefaultObject.remaining_seconds_total) % 60).toString().padStart(2, "0");
  let remainingMinutesSecondsString = remainingMinutes2 + ":" + remainingSeconds;
  let remainingHoursMinutesSecondsString = remainingHours2 + ":" + remainingMinutes1 + ":" + remainingSeconds;
  let remainingDaysHoursMinutesSecondsString = remainingDays + ":" + remainingHours1 + ":" + remainingMinutes1 + ":" + remainingSeconds;
  winampDisplayDataDefaultObject.remaining_seconds = remainingSeconds;
  winampDisplayDataDefaultObject.remaining_minutes_1 = remainingMinutes1;
  winampDisplayDataDefaultObject.remaining_minutes_2 = remainingMinutes2;
  winampDisplayDataDefaultObject.remaining_hours_1 = remainingHours1;
  winampDisplayDataDefaultObject.remaining_hours_2 = remainingHours2;
  winampDisplayDataDefaultObject.remaining_days = remainingDays;
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.remaining_seconds, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.remaining_minutes_1, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.remaining_minutes_2, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.remaining_hours_1, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.remaining_hours_2, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.remaining_days, winampDisplayDataBufferIndex);
  winampDisplayDataDefaultObject.remaining_minutes_seconds_string = remainingMinutesSecondsString;
  winampDisplayDataDefaultObject.remaining_hours_minutes_seconds_string = remainingHoursMinutesSecondsString;
  winampDisplayDataDefaultObject.remaining_days_hours_minutes_seconds_string = remainingDaysHoursMinutesSecondsString;
  let remainingMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
  let remainingMinutesSecondsStringLength = [...winampDisplayDataDefaultObject.remaining_minutes_seconds_string].length;
  remainingMinutesSecondsStringBuffer.write(winampDisplayDataDefaultObject.remaining_minutes_seconds_string, 0, remainingMinutesSecondsStringLength, "ascii");
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  remainingMinutesSecondsStringBuffer.copy(winampDisplayDataDefaultBuffer, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
  winampDisplayDataDefaultBuffer.writeInt32LE(remainingMinutesSecondsStringLength, winampDisplayDataBufferIndex);
  let remainingHoursMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
  let remainingHoursMinutesSecondsStringLength = [...winampDisplayDataDefaultObject.remaining_hours_minutes_seconds_string].length;
  remainingHoursMinutesSecondsStringBuffer.write(winampDisplayDataDefaultObject.remaining_hours_minutes_seconds_string, 0, remainingHoursMinutesSecondsStringLength, "ascii");
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  remainingHoursMinutesSecondsStringBuffer.copy(winampDisplayDataDefaultBuffer, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
  winampDisplayDataDefaultBuffer.writeInt32LE(remainingHoursMinutesSecondsStringLength, winampDisplayDataBufferIndex);
  let remainingDaysHoursMinutesSecondsStringBuffer = Buffer.alloc(16, 0);
  let remainingDaysHoursMinutesSecondsStringLength = [...winampDisplayDataDefaultObject.remaining_days_hours_minutes_seconds_string].length;
  remainingDaysHoursMinutesSecondsStringBuffer.write(winampDisplayDataDefaultObject.remaining_days_hours_minutes_seconds_string, 0, remainingDaysHoursMinutesSecondsStringLength, "ascii");
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  remainingDaysHoursMinutesSecondsStringBuffer.copy(winampDisplayDataDefaultBuffer, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 16;
  winampDisplayDataDefaultBuffer.writeInt32LE(remainingDaysHoursMinutesSecondsStringLength, winampDisplayDataBufferIndex);

  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.audio_channels, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.repeat_state, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.eq_auto_state, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.shuffle_state, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.eq_state, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeInt8(winampDisplayDataDefaultObject.balance_pan, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.time_display_state, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.sample_rate_khz, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeInt32LE(winampDisplayDataDefaultObject.sample_rate_hz, winampDisplayDataBufferIndex);
  winampDisplayDataDefaultObject.eq_70hz_int = map(winampDisplayDataDefaultObject.eq_70hz_float, -12, 12, 0, 255);
  winampDisplayDataDefaultObject.eq_180hz_int = map(winampDisplayDataDefaultObject.eq_180hz_float, -12, 12, 0, 255);
  winampDisplayDataDefaultObject.eq_320hz_int = map(winampDisplayDataDefaultObject.eq_320hz_float, -12, 12, 0, 255);
  winampDisplayDataDefaultObject.eq_600hz_int = map(winampDisplayDataDefaultObject.eq_600hz_float, -12, 12, 0, 255);
  winampDisplayDataDefaultObject.eq_1khz_int = map(winampDisplayDataDefaultObject.eq_1khz_float, -12, 12, 0, 255);
  winampDisplayDataDefaultObject.eq_3khz_int = map(winampDisplayDataDefaultObject.eq_3khz_float, -12, 12, 0, 255);
  winampDisplayDataDefaultObject.eq_6khz_int = map(winampDisplayDataDefaultObject.eq_6khz_float, -12, 12, 0, 255);
  winampDisplayDataDefaultObject.eq_12khz_int = map(winampDisplayDataDefaultObject.eq_12khz_float, -12, 12, 0, 255);
  winampDisplayDataDefaultObject.eq_14khz_int = map(winampDisplayDataDefaultObject.eq_14khz_float, -12, 12, 0, 255);
  winampDisplayDataDefaultObject.eq_16khz_int = map(winampDisplayDataDefaultObject.eq_16khz_float, -12, 12, 0, 255);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.eq_70hz_int, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.eq_180hz_int, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.eq_320hz_int, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.eq_600hz_int, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.eq_1khz_int, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.eq_3khz_int, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.eq_6khz_int, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.eq_12khz_int, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.eq_14khz_int, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  winampDisplayDataDefaultBuffer.writeUInt8(winampDisplayDataDefaultObject.eq_16khz_int, winampDisplayDataBufferIndex);
  winampDisplayDataDefaultObject.window_title_unicode_string = windowTitleUnicodeUtf16leBufferObject.utf16le_string;
  winampDisplayDataDefaultObject.window_title_ascii_string = windowTitleNoUnicodeAsciiBufferObject.ascii_string_clean;
  //winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  //windowTitleNoUnicodeAsciiBufferObject.ascii_string_to_buffer.copy(winampDisplayDataDefaultBuffer, winampDisplayDataBufferIndex);
  //winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 256;
  //winampDisplayDataDefaultBuffer.writeInt32LE(windowTitleNoUnicodeAsciiBufferObject.ascii_string_clean_length, winampDisplayDataBufferIndex);
  winampDisplayDataDefaultObject.filename_unicode_string = filenameUnicodeUtf16leBufferObject.utf16le_string;
  winampDisplayDataDefaultObject.filename_ascii_string = filenameNoUnicodeAsciiBufferObject.ascii_string_clean;
  //winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  //filenameNoUnicodeAsciiBufferObject.ascii_string_to_buffer.copy(winampDisplayDataDefaultBuffer, winampDisplayDataBufferIndex);
  //winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 256;
  //winampDisplayDataDefaultBuffer.writeInt32LE(filenameNoUnicodeAsciiBufferObject.ascii_string_clean_length, winampDisplayDataBufferIndex);
  winampDisplayDataDefaultObject.song_title_no_number_unicode_string = songTitleNoNumberUnicodeUtf16leBufferObject.utf16le_string;
  winampDisplayDataDefaultObject.song_title_no_number_ascii_string = songTitleNoNumberNoUnicodeAsciiBufferObject.ascii_string_clean;
  //winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 4;
  //songTitleNoNumberNoUnicodeAsciiBufferObject.ascii_string_to_buffer.copy(winampDisplayDataDefaultBuffer, winampDisplayDataBufferIndex);
  //winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 256;
  //winampDisplayDataDefaultBuffer.writeInt32LE(songTitleNoNumberNoUnicodeAsciiBufferObject.ascii_string_clean_length, winampDisplayDataBufferIndex);
  winampDisplayDataDefaultObject.song_title_unicode_string = songTitleUnicodeUtf16leBufferObject.utf16le_string;
  winampDisplayDataDefaultObject.song_title_ascii_string = songTitleNoUnicodeAsciiBufferObject.ascii_string_clean;
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 1;
  songTitleNoUnicodeAsciiBufferObject.ascii_string_to_buffer.copy(winampDisplayDataDefaultBuffer, winampDisplayDataBufferIndex);
  winampDisplayDataBufferIndex = winampDisplayDataBufferIndex + 256;
  winampDisplayDataDefaultBuffer.writeInt32LE(songTitleNoUnicodeAsciiBufferObject.ascii_string_clean_length, winampDisplayDataBufferIndex);

  io.sockets.emit("winamp_display_data", winampDisplayDataDefaultObject);
  if (tcpClientObject != null && tcpClientObject != undefined) {
    console.log(new Date().toISOString() + " We have to send default Winamp data 6");
    sendTcpMessageToClient(tcpClientObject, winampDisplayDataDefaultBuffer);
  }
  return;
}