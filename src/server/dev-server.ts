import * as Hapi from "hapi";
const Inert = require("inert");
const Vision = require("vision");
const Exiting = require("exiting");

const TemplateServer = require("./plugins/template-server");
const StaticFileServer = require("./plugins/file-server");
const webpackConfig = require("../../config/webpack.config.dev");

const server = new Hapi.Server();
server.connection({
    port: 3001
});

const plugins = [
    Inert,
    Vision,
    {
        register: require("hapi-webpack-dev-middleware"),
        options: {
            config: webpackConfig,
            options: {
                noInfo: true,
                publicPath: webpackConfig.output.publicPath
            }
        }
    },
    {
        register: require("hapi-webpack-hot-middleware")
    },
    {
        register: TemplateServer,
        options: {
            template: "index",
            context: {
                context: JSON.stringify({}),
                bundleName: "bundle.js"
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

    console.log("Development server started at", server.info.uri);
});
