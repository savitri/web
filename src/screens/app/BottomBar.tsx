import * as React from "react";
import { Paper, FontIcon } from "material-ui";
const BottomNavigation = require("material-ui/BottomNavigation");

interface BottomBarProps { }

interface InjectedProps extends BottomBarProps { }

export class BottomBar extends React.Component<BottomBarProps, {}> {
    render() {

        return (
            <div style={{ paddingTop: 40 }}>
                <Paper zDepth={1} style={{ position: "fixed", bottom: 0, width: "100%", left: 0 }}>
                    <BottomNavigation.BottomNavigation>
                        <BottomNavigation.BottomNavigationItem
                            label="Recents"
                            icon={<FontIcon className="material-icons">restore</FontIcon>}
                            />
                    </BottomNavigation.BottomNavigation>
                </Paper>
            </div>
        );
    }
}
