import { useState } from "react";
import axios from 'axios';
import UserModals from "./UserModals";

interface User {
    id: number;
    name: string;
    dogName: string;
    phoneNumber: string;
}

interface SurveyStats {
    surveyId: number;
    date: string;
    isConfirmed: boolean;
    exerciseRatings: { exerciseName: string; rating: number }[];
    bestDogOwner: {
        id: number;
        name: string;
        dogName: string;
    } | null;
}

const SearchForm = () => {
    const [statsUserId, setStatsUserId] = useState<number | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchInput, setSearchInput] = useState<string>("");
    const [usersList, setUsersList] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    // Состояние для статистики
    const [userStats, setUserStats] = useState<SurveyStats[] | null>(null);

    const handleSearchUsers = async () => {
        setStatsUserId(null);
        try {
            if (searchInput) {
                const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user`, { phoneNumber: searchInput }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (response.data.result) {
                    setFilteredUsers([response.data.user]);
                }
            } else {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (response.data.result) {
                    setFilteredUsers(response.data.users);
                }
            }
        } catch (error) {
            console.error("Ошибка при поиске пользователя", error);
        }
    };

    const handleStatsCheck = (userId: number) => {
        setStatsUserId(userId);
        getUserStats(userId);
    };

    // Функция для получения статистики пользователя
    const getUserStats = async (userId: number) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/stats/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (response.data.surveys) {
                setUserStats(response.data.surveys);  // Сохраняем статистику в состояние
            }
        } catch (error) {
            console.error("Ошибка при получении статистики", error);
        }
    };

    // Открытие модального окна для редактирования
    const openEditModal = (user: User) => {
        console.log(user);
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    // Открытие модального окна для удаления
    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    // Функция для подтверждения редактирования
    const handleEditConfirm = async () => {
        if (selectedUser) {
            try {
                const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/user/edit`, {
                    userId: selectedUser.id,
                    name: selectedUser.name,
                    dogName: selectedUser.dogName,
                    phoneNumber: selectedUser.phoneNumber
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (response.data.result) {
                    setFilteredUsers((prevUsers) =>
                        prevUsers.map((user) =>
                            user.id === selectedUser.id ? response.data.user : user
                        )
                    );
                    setEditModalOpen(false);
                }
            } catch (error) {
                console.error("Ошибка при редактировании пользователя", error);
            }
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedUser) {
            try {
                const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/user/delete/${selectedUser.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (response.data.result) {
                    setFilteredUsers((prevUsers) =>
                        prevUsers.filter((user) => user.id !== selectedUser.id)
                    );
                    setDeleteModalOpen(false);
                }
            } catch (error) {
                console.error("Ошибка при удалении пользователя", error);
            }
        }
    };

    return (
        <div className="user-search-wrapper">
            <label htmlFor="user-search" className="user-input-wrapper">
                <input
                    placeholder="Введите номер телефона"
                    type="text"
                    id="user-search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="user-search-input admin-input"
                />
                <button
                    className="default-btn reverse"
                    onClick={handleSearchUsers}
                >
                    Найти
                </button>
            </label>

            {filteredUsers.length > 0 ? (
                <div className="user-list-wrapper">
                    {filteredUsers.map((user) => (
                        <div className="user-list__box" key={user.id}>
                            <div className="user-list__info">
                                <div className="user-list__names">
                                    <div>
                                        Хозяин: <h2 className="names__row">{user.name}</h2>
                                    </div>
                                    <div>
                                        Собака: <h2 className="names__row">{user.dogName}</h2>
                                    </div>
                                </div>
                                <div>+{user.phoneNumber}</div>
                            </div>
                            <div className="button-grid">
                                <button
                                    className="default-btn delete"
                                    onClick={() => openDeleteModal(user)}
                                >
                                    Удалить
                                </button>
                                <button
                                    className="default-btn edit"
                                    onClick={() => openEditModal(user)}
                                >
                                    Изменить
                                </button>
                                <button
                                    className="default-btn stats"
                                    onClick={() => handleStatsCheck(user.id)}
                                >
                                    Показать статистику
                                </button>
                            </div>

                            {statsUserId === user.id && userStats && (
                                <div className="user-stats">
                                    {userStats.length === 0 ? (
                                        <p>Нет доступных статистических данных</p>
                                    ) : (
                                        userStats.map((survey) => (
                                            <div key={survey.surveyId} className="survey-stats">
                                                <p>Дата: {survey.date.split("T")[0]}</p>
                                                <div>
                                                    <h4>Оценки упражнений:</h4>
                                                    <ul>
                                                        {survey.exerciseRatings.map((rating, index) => (
                                                            <li key={index}>
                                                                {rating.exerciseName}: {rating.rating}/6
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                {survey.bestDogOwner && (
                                                    <div>
                                                        <h4>Лучший хозяин собаки:</h4>
                                                        <p>{survey.bestDogOwner.name} с собакой {survey.bestDogOwner.dogName}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Пользователи не найдены</p>
            )}

            <UserModals
                userToEdit={selectedUser}
                isEditModalOpen={isEditModalOpen}
                isDeleteModalOpen={isDeleteModalOpen}
                closeEditModal={() => setEditModalOpen(false)}
                closeDeleteModal={() => setDeleteModalOpen(false)}
                onEditConfirm={handleEditConfirm}
                onDeleteConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default SearchForm;
