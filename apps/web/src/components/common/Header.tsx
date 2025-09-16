import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@repo/ui/components/ui/navigation-menu"
import { Button } from "@repo/ui/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

export default function Header() {
    const { handleGoogleLogin } = useAuth();

    return (
        <>
            <div className="flex justify-between px-10 py-2">
                <div>
                    <h1 className="text-2xl font-extrabold font-mono">VIBEO</h1>
                </div>
                <div className="flex space-x-4">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Tribes</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <NavigationMenuLink>Discord</NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <Button onClick={handleGoogleLogin}>Join for Free</Button>

                </div>
            </div>
        </>
    )
}