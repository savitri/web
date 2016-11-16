import * as React from "react";
import { Card, CardActions, CardHeader, CardTitle, CardText, FlatButton } from "material-ui";
import { Models } from "savitri-shared";
import { observer } from "mobx-react";
import { observable, action } from "mobx";
const md = require("markdown-it")({
    html: true,
    linkify: true,
    breaks: true
});

interface PostCardProps {
    post: Models.IPost;
}

interface InjectedProps extends PostCardProps { }

@observer
export class PostCard extends React.Component<PostCardProps, {}> {
    @observable htmlText: string;

    @action setHtmlText(mdText: string) {

        this.htmlText = md.render(mdText);
    }

    handleExpandChange() {

        if (!this.htmlText) {

            this.setHtmlText(this.props.post.txt);
        }
    }

    private getFormattedDate(dateString: string) {

        const date = new Date(dateString);

        return date.getDate() + 1 + "." + (date.getMonth() + 1) + "." + date.getFullYear();
    }

    get headerSubtitle() {

        const { post } = this.props;

        let subtitle = "";

        if (post.number) {

            subtitle += `#${post.number}`;
        }

        if (post.published_at) {

            subtitle += ` • ${this.getFormattedDate(post.published_at)}`;
        }

        return subtitle;
    }

    render() {

        const { post } = this.props;

        return (
            <Card style={styles.self} onExpandChange={this.handleExpandChange.bind(this)}>
                {post.series_id || this.headerSubtitle ? <CardHeader
                    title={post.series_id}
                    subtitle={this.headerSubtitle}
                    actAsExpander={true}
                    /> : null}
                <CardTitle
                    title={post.title}
                    subtitle={post.subtitle}
                    actAsExpander={true}
                    showExpandableButton={true}
                    />
                <CardText expandable={true}>
                    <div dangerouslySetInnerHTML={{ __html: this.htmlText }} />
                </CardText>
                <CardActions
                    expandable
                    >
                    <FlatButton label="Comment" />
                </CardActions>
            </Card>
        );
    }
}

const styles = {
    self: {
        marginTop: 10
    } as React.CSSProperties
};
