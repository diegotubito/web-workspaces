import { useState } from "react"
import axios from "axios"

export const useWorkspace = () => {
    const [workspaces, setWorkspaces] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const fetchWorkspacesByUserId = async () => {
        setIsLoading(true)
        setTimeout(async () => {
            try {
                const response = await axios.get('http://127.0.0.1:666/api/v1/workspace-by-user-id?userId=655a834f3905e3f7d37d39c1');
                setIsLoading(false)
                setWorkspaces(response.data.workspaces)
            } catch (error) {
                setIsLoading(false)
                console.log(error)            
            }
                
        }, 2000);

    }

    return { workspaces, fetchWorkspacesByUserId, isLoading }
}