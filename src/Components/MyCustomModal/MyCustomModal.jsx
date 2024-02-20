import './MyCustomModal.css'
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';

export const MyCustomModal = ({ array, isLoading = false, customModalOpen, onCustomModalSelectedRegister, onShouldCloseModal }) => {
    if (!customModalOpen) { return null }

    const onSelectRegister = (_id) => {
        onCustomModalSelectedRegister(_id)
    }
    const onCloseDidClicked = () => {
        onShouldCloseModal()
    }



    return (
        <div className='custom-modal__background'>
            <div className='custom-modal__content'>
                <h1>Select Your Workspace</h1>

                {isLoading ? (
                    <div className="spinner-wrapper">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div>
                        <ul>
                            {array.map((register) => {
                                

                                return (
                                    <li key={register._id} onClick={() => onSelectRegister(register._id)}>
                                        <div className="register-content">
                                            <div className="register-title">{register.title}</div>
                                            {register.subtitle && <div className="register-subtitle">{register.subtitle}</div>}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>


                    </div>
                )}

                <Button variant='warning' className='custom-modal__button' onClick={() => onCloseDidClicked()}>Cancel</Button>

            </div>
            <div>


            </div>
        </div>
    )
}
