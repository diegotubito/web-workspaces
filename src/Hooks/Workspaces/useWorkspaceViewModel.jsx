import { useWorkspaceSession } from '../../Utils/workspaceSessionContext'
import { useFetchUserWorkspaces } from './useFetchUserWorkspaces'
import { useUserSession } from '../../Utils/userSessionContext'
import { useState, useEffect } from 'react';

export const useWorkspaceViewModel = () => {
    const { fetchWorkspacesByUserId, isLoading, error } = useFetchUserWorkspaces()
    const [workspaces, setWorkspaces] = useState([])
   
    const { updateWorkspaceSession } = useWorkspaceSession()
    const [displayWorkspaces, setDisplayWorkspaces] = useState([])
    const { userSession } = useUserSession();

    useEffect(() => {
        mapDisplayModelWorkspace()
    }, [workspaces])

    const fetchWorkspaces = async () => {
        setDisplayWorkspaces([])
        try {
            const response = await fetchWorkspacesByUserId(userSession.user._id)            
            setWorkspaces(response.workspaces)
        } catch (error) {
            console.log('Error title:', error.title); // This should show the custom error class name if available
            console.log('Error message:', error.message); // This should show the custom message
        }
    }

    const mapDisplayModelWorkspace = () => {
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
    }

    const saveDefaultWorkspace = (_id) => {
        const selectedWorkspace = workspaces.find((item) => item._id === _id)
        updateWorkspaceSession(selectedWorkspace)
    }

    return { isLoading, workspaces: displayWorkspaces, error, fetchWorkspaces, saveDefaultWorkspace }
}