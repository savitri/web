import { Models } from "savitri-shared";

import { postData } from "../shared/utils";

let instance: PostsStore;

export class PostsStore {
    static getInstance = () => {

        if (!instance) {
            instance = new PostsStore();
        }

        return instance;
    }

    private constructor() { }

    tryCreatingPost = (blogSlug: string, postData: Models.IPost) => {

        return this.createPost(blogSlug, postData);
    }

    private createPost = (blogSlug: string, payload: Models.IPost) => {

        return postData<Models.IPost>(Models.Blog.getPostsURL(blogSlug), payload);
    }
}
