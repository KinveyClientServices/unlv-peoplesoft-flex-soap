/**
 * Copyright (c) 2018 Kinvey Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */


const config = require('config');
const soap = require('soap');

let peopleSoftConnection;
let logger;

function initHandler(flexLogger) {
    logger = flexLogger;
}

function getPeopleSoftConnection(callback) {
    if (peopleSoftConnection) {
      return setImmediate(() => callback(null, peopleSoftConnection));
    }

    const url = config.peopleSoft.connectionUrl;

    soap.createClient(url, function(err, client) {
      if (err) {
        return callback(err, client);
      }
      peopleSoftConnection = client;
      return callback(null, peopleSoftConnection);
    });
}

function getUNLAuthBasicC(authObject, callback) {
 //const jsonObjectData = JSON.parse(authObject);

  peopleSoftConnection.CI_UNLAUTH_BASIC_C({
    UNL_AUTH_NBR: authObject.UNL_AUTH_NBR != null ?
      authObject.UNL_AUTH_NBR : "",
    UNL_FIELD1: authObject.UNL_FIELD1 != null ?
      authObject.UNL_FIELD1 : "",
    UNL_FIELD2: authObject.UNL_FIELD2 != null ?
      authObject.UNL_FIELD2 : "",
    UNL_FIELD3: authObject.UNL_FIELD3 != null ?
      authObject.UNL_FIELD3 : "",
    UNL_AUTH_TYPE: authObject.UNL_AUTH_TYPE != null ?
      authObject.UNL_AUTH_TYPE : "",
    UNL_APP_TYPE: authObject.UNL_APP_TYPE != null ?
      authObject.UNL_APP_TYPE : "",
    UNL_KEY: authObject.UNL_KEY != null ?
      authObject.UNL_KEY : "",
    UNL_AUTH_FLG: authObject.UNL_AUTH_FLAG != null ?
      authObject.UNL_AUTH_FLAG : "",
    EMPLID: authObject.EMPLID != null ?
      authObject.EMPLID : "",
    FIRST_NAME: authObject.FIRST_NAME != null ?
      authObject.FIRST_NAME : "",
    MIDDLE_NAME: authObject.MIDDLE_NAME != null ?
      authObject.MIDDLE_NAME : "",
    LAST_NAME: authObject.LAST_NAME != null ?
      authObject.LAST_NAME : ""
  }, 
    function(err, result, rawResponse, soapHeader, rawRequest) {
      if (err) {
        logger.error("Error: " + JSON.stringify(err));
        return callback(err, null, null, null, null);
      }
      else {
        return callback(null, result, rawResponse, soapHeader, rawRequest);
      }
  });
}

function getUNLAuthBasicG(authData, callback) {
  peopleSoftConnection.CI_UNLAUTH_BASIC_G({
    UNL_AUTH_NBR: authData.detail.UNLAUTH_BASIC.UNL_AUTH_NBR,
    UNL_AUTH_FLG: authData.detail.UNLAUTH_BASIC.UNL_AUTH_FLAG
  }, function(err, result, rawResponse, soapHeader, rawRequest) {
    if (err) {
      return callback(err, null, null, null, null);
    }
    else {
      return callback(null, result, rawResponse, soapHeader, rawRequest);
    }
  });
}

  function fetchHandler(context, complete) {
    logger.info("Context: " + JSON.stringify(context));

    const authObject = JSON.parse(context.query.query);

    //logger.info("Context Query: " + JSON.stringify(context.query.query));
    getPeopleSoftConnection((err, connection) => {
      getUNLAuthBasicC(authObject, (err, result, rawResponse, soapHeader, rawRequest) => {
        if (err) {
          logger.error("Error: " + err);
          return complete().setBody(err).badRequest().next();
        }
        else {
          getUNLAuthBasicG(result, (err, resultData, rawResponse, soapHeader, rawRequest) => {
            if (err) {
              logger.error("Error: " + err);
              return complete().setBody(err).badRequest().next();
            }
            else {
              return complete().setBody(resultData).ok().next();
            }
          });
        }
      });
    });
  }

  function authHandler(context, complete, modules) {

    const authObject = {};
    /* Add variables HERE to authObject that are passed in
     * the context object.
     * 
     */
    authObject.UNL_FIELD1  = context.body.username;
    authObject.UNL_FIELD2 = context.body.password;

    /* Hard-coding other required variables, such as
     * UNL_FIELD_3, UNL_AUTH_TYPE, UNL_APP_TYPE, UNL_KEY
     */
    authObject.UNL_FIELD3 = "N";
    authObject.UNL_AUTH_TYPE = "ST";
    authObject.UNL_APP_TYPE = "ITTEST";
    authObject.UNL_KEY="MYTEST";

    getPeopleSoftConnection((err, connection) => {
      if (err) {
        logger.error("Error: " + err);
        return complete().accessDenied(err).next();
      }
      else {
        getUNLAuthBasicC(authObject, (err, result, rawResponse, soapHeader, rawRequest) => {
          if (err) {
            logger.error("Error: " + err);
            return complete().accessDenied(err).next();
          }
          else {
            getUNLAuthBasicG(result, (err, resultData, rawResponse, soapHeader, rawRequest) => {
              if (err) {
                logger.error("Error: " + err);
                return complete().accessDenied(err).next();
              }
              else {
                logger.info("Result Data: " + JSON.stringify(resultData));
                if (resultData.EMPLID != null) {
                  return complete().setToken({'myAuthToken': 'ffds9afdsafdsaf89ds0fds90f8ds-='}).ok().next();
                  /*
                    .addAttribute("EmplId", resultData.EMPLID)
                    .addAttribute("FirstName", resultData.FIRST_NAME)
                    .addAttribute("LastName", resultData.LAST_NAME).ok().next();*/
                }
                else {
                  return complete().accessDenied("Invalid credentials").next();
                }
              }
            });
          }
        });
      }
    });
  }

  exports.authHandler = authHandler;
  exports.fetchHandler = fetchHandler;
  exports.initHandler = initHandler;
