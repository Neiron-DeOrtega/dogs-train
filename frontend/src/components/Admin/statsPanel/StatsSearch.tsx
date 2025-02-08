import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";

interface StatsPanelProps {
  setStats: Dispatch<SetStateAction<{ dogName: string; averageRating: number }[] | undefined>>;
}

export const StatsSearch: React.FC<StatsPanelProps> = ({setStats}) => {
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [responseType, setResponseType] = useState<"success" | "error" | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleSearch = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/average`, {
        date: selectedDate,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setStats(response.data.result)
      setResponseMessage("Данные успешно получены");
      setResponseType("success");
    } catch (error: any) {
      if (error.status === 404) {
        setResponseMessage("Данные не найдены");
        setResponseType("error");
      } else {
        setResponseMessage("Ошибка при получении данных");
        setResponseType("error");
      }
    }
  };

  return (
    <div className="user-wrapper">
      <div className="admin-container">
        <h1 className="admin-title">Вывод статистики по дате</h1>
        <form className="admin-form" onSubmit={handleSearch}>
          <input
            className="admin-date-input"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button 
            type="button" 
            className="default-btn reverse" 
            onClick={() => handleSearch()}>Показать</button>
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
