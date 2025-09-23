import { useState } from "react"


export default function Fheaders() {
    const [activeTab, setActiveTab] = useState('foryou')
    const tabs = [
        { id: 'foryou', label: 'for you ' },
        { id: 'following', label: 'Following' }
    ]
    return (
        <>
            <div className="  ">
                <div className="flex justify-between items-center w-full">
                    <h1 className="text-xl font-bold ">Feeds</h1>
                    <ul className=" flex space-x-4 text-gray-400">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 relative ${activeTab === tab.id
                                    ? "text-black"
                                    : "text-gray-500 hover:text-gray-300"
                                    }`}
                            >{tab.label}
                                {/* Active Tab Indicator */}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                                )}
                            </button>
                        ))}
                    </ul>
                </div>
                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === "foryou" && (
                        <div>
                            {/* For You content */}
                            <div className="text-gray-400 text-center py-8">
                                For You feed content goes here
                            </div>
                        </div>
                    )}
                    {activeTab === "following" && (
                        <div>
                            {/* Following content */}
                            <div className="text-gray-400 text-center py-8">
                                Following feed content goes here
                            </div>
                        </div>
                    )}
                </div>

            </div>

        </>
    )
}