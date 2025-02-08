import React, { useEffect } from "react";
import axios from "axios";
import { TrainingSurvey } from "./TrainingPanel";

interface TrainingListProps {
    unconfirmedSurveys: TrainingSurvey[];
    setUnconfirmedSurveys: React.Dispatch<React.SetStateAction<TrainingSurvey[]>>;
}

const TrainingList: React.FC<TrainingListProps> = ({ unconfirmedSurveys, setUnconfirmedSurveys }) => {

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/training/unconfirmed`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            .then((response) => {
                setUnconfirmedSurveys(response.data);
            })
            .catch((error) => {
                throw new Error(error);
            });
    }, [])

    const handleConfirmTraining = (id: number) => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/training/confirm/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        })
        .then(() => {
            setUnconfirmedSurveys(unconfirmedSurveys.filter((survey) => survey.id !== id));
        })
        .catch((error) => {
            console.error("Ошибка подтверждения тренировки:", error);
        });
    };

    const handleDeleteTraining = (id: number) => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/training/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        })
        .then(() => {
            setUnconfirmedSurveys(unconfirmedSurveys.filter((survey) => survey.id !== id));
        })
        .catch((error) => {
            console.error("Ошибка при удалении тренировки:", error);
        });
    };

    return (
        <div className="admin-training-list">
            {unconfirmedSurveys.length ? (
                unconfirmedSurveys.map((el: TrainingSurvey, index: number) => (
                    <div className="admin-container" key={index}>
                        <div className="admin-title">Новая тренировка</div>
                        <form className="admin-form">
                            <div>
                                <label htmlFor="training-date" className="admin-label">
                                    Дата тренировки
                                </label>
                                <p className="admin-input">{el.date}</p>
                            </div>
                            <div>
                                <label className="admin-label">Упражнения</label>
                                {el.exercises.map((exercise, index) => (
                                    <div key={index} className="admin-exercise-wrapper">
                                        <p className="admin-input">{exercise.exerciseName}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="training-list__btn default-btn default-btn--margin"
                                    onClick={() => handleConfirmTraining(el.id)}
                                >
                                    Подтвердить
                                </button>
                                <button
                                    type="button"
                                    className="training-list__btn default-btn reverse"
                                    onClick={() => handleDeleteTraining(el.id)}
                                >
                                    Удалить
                                </button>
                            </div>
                        </form>
                    </div>
                ))
            ) : (
                <div>Здесь будет список ваших тренировок.</div>
            )}
        </div>
    );
};

export default TrainingList;
