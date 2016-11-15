import * as React from "react";
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import { Paper, TextField, FlatButton, Dialog, RadioButton, RadioButtonGroup, DatePicker, TimePicker } from "material-ui";
import { amber500 } from "material-ui/styles/colors";
import * as ReactRouter from "react-router";
const md = require("markdown-it")({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
});

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

// type PublishOptions = "save" | "now" | "schedule";

enum Publish {
    Save,
    Post,
    Schedule
}

@ReactRouter.withRouter
@observer
export class PostEditor extends React.Component<PostEditorProps, {}> {
    @observable private confirmDialogOpen = false;
    @observable private previewMode = false;
    @observable private mdContent: string = "";
    @observable private scheduled: Publish = Publish.Save;
    private htmlContent = "";

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

    @action togglePreview = () => {

        if (this.previewMode) {

            this.scheduled = Publish.Save;
        }

        this.previewMode = !this.previewMode;
    }

    @action handleMarkdownContentUpdated = (event: React.FormEvent<{}>) => {

        this.mdContent = (event.target as any).value;
    }

    @action handleSchedule = (event: any, value: "save" | "now" | "schedule") => {

        if (value === "save") {
            this.scheduled = Publish.Save;
        }
        else if (value === "now") {
            this.scheduled = Publish.Post;
        }
        else {
            this.scheduled = Publish.Schedule;
        }
    }

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
            content: this.mdContent,
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

        if (!this.previewMode) {

            this.htmlContent = md.render(this.mdContent);
        }

        this.togglePreview();
    }

    private handleCancelClicked = () => {

        this.handleShowConfirmDialog();
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

    private renderHtml = (): any => {

        if (this.previewMode) {

            return (
                <div
                    style={Object.assign({}, styles.textField, { marginTop: 36 })}
                    dangerouslySetInnerHTML={{ __html: this.htmlContent }}
                    />
            );
        }
    }

    private get previewModeButtons() {

        return <FlatButton
            label={Publish[this.scheduled]}
            primary
            onTouchTap={this.handleSaveClicked}
            />;
    }

    private getScheduleOptions = () => {

        return (
            <div style={{ marginTop: 40 }}>
                <div style={{ marginBottom: 20 }}>Publish options</div>
                <RadioButtonGroup name="publish" defaultSelected="save" onChange={this.handleSchedule}>
                    <RadioButton
                        value="save"
                        label="Save as draft"
                        style={styles.radioButton}
                        />
                    <RadioButton
                        value="now"
                        label="Publish now"
                        style={styles.radioButton}
                        />
                    <RadioButton
                        value="schedule"
                        label="Schedule for later"
                        style={styles.radioButton}
                        />
                </RadioButtonGroup>
                {this.scheduled === Publish.Schedule && this.getDateAndTimeOptions()}
            </div>
        );
    }

    private getDateAndTimeOptions = () => {

        return (
            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <DatePicker floatingLabelText="Pick a date" />
                <TimePicker
                    floatingLabelText="Choose the time"
                    format="24hr"
                    />
            </div>
        );
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
                            disabled={this.previewMode}
                            ref={this.getSeriesRef}
                            inputStyle={styles.textField}
                            />
                        <TextField
                            floatingLabelText="Post title"
                            floatingLabelStyle={{ color: amber500 }}
                            fullWidth
                            disabled={this.previewMode}
                            ref={this.getTitleRef}
                            inputStyle={styles.textField}
                            />
                        <TextField
                            floatingLabelText="Subtitle"
                            fullWidth
                            disabled={this.previewMode}
                            ref={this.getSubtitleRef}
                            inputStyle={styles.textField}
                            />
                        <TextField
                            floatingLabelText="Excerpt"
                            rows={4}
                            multiLine
                            fullWidth
                            disabled={this.previewMode}
                            ref={this.getExcerptRef}
                            textareaStyle={styles.textField}
                            inputStyle={styles.textField}
                            />
                        <TextField
                            floatingLabelText="Content"
                            floatingLabelStyle={{ color: amber500 }}
                            fullWidth
                            rows={20}
                            multiLine
                            disabled={this.previewMode}
                            ref={this.getContentRef}
                            onChange={this.handleMarkdownContentUpdated}
                            value={!this.previewMode ? this.mdContent : ""}
                            children={this.renderHtml()}
                            />
                        <TextField
                            floatingLabelText="Tags"
                            fullWidth
                            ref={this.getTagsRef}
                            disabled={this.previewMode}
                            inputStyle={styles.textField}
                            />
                        {this.previewMode && this.getScheduleOptions()}
                        <div style={styles.buttonSeparator}>
                            <FlatButton
                                label={!this.previewMode ? "Preview" : "Edit"}
                                primary
                                onTouchTap={this.handlePreviewClicked}
                                />
                            {this.previewMode && this.previewModeButtons}
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
    } as React.CSSProperties,
    textField: {
        color: "inherit"
    },
    radioButton: {
        marginBottom: 16,
    }
};
