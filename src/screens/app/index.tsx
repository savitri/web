import * as React from "react";
import * as History from "history";
import { AppBar } from "material-ui";
import { withRouter } from "react-router";
import * as ReactRouter from "react-router";
import { Layout } from "./Layout";
import { NavButtons } from "./NavButtons";
import { observer, inject } from "mobx-react";

import * as Stores from "../../stores";
import { SideNav } from "./SideNav";

interface AppProps { }

interface InjectedProps extends AppProps {
    editionsStore: Stores.EditionsStore;
    router: ReactRouter.InjectedRouter;
    appState: Stores.AppState;
    location: History.Location;
}

@inject("editionsStore", "appState")
@withRouter
@observer
export class App extends React.Component<AppProps, {}> {
    get injected() {

        return this.props as InjectedProps;
    }

    handleTitleTouchTap = () => {

        this.injected.router.push("/");
    }

    handleLeftIconClicked = () => {

        const edition: string = (this.injected.location.query as any).edition || "1950";
        this.injected.appState.setSidenavOpen(true);
        this.injected.editionsStore.setSelectedEdition(parseInt(edition));
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
