import ReactStars from 'react-stars';

interface RatingSlideProps {
  title: string;
  onRatingChange: (newRating: number) => void;
}

export default function RatingSlide({ title, onRatingChange }: RatingSlideProps) {
  return (
    <div className="wrapper">
      <div className="swiper-title">{title}</div>
      <div className="swiper-subtitle">Оцените вашего питомца</div>
      <div>
        <ReactStars
            count={6}
            onChange={onRatingChange}
            size={70}
            color2={'#ffd700'}
            half={false}
            edit={true}
        />
      </div>
    </div>
  );
}
