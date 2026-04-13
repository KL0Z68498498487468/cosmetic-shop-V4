import { useEffect, useRef, useState } from 'react';

const useRevealOnScroll = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.16 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

export default useRevealOnScroll;
