import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const [routeToLogin, setRouteToLogin] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (routeToLogin) {
            navigate('/login');
        }
    }, [routeToLogin])

    return (
        <Button onClick={() => setRouteToLogin(true)}>Go To Login</Button>
    )
}