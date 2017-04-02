CharIoT
=======

End-user programming interface for GIoTTO.

## Installation

1. Install NodeJS: https://nodejs.org/en/
2. Clone/download this folder and `cd` into it
3. Run `npm install`
4. Optional: in order to enable the explore tab, install the Eye reasoner
  - http://eulersharp.sourceforge.net/INSTALL

## Usage

To start the application, execute: `npm start`

Access the app through your browser on the address: http://localhost:3333/

The app assumes that devices have locations associated with them (e.g., living
room, lab).
To add a location for a device:

- Click on a device node in the graph
- Type in the location name and click on Add
- Do this for all the devices

Creating a rule requires a virtual sensor - there are two types of virtual sensors:

- Programmed - added by clicking the ``Program an event'' button. Contain conditions on a specific sensor value, e.g., temperature
- Virtual - demonstrated using PbD. Click on ``Demonstrate an event'' to add it.

To create a rule, go to the ``Build'' section and follow the IFTTT-like interface.

# Screenshots

## Overview of installation

<img src="https://f001.backblazeb2.com/file/referred/chariot-screenshots/overview.png" width="400"/>

## Training virtual sensors

<img src="https://f001.backblazeb2.com/file/referred/chariot-screenshots/create_virtual_sensor.png" width="400"/> <img src="https://f001.backblazeb2.com/file/referred/chariot-screenshots/demonstrations.png" width="400"/>
<img src="https://f001.backblazeb2.com/file/referred/chariot-screenshots/training.png" width="400"/>

## IFTTT rules

<img src="https://f001.backblazeb2.com/file/referred/chariot-screenshots/ifttt.png" width="400"/> <img src="https://f001.backblazeb2.com/file/referred/chariot-screenshots/rule_overview.png" width="400"/>
<img src="https://f001.backblazeb2.com/file/referred/chariot-screenshots/conditions.png" width="400"/> <img src="https://f001.backblazeb2.com/file/referred/chariot-screenshots/actions.png" width="400"/>

## Rule recommendations

<img src="https://f001.backblazeb2.com/file/referred/chariot-screenshots/explore.png" width="400"/>

## TODO

- Deleting rules and virtual sensors is not supported since the API for deleting sensors is missing in BuildingDepot.
