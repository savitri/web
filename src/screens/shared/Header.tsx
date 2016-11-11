import * as React from "react";

interface HeaderProps {
    heading?: string;
    title?: string;
    subtitle?: string;
    author?: string;
}

export class Header extends React.Component<HeaderProps, {}> {
    render() {

        return (
            <div>
                <h3>{this.props.heading}</h3>
                <h1>{this.props.title}</h1>
                <h4>{this.props.subtitle}</h4>
            </div>
        );
    }
}
