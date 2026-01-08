import { PostComposer } from "@/components/common/PostComposer"
import { Posts } from "@/components/feed"
import { DisplayComment } from "@/components/feed/DisplayComment"
import type { Post } from "@/types"
import { useState, useEffect } from "react";
import api from "@/api/axiosInstance";
import { useParams } from "react-router";

export const PostDetail = () => {

  const [onClose, setOnclose] = useState<Post>()
  const [post, setPost] = useState<Post | null>(null)

  const { postId } = useParams();
  const [mainPost, setMainPost] = useState<Post | null>(null);

  const handleCreateComment = async (content: string, media: string[]) => {
    await api.post(`api/v1/posts/${post?.id}/comment`, { content, media })
  }
  // Fetch the main post here...
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Use the postId from useParams
        const response = await api.get(`/api/v1/posts/${postId}`);
        setMainPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  if (!mainPost) return null;

  return (
    <div className="min-h-screen bg-white w-full">
      {/* The Thread Header / Back button would go here */}

      {/* 1. The Main Post */}
      <Posts post={mainPost} isComment={false} />

      {/* 2. The Reply Input */}
      <div className="px-4 mt-2  py-2 border-b border-gray-100">
        <PostComposer
          placeholder="Post your reply"
          buttonText="Reply"
          onSubmit={handleCreateComment}
          onSuccess={() => setOnclose(undefined)}
        />
      </div>

      {/* all replies */}
      {postId && <DisplayComment postId={postId} />}
    </div>
  );
};