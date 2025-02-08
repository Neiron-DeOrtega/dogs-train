import React, { useEffect, useState } from "react";
import './admin.css'
import Header from "../Main/Header";
import TrainingPanel from "./trainingPanel/TrainingPanel";
import UserPanel from "./userPanel/UserPanel";
import StatsPanel from "./statsPanel/StatsPanel";

const Admin: React.FC = () => {
  const [content, setContent] = useState<number>(0)

  const handleContentChange = (number: number) => {
    if (number === 0) {
        return <TrainingPanel />
    } else if (number === 1) {
        return <UserPanel />
    } else if (number === 2) {
      return <StatsPanel />
    }
  }

  return (
    <>
    <Header />
    <div className="container admin--margin">
        <div className="buttons-wrapper">
            <button className='change-btn' type="button" onClick={() => setContent(0)}>Тренировки</button>
            <button className="change-btn" type="button" onClick={() => setContent(1)}>Пользователи</button>
            <button className="change-btn" type="button" onClick={() => setContent(2)}>Статистика</button>
        </div>
        {handleContentChange(content)}
    </div>
    </>
  );
};

export default Admin;
