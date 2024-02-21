import { useState } from "react"
import { useApiCall } from "../../Utils/apiCall"

export const useFetchUserWorkspaces = () => {
    const [workspaces, setWorkspaces] = useState([])
    const { apiCall, data, isLoading } = useApiCall()

    const fetchWorkspacesByUserId = async (_id) => {
        try {
            const response = await apiCall({
                path: `/api/v1/workspace-by-user-id?userId=${_id}`
            });
            setWorkspaces(response.workspaces)
        } catch (error) {
            console.log('Error name:', error.title); // This should show the custom error class name if available
            console.log('Error message:', error.message); // This should show the custom message
        }
    }

    return { workspaces, fetchWorkspacesByUserId, isLoading }
}
