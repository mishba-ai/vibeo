import { X, Music, Mountain, ChefHat } from "lucide-react"

export default function Recommendations() {
    const recommendations = [
        {
            id: 1,
            title: "UI/UX",
            icon: X,
            bgColor: "bg-blue-200",
            textColor: "text-gray-800",
            shape: "circle"
        },
        {
            id: 2,
            title: "Music",
            icon: Music,
            bgColor: "bg-pink-300",
            textColor: "text-gray-800",
            shape: "circle"
        },
        {
            id: 3,
            title: "Cooking",
            icon:ChefHat,
            backgroundImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
            textColor: "text-white",
            shape: "circle"
        },
        {
            id: 4,
            title: "Hiking",
            icon: Mountain,
            bgColor: "bg-purple-300",
            textColor: "text-gray-800",
            shape: "rounded"
        }
    ]

    return (
        <div className="bg-white rounded-2xl p- max-w-sm transition-transform scale-90">
            <h2 className="text-xl font-bold text-gray-900 mb-">Recommendations</h2>
            
            <div className="grid grid-cols-2 gap-4 transition-transform scale-75">
                {recommendations.map((item) => (
                    <div
                        key={item.id} 
                        className={`
                            relative overflow-hidden cursor-pointer transition-transform   hover:scale-105
                            ${item.shape === 'circle' ? 'rounded-full aspect-square' : 'rounded-2xl aspect-square'}
                            ${item.backgroundImage ? '' : item.bgColor}
                        `}
                        style={item.backgroundImage ? {
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${item.backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        } : {}}
                    >
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            {item.icon && (
                                <item.icon 
                                    className={`w-8 h-8 mb-2 ${item.textColor}`}
                                />
                            )}
                            <span className={`text-sm font-semibold text-center ${item.textColor}`}>
                                {item.title}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Show More Link */}
            <div className="mt- pt-">
                <button className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors">
                    Show more
                </button>
            </div>
        </div>
    )
}