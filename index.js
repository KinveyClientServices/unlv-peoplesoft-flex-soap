const sdk = require('kinvey-flex-sdk');

const handlers = require ('./lib/handlers');

sdk.service((err, flex) => {
  if (err) {
    console.log('Error initializing the Flex SDK, exiting.');
    throw err;
  }

  handlers.initHandler(flex.logger);

  const data = flex.data;   // gets the datalink object from the service  
  const peopleSoftFlex = data.serviceObject('UNLV_People_Soft');

  const flexAuth = flex.auth; 
  flexAuth.register('peopleSoftAuth', handlers.authHandler);

  // wire up the events that we want to process
  peopleSoftFlex.onGetByQuery(handlers.fetchHandler);
});