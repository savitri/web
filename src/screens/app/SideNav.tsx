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
    get injected() {

        return this.props as InjectedProps;
    }

    componentWillUpdate(nextProps: SideNavProps) {

        this.injected.editionsStore.getEditionsList();
    }

    handleEditionSelected = (event: any, index: number, value: number) => {

        this.injected.editionsStore.getSelectedEdition(value);
    }

    private getEditionList() {

        const { editionsList } = this.injected.editionsStore;

        return editionsList.map((edition, index) => <MenuItem
            key={index}
            value={edition.year}
            primaryText={edition.title}
            />);
    }

    private getTOC = () => {

        const {selectedEdition, getEditionObj} = this.injected.editionsStore;

        const selectedEditionObj = getEditionObj(selectedEdition);

        if (!selectedEditionObj) {
            return;
        }

        const edition = selectedEditionObj.year !== 1950 ? selectedEditionObj.year : undefined;
        return selectedEditionObj.toc.parts.map(part => {

            return (
                <ListItem
                    key={part.no}
                    primaryText={part.heading}
                    primaryTogglesNestedList
                    nestedItems={this.getBooksTOC(part, edition)}
                    />
            );
        });
    }

    private getBooksTOC = (part: Models.PartTOC, edition?: number) => {

        return part.books.map(book =>
            <CustomListItem
                key={book.no}
                primaryTogglesNestedList
                primaryText={book.title}
                secondaryText={book.heading}
                nestedItems={this.getCantosTOC(book, edition)}
                secondaryTextLines={2}
                />
        );
    }

    private getCantosTOC = (book: Models.BookTOC, edition?: number) => {

        return book.cantos.map((canto) =>
            <CustomListItem
                key={canto.no}
                primaryText={canto.title}
                secondaryText={canto.heading}
                nestedItems={this.getSectionsTOC(book, canto, edition)}
                secondaryTextLines={2}
                // tslint:disable-next-line
                onTouchTap={() => {

                    this.injected.appState.setSidenavOpen(false);
                    this.injected.sectionsStore.setShownSectionNumber(book.no, canto.no, 1, edition);
                    this.injected.router.push(Read.URL(book.no, canto.no, 1, edition));
                } }
                />);
    }

    private getSectionsTOC = (book: Models.BookTOC, canto: Models.CantoTOC, edition?: number) => {

        return canto.sections.map((section) =>
            <ListItem
                key={section.no}
                secondaryText={section.heading}
                // tslint:disable-next-line
                onTouchTap={() => {

                    this.injected.appState.setSidenavOpen(false);
                    this.injected.sectionsStore.setShownSectionNumber(book.no, canto.no, section.no, edition);
                    this.injected.router.push(Read.URL(book.no, canto.no, section.no, edition));
                } }
                />
        );
    }

    render() {

        const { selectedEdition } = this.injected.editionsStore;

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
                    value={selectedEdition}
                    fullWidth
                    menuStyle={styles.editionMenuStyle}
                    floatingLabelStyle={styles.editionLabelStyle}
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
    },
    editionMenuStyle: {
        padding: "0 16px"
    },
    editionLabelStyle: {
        padding: "0 22px"
    }
};
