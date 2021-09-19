# Summarize Stickys

A Figjam plugin for automatically summarizing a selection of sticky notes.

This plugin uses the open source [GPT Summarization API](https://gpt-summarization.p.rapidapi.com/summarize).


## How to run locally
* Run `yarn` to install dependencies.
* Run `yarn build:watch` to start webpack in watch mode.

## How too use
*  To use it locally, sign up for a Rapid API account and input your API key in App.tsx on line 85. 
*  Then build the plugin using the commands above, create a new plugin in Figjam, and select this folder's Manifest.JSON file. 
* You should then be able to run this plugin "in development" in Figjam.
* Once installed, select any given sticky notes and hit summarize.

The endpoint is quite slow (it is free) so be mindful that is working.

⭐ To change the UI of your plugin (the react code), start editing [App.tsx](./src/app/components/App.tsx).  
⭐ To interact with the Figma API edit [controller.ts](./src/plugin/controller.ts).  
⭐ Read more on the [Figma API Overview](https://www.figma.com/plugin-docs/api/api-overview/).

## Toolings
This repo is using:
* React + Webpack
* TypeScript
* TSLint
* Prettier precommit hook
