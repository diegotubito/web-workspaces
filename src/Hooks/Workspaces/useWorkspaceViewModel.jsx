import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext'
import { useFetchUserWorkspaces } from './useFetchUserWorkspaces'
import { useUserSession } from '../../Utils/Contexts/userSessionContext'
import { useState } from 'react';

export const useWorkspaceViewModel = () => {
    const { fetchWorkspacesByUserId, isLoading, error } = useFetchUserWorkspaces()
    const { updateWorkspaceSession } = useWorkspaceSession()
    const { userSession } = useUserSession();
    const [workspaces, setWorkspaces] = useState([])
    const [displayWorkspaces, setDisplayWorkspaces] = useState([])

    const fetchWorkspaces = async () => {
        setDisplayWorkspaces([])
        try {
            const response = await fetchWorkspacesByUserId(userSession.user._id)
            mapDisplayModelWorkspace(response.workspaces)
        } catch (error) {
            console.log('Error title:', error.title); // This should show the custom error class name if available
            console.log('Error message:', error.message); // This should show the custom message
        }
    }

    const mapDisplayModelWorkspace = (workspaces) => {
        const mapValues = workspaces.map(workspace => {
            const { _id, title, subtitle, location } = workspace;

            const formattedAddress = location?.googleGeocode?.formatted_address;

            const newValue = {
                _id: _id,
                title: `${title}, ${subtitle}.`,
                subtitle: formattedAddress
            }
            return newValue;
        });

        setDisplayWorkspaces(mapValues)
        setWorkspaces(workspaces)
    }

    const saveDefaultWorkspace = (_id) => {
        const selectedWorkspace = workspaces.find((item) => item._id === _id)
        updateWorkspaceSession(selectedWorkspace)
    }

    return {
        isLoading,
        workspaces: displayWorkspaces,
        error,
        fetchWorkspaces,
        saveDefaultWorkspace
    }
}