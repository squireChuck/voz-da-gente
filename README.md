# voz-da-gente

## Prereq's:

1. A forvo api key from Forvo's website.

## Example setup steps:
1. Clone repo.

2. Create a config/config.json in the project's root folder with your forvo api key, e.g.
```json
{
    "FORVO_API_KEY":"your_api_key_here_abc_123"
}
```

3. Using your fav command prompt, start the app by nav'ing to the project's root folder and running `node app.js` 

4. Check http://localhost:3000/api/samplePhrase in your browser - if you get some json, you're all set!

## Goals: 

1. Experiment with html, css, Boostrap, Node, other js

2. Enter block of text - hear selected words by native speakers a la Google translate, Forvo, etc.

## Reflections:
1. The async npm package makes easy work of processing/aggregating the results of a list of requests.

2. Even though I went with a simple config.json, the dotenv npm package looked nice. Provides an easy way to set environment config (e.g. api keys) and get them from process.env.

3. Pulling the httpOptions out of the controller and into a model (e.g. forvoHttpOptions) made it really easy to to build a bunch of options while varying the word/lang/etc.

4. Felt good to have the apiController pass off processing to a service - cut down a lotta code noise in the controller.