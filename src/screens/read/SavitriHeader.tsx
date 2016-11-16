import * as React from "react";
import { observer, inject } from "mobx-react";

import * as Stores from "../../stores";
import { Header } from "../shared/Header";

interface SavitriHeaderProps { }

interface InjectedProps {
    sectionsStore: Stores.SectionsStore;
    editionsStore: Stores.EditionsStore;
}

@inject("editionsStore", "sectionsStore")
@observer
export class SavitriHeader extends React.Component<SavitriHeaderProps, {}> {
    get injected() {

        return this.props as InjectedProps;
    }

    render() {

        const { getSectionDetails } = this.injected.editionsStore;
        const { shownSectionNumber } = this.injected.sectionsStore;

        const section = getSectionDetails(
            shownSectionNumber.book, shownSectionNumber.canto,
            shownSectionNumber.section, shownSectionNumber.edition);

        if (!section) {

            return null;
        }

        return (
            <div>
                <h3>{section.edition + " / " + section.matchingBook.title}</h3>
                <Header
                    heading={section.matchingCanto.heading}
                    title={section.matchingCanto.title}
                    subtitle={section.matchingSection.heading}
                    />
            </div>
        );
    }
}
