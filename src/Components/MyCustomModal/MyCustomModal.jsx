import './MyCustomModal.css'
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';

/*
array = [{
    _id: String
    title: String
    subtitle: String
}]
*/
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
                            {array.map((register) => (
                                <li key={register._id} onClick={() => onSelectRegister(register._id)}>
                                    {register.title}
                                </li>
                            ))}
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
