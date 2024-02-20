import { useEffect, useState } from 'react';
import './FooterBar.css'
import { dateAndTimeFormat, stringMonthFormat } from '../../Utils/dateUtils';
import { useUserSession } from '../../Utils/userSessionContext'
import { useWorkspaceSession } from '../../Utils/workspaceSessionContext'

export const FooterBar = () => {
    const {userSession} = useUserSession()
    const {workspaceSession} = useWorkspaceSession()

    const getFullName = () => {
        if (!userSession) { return }
        return `${userSession.user.lastName} ${userSession.user.firstName}`
    }

    const getAccessTokenStringDate = () => {
        if (!userSession) { return }
        return dateAndTimeFormat(userSession.accessTokenExpirationDateString);
    }

    const getRefreshTokenStringDate = () => {
        if (!userSession) { return }
        return stringMonthFormat(userSession.refreshTokenExpirationDateString);
    }

    return (
        <>
            <footer className="footer-bar">
                <p className='roboto-thin'>{getFullName()} - EAT: {getAccessTokenStringDate()}- RAT: {getRefreshTokenStringDate()}</p>
                { workspaceSession && <p className='roboto-thin'> {workspaceSession.title} {workspaceSession.subtitle}</p> }
                <p className='roboto-thin'>@ 2024 David Diego Gomez. All Rights Reserved</p>
            </footer>
        </>
    )
}