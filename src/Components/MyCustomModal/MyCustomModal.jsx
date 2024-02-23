import './MyCustomModal.css'
import { Spinner } from '../Spinner/spinner'

export const MyCustomModal = ({ array, isLoading = false, isOpen, onCustomModalSelectedRegister, onShouldClose }) => {
    if (!isOpen) { return null }

    const onSelectRegister = (_id) => {
        onCustomModalSelectedRegister(_id)
    }
    const onCloseDidClicked = () => {
        onShouldClose()
    }

    return (
        <div className='custom-modal__background'>
             
            <div className='custom-modal__content'>
                <h1>Select Your Workspace</h1>
                {isLoading && <Spinner/>}
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

                <button className='custom-modal__button' onClick={() => onCloseDidClicked()}>Cancel</button>

            </div>
        </div>
    )
}
