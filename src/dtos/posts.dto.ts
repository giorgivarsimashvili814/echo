export type CreatePostDto = {
  title: string;
  body?: string;
  authorId: string;
};

export type EditPostDto = {
  body: string;
  authorId: string;
  postId: string;
};
