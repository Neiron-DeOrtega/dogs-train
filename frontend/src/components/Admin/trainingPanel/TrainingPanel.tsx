import { useState } from "react";
import TrainingCreate from "./TrainingCreate";
import TrainingList from "./TrainingList";

export interface Exercise {
    id: number;
    exerciseName: string;
}

export interface TrainingSurvey {
    id: number;
    date: string;
    exercises: Exercise[];
}

const TrainingPanel = () => {

    const [unconfirmedSurveys, setUnconfirmedSurveys] = useState<TrainingSurvey[]>([]);

    return (
        <div className="admin-wrapper">
            <TrainingCreate setUnconfirmedSurveys={setUnconfirmedSurveys}/>
            <TrainingList setUnconfirmedSurveys={setUnconfirmedSurveys} unconfirmedSurveys={unconfirmedSurveys}/>
        </div>
    )
}

export default TrainingPanel;