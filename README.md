# react-app-playground

Barebones react SPA application with tooling for learning and experimentation.

## Key Infrastructure

- Vite build framework
- Vitest unit testing
- Modular SCSS support
- Lightweight ESLint rule set
- Lightweight ESLint Stylistic formatting

## Capability Libraries

- Tanstack query for data management
- Mock Service Worker (MSW) for API mocking and manipulation

## Node/React Versions
We are not targetting the latest Node or React versions to maintain compatibility with other parts of our estate. As our general support level moves forward, we will update the playground to match.  

## No Tailwind
We have intentionally not included Tailwind setup as part of this playground for now, so that you can use it to improve your native CSS skills via the modular SCSS support instead.

## MSW
This playground includes MSW (Mock Service Worker) support for API mocking. You can find an example of a service and corresponding mock implementation in the *src/areas/demo/service* folder.
It is intended to provide more advanced, accurate and production style API interactions, but does come with some complexity/overhead to setup, so feel free to use more basic hard coded mock data operations if you like.

# Setup

**NPM Scripts Window**

The NPM scripts window is shown in VSCode on the left (under explorer).  
This is the easiest way to execute commands without having to use the terminal or worry about directories.

## NPM Install

When you first get this repo you will need to install the npm dependencies.

Run _install_ from the npm scripts window  
OR  
From a terminal execute _npm install_

## VSCode Settings

The repo is setup to provide workspace settings and extension recommendations.
These have been carefully set up to work together so you should install the recommended extensions when prompted.
If you don't get prompted for extensions, go to the extensions vscode tab, type '@recommended' in the search, and install everything listed under 'workspace extensions'.

### NPM Commands

These can be easily access in VSCode side menu after viewing any package.json file, or executed via terminal with `npm run [command name]`.

- **dev** - Runs the vite development site for the library
- **watch-scss** - Run this (and leave it running) to automatically keep scss class definitions in sync with source files
- **test** - Starts the vitest test runner (this will execute all tests and remain running, watching for changes)
- **lint** - Runs a lint check on the contents
- **build** - Executes a build with publish configuration
- **preview** - Executes and runs a production style build of the site

# Folder Structure

The top level folder structure is as follows:

- .vscode : VSCode extensions and config **DO NOT EDIT**
- **src** : The site content root folder
- public : Files served directly in the root of the output site
- test : Vitest setup

There may also be additional dynamic generated folders which should not be committed:

- dist : Package build output
- node_modules : dependencies folder

# Root Files

The following files contain environmental setup. You can alter these as needed to control local deployment behaviour:

- **.env.development** -Environmental variables used when running in dev mode
- **.env.preview** -Environmental variables used when running in preview mode

- **.eslint.config.js** - Eslint/Stylistic configuration
- **.npmrc** - Package repository configuration
- **.nvmrc** - Node version specification for nvm
- **.gitignore** - Git exclusions
- **index.html** - Vite test site container html
- **package-lock.json** - Current package dependencies map
- **package.json** - Site npm configuration
- **stylelint.config.js** - Stylelint configuration
- **tsconfig.build.json** - Typescript setup for use with production builds
- **tsconfig.json** - Typescript setup for site
- **tsconfig.node.json** - Typescript setup for vite internals
- **vite.config.ts** - Vite configuration

# Src Files

- **areas/demo** - This folder contains a basic example of a list with data load via an MSW mocked API, along with a simple modular SCSS usage and vitest unit testing.
- **common** - Container for common constants and partial SCSS example
- **msw** - Support code for MSW implementations. KEY FILE *mswBrowser.ts* - Add any mock API handlers you create into this file.
