# plugin_filternavigation: Storefront Reference Architecture (SFRA)

This is the repository for the plugin_filternavigation plugin. This plugin enhances the app_storefront_base cartridge by keeping track of search navigation through asynchronous actions, including the following capabilities:

* Moving back and forth between filter changes
* Go back from the PLP from a PDP without losing your location

# Demo
[![Demonstration](http://i3.ytimg.com/vi/xfcei967Js0/hqdefault.jpg)](https://www.youtube.com/watch?v=xfcei967Js0&feature=youtu.be)


# Cartridge Path Considerations
The plugin_filternavigation plugin requires the app\_storefront\_base cartridge. In your cartridge path, include the cartridges in the following order:

```
plugin_filternavigation:app_storefront_base
```

# Getting Started

1. Clone this repository. (The name of the top-level folder is plugin\_commercepayments.)
2. In the top-level plugin_filternavigation folder, enter the following command: `npm install`. (This command installs all of the package dependencies required for this plugin.)
3. In the top-level plugin_filternavigation folder, edit the paths.base property in the package.json file. This property should contain a relative path to the local directory containing the Storefront Reference Architecture repository. For example:
```
"paths": {
    "base": "../storefront-reference-architecture/cartridges/app_storefront_base/"
}
```
4. In the top-level plugin_filternavigation folder, enter the following command: `npm run compile:js && npm run compile:scss`
5. In the top-level plugin_filternavigation folder, enter the following command: `npm run uploadCartridge`

For information on Getting Started with SFRA, see [Get Started with SFRA](https://documentation.b2c.commercecloud.salesforce.com/DOC1/index.jsp?topic=%2Fcom.demandware.dochelp%2Fcontent%2Fb2c_commerce%2Ftopics%2Fsfra%2Fb2c_sfra_setup.html).

# NPM scripts
Use the provided NPM scripts to compile and upload changes to your sandbox.

## Compiling your application

* `npm run compile:js` - Compiles all js files and aggregates them.

**Note:** The plugin cartridge must be compiled after compiling storefront-reference-architecture (SFRA base) cartridge.

## Linting your code

`npm run lint` - Execute linting for all JavaScript and SCSS files in the project.

## Watching for changes and uploading

`npm run watch` - Watches everything and recompiles (if necessary) and uploads to the sandbox. Requires a valid dw.json file at the root that is configured for the sandbox to upload.
