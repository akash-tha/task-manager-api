# task-manager-api
node backend app for user and tasks creations

The code is wrapped with serverless function, customized(sharp library installed for linux with command "npm install --arch=x64 --platform=linux sharp" on windows CMD in admin mode)to work on AWS platform.

In order to test the code locally, run command: serverless offline start

Note: Sharp module may throw error when running on windows machine. It can be resolved by uninstalling "sharp" npm module and installing normally (npm install sharp).

In order to deploy the code on AWS, run command: serverless deploy

Note: Sharp module may throw error at run time. To resolve this, 
 - uninstall sharp module (npm uninstall sharp)
 - Install sharp module for linux (npm install --arch=x64 --platform=linux sharp) from the code directory in CMD admin mode
 - redeploy the code (serverless deploy)
