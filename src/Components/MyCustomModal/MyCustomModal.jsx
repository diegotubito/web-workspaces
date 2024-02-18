import { Button } from 'react-bootstrap';
import './MyCustomModal.css'
import { useState } from 'react';

export const MyCustomModal = ({isOpen, setIsOpen}) => {
    const workspaces = [{ id: 0, name: 'BodyShaping' }, { id: 1, name: 'Barber Shop' }, { id: 0, name: `Ricky's Shop` }]
 
    if (!isOpen) { return null }

    const onSelectWorkspace = (workspace) => {
        console.log(workspace.name)
    }
    const onCloseDidClicked = () => {
        setIsOpen(false)
    }

    return (
        <div className='modal-background'>
            <div className='modal-content'>
                <h1>Select Your Workspace</h1>

                <ul>
                    {workspaces.map((workspace) => (
                        <li key={workspace.id} onClick={() => onSelectWorkspace(workspace)}>
                            {workspace.name}
                        </li>
                    ))}
                </ul>

                <Button onClick={() => onCloseDidClicked()}>CLOSE</Button>

            </div>
        </div>
    )
}
