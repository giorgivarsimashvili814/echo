export type CreateCommentDto = {
  body: string;
  authorId: string;
  postId: string;
};

export type EditCommentDto = {
  body: string,
  authorId: string,
  commentId: string,
};