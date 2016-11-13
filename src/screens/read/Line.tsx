import * as React from "react";

interface LineProps {
    line: string;
}

interface InjectedProps extends LineProps { }

export class Line extends React.Component<LineProps, {}> {
    render() {

        return (
            <span>{this.props.line}</span>
        );
    }
}
