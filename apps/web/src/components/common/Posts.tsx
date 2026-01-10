import Card from "./card";
import type { Post } from '@/types'

interface PostProps {
    post: Post
}

export default function Posts({ post }: PostProps) {
    return (
        <Card post={post} type="post" />
    )
}
