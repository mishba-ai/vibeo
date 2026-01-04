import { useEffect } from 'react';
export const useFeedSSE = () => {
    useEffect(() => {
        const eventSource = new EventSource(
            `http://localhost:3000/api/v1/posts/subscribe`, 
            { withCredentials: true }
        );

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.postId) {
                    // Create a global event that individual hooks listen for
                    const customEvent = new CustomEvent(`post-update-${data.postId}`, { detail: data });
                    window.dispatchEvent(customEvent);
                }
            } catch (e) {
                console.error("SSE Parse Error", e);
            }
        };

        return () => eventSource.close();
    }, []);
};