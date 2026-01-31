const path = require("path");

//Configuring environment vairiables
exports.config = () => {
  const environment = process.env.env;
  let envPath;
  if(environment == "development"){
    envPath = "./env/.env-dev";
  }
  if(environment == "staging"){
    envPath = "./env/.env-stg";
  }
  if(environment == "test"){
    envPath = "./env/.env-test";
  }
  require("dotenv").config({ path: path.resolve(process.cwd(), envPath) });
  return environment;
};
