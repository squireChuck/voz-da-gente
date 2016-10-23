# voz-da-gente

## Prereq's

1. A forvo api key from [Forvo's Api site](http://api.forvo.com/) to get the voice clips. 

2. A [Google Cloud Vision project](https://cloud.google.com/vision/docs/quickstart#set_up_your_project) - optional, if you want image-to-text processing. For example, upload a book's page and get the text for it.

3. [Nodejs](https://nodejs.org/en/) - required to run the web app.

## Setup
1. Clone or download the project.

2. To enable the voice clips:
  1. Find the configExample.json file in the voz-da-gente/server/config folder and copy your api key into the "your_api_key_here_abc_123" placeholder text, e.g. 
  2. Rename configExample.json to config.json 
  3. When you're done, the config.json should look something like 
 ```json
 {
     "FORVO_API_KEY":"g1f5d9s888sc8ee7as8a5e2s6a3f4fwa"
 }
 ``` 
3. To enable image upload and processing, you'll need a Google vision key file.
  * Follow [Google's instructions](https://cloud.google.com/vision/docs/common/auth#set_up_a_service_account) on how to create a key file. 
  * Then, save the Google key file into the voz-da-gente/server/config folder and name it googleVisionKeyfile.json

3. Using your fav command prompt, nav to the voz-da-gente/server folder and run `npm install` to install the dependencies.

4. Start the app by running `node app.js` in the voz-da-gente/server folder

5. Check http://localhost:3000/voz/api/samplePhrase in your browser - if you get some text, you're all set!

6. Once the app is running, visit it at http://localhost:3000/voz 

## Goals

1. Experiment with html, css, Boostrap, Node, other js

2. Enter block of text - hear selected words by native speakers a la Google translate, Forvo, etc.

## The 20/20
1. Skills exercised: js on node (api endpoints), hitting external api's (Forvo, Google Cloud Vision), html 5 (including file upload), Aurelia (core and http-client), promises (on client and server side), async, dotenv

2. The async npm package makes easy work of processing/aggregating the results of a list of requests.

3. Even though I went with a simple config.json (for the Forvo api key), the dotenv npm package looked nice. Provides an easy way to set environment config (e.g. api keys) and get them from process.env.

4. Pulling the httpOptions out of the controller and into a model (e.g. forvoHttpOptions) made it really easy to to build a bunch of options while varying the word/lang/etc.

5. Felt good to have the apiController pass off processing to a service - cut down a lotta code noise in the controller.

6. Got some Aurelia action (with the aurelia-http-client extra) going on! Like the split between view/html/css and behavior/js. Useful binding like disabled.bind="isThisEnabled" (for buttons) or if.bind="!isThisTrue" (when determining if to render a tag or not).

7. For international/accented chars, used the node library 'querystring' to escape the word before sending it to Forvo's api. This fixed the bug that prevented words like 'aplicação' from getting voice clip results. 
  * On the client side, use encodeURI() to preserve spaces, newlines, etc being sent to the server.

8. Aurelia's data binding made easy work of displaying a bunch of dropdown options from an api response.

9. Promises (client and server side) are great for reducing the complexity of upteen-layers of callbacks. @.@

10. Considered using Express multer middleware for uploading a file directly to server as part of a form submit... But since I didn't want to temporarily save (and clean up) old images, it's good enough that the client sends a base 64 encoded string of the image to the server.

11. Google Cloud Vision - a little tricky setting up the auth and digesting/hitting the api... But infinitely easier than a home-grown text-from-image solution!!!! 

12. Nice to have the client and server code separated into their own folders. 
  * Received an "Error: Forbidden" from Express' res.sendFile() - discovered it's necessary to require('path') and use path.resolve when navigating with relative paths (e.g. '../../client/src'). The '../' could be used maliciously if it came in from user - this tells Express to resolve the path.

13. Using methods in Aurelia views
  * sending strings to method from view: myMethod(${myObject.word})
  * sending the object itself (which you can set properties on): myMethod(myObject)
  * moral of the story - don't overcomplicate the process!
