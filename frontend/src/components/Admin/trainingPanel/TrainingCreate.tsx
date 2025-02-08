import React, { useState } from "react";
import axios from "axios";
import { TrainingSurvey } from "./TrainingPanel";

interface TrainingCreateProps {
    setUnconfirmedSurveys: React.Dispatch<React.SetStateAction<TrainingSurvey[]>>;
}

const TrainingCreate: React.FC<TrainingCreateProps> = ({ setUnconfirmedSurveys }) => {
    const [exercises, setExercises] = useState<{ exerciseName: string }[]>([{ exerciseName: "Упражнение 1" }]);
    const [date, setDate] = useState('');
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [responseType, setResponseType] = useState<"success" | "error" | null>(null);

    const handleSaveTraining = async () => {
        try {
            if (!date) {
                setResponseType("error");
                setResponseMessage("Дата не указана");
            } else {
                const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/training/create`, {
                    date,
                    exerciseRatings: exercises
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                if (response.data.result) {
                    setResponseType("success");
                    setResponseMessage("Тренировка успешно создана");
                } else {
                    setResponseType("error");
                    setResponseMessage("Произошла ошибка");
                }
            }

            setTimeout(() => {
                setResponseMessage(null);
            }, 5000);
        } catch (error: any) {
            console.error(error);
        }
    };

    const handleAddExercise = () => {
        setExercises([...exercises, { exerciseName: `Упражнение ${exercises.length + 1}` }]);
    };

    const handleRemoveExercise = (index: number) => {
        setExercises(exercises.filter((_, i) => i !== index));
    };

    const handleExerciseChange = (index: number, value: string) => {
        setExercises(exercises.map((exercise, i) => i === index ? { exerciseName: value } : exercise));
    };

    return (
        <div className="wrapper-column">
            <div className="admin-container">
                <h1 className="admin-title">Добавление тренировки</h1>
                <form className="admin-form">
                    <div>
                        <label htmlFor="training-date" className="admin-label">
                            Дата тренировки
                        </label>
                        <input
                            type="date"
                            id="training-date"
                            className="admin-date-input"
                            required
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="admin-label">Упражнения</label>
                        {exercises.map((exercise, index) => (
                            <div key={index} className="admin-exercise-wrapper">
                                <input
                                    type="text"
                                    value={exercise.exerciseName}
                                    className="admin-input"
                                    onChange={(e) => handleExerciseChange(index, e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="admin-remove-btn"
                                    onClick={() => handleRemoveExercise(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="admin-add-btn"
                            onClick={handleAddExercise}
                        >
                            +
                        </button>
                    </div>
                    <button
                        type="button"
                        className="default-btn"
                        onClick={handleSaveTraining}
                    >
                        Сохранить тренировку
                    </button>
                </form>
            </div>
            {responseMessage && (
                <div className={`user-response ${responseType}`}>
                    {responseMessage}
                </div>
            )}
        </div>
    );
};

export default TrainingCreate;
