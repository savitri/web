import * as React from "react";
import { Drawer, SelectField, MenuItem, List, ListItem } from "material-ui";
import { observer, inject } from "mobx-react";
import { Models } from "savitri-shared";
import { withRouter, InjectedRouter } from "react-router";

import * as Stores from "../../stores";
import { Read } from "../read";

interface SideNavProps {
    open: boolean;
    onClose: (opening: boolean, reason: string) => void;
}

interface InjectedProps extends SideNavProps {
    router: InjectedRouter;
    appState: Stores.AppState;
    editionsStore: Stores.EditionsStore;
    sectionsStore: Stores.SectionsStore;
}

class CustomListItem extends ListItem {
    static muiName = "ListItem";

    render() {
        return (
            <ListItem
                {...this.props}
                primaryText={<div style={styles.primaryText}>{this.props.secondaryText}</div>}
                secondaryText={<div style={styles.secondaryText}>{this.props.primaryText}</div>}
                />
        );
    }
}

@inject("editionsStore", "appState", "sectionsStore")
@withRouter
@observer
export class SideNav extends React.Component<SideNavProps, {}> {
    private injected: InjectedProps;

    constructor(props: SideNavProps) {

        super(props);
        this.injected = props as any;
    }

    componentWillUpdate(nextProps: SideNavProps) {

        if (nextProps.open) {

            this.injected.editionsStore.getEditionsList();
        }
    }

    handleEditionSelected = (event: any, index: number, value: number) => {

        this.injected.editionsStore.setShownEdition(value);
    }

    private getEditionList() {

        return this.injected.editionsStore.editionsList.map(edition =>
            <MenuItem
                key={edition.year}
                value={edition.year}
                primaryText={edition.title}
                />);
    }

    private getTOC = () => {

        if (!this.injected.editionsStore.shownEdition) {
            return;
        }

        return this.injected.editionsStore.shownEdition.toc.parts.map(part => {

            return (
                <ListItem
                    key={part.no}
                    primaryText={part.heading}
                    primaryTogglesNestedList
                    nestedItems={part.books.map(this.getBooksTOC)}
                    />
            );
        });
    }

    private getBooksTOC = (book: Models.BookTOC) => {

        return (
            <CustomListItem
                key={book.no}
                primaryTogglesNestedList
                primaryText={book.title}
                secondaryText={book.heading}
                nestedItems={this.getCantosTOC(book)}
                secondaryTextLines={2}
                />
        );
    }

    private getCantosTOC = (book: Models.BookTOC) => {

        return book.cantos.map((canto) =>
            <CustomListItem
                key={canto.no}
                primaryText={canto.title}
                secondaryText={canto.heading}
                nestedItems={this.getSectionsTOC(book, canto)}
                secondaryTextLines={2}
                // tslint:disable-next-line
                onTouchTap={() => {

                    this.injected.appState.setSidenavOpen(false);
                    this.injected.sectionsStore.setShownCanto(canto);
                    this.injected.router.push(Read.URL(book.no, canto.no, 1));
                } }
                />);
    }

    private getSectionsTOC = (book: Models.BookTOC, canto: Models.CantoTOC) => {

        return canto.sections.map((section) =>
            <ListItem
                key={section.no}
                secondaryText={section.heading}
                // tslint:disable-next-line
                onTouchTap={() => {

                    this.injected.appState.setSidenavOpen(false);
                    this.injected.sectionsStore.setShownCanto(canto);
                    this.injected.router.push(Read.URL(book.no, canto.no, section.no));
                } }
                />
        );
    }

    render() {

        return (
            <Drawer
                open={this.props.open}
                onRequestChange={this.props.onClose}
                docked={false}
                width={320}
                >
                <SelectField
                    floatingLabelText="Select an edition"
                    onChange={this.handleEditionSelected}
                    value={this.injected.editionsStore.selectedEdition}
                    fullWidth
                    menuStyle={{ padding: "0 16px" }}
                    floatingLabelStyle={{ padding: "0 22px" }}
                    >
                    {this.getEditionList()}
                </SelectField>
                <List>
                    {this.getTOC()}
                </List>
            </Drawer>
        );
    }
}

const styles = {
    primaryText: {
        fontSize: "85%",
        color: "grey"
    },
    secondaryText: {
        fontSize: "100%",
        color: "rgba(0, 0, 0, 0.870588)"
    }
};
