import * as React from "react";
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import { Paper, TextField, FlatButton, Dialog } from "material-ui";
import { amber500 } from "material-ui/styles/colors";
import * as ReactRouter from "react-router";

interface PostEditorProps { }

interface InjectedProps extends PostEditorProps {
    router: ReactRouter.InjectedRouter;
}

interface PostEditorRefs {
    seriesTitle: TextField;
    title: TextField;
    subtitle: TextField;
    excerpt: TextField;
    content: TextField;
    tags: TextField;
}

@ReactRouter.withRouter
@observer
export class PostEditor extends React.Component<PostEditorProps, {}> {
    @observable private confirmDialogOpen: boolean = false;

    get injected() {

        return this.props as InjectedProps;
    }

    private componentRefs: PostEditorRefs = {} as any;

    private getSeriesRef = (seriesTitleField: TextField) => {

        this.componentRefs.seriesTitle = seriesTitleField;
    }

    private getTitleRef = (titleField: TextField) => {

        this.componentRefs.title = titleField;
    }

    private getSubtitleRef = (subtitleField: TextField) => {

        this.componentRefs.subtitle = subtitleField;
    }

    private getExcerptRef = (excerptField: TextField) => {

        this.componentRefs.excerpt = excerptField;
    }

    private getContentRef = (contentField: TextField) => {

        this.componentRefs.content = contentField;
    }

    private getTagsRef = (tagsField: TextField) => {

        this.componentRefs.tags = tagsField;
    }

    private get formData() {

        return {
            title: this.componentRefs.title.getValue().trim(),
            content: this.componentRefs.content.getValue().trim(),
            excerpt: this.componentRefs.excerpt.getValue().trim(),
            seriesTitle: this.componentRefs.seriesTitle.getValue().trim(),
            subtitle: this.componentRefs.subtitle.getValue().trim(),
            tags: this.componentRefs.tags.getValue().trim()
        };
    }

    private handleSaveClicked = () => {

        console.log("save", this.formData);
    }

    private handlePreviewClicked = () => {

        console.log("preview", this.formData);
    }

    private handleCancelClicked = () => {

        this.handleShowConfirmDialog();
    }

    @action private handleShowConfirmDialog = () => {

        this.confirmDialogOpen = true;
    }

    @action private handleCancelCloseDialog = () => {

        this.confirmDialogOpen = false;
    }

    @action private handleDiscardDraft = () => {

        this.confirmDialogOpen = false;

        setTimeout(() => {
            this.injected.router.goBack();
        }, 500);
    }

    private get cancelActions() {

        return [
            <FlatButton
                label="Cancel"
                primary
                onTouchTap={this.handleCancelCloseDialog}
                />,
            <FlatButton
                label="Discard"
                secondary
                onTouchTap={this.handleDiscardDraft}
                />
        ];
    }

    render() {

        return (
            <div className="row">
                <div className="col-lg-offset-2 col-lg-8 col-md-offset-1 col-md-10 col-sm-12 col-xs-12">
                    <h1 style={styles.blogTitle}>New post</h1>
                    <Paper style={styles.formStyle}>
                        <TextField
                            floatingLabelText="Series title"
                            fullWidth
                            ref={this.getSeriesRef}
                            />
                        <TextField
                            floatingLabelText="Post title"
                            floatingLabelStyle={{ color: amber500 }}
                            fullWidth
                            ref={this.getTitleRef}
                            />
                        <TextField
                            floatingLabelText="Subtitle"
                            fullWidth
                            ref={this.getSubtitleRef}
                            />
                        <TextField
                            floatingLabelText="Excerpt"
                            rows={4}
                            multiLine
                            fullWidth
                            ref={this.getExcerptRef}
                            />
                        <TextField
                            floatingLabelText="Content"
                            floatingLabelStyle={{ color: amber500 }}
                            fullWidth
                            rows={20}
                            multiLine
                            ref={this.getContentRef}
                            />
                        <TextField
                            floatingLabelText="Tags"
                            fullWidth
                            ref={this.getTagsRef}
                            />
                        <div style={styles.buttonSeparator}>
                            <FlatButton
                                label="Save"
                                primary
                                onTouchTap={this.handleSaveClicked}
                                />
                            <FlatButton
                                label="Preview"
                                primary
                                onTouchTap={this.handlePreviewClicked}
                                />
                            <FlatButton
                                label="Cancel"
                                secondary
                                onTouchTap={this.handleCancelClicked}
                                />
                        </div>
                    </Paper>
                </div>
                <Dialog
                    actions={this.cancelActions}
                    modal={false}
                    open={this.confirmDialogOpen}
                    onRequestClose={this.handleCancelCloseDialog}
                    >
                    Discard draft?
        </Dialog>
            </div>
        );
    }
}

const styles = {
    blogTitle: {
        fontFamily: "sans-serif",
        padding: "0 16px",
        marginBottom: 50
    } as React.CSSProperties,
    formStyle: {
        padding: "24px 16px"
    },
    buttonSeparator: {
        marginTop: 32
    } as React.CSSProperties
};
