const { writeFile } = require('fs');
const { argv } = require('yargs');
// read environment variables from .env file
require('dotenv').config();
// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;
// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   ANGULAR_APP_CLOUD_NAME: "${process.env.ANGULAR_APP_CLOUD_NAME}",
   ANGULAR_APP_UPLOAD_PRESET: "${process.env.ANGULAR_APP_UPLOAD_PRESET}"
};
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err: any) {
   if (err) {
      console.log(err);
   }
   console.log(`Wrote variables to ${targetPath}`);
});