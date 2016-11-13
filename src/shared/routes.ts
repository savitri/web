import { PlainRoute } from "react-router";

import { App } from "../screens/app";
import { Home } from "../screens/app/Home";
import { Test } from "../screens/test";
import { Read } from "../screens/read";

import DefaultExport from "./DefaultExport";

const plainRoutes: PlainRoute = {
    path: "/",
    component: App,
    indexRoute: { component: Home },
    childRoutes: [
        {
            path: "/test",
            component: Test
        },
        {
            path: "/read/:book/:canto/:section",
            component: Read
        }
    ]
};

export const routes = Object.assign(DefaultExport, plainRoutes);
