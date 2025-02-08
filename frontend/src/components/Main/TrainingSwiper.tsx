import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useEffect, useRef, useState } from 'react';
import RatingSlide from './RatingSlide';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loading } from '../Loading';
import { Exercise } from '../Admin/trainingPanel/TrainingPanel';

export default function TrainingSwiper() {
  const swiperRef = useRef<any>(null);
  const [ratingArray, setRatingArray] = useState<{ exerciseName: string; rating: number }[]>([]);
  const [bestDog, setBestDog] = useState<number>();
  const [ratingList, setRatingList] = useState<{ exerciseName: string; rating: number }[]>();
  const [loadedSurvey, setLoadedSurvey] = useState<any>();
  const [isTrainingExist, setIsTrainingExist] = useState<boolean>(false);

  let navigate = useNavigate()

  const resetTrainingState = () => {
    setIsTrainingExist(false);
    setRatingArray([]);
    setRatingList([]);
    setLoadedSurvey(null);
    setBestDog(undefined);
  };
  
  const handleRatingChange = (newRating: number, title: string) => {
    setRatingArray((prevRatings) => [
      ...prevRatings.filter((rating) => rating.exerciseName !== title), // Удаляем старую оценку, если она существует
      { exerciseName: title, rating: newRating },
    ]);
    
    setRatingList((prevRatings) => [
      ...prevRatings?.filter((rating) => rating.exerciseName !== title) ?? [],
      { exerciseName: title, rating: newRating }
    ])
  
  
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };
  

  const handleBestDogChoice = (id: number) => {
    if (swiperRef.current) {
      setBestDog(id);
      swiperRef.current.swiper.slideNext();
    }
  };

  useEffect(() => {

    if (!localStorage.getItem('accessToken')) {
      navigate('/login')
    
    }
    let isMounted = true;
  
    const loadSurvey = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/training/load`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (isMounted && response.data.result) {
          setIsTrainingExist(true);
          setLoadedSurvey(response.data.survey);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    loadSurvey();
  
    return () => {
      isMounted = false;
    };
  }, []);
  

  const completeResult = async () => {
    const surveyResult = {
      surveyId: loadedSurvey.id,
      exerciseRatings: ratingList ? ratingList : [],
      bestDogOwnerId: bestDog,
    };
      axios.post(
        `${process.env.REACT_APP_SERVER_URL}/training/submit`,
        surveyResult,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      ).then((response) => {
        if (response.data.result) {
          resetTrainingState();
          swiperRef.current.swiper.slideNext();
        }
      }).catch((error) => {
        console.log(error)
      })
  };

  return (
    <Swiper
      navigation={false}
      ref={swiperRef}
      allowTouchMove={false}
      modules={[Navigation]}
      className="mySwiper"
    >
      <SwiperSlide>
        <div className="slide-wrapper">
          <div>
            {isTrainingExist ? (
              <>
                <p className="swiper-title main-title">Пройдите опрос по сегодняшней тренировке</p>
                <button
                  className="swiper__btn default-btn"
                  onClick={() => swiperRef.current.swiper.slideNext()}
                >
                  Начать
                </button>
              </>
            ) : (
              <p className="swiper-title main-title">Здесь пока что ничего нет.</p>
            )}
          </div>
        </div>
      </SwiperSlide>

      {loadedSurvey?.exerciseRatings?.map((exercise: Exercise, index: number) => (
        <SwiperSlide key={index}>
          <div className="slide-wrapper">
            <RatingSlide
              title={exercise.exerciseName}
              onRatingChange={(newRating: number) =>
                handleRatingChange(newRating, exercise.exerciseName)
              }
            />
          </div>
        </SwiperSlide>
      ))}

      <SwiperSlide>
        <div className="container">
          <div className="slide-wrapper">
            <p className="swiper-title">Выберите лучшую собаку на тренировке (кроме вашей)</p>
            <div className="best-dogs__list">
              {loadedSurvey?.usersList?.map((user: any) => (
                <div className="best-dogs__wrapper" key={user.id}>
                  <h3 className="best-dogs__name">
                    <img src="/img/user.png" alt="" className="best-dogs__icon" />
                    <span>{user.name}</span>
                  </h3>
                  <h3 className="best-dogs__name">
                    <img src="/img/pawprint.png" alt="" className="best-dogs__icon" />
                    <span>{user.dogName}</span>
                  </h3>
                  <button
                    className="best-dogs__btn default-btn reverse"
                    onClick={() => handleBestDogChoice(user.id)}
                  >
                    Выбрать
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="slide-wrapper">
          <div>
            <p className="swiper-title main-title">Благодарим за пройденный опрос!</p>
            <button
              className="swiper__btn default-btn reverse"
              onClick={() => completeResult()}
            >
              Завершить
            </button>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="slide-wrapper">
          <div>
            <p className="swiper-title main-title">Здесь пока что ничего нет.</p>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}

