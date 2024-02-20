import './Home.css'
import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserSession } from '../../Utils/userSessionContext';
import { FooterBar } from '../../Components/FooterBar/FooterBar';
import { MyCustomModal } from '../../Components/MyCustomModal/MyCustomModal';
import { useWorkspace } from '../../Hooks/useWorkspace';
import { useWorkspaceSession } from '../../Utils/workspaceSessionContext'

export const Home = () => {
    const [routeToLogin, setRouteToLogin] = useState(false)
    const { userSession, updateUserSession } = useUserSession();
    const navigate = useNavigate()
    const [customModalOpen, setIsOpen] = useState(false)
    const { workspaceSession, updateWorkspaceSession } = useWorkspaceSession()

    const { workspaces, fetchWorkspacesByUserId, isLoading } = useWorkspace()

    useEffect(() => {
        if (routeToLogin) {
            updateUserSession(null)
            updateWorkspaceSession(null)
        }
    }, [routeToLogin])

    const openMyModal = () => {
        fetchWorkspacesByUserId(userSession.user._id)
        
        setIsOpen(true)
    }

    const onCustomModalSelectedRegister = (_id) => {
        const selectedWorkspace = workspaces.find((item) => item._id === _id)
        updateWorkspaceSession(selectedWorkspace)
        setIsOpen(false)
    }

    const onShouldCloseModal = () => {
        setIsOpen(false)
    }

    return (
        <>
            <div>
                <h1>Hello {userSession.user.firstName}</h1>
                {workspaceSession ? (<h1>Default Workspace {workspaceSession.title}</h1>) : (null)}
            </div>
            <Button variant='secondary' onClick={() => setRouteToLogin(true)}>Log Out</Button>
            <Button onClick={() => openMyModal()}>Workspace</Button>

            <MyCustomModal
                array={workspaces}
                customModalOpen={customModalOpen}
                onCustomModalSelectedRegister={onCustomModalSelectedRegister}
                onShouldCloseModal={onShouldCloseModal}
                isLoading={isLoading}
            />

            < FooterBar />

        </>
    )
}