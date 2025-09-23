import { Button } from "@repo/ui/components/ui/button"

export default function Suggestion() {
    const suggestionList = [
        {
            profile: 'https://i.pinimg.com/1200x/4d/83/91/4d83917829f280e342acfda9b1738b30.jpg',
            username: 'Miki',
            handle: '@mikisabine'
        },
        {
            profile: 'https://i.pinimg.com/1200x/63/ac/83/63ac83c98641dbed5355f6410cb8c720.jpg',
            username: 'Brittni',
            handle: '@brittni_official'
        },
        {
            profile: 'https://i.pinimg.com/1200x/2d/ce/4d/2dce4d791ad83e2d20b50488b54eab59.jpg',
            username: 'Ivan',
            handle: '@ivanwillbe'
        }
    ]

    return (
        <div className="bg-gray0 rounded-2xl transition-transform scale-90 max-w-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Suggestions</h2>
            
            <div className="space-y-4 bg-red-200  px-4">
                {suggestionList.map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                            <img 
                                src={user.profile} 
                                alt={`${user.username} profile`}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex flex-col">
                                <h3 className="font-semibold text-gray-900 text-sm">
                                    {user.username}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {user.handle}
                                </p>
                            </div>
                        </div>
                        
                        {/* Follow Button */}
                        <Button 
                            className="bg-black hover:bg-gray-800 text-white text-sm font-medium px-6 py-2 rounded-full transition-colors"
                            size="sm"
                        >
                            Follow
                        </Button>
                    </div>
                ))}
            </div>
            
            {/* Show More Link */}
            <div className="mt-2 px-2">
                <button className="text-gray-500 text-sm font-medium hover:text-gray-600 transition-colors">
                    Show more
                </button>
            </div>
        </div>
    )
}