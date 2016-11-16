import * as React from "react";

interface BodyProps {
    content: string | string[];
}

export class Body extends React.Component<BodyProps, {}> {
    render() {

        return (
            <div>{this.props.content}</div>
        );
    }
}
