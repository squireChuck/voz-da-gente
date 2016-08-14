# vozes-da-gente

Goals: 

1. Experiment with html, css, Boostrap, Node, other js

2. Enter block of text - hear selected words by native speakers a la Google translate, Forvo, etc.

Reflections:
1. The async npm package makes easy work of processing/aggregating the results of a list of requests.

2. Even though I went with a simple config.json, the dotenv npm package looked nice. Provides an easy way to set environment config (e.g. api keys) and get them from process.env.

3. Pulling the httpOptions out of the controller and into a model (e.g. forvoHttpOptions) made it really easy to to build a bunch of options while varying the word/lang/etc.

4. Felt good to have the apiController pass off processing to a service - cut down a lotta code noise in the controller.