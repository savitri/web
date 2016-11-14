import * as React from "react";
import * as History from "history";
import { Paper } from "material-ui";
import { observer, inject } from "mobx-react";

import * as Stores from "../../stores";
import { SavitriHeader } from "./SavitriHeader";
import { SavitriBody } from "./SavitriBody";

interface ReadProps { }

export interface ReadRouterParams {
    book: number;
    canto: number;
    section: number;
}

interface ReadRouterQuery {
    edition: number;
}

interface InjectedProps extends ReadProps {
    params: ReadRouterParams;
    location: History.Location;
    sectionsStore: Stores.SectionsStore;
    editionsStore: Stores.EditionsStore;
}

function fetchData(context: InjectedProps, props?: ReadProps) {

    const edition = (context.location.query as any).edition;

    const { book, canto, section } = context.params;

    return Promise.all([
        context.sectionsStore.getSection(book, canto, section, edition),
        context.editionsStore.getShownEdition(edition)
    ]);
}

@inject("sectionsStore", "editionsStore")
@observer
export class Read extends React.Component<ReadProps, {}> {
    get injected() {

        return this.props as InjectedProps;
    }

    static URL = (book: number, canto: number, section: number, edition?: number) =>
        `/read/${book}/${canto}/${section}` + (edition ? `?edition=${edition}` : "");

    componentDidMount() {

        return fetchData(this.injected);
    }

    componentWillReceiveProps(nextProps: InjectedProps) {

        return fetchData(nextProps);
    }

    render() {

        const shownSection = this.injected.sectionsStore.shownSection;

        if (!shownSection) {

            return null;
        }

        return (
            <div className="row">
                <Paper zDepth={1} style={styles.self} className="col-xs-offset-2 col-xs-8">
                    <SavitriHeader />
                    <SavitriBody />
                </Paper>
            </div>
        );
    }
}

const styles = {
    self: {
        padding: 20
    }
};
