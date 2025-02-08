import axios from "axios";
import { useState } from "react";

const CreateForm = () => {

    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [responseType, setResponseType] = useState<"success" | "error" | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [dogName, setDogName] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleCreateUser = async () => {
        if (!name.trim() || !dogName.trim() || !password.trim() || !phoneNumber.trim() || phoneNumber.length !== 11 || !Number(phoneNumber)) {
            setResponseMessage("Заполните все поля корректно");
            setResponseType("error");
            console.log('ddd')
            return
        }
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/create`, {
            phoneNumber, name, dogName, password
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }
    )

        if (response.data.result) {
            setResponseMessage("Пользователь успешно создан");
            setResponseType("success");
            
            setPhoneNumber('')
            setName('')
            setDogName('')
            setPassword('')
        } else {
            setResponseMessage("Ошибка создания пользователя");
            setResponseType("error");
        }

        setTimeout(() => {
            setResponseMessage(null);
        }, 5000);
    };

    return (
    <div className="user-wrapper">
                <div className="admin-container">
                    <h1 className="admin-title">Создание пользователя</h1>
                    <form className="admin-form">
                        <div>
                            <label htmlFor="phone-number" className="admin-label">
                                Номер телефона
                            </label>
                            <input
                                type="text"
                                id="phone-number"
                                className="admin-date-input"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="user-name" className="admin-label">
                                Имя хозяина
                            </label>
                            <input
                                type="text"
                                id="user-name"
                                className="admin-date-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="dog-name" className="admin-label">
                                Имя собаки
                            </label>
                            <input
                                type="text"
                                id="dog-name"
                                className="admin-date-input"
                                value={dogName}
                                onChange={(e) => setDogName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="admin-label">Пароль</label>
                            <input
                                type="password"
                                id="password-user"
                                className="admin-date-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            className="default-btn reverse"
                            onClick={handleCreateUser}
                        >
                            Создать
                        </button>
                    </form>
                </div>
                {responseMessage && (
                    <div className={`user-response ${responseType}`}>
                        {responseMessage}
                    </div>
                )}
            </div>
    )
}

export default CreateForm