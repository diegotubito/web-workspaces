import './Home.css'
import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserSession } from '../../Utils/userSessionContext';
import { FooterBar } from '../../Components/FooterBar/FooterBar';
import { MyCustomModal } from '../../Components/MyCustomModal/MyCustomModal';
import { useWorkspace } from '../../Hooks/useWorkspace';

export const Home = () => {
    const [routeToLogin, setRouteToLogin] = useState(false)
    const { userSession, updateUserSession } = useUserSession();
    const navigate = useNavigate()
    const [customModalOpen, setIsOpen] = useState(false)

    const { workspaces, fetchWorkspacesByUserId, isLoading } = useWorkspace()

    useEffect(() => {
        if (routeToLogin) {
            updateUserSession(null)
        }
    }, [routeToLogin])

    const openMyModal = () => {
        fetchWorkspacesByUserId()
        setIsOpen(true)
    }

    const onCustomModalSelectedRegister = (_id) => {
        console.log(_id)
        setIsOpen(false)
    }

    const onShouldCloseModal = () => {
        setIsOpen(false)
    }

    return (
        <>
            <div>
                <h1>Hello {userSession.user.firstName}</h1>
            </div>
            <Button variant='secondary' onClick={() => setRouteToLogin(true)}>Log Out</Button>
            <Button onClick={() => openMyModal()}>Open My Modal</Button>

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