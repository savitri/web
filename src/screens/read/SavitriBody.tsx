import * as React from "react";
import { observer, inject } from "mobx-react";

import * as Stores from "../../stores";
import { Sentence } from "./Sentence";

interface SavitriBodyProps { }

interface InjectedProps extends SavitriBodyProps {
    sectionsStore: Stores.SectionsStore;
}

@inject("sectionsStore")
@observer
export class SavitriBody extends React.Component<SavitriBodyProps, {}> {
    get injected() {

        return this.props as InjectedProps;
    }

    render() {

        const { shownSection } = this.injected.sectionsStore;

        if (!shownSection) {

            return null;
        }

        const {sentences, running_no} = shownSection.section;

        return (
            <div>
                {sentences.map(sentence =>
                    <Sentence
                        sentence={sentence.lines}
                        sectionRunningNo={running_no}
                        sentenceNo={sentence.no}
                        key={sentence.no}
                        />
                )}
            </div>
        );
    }
}
