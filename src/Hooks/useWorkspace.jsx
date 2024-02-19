import { useState } from "react"
import axios from "axios"

export const useWorkspace = () => {
    const [workspaces, setWorkspaces] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const fetchWorkspacesByUserId = async (_id) => {
        setIsLoading(true)
        setTimeout(async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:666/api/v1/workspace-by-user-id?userId=${_id}`);
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