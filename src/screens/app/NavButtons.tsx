import * as React from "react";
import { FlatButton, Popover, Menu, MenuItem } from "material-ui";
import { PopoverAnimationVertical } from "material-ui/Popover";
import * as ReactRouter from "react-router";
import { observer, inject } from "mobx-react";
import { observable, action } from "mobx";

import * as Stores from "../../stores";
import { Blogs } from "../blogs";
import { Read } from "../read";

interface NavButtonsProps { }

interface InjectedProps extends NavButtonsProps {
    blogsStore: Stores.BlogsStore;
    router: ReactRouter.InjectedRouter;
    params: any;
    location: any;
    routes: any;
}

function fetchData(context: InjectedProps) {

    return context.blogsStore.getBlogs();
}

@inject("blogsStore")
@ReactRouter.withRouter
@observer
export class NavButtons extends React.Component<NavButtonsProps, {}> {
    static muiName = "FlatButton";

    get allowedProps() {

        const allowedProps = Object.assign({}, this.props as InjectedProps);
        delete allowedProps.blogsStore;
        delete allowedProps.router;
        delete allowedProps.params;
        delete allowedProps.location;
        delete allowedProps.routes;
        return allowedProps as __MaterialUI.FlatButtonProps;
    }

    get injected() {

        return this.props as InjectedProps;
    }

    @observable journalsPopoverOpen: boolean;
    popoverAnchorEl: any;

    @action handleJournalPopoverTap(event: __MaterialUI.TouchTapEvent) {

        this.popoverAnchorEl = event.currentTarget;
        this.journalsPopoverOpen = true;
    }

    @action handleJournalPopoverRequestClose() {

        this.journalsPopoverOpen = false;
    }

    componentDidMount() {

        fetchData(this.injected);
    }

    handleMenuItemClicked(slug: string) {

        this.handleJournalPopoverRequestClose();
        this.injected.router.push(Blogs.URL(slug));
    }

    private getBlogsList() {

        return this.injected.blogsStore.blogsList.map(blog =>
            <MenuItem
                key={blog.id}
                primaryText={blog.title}
                // tslint:disable-next-line
                onTouchTap={() => this.handleMenuItemClicked(blog.slug)}
                />
        );
    }

    private handleTextClicked = () => {

        this.injected.router.push(Read.URL(1, 1, 1));
    }

    render() {

        return (
            <div>
                <FlatButton
                    label="Text"
                    onTouchTap={this.handleTextClicked}
                    {...this.allowedProps}
                    />
                <FlatButton
                    label="Journals"
                    onTouchTap={this.handleJournalPopoverTap.bind(this)}
                    {...this.allowedProps}
                    />
                <Popover
                    open={this.journalsPopoverOpen}
                    anchorEl={this.popoverAnchorEl}
                    anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                    targetOrigin={{ horizontal: "left", vertical: "top" }}
                    onRequestClose={this.handleJournalPopoverRequestClose.bind(this)}
                    animation={PopoverAnimationVertical}
                    >
                    <Menu>{this.getBlogsList()}</Menu>
                </Popover>
            </div>
        );
    }
}
