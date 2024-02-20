import { useWorkspaceSession } from '../../Utils/workspaceSessionContext'
import { useWorkspace } from './useWorkspace'
import { useUserSession } from '../../Utils/userSessionContext'
import { useState, useEffect } from 'react';

export const useWorkspaceViewModel = () => {
    const { workspaces, fetchWorkspacesByUserId, isLoading } = useWorkspace()
    const { workspaceSession, updateWorkspaceSession } = useWorkspaceSession()
    const [ displayWorkspaces, setDisplayWorkspaces] = useState([])
    const { userSession, updateUserSession } = useUserSession();

    useEffect(() => {
        mapDisplayModelWorkspace()
    }, [workspaces])

    const fetchWorkspaces = () => {
        fetchWorkspacesByUserId(userSession.user._id)
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

    return { isLoading, displayWorkspaces, fetchWorkspaces, saveDefaultWorkspace }
}