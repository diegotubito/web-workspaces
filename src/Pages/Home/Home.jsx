import './Home.css'
import { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useUserSession } from '../../Utils/Contexts/userSessionContext';
import { FooterBar } from '../../Components/FooterBar/FooterBar';
import { MyCustomModal } from '../../Components/MyCustomModal/MyCustomModal';
import { useWorkspaceViewModel } from '../../Hooks/Workspaces/useWorkspaceViewModel';
import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext';
import { PurchaseView } from '../Purchase/PurchaseView';
import { SaleView } from '../Sales/SaleView'

const Views = {
    purchaseView: 'purchase_view',
    saleView: 'sale_view'
}

export const Home = () => {
    const [routeToLogin, setRouteToLogin] = useState(false)
    const { userSession, updateUserSession } = useUserSession();
    const [customModalOpen, setIsOpen] = useState(false)
    const { workspaceSession, updateWorkspaceSession } = useWorkspaceSession()
    const [currentView, setCurrentView] = useState()

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
    }, [routeToLogin, updateUserSession, updateWorkspaceSession])

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

    const setPurchaseView = () => {
        setCurrentView(Views.purchaseView)
    }
    const setSaleView = () => {
        setCurrentView(Views.saleView)
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
                    <div className='home__left-sidebar-buttons'>
                        <button
                            className="btn btn-primary d-block w-100"
                            onClick={() => setCurrentView(Views.saleView)}>
                            <h1>Sales</h1>

                        </button>

                        <button
                            className="btn btn-secondary d-block w-100"
                            onClick={() => setCurrentView(Views.purchaseView)}>
                            <h1>Purchase</h1>

                        </button>

                        <button
                            className="btn btn-secondary d-block w-100"
                            onClick={() => setCurrentView(Views.saleView)}>
                            <h1>Cierre De Caja</h1>

                        </button>

                    </div>

                </div>

                <div className='home__main-content'>

                    {currentView === Views.purchaseView && <PurchaseView />}
                    {currentView === Views.saleView && <SaleView />}

                </div>

                <div className='home__right-sidebar'>
                    <h1>Right Side Bar</h1>
                </div>
            </div>

            <FooterBar />

        </div>
    )
}