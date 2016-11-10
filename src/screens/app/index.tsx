import * as React from "react";
import { AppBar } from "material-ui";
import { withRouter } from "react-router";
import * as ReactRouter from "react-router";
import { Layout } from "./Layout";
import { NavButtons } from "./NavButtons";
import { observer, inject } from "mobx-react";

import * as Stores from "../../stores";
import { SideNav } from "./SideNav";

interface AppProps {
    router: ReactRouter.InjectedRouter;
}

interface InjectedProps extends AppProps {
    editionsStore: Stores.EditionsStore;
    appState: Stores.AppState;
}

@inject("editionsStore", "appState")
@withRouter
@observer
export class App extends React.Component<AppProps, {}> {
    private injected: InjectedProps;

    constructor(props: AppProps) {

        super(props);
        this.injected = props as any;
    }

    handleTitleTouchTap = () => {

        this.props.router.push("/");
    }

    handleLeftIconClicked = () => {

        this.injected.appState.setSidenavOpen(true);
    }

    handleDrawerRequestClose = () => {

        this.injected.appState.setSidenavOpen(false);
    }

    render() {

        return (
            <div>
                <AppBar
                    title={<span style={styles.title}>Savitri</span>}
                    onLeftIconButtonTouchTap={this.handleLeftIconClicked}
                    onTitleTouchTap={this.handleTitleTouchTap}
                    iconElementRight={<NavButtons />}
                    />
                <SideNav
                    open={this.injected.appState.sidenavOpen}
                    onClose={this.handleDrawerRequestClose}
                    />
                <Layout>{this.props.children}</Layout>
            </div>
        );
    }
}

const styles = {
    title: {
        cursor: "pointer"
    }
};
