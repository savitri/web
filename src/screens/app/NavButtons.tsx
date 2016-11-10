import * as React from "react";
import { FlatButton } from "material-ui";
import { Link } from "react-router";

interface NavButtonsProps {
    router?: any;
}

export class NavButtons extends React.Component<NavButtonsProps, {}> {
    static muiName = "FlatButton";

    render() {
        return (
            <div>
                <FlatButton label="Text" {...this.props} containerElement={<Link to="/read" />} />
                <FlatButton {...this.props} label="Journals" containerElement={<Link to="/test" />} />
            </div>
        );
    }
}
