import * as React from "react";
import { observer, inject } from "mobx-react";
import { FlatButton } from "material-ui";

import * as Stores from "../../stores";
import { PostCard } from "./PostCard";

interface BlogsProps { }

export interface ReadRouterParams {
    blogSlug: string;
}

interface InjectedProps extends BlogsProps {
    blogsStore: Stores.BlogsStore;
    params: ReadRouterParams;
}

function fetchData(context: InjectedProps) {

    return context.blogsStore.getBlogPosts(context.params.blogSlug);
}

@inject("blogsStore")
@observer
export class Blogs extends React.Component<BlogsProps, {}> {
    static URL = (blogSlug: string) => `/blogs/${blogSlug}`;

    get injected() {

        return this.props as InjectedProps;
    }

    componentDidMount() {

        return fetchData(this.injected);
    }

    componentWillReceiveProps(newProps: InjectedProps) {

        return fetchData(newProps);
    }

    handleLoadMoreBlogPosts = () => {

        this.injected.blogsStore.getMoreBlogPosts(this.injected.params.blogSlug);
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
                    {posts.map((post, index) => <PostCard key={index} post={post} />)}
                    <FlatButton secondary label="Load more" onTouchTap={this.handleLoadMoreBlogPosts} style={styles.loadMore} />
                </div>
            </div>
        );
    }
}

const styles = {
    loadMore: {
        marginTop: 20
    },
    blogTitle: {
        fontFamily: "sans-serif"
    }
};
