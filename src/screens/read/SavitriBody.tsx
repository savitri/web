import * as React from "react";
import { observer, inject } from "mobx-react";

import * as Stores from "../../stores";
import { Body } from "../shared/Body";

interface SavitriBodyProps { }

interface InjectedProps extends SavitriBodyProps {
    sectionsStore: Stores.SectionsStore;
}

@inject("sectionsStore")
@observer
export class SavitriBody extends React.Component<SavitriBodyProps, {}> {
    private injected: InjectedProps;

    constructor(props: SavitriBodyProps) {

        super(props);
        this.injected = props as InjectedProps;
    }
    render() {

        return (
            <Body
                content={this.injected.sectionsStore.shownSection.sentences[0].lines.join("\n")}
                />
        );
    }
}
