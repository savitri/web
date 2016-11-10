import * as Hapi from "hapi";

exports.register = (server: Hapi.Server, options: any, next: Function) => {

    server.route({
        path: "/static/{p*}",
        method: "GET",
        handler: {
            directory: {
                path: "public"
            }
        }
    });

    server.route({
        path: "/favicon.ico",
        method: "GET",
        handler: {
            file: "public/favicon.ico"
        }
    });

    return next();
};

exports.register.attributes = {
    name: "file-server"
};
