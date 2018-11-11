# UNLV PeopleSoft Flex Connector
Flex connector to UNLV's PeopleSoft SOAP service (https://css-tst.unlv.nevada.edu/PSIGW/PeopleSoftServiceListeningConnector/CI_UNLAUTH_BASIC.1.wsdl)

# Prerequisites
Install the Kinvey Flex CLI (https://devcenter.kinvey.com/nativescript/guides/flex-services#installation).
Install the NPM Soap module (https://www.npmjs.com/package/soap#install)

# Test Locally
Follow this tutorial (https://www.progress.com/blogs/developing-and-testing-of-kinvey-flex-services-the-easier-way).  Choose the FlexData approach, creating a collection, and then mapping the collection to the established data service.

# Deploy on Flex Service Runtime
To deploy on FlexService Runtime, create a flex profile if none exists.  Use the flex profile, log in to the new profile, and then initialize the Node.JS project as a flex service.  You will be walked through steps to determine which FSR Service to map the microservice to.  After the microservice is mapped to the correct FSR service, you should see UNLV_People_Soft under the FlexData Service Objects menu.  Now, you can map a collection to use this data service. 

# Using the PeopleSoft Flex Connector
This Flex connector is a Kinvey FlexData service (https://devcenter.kinvey.com/nativescript/guides/flex-services#flex-data).
There is one service object, registered as "UNLV_People_Soft".  The service object has one 
FlexData route (https://devcenter.kinvey.com/nativescript/reference/flex/reference.html#flexdata-routes) exposed, for onGetByQuery.

Clients expecting to connect to this FlexService should issue a GET query with a JSON object set to the query parameter:

/appdata/<app_kid>/<mapped_collection_name?query={"key1":"value1","key2",:"value2"} Include all strings with single quotes, NOT DOUBLE QUOTES.

The JSON object should contain the following keys to have the following structure, here is a sample test account that successfully connects:

{
  "UNL_FIELD1":"1000195910",
  "UNL_FIELD2":"123unlv!",
  "UNL_FIELD3":"N",
  "UNL_AUTH_TYPE":"ST",
  "UNL_APP_TYPE":"ITTEST",
  "UNL_KEY":"MYTEST"
}
