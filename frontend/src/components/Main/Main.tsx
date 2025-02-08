import { useNavigate } from 'react-router-dom';
import Header from './Header';
import TrainingSwiper from './TrainingSwiper';
import './main.css'

export default function Main() {

  return (
    <div className="main-container">
      <Header />
      <TrainingSwiper />
    </div>
  );
}
