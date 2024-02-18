import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const [routeToLogin, setRouteToLogin] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (routeToLogin) {
            localStorage.setItem('userSession', null);
            navigate('/login');
        }
    }, [routeToLogin])

    return (
        <>

        <div></div>
            <Button onClick={() => setRouteToLogin(true)}>Go To Login</Button>
        </>
    )
}