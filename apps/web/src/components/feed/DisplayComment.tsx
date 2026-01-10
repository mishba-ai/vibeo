import { usePostComments } from "@/hooks/usePostComments"
import Card from "../common/card"
import type { Post } from "@/types"

interface commentprops {
  postId: string
}

export const DisplayComment = ({ postId }: commentprops) => {
  const { comments, isLoading } = usePostComments(postId)
 
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {comments.map(com => (
        <Card key={com.id} post={com} type="comment" />
      ))}
    </div>
  )
}
