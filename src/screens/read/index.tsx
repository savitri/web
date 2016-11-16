import * as React from "react";
import * as History from "history";
import { Paper } from "material-ui";
import { observer, inject } from "mobx-react";

import * as Stores from "../../stores";
import { SavitriHeader } from "./SavitriHeader";
import { SavitriBody } from "./SavitriBody";

interface ReadProps { }

interface ReadRouterParams {
    book: string;
    canto: string;
    section: string;
}

interface InjectedProps extends ReadProps {
    params: ReadRouterParams;
    location: History.Location;
    sectionsStore: Stores.SectionsStore;
    editionsStore: Stores.EditionsStore;
}

function fetchData(context: InjectedProps, props?: ReadProps) {

    const editionStr: string = (context.location.query as any).edition;

    const edition = editionStr && editionStr.trim().length > 0 ? parseInt(editionStr) : undefined;

    const { book, canto, section } = context.params;

    return Promise.all([
        context.sectionsStore.getSection(parseInt(book), parseInt(canto), parseInt(section), edition),
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
                <Paper zDepth={1} style={styles.self} className="col-lg-offset-2 col-lg-8 col-md-offset-1 col-md-10 col-sm-12 col-xs-12">
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
