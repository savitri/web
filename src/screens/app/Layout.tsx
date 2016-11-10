import * as React from "react";
import { observer } from "mobx-react";

@observer
export class Layout extends React.Component<{}, {}> {
    render() {

        return (
            <div className="container" style={styles.self}>
                {this.props.children}
            </div>
        );
    }
}

const styles = {
    self: {
        paddingTop: 60,
        paddingBottom: 60
    }
};
