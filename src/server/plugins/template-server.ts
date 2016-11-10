import * as Hapi from "hapi";

exports.register = (server: Hapi.Server, options: any, next: Function) => {

    const { template, context } = options;

    server.route({
        path: "/{p*}",
        method: "GET",
        handler: (request, reply) => {

            return reply.view(template, context);
        }
    });

    return next();
};

exports.register.attributes = {
    name: "template-server",
    dependencies: ["vision"]
};
