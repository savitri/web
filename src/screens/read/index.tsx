import * as React from "react";
import { observer, inject } from "mobx-react";

import * as Stores from "../../stores";
import { SavitriHeader } from "./SavitriHeader";
import { SavitriBody } from "./SavitriBody";

interface ReadProps {
}

export interface ReadRouterParams {
    book: number;
    canto: number;
    section: number;
}

interface InjectedProps {
    params: ReadRouterParams;
    sectionsStore: Stores.SectionsStore;
}

function fetchData(context: InjectedProps, props?: ReadProps) {

    return context.sectionsStore.getSection(context.params);
}

@inject("sectionsStore")
@observer
export class Read extends React.Component<ReadProps, {}> {
    private injected: InjectedProps;
    static URL = (book: number, canto: number, section: number) =>
        `/read/${book}/${canto}/${section}`;

    constructor(props: ReadProps) {
        super(props);
        this.injected = props as InjectedProps;
    }

    componentDidMount() {

        return fetchData(this.injected);
    }

    componentWillReceiveProps(nextProps: InjectedProps) {

        return fetchData(nextProps);
    }

    render() {

        const shownSection = this.injected.sectionsStore.shownSection;

        return (
            <div className="row">
                <div className="col-xs-offset-2 col-xs-8">
                    {shownSection && <SavitriHeader />}
                    {shownSection && <SavitriBody />}
                </div>
            </div>
        );
    }
}
