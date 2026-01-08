import type { Post } from "@/types"
import { CommentPopup } from "../common/CommentPopup"
import Posts from "../common/Posts"
import { usePostComments } from "@/hooks/usePostComments"

interface postprops {
  postId: string
}

export const DisplayComment = ({ postId }: postprops) => {
  const { comments, isLoading } = usePostComments(postId)

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {comments.map(comment => (
        <Posts key={comment.id} post={comment} isComment={true} />
      ))}
    </div>
  )
}
