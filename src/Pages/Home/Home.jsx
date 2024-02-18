import './Home.css'
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserSession } from '../../Utils/userSessionContext';
import { FooterBar } from '../../Components/FooterBar/FooterBar';

export const Home = () => {
    const [routeToLogin, setRouteToLogin] = useState(false)
    const { userSession, updateUserSession } = useUserSession();
    const navigate = useNavigate()

    const { username } = userSession.user

    useEffect(() => {
        if (routeToLogin) {
            updateUserSession(null)
            
        }
    }, [routeToLogin])

    const changeName = () => {
        const newUserSession = {...userSession, user: {
            ...userSession.user,
            firstName: 'Rickito Bebe'
        }}
        updateUserSession(newUserSession)
    }

    return (
        <>

            <div>
                <h1>Hello {userSession.user.firstName}</h1>
            </div>
            <Button variant='secondary' onClick={() => setRouteToLogin(true)}>Log Out</Button>
            <Button onClick={() => changeName()}>Change Name in User Session</Button>
            < FooterBar />
        </>
    )
}