import * as React from "react";
import { observer, inject } from "mobx-react";

import * as Stores from "../../stores";
import { Header } from "../shared/Header";

interface SavitriHeaderProps {
}

interface InjectedProps {
    sectionsStore: Stores.SectionsStore;
}

@inject("sectionsStore")
@observer
export class SavitriHeader extends React.Component<SavitriHeaderProps, {}> {
    private injected: InjectedProps;

    constructor(props: SavitriHeaderProps) {

        super(props);
        this.injected = props as InjectedProps;
    }

    render() {

        const shownCanto = this.injected.sectionsStore.shownCanto;

        if (!shownCanto) {
            return null;
        }

        const shownSection = this.injected.sectionsStore.shownSection;

        return (
            <Header
                heading={shownCanto.heading}
                title={shownCanto.title}
                subtitle={shownSection.heading}
                />
        );
    }
}
