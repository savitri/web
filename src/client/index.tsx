import * as React from "react";
import * as ReactTapEventPlugin from "react-tap-event-plugin";
import { render } from "react-dom";
import { useStrict } from "mobx";
import "core-js/shim";

import Main from "./main";
import * as Stores from "../stores";
import { Context } from "../shared/interfaces";

ReactTapEventPlugin();

useStrict(true);

declare const module: { hot: any };

interface WindowCustom extends Window {
    __INITIAL_STATE__: Context;
}

declare const window: WindowCustom;

const context: Context = {
    appState: Stores.AppState.getInstance(window.__INITIAL_STATE__.appState),
    editionsStore: Stores.EditionsStore.getInstance(window.__INITIAL_STATE__.editionsStore),
    sectionsStore: Stores.SectionsStore.getInstance(window.__INITIAL_STATE__.sectionsStore),
    blogsStore: Stores.BlogsStore.getInstance()
};

if (process.env.NODE_ENV !== "production") {
    const { AppContainer } = require("react-hot-loader");

    render(
        <AppContainer>
            <Main { ...context } />
        </AppContainer>,
        document.getElementById("app")
    );

    if (module.hot) {
        module.hot.accept("./main", () => {

            const NextApp = require("./main").default;

            render(
                <AppContainer>
                    <NextApp { ...context } />
                </AppContainer>,
                document.getElementById("app")
            );
        });
    }
}
else {
    render(
        <Main { ...context } />,
        document.getElementById("app")
    );
}
