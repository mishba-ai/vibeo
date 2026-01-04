import Main from '@/components/common/Main'
import { useFeedSSE } from '@/hooks/useFeedSSE'

export default function Feed() {
    useFeedSSE()
    return (
        <>
        
            <Main />

            {/*  */}
        </>
    )
}