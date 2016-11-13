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
    private injected: InjectedProps;

    constructor(props: SavitriBodyProps) {

        super(props);
        this.injected = props as InjectedProps;
    }

    render() {

        const {sentences, running_no} = this.injected.sectionsStore.shownSection.section;

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
