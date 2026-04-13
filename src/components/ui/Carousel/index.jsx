import { Swiper } from 'swiper/react';
import 'swiper/css';

const Carousel = ({ children, ...props }) => {
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={1.1}
      breakpoints={{
        640: { slidesPerView: 2.1 },
        1024: { slidesPerView: 3.2 },
        1280: { slidesPerView: 4 }
      }}
      {...props}
    >
      {children}
    </Swiper>
  );
};

export default Carousel;
