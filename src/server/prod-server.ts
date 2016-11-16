import * as Hapi from "hapi";
import { readFileSync } from "fs";
const Inert = require("inert");
const Vision = require("vision");
const Exiting = require("exiting");
require("dotenv").config();

const TemplateServer = require("./plugins/template-server");
const StaticFileServer = require("./plugins/file-server");

const bundleName = JSON.parse(readFileSync("public/webpack.hash.json", "utf-8")).main;

const server = new Hapi.Server();

server.connection({
    port: 3002
});

const plugins = [
    Inert,
    Vision,
    {
        register: TemplateServer,
        options: {
            template: "index",
            context: {
                context: JSON.stringify({}),
                bundleName: bundleName
            }
        }
    },
    StaticFileServer
];

server.register(plugins, (err) => {

    if (err) {
        throw err;
    }
});

server.views({
    engines: { hbs: require("handlebars") }
});

new Exiting.Manager(server).start((err: Error) => {

    if (err) {
        throw err;
    }

    console.log("Production server started at", server.info.uri);
});
