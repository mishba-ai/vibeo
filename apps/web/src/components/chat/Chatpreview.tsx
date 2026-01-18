
export default function Chatpreview() {
    return (
        <div className="w-96 pt-4 bg-white min-h-screen scroll-auto ">
            <h1 className="font-medium text-2xl">Messages</h1>

            <div className="flex m-2 mt-8 gap-x-4 p-2 hover:bg-neutral-100 rounded-sm cursor-pointer" onClick={(e) => e.stopPropagation()}>

                <button className="rounded-full w-14 h-14  cursor-pointer">
                    <img src="https://i.pinimg.com/736x/ee/99/9b/ee999b598c2abbd85f10df542e9cb768.jpg" alt="pfp" className="rounded-full w-14 h-14  hover:opacity-50" />
                </button>
                <div className="flex-1 min-w-0 ">
                    <h1 className="font-medium text-lg">name</h1>
                    <div className="text-gray-400 text-sm truncate ">lorem ipsumfdsfs dfdsgnf gsjagkj g fsdfds</div>
                </div>
                {/* last message timestamp */}
            </div>
        </div>
    )
}
