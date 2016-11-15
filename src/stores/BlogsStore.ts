import { observable, action, ObservableMap, map } from "mobx";
import { Models } from "savitri-shared";

import { fetchData } from "../shared/utils";

let instance: BlogsStore;

export class BlogsStore {
    @observable blogsList: Models.IBlog[];
    blogPostPage: { [key: string]: number };
    @observable blogPosts: ObservableMap<Models.IPost[]>;

    static getInstance() {

        if (!instance) {

            instance = new BlogsStore();
        }

        return instance;
    }

    private constructor() {

        this.blogsList = [];
        this.blogPosts = map({}) as any;
        this.blogPostPage = {};
    }

    @action setBlogsList = (blogs: Models.IBlog[]) => {

        this.blogsList = blogs;
    }

    getBlogs = () => {

        if (this.blogsList.length > 0) {

            return;
        }

        return this.fetchBlogs(Models.Blog.getBlogsURL());
    }

    getBlogPosts = (blogSlug: string) => {

        if (this.blogPosts.get(blogSlug)) {

            return;
        }

        return this.fetchBlogPosts(blogSlug);
    }

    getMoreBlogPosts = (blogSlug: string) => {

        return this.fetchBlogPosts(blogSlug, this.blogPostPage[blogSlug] + 1);
    }

    private updateBlogPostPage = (blogSlug: string, page?: number) => {

        this.blogPostPage[blogSlug] = page || 1;
    }

    @action private addBlogPosts = (blogSlug: string, posts: Models.IPost[]) => {

        if (this.blogPosts.get(blogSlug)) {

            this.blogPosts.set(blogSlug, this.blogPosts.get(blogSlug).concat(posts));
        }
        else {

            this.blogPosts.set(blogSlug, posts);
        }
    }

    private fetchBlogs = (blogsUrl: string) => {

        return fetchData<Models.IBlog[]>(blogsUrl)
            .then(this.setBlogsList);
    }

    private fetchBlogPosts = (blogSlug: string, page?: number) => {

        return fetchData<Models.IPost[]>(Models.Blog.getPostsURL(blogSlug, page))
            .then((posts) => this.addBlogPosts(blogSlug, posts))
            .then(() => this.updateBlogPostPage(blogSlug, page));
    }
}
