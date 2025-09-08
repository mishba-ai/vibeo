import Contentsidebar from "@/components/feed/Contentsidebar"
import Fheaders from "@/components/feed/Fheaders"
import Fsidebar from "@/components/feed/Fsidebar"
import Timeline from "@/components/feed/timeline"
export default function Feed() {
    return (
        <>
            <div className="flex w-full space-x-4">
                <div className="max-w-">
                    <Fsidebar />
                </div>
                <div className="flex w-full justify-between px-2 pt-4">
                <div className="w-[60%] max-w-[70%] bg-red-">
                    <Fheaders />
                    <Timeline/>
                    {/*  */}
                </div>
                <div className="w-[30%] bg-amber-">
                    <Contentsidebar />
                </div></div>
            </div>
        </>
    )
}