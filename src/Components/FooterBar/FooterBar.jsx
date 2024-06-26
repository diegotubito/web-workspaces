import './FooterBar.css'
import { dateAndTimeFormat, stringMonthFormat } from '../../Utils/Common/dateUtils';
import { useUserSession } from '../../Utils/Contexts/userSessionContext'
import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext'

export const FooterBar = () => {
    const {userSession} = useUserSession()
    const {workspaceSession} = useWorkspaceSession()

    const getFullName = () => {
        if (!userSession) { return }
        return `${userSession.user.lastName} ${userSession.user.firstName}`
    }

    const getRole = () => {
        if (!workspaceSession || !userSession) { return 'Empty'}
        const member = workspaceSession.members.find((member) => member.user._id === userSession.user._id)
        return member.isOwner ? 'Owner' : member.role.name
    }

    const getAccessTokenStringDate = () => {
        if (!userSession) { return }
        return dateAndTimeFormat(userSession.accessTokenExpirationDateString);
    }

    const getRefreshTokenStringDate = () => {
        if (!userSession) { return }
        return dateAndTimeFormat(userSession.refreshTokenExpirationDateString);
    }

    return (
        <>
            <footer className="footer-bar">
                <p className='roboto-thin'>{getFullName()} Role: {getRole()} - AT-Exp: {getAccessTokenStringDate()}- RT-Exp: {getRefreshTokenStringDate()}</p>
                { workspaceSession && <p className='roboto-thin'> {workspaceSession.title} {workspaceSession.subtitle}</p> }
                <p className='roboto-thin'>@ 2024 David Diego Gomez. All Rights Reserved</p>
            </footer>
        </>
    )
}