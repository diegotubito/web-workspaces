import './Home.css'
import { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useUserSession } from '../../Utils/Contexts/userSessionContext';
import { FooterBar } from '../../Components/FooterBar/FooterBar';
import { MyCustomModal } from '../../Components/MyCustomModal/MyCustomModal';
import { useWorkspaceViewModel } from '../../Hooks/Workspaces/useWorkspaceViewModel';
import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext';
import { PurchaseView } from '../Purchase/PurchaseView';
import { HomeMiddleView } from './HomeMiddleView/HomeMiddleView'
import { useTranslation } from 'react-i18next';
import purchaseIcon from '../../Resources/Images/logo.svg'
import point_of_sale from '../../Resources/Images/point_of_sale.svg'
import { ButtonIcon } from '../../Components/Buttons/ButtonIcon/ButtonIcon'
import { useNavigate } from 'react-router-dom';

import { ReactComponent as OrderIcon } from '../../Resources/Images/point_of_sale.svg';
import TurnstyleView from '../../Components/TurnStyleManager/Turnstyle';

const Views = {
    purchaseView: 'purchase_view',
    saleView: 'sale_view',
    closingCash: 'closing_cash'
}

export const Home = () => {
    const { t } = useTranslation()
    const navigate = useNavigate();
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
        setPurchaseView()
    }, [])

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

    const onPurchaseOrderViewDidClicked = () => {
        navigate(`/purchase_order_view`)
    }

    const onTransferViewDidClicked = () => {
        navigate(`/transfer_view`)
    }

    const onCashBalanceViewDidClicked = () => {
        navigate(`/cash_balance_view`)
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

                        <ButtonIcon title={t('ORDER_BUTTON')} reactIcon={OrderIcon} onClick={onPurchaseOrderViewDidClicked} />

                        <ButtonIcon title={t('Transfers')} reactIcon={OrderIcon} onClick={onTransferViewDidClicked} />

                        <ButtonIcon title={t('Cash Balance')} reactIcon={OrderIcon} onClick={onCashBalanceViewDidClicked} />
                       
                    </div>

                </div>

                <div className='home__main-content'>

                   
                     <HomeMiddleView />
                    

                </div>

                <div className='home__right-sidebar'>
                    <div>Right Side Bar</div>
                    <div>Right Side Bar</div>
                    <div>Right Side Bar</div>
                    <div>Right Side Bar</div>
                    <div>Right Side Bar</div>
                    <div>Right Side Bar</div>
                    <div>Right Side Bar</div>
                    <div>Right Side Bar</div>
                    <div>Right Side Bar</div>
                    <div>Right Side Bar</div>
                    <div>Right Side Bar</div>
                    <div>Right Side Bar</div>
                    {/* <TurnstyleView/> */}
                </div>
            </div>

            <FooterBar />

        </div>
    )
}