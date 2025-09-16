import { AuthContext } from "@/contexts/AuthContext"
import { useContext } from "react"

export const useAuth = () => {
    const context =  useContext(AuthContext)
    if(context ===null){
        throw new Error('useauth must be used within as authprovider')
    }

    return  context
}