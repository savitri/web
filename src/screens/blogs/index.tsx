import * as React from "react";
import { observer, inject } from "mobx-react";
import { FlatButton, FloatingActionButton } from "material-ui";
import { ContentAdd } from "material-ui/svg-icons";
import * as ReactRouter from "react-router";
import { Models } from "savitri-shared";

import * as Stores from "../../stores";
import { PostCard } from "./PostCard";

interface BlogsProps { }

export interface ReadRouterParams {
    blogSlug: string;
}

interface InjectedProps extends BlogsProps {
    blogsStore: Stores.BlogsStore;
    params: ReadRouterParams;
    router: ReactRouter.InjectedRouter;
}

function fetchData(context: InjectedProps) {

    return context.blogsStore.getBlogPosts(context.params.blogSlug);
}

@inject("blogsStore")
@ReactRouter.withRouter
@observer
export class BlogPosts extends React.Component<BlogsProps, {}> {
    static URL = (blogSlug: string) => `/blogs/${blogSlug}/posts`;

    get injected() {

        return this.props as InjectedProps;
    }

    componentDidMount() {

        return fetchData(this.injected);
    }

    componentWillReceiveProps(newProps: InjectedProps) {

        return fetchData(newProps);
    }

    handleSeeMoreBlogPosts = () => {

        this.injected.blogsStore.getMoreBlogPosts(this.injected.params.blogSlug);
    }

    handleFABClicked = () => {

        const slug = this.injected.params.blogSlug;

        this.injected.router.push(Models.Post.getPostURL(slug, "new"));
    }

    render() {

        const slug = this.injected.params.blogSlug;

        const blog = this.injected.blogsStore.blogsList.find(blogs => blogs.slug === slug);

        const posts = this.injected.blogsStore.blogPosts.get(slug);

        if (!posts) {

            return null;
        }

        return (
            <div className="row">
                <div className="col-lg-offset-2 col-lg-8 col-md-offset-1 col-md-10 col-sm-12 col-xs-12">
                    <h1 style={styles.blogTitle}>{blog.title}</h1>
                    {posts.map(post => <PostCard key={post.id} post={post} />)}
                    <FlatButton label="See more" onTouchTap={this.handleSeeMoreBlogPosts} style={styles.seeMore} />
                    <FloatingActionButton
                        onTouchTap={this.handleFABClicked}
                        style={styles.fab}
                        >
                        <ContentAdd />
                    </FloatingActionButton>
                </div>
            </div>
        );
    }
}

const styles = {
    seeMore: {
        marginTop: 20
    },
    blogTitle: {
        fontFamily: "sans-serif",
        padding: "0 16px",
        marginBottom: 50
    } as React.CSSProperties,
    fab: {
        position: "fixed",
        right: 25,
        bottom: 25
    }
};
