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
        <div className='home__main'>

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
            <MyCustomModal
                array={workspaces}
                isOpen={customModalOpen}
                onCustomModalSelectedRegister={onCustomModalSelectedRegister}
                onShouldClose={onShouldCloseModal}
                isLoading={isLoading}
            />

            <div className='home__header'>

                <div className='home__header-left'>
                    {workspaceSession ? (<h3>{`${workspaceSession?.title} ${workspaceSession?.subtitle}`}</h3>) : (null)}
                </div>


                <div className='home__header-right'>
                    <h2>{userSession.user.username}</h2>
                    <Button size='lg' onClick={() => openMyModal()}>Workspace</Button>
                    <Button size='lg' variant='secondary' onClick={() => setRouteToLogin(true)}>Log Out</Button>
                </div>

            </div>

            <div className='home__main-container'>
                <div className='home__left-sidebar'>
                    <h1>Left Side Bar</h1>

                </div>

                <div className='home__main-content'>
                    <div>
                    </div>

                </div>

                <div className='home__right-sidebar'>
                    <h1>Right Side Bar</h1>
                </div>
            </div>

            <FooterBar />

        </div>
    )
}