import * as React from "react";
import { Drawer, SelectField, MenuItem, List, ListItem, Subheader } from "material-ui";
import { observer, inject } from "mobx-react";
import { Models } from "savitri-shared";

import * as Stores from "../../stores";

interface SideNavProps {
    open: boolean;
    onClose: (opening: boolean, reason: string) => void;
}

interface InjectedProps extends SideNavProps {
    editionsStore: Stores.EditionsStore;
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

@inject("editionsStore")
@observer
export class SideNav extends React.Component<SideNavProps, {}> {
    private injected: InjectedProps;

    constructor(props: SideNavProps) {

        super(props);
        this.injected = props as any;
    }

    componentWillUpdate(nextProps: SideNavProps) {

        if (nextProps.open && this.injected.editionsStore) {

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
                nestedItems={book.cantos.map(this.getCantosTOC)}
                secondaryTextLines={2}
                />
        );
    }

    private getCantosTOC = (canto: Models.CantoTOC) => {

        return (
            <CustomListItem
                key={canto.no}
                primaryText={canto.title}
                secondaryText={canto.heading}
                nestedItems={canto.sections.map(this.getSectionsTOC)}
                secondaryTextLines={2}
                />
        );
    }

    private getSectionsTOC = (section: Models.SectionTOC) => {

        return (
            <ListItem
                key={section.no}
                secondaryText={section.heading}
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
