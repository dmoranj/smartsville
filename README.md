# SmartCity Connection tutorial: Smartsville

## Overview

This repository holds the resources for the FIWARE SmartCity device connection tutorial for Intel Edison. It mainly holds two resources: the code for the tutorial and the Postman API Call collection.

## Code

Be aware that the code was initially intended for its use in an Intel Edison project, so changes might be needed to work on other platforms.

There are several branches in the repository. Each one of the branches hold a diferent consecutive stage in the development of the same complete project. The `master` branch holds de final code. The following list explains in greater detail what is implemented in each branch:

* `step1`: holds the code for accesing the underlying sensor information and the control loop for the lighting and sempahores.
* `step2`: adds the code to send the sensor information to the IoT Platform.
* `step3`: adds all the code needed to process the commands coming from the IoT Platform.
* `master`: branch holds the final state of the code with all the SmartCity features working connected to the Platform.

## Postman API Call collection

Postman is REST client implemented as an application/plugin for Google Chrome. This repository holds an exported Postman collection that you can import in your local browser, in order to reproduce all the API Calls used throughout the tutorial. Take into account that, in order for the Postman collection to work, you must create a Postman environment, as some of the requests use variables to hold some pieces of data. The following list shows the required variables and a brief explanation:

* **iotahost**: IP or hostname where the IoTAgent is listening.
* **iotaport**: North Bound port where the IoTAgent is listening.
* **measureport**: South Bound port where the IoTAgent is listening.
* **cbhost**: host of the Context Broker.
* **cbport**: port where the Context Broker is listening.
* **apikey**: APIKey the device group will use.
* **service**: name of the Service or Tenant owner of the data.
* **subservice**: subservice or segmentation of the data inside the tenant (must begin with '/').
* **deviceid**: ID of the device.
