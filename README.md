# voz-da-gente

## Prereq's:

1. A forvo api key from Forvo's website.

2. Nodejs

## Example setup steps:
1. Clone repo.

2. Create a config/config.json in the project's root folder with your forvo api key, e.g.
```json
{
    "FORVO_API_KEY":"your_api_key_here_abc_123"
}
```
3. Using your fav command prompt, nav to the project's root folder and `npm install` to install the dependencies.

4. Start the app by running `node app.js` in the project's root folder.

5. Check http://localhost:3000/voz/api/samplePhrase in your browser - if you get some json, you're all set!

6. Visit the web app (with the default client) at http://localhost:3000/voz 

## Todo list:
1. Troubleshoot words that have non-english chars, e.g. secretária, português.

2. Lazy load the audio links to save on Forvo api calls, e.g. click button in order to load audio controls.

3. Pretty up the app.

4. forvoService.getForvoObjects() => remove that response parameter

## Goals: 

1. Experiment with html, css, Boostrap, Node, other js

2. Enter block of text - hear selected words by native speakers a la Google translate, Forvo, etc.

## Reflections:
1. Skills exercised: js on node (api endpoints), hitting external api (Forvo), html 5, Aurelia (core and http-client), promises, async, dotenv 

2. The async npm package makes easy work of processing/aggregating the results of a list of requests.

3. Even though I went with a simple config.json, the dotenv npm package looked nice. Provides an easy way to set environment config (e.g. api keys) and get them from process.env.

4. Pulling the httpOptions out of the controller and into a model (e.g. forvoHttpOptions) made it really easy to to build a bunch of options while varying the word/lang/etc.

5. Felt good to have the apiController pass off processing to a service - cut down a lotta code noise in the controller.

6. Got some Aurelia action (with the aurelia-http-client extra) going on! Like the split between view/html/css and behavior/js.

7. For international/accented chars, used the node library 'querystring' to escape the word before sending it to Forvo's api. This fixed the bug that prevented words like 'aplicação' from getting voice clip results.

8. Aurelia's data binding made easy work of displaying a bunch of dropdown options from an api response.
