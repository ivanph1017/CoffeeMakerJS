# CoffeeMakerJS

This is part of project to manage a coffee maker remotely. More details can be found here:

- [CoffeeMaker](https://github.com/ivanph1017/CoffeeMaker)

The script was developed in Javascript following ECMAScript 2016 and run on Node.JS. More details can be found here:

- [Promise guide](https://javascript.info/promise-basics): Modern JavaScript Tutorial
- [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) by Mozilla
- [JavaScript: What the heck is a Callback?](https://codeburst.io/javascript-what-the-heck-is-a-callback-aba4da2deced) by Brandon Morelli

## Wiring

The full list of devices required are below:

-	Android smartphone
-	Raspberry PI 3
-	Relay module
-	Coffee maker
-	Breadboard
-	2 float ball liquid sensor
-	2 resistors of 10k ohms
-	Many jump wires with female and male header connectors
-	Many jump wires with female and female header connectors
-	Many jump wires with male and male header connectors

Then, the circuits should look like the image below:

![Circuit](https://raw.githubusercontent.com/ivanph1017/AssetsRepo/master/CoffeeMaker/circuit%20with%20raspberry%20pi%203.png)

The relay module is like our switch, it can open or close the electric circuit of the coffee maker. In other words, it's the device that turns on/off our machine. For more details of how a relay works, follow the next link:

-	[Introduction to relays (Spanish)](https://www.inventable.eu/introduccion-a-los-reles/)

## Setting up

First of all, we might end up accesing our Raspberry PI 3 on Wifi, so enabling SSH and setting up our SSID and password come handy.

-	[Raspberry PI SSH guide](https://www.raspberrypi.org/documentation/remote-access/ssh/)
-	[Raspberry PI Wifi guide](https://www.raspberrypi.org/documentation/configuration/wireless/)

Then, it's necessary to install Node.JS in order to be run the script on our Raspdian. Therefore, it's necessary to follow Node.JS. Nonetheless, it's  thoroughly recommended to follow the NVM guide to manage both Node.JS and npm in an easier way.

-	[Node.JS guide](https://docs.npmjs.com/getting-started/installing-node)
-	[NVM guide](https://github.com/creationix/nvm/blob/master/README.md#installation)

Later, it's time to set up the libraries that will be part of our project.

-	[Onoff doc](https://github.com/fivdi/onoff): The GPIO library that allow us to access GPIO Raspberry PI 3 pins.
-	[Firebase doc](https://firebase.google.com/docs/web/setup): Here's a complete guide detailed step by step to add Firebase library

Finally, install PM2 library globally in order to auto run our script on startup and monitor it.

-	[PM2 doc](http://pm2.keymetrics.io/docs/usage/quick-start/)

Here's an article about Node.JS modules and an explanation about exporting primitive values by module.exports:

-	[Understanding module.exports and exports in Node.js](https://www.sitepoint.com/understanding-module-exports-exports-node-js/) by Cho S. Kim
-	[Stackoverflow: Node.js - changing the value of an exported integer](https://stackoverflow.com/questions/32662435/node-js-changing-the-value-of-an-exported-integer) by jfriend00
