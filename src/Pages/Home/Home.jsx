import './Home.css'
import { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserSession } from '../../Utils/userSessionContext';
import { FooterBar } from '../../Components/FooterBar/FooterBar';
import { MyCustomModal } from '../../Components/MyCustomModal/MyCustomModal';
import { useWorkspaceViewModel } from '../../Hooks/Workspaces/useWorkspaceViewModel';
import { useWorkspaceSession } from '../../Utils/workspaceSessionContext';

export const Home = () => {
    const [routeToLogin, setRouteToLogin] = useState(false)
    const { userSession, updateUserSession } = useUserSession();
    const navigate = useNavigate()
    const [customModalOpen, setIsOpen] = useState(false)
    const { workspaceSession, updateWorkspaceSession } = useWorkspaceSession()

    const [openAlert, setOpenAlert] = useState(false)

    const {
        fetchWorkspaces,
        workspaces,
        error: workspaceError,
        isLoading,
        saveDefaultWorkspace
    } = useWorkspaceViewModel()

    useEffect(() => {
        if (routeToLogin) {
            updateUserSession(null)
            updateWorkspaceSession(null)
        }
    }, [routeToLogin])

    useEffect(() => {
        if (workspaceError) {
            setOpenAlert(true)
            setIsOpen(false)
        }
    }, [workspaceError])

    const openMyModal = () => {
        fetchWorkspaces()
        setIsOpen(true)
    }

    const onCustomModalSelectedRegister = (_id) => {
        saveDefaultWorkspace(_id)
        setIsOpen(false)
    }

    const onShouldCloseModal = () => {
        setIsOpen(false)
    }

    return (
        <>
            {openAlert && (
                <div className="alert-container">
                    <Alert variant="danger" onClose={() => setOpenAlert(false)} dismissible>
                        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                        <p>
                            Something went wrong while fetching the workspaces. Please try again later.
                        </p>
                    </Alert>
                </div>
            )}
            <div>
                <h1>Hello {userSession.user.firstName}</h1>
                {workspaceSession ? (<h1>Default Workspace {workspaceSession?.title}</h1>) : (null)}
            </div>
            <Button variant='secondary' onClick={() => setRouteToLogin(true)}>Log Out</Button>
            <Button onClick={() => openMyModal()}>Workspace</Button>

            <MyCustomModal
                array={workspaces}
                isOpen={customModalOpen}
                onCustomModalSelectedRegister={onCustomModalSelectedRegister}
                onShouldClose={onShouldCloseModal}
                isLoading={isLoading}
            />

            < FooterBar />



        </>
    )
}