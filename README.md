# voz-da-gente

## Prereq's

1. A forvo api key from Forvo's website.

2. A Google Cloud Vision project and keyfile.

3. Nodejs

## Setup
1. Clone repo.

2. Create a config/config.json in the project's root folder with your forvo api key, e.g. 
```json
{
    "FORVO_API_KEY":"your_api_key_here_abc_123"
}
``` 
3. config/googleVisionKeyfile.json => TODO Instructions on how to do this.

3. Using your fav command prompt, nav to the project's root folder and `npm install` to install the dependencies.

4. Start the app by running `node app.js` in the server's root folder (voz-da-gente/server).

5. Check http://localhost:3000/voz/api/samplePhrase in your browser - if you get some json, you're all set!

6. Visit the web app (with the default client) at http://localhost:3000/voz 

## Goals

1. Experiment with html, css, Boostrap, Node, other js

2. Enter block of text - hear selected words by native speakers a la Google translate, Forvo, etc.

## The 20/20
1. Skills exercised: js on node (api endpoints), hitting external api's (Forvo, Google Cloud Vision), html 5 (including file upload), Aurelia (core and http-client), promises (on client and server side), async, dotenv

2. The async npm package makes easy work of processing/aggregating the results of a list of requests.

3. Even though I went with a simple config.json, the dotenv npm package looked nice. Provides an easy way to set environment config (e.g. api keys) and get them from process.env.

4. Pulling the httpOptions out of the controller and into a model (e.g. forvoHttpOptions) made it really easy to to build a bunch of options while varying the word/lang/etc.

5. Felt good to have the apiController pass off processing to a service - cut down a lotta code noise in the controller.

6. Got some Aurelia action (with the aurelia-http-client extra) going on! Like the split between view/html/css and behavior/js. Useful binding like disabled.bind="isThisEnabled" (for buttons) or if.bind="!isThisTrue" (when determining if to render a tag or not).

7. For international/accented chars, used the node library 'querystring' to escape the word before sending it to Forvo's api. This fixed the bug that prevented words like 'aplicação' from getting voice clip results.

8. Aurelia's data binding made easy work of displaying a bunch of dropdown options from an api response.

9. Promises (client and server side) are great for reducing the complexity of upteen-layers of callbacks. @.@

10. Considered using Express multer middleware for uploading a file directly to server as part of a form submit... But since I didn't want to temporarily save (and clean up) old images, it's good enough that the client sends a base 64 encoded string of the image to the server.

11. Google Cloud Vision - a little tricky setting up the auth and digesting/hitting the api... But infinitely easier than a home-grown text-from-image solution!!!! 

12. Nice to have the client and server code separated into their own folders. Received an "Error: Forbidden" from Express' res.sendFile() - discovered it's necessary to require('path') and use path.resolve when navigating with relative paths (e.g. '../../client/src'). The '../' could be used maliciously if it came in from user - this tells Express to resolve the path.
