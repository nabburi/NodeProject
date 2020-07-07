//to get data from bluetooth
//const bluetooth = require('node-bluetooth');
//const device = new bluetooth.DeviceINQ();
//to get data from usb port
var usbPorts = require("usb");

usbPorts.setDebugLevel(3);
connectdevice(43981, 4660);
/** 
ports = usbPorts.getDeviceList();
ports.forEach((port) => {
  console.log(port);
});
//to get device names
var usbDetect = require("usb-detection");
usbDetect.find().then(function (devices) {
  console.log(devices);
});
*/
function connectdevice(vID, pId) {
  var device = usbPorts.findByIds(vID, pId);
  device.open();
  //evice.controlTransfer(0x80, 34, 0, 0, 8, 0, 0);
  var deviceINTF = device.interfaces[0];

  if (deviceINTF.isKernelDriverActive()) {
    deviceINTF.detachKernelDriver();
  }
  deviceINTF.claim();

  var ePs = deviceINTF.endpoints;
  var inEndpoint = ePs[1];
  var outEndPoint = ePs[0];
  console.log(ePs);
  //device.interfaces[0].claim();

  if (inEndpoint) {
    inEndpoint.transferType = 2;
    inEndpoint.startPoll(10, 800);
    console.log("non empty port : " + inEndpoint);
    inEndpoint.transfer(8000, function (error, data) {
      if (!error) {
        console.log(data);
      } else {
        console.log(error);
      }
    });
    inEndpoint.on("data", function (data) {
      console.log("1" + data);
    });
    inEndpoint.on("error", function (error) {
      console.log(error);
    });
    console.log("after transfer");
    inEndpoint.stopPoll(function (end) {
      console.log(end);
    });
  } else {
    console.log("unable to read ..");
  }

  /**
  outEndPoint.transferType = 2;
  //outEndPoint.startStream(1, 64);
  outEndPoint.transfer(Buffer.alloc(8), function (err) {
    console.log(err);
  });
   */
}
