import { useState } from "react"
import axios from "axios"

export const useFetchUserWorkspaces = () => {
    const [workspaces, setWorkspaces] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    
    const fetchWorkspacesByUserId = async (_id) => {
        setIsLoading(true)
        try {
            const response = await axios.get(`http://127.0.0.1:666/api/v1/workspace-by-user-id?userId=${_id}`);
            setWorkspaces(response.data.workspaces)
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    return { workspaces, fetchWorkspacesByUserId, isLoading }
}
