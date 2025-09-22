
import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

const BackgroundCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [muted, setMuted] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const autoNextRef = useRef<NodeJS.Timeout>();

  const slides = [
    {
      id: 1,
      videoId: "I-j_SMn8RRc",
      videoUrl: "https://www.youtube.com/embed/I-j_SMn8RRc?autoplay=1&mute=1&loop=1&playlist=I-j_SMn8RRc&controls=0&showinfo=0&rel=0&enablejsapi=1",
      image: "https://img.youtube.com/vi/I-j_SMn8RRc/maxresdefault.jpg",
      author: "CYRUS PLATFORM",
      title: "Ferramentas",
      topic: "Premium",
      description: "Acesse as melhores ferramentas de IA, design e produtividade em um só lugar",
      buttons: ["Explorar", "Saiba Mais"]
    },
    {
      id: 2,
      videoId: "7oBZ8sBjdyQ",
      videoUrl: "https://www.youtube.com/embed/7oBZ8sBjdyQ?autoplay=1&mute=1&loop=1&playlist=7oBZ8sBjdyQ&controls=0&showinfo=0&rel=0&enablejsapi=1",
      image: "https://img.youtube.com/vi/7oBZ8sBjdyQ/maxresdefault.jpg",
      author: "AI REVOLUTION",
      title: "Inteligência",
      topic: "Artificial",
      description: "ChatGPT, Midjourney, Leonardo AI e muito mais para revolucionar seu trabalho",
      buttons: ["Começar", "Ver Planos"]
    },
    {
      id: 3,
      videoId: "IXWEQHCKR20",
      videoUrl: "https://www.youtube.com/embed/IXWEQHCKR20?autoplay=1&mute=1&loop=1&playlist=IXWEQHCKR20&controls=0&showinfo=0&rel=0&enablejsapi=1",
      image: "https://img.youtube.com/vi/IXWEQHCKR20/maxresdefault.jpg",
      author: "DESIGN TOOLS",
      title: "Criação",
      topic: "Profissional",
      description: "Canva Pro, Adobe Stock, Freepik e outras ferramentas de design premium",
      buttons: ["Criar", "Descobrir"]
    },
    {
      id: 4,
      videoId: "uXlWYZ022zU",
      videoUrl: "https://www.youtube.com/embed/uXlWYZ022zU?autoplay=1&mute=1&loop=1&playlist=uXlWYZ022zU&controls=0&showinfo=0&rel=0&enablejsapi=1",
      image: "https://img.youtube.com/vi/uXlWYZ022zU/maxresdefault.jpg",
      author: "ANALYTICS",
      title: "Análise",
      topic: "Dados",
      description: "SEMrush, SimilarWeb e ferramentas de análise para otimizar seus resultados",
      buttons: ["Analisar", "Ver Mais"]
    }
  ];

  const thumbnails = slides.map(slide => ({
    ...slide,
    thumbnail: slide.image
  }));

  const timeRunning = 3000;
  const timeAutoNext = 7000;

  useEffect(() => {
    // Auto-advance slides
    autoNextRef.current = setTimeout(() => {
      showSlider('next');
    }, timeAutoNext);

    return () => {
      if (autoNextRef.current) clearTimeout(autoNextRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentSlide]);

  const showSlider = (type: 'next' | 'prev') => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    if (type === 'next') {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      carousel.classList.add('next');
    } else {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      carousel.classList.add('prev');
    }

    // Clear existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (autoNextRef.current) clearTimeout(autoNextRef.current);

    // Remove animation classes after animation completes
    timeoutRef.current = setTimeout(() => {
      carousel.classList.remove('next', 'prev');
    }, timeRunning);

    // Set next auto-advance
    autoNextRef.current = setTimeout(() => {
      showSlider('next');
    }, timeAutoNext);
  };

  const toggleMute = () => {
    setMuted(!muted);
    // Here you could control the iframe audio if the YouTube API was fully integrated
  };

  const getVideoUrl = (slide: typeof slides[0]) => {
    return slide.videoUrl.replace('mute=1', `mute=${muted ? 1 : 0}`);
  };

  return (
    <>
      <style>{`
        .background-carousel {
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          position: relative;
          font-family: 'Inter', sans-serif;
          /* Ensure carousel is behind sidebar */
          z-index: 0;
        }

        .background-carousel .list .item {
          width: 100vw;
          height: 100%;
          position: absolute;
          inset: 0;
        }

        .background-carousel .list .item iframe,
        .background-carousel .list .item img {
          width: 100vw;
          height: 100%;
          object-fit: cover;
          /* Ensure video covers full width including sidebar area */
          position: absolute;
          left: 0;
          top: 0;
        }

        .background-carousel .list .item .content {
          position: absolute;
          top: 20%;
          width: 1140px;
          max-width: 80%;
          left: 50%;
          transform: translateX(-50%);
          padding-right: 30%;
          box-sizing: border-box;
          color: #fff;
          text-shadow: 0 5px 10px rgba(0,0,0,0.7);
          z-index: 10;
          /* Adjust content position to account for sidebar */
          margin-left: 32px;
        }

        @media (max-width: 768px) {
          .background-carousel .list .item .content {
            margin-left: 0;
          }
        }

        .background-carousel .list .item .author {
          font-weight: bold;
          letter-spacing: 10px;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .background-carousel .list .item .title,
        .background-carousel .list .item .topic {
          font-size: 5em;
          font-weight: bold;
          line-height: 1.3em;
          margin: 0;
        }

        .background-carousel .list .item .topic {
          color: #A259FF;
        }

        .background-carousel .list .item .description {
          margin: 20px 0;
          font-size: 16px;
          line-height: 1.6;
        }

        .background-carousel .list .item .buttons {
          display: grid;
          grid-template-columns: repeat(2, 130px);
          grid-template-rows: 40px;
          gap: 5px;
          margin-top: 20px;
        }

        .background-carousel .list .item .buttons button {
          border: none;
          background-color: #eee;
          letter-spacing: 3px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .background-carousel .list .item .buttons button:nth-child(2) {
          background-color: transparent;
          border: 1px solid #fff;
          color: #eee;
        }

        .background-carousel .list .item .buttons button:hover {
          transform: scale(1.05);
        }

        /* Volume Control */
        .volume-control {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s;
        }

        .volume-control:hover {
          background: rgba(0, 0, 0, 0.7);
          transform: scale(1.1);
        }

        /* Thumbnail */
        .thumbnail {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          width: max-content;
          z-index: 100;
          display: flex;
          gap: 20px;
          /* Adjust thumbnail position to account for sidebar */
          margin-left: 16px;
        }

        @media (max-width: 768px) {
          .thumbnail {
            margin-left: 0;
          }
        }

        .thumbnail .item {
          width: 150px;
          height: 220px;
          flex-shrink: 0;
          position: relative;
          cursor: pointer;
          transition: all 0.3s;
          overflow: hidden;
        }

        .thumbnail .item:hover {
          transform: scale(1.05);
        }

        .thumbnail .item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 20px;
          transition: all 0.5s ease;
        }

        .thumbnail .item .content {
          color: #fff;
          position: absolute;
          bottom: 10px;
          left: 10px;
          right: 10px;
        }

        .thumbnail .item .content .title {
          font-weight: 500;
          font-size: 12px;
        }

        .thumbnail .item .content .description {
          font-weight: 300;
          font-size: 10px;
          margin-top: 5px;
        }

        /* Animation */
        .background-carousel .list .item:nth-child(1) {
          z-index: 1;
        }

        /* Animation text in first item */
        .background-carousel .list .item:nth-child(1) .content .author,
        .background-carousel .list .item:nth-child(1) .content .title,
        .background-carousel .list .item:nth-child(1) .content .topic,
        .background-carousel .list .item:nth-child(1) .content .description,
        .background-carousel .list .item:nth-child(1) .content .buttons {
          transform: translateY(50px);
          filter: blur(20px);
          opacity: 0;
          animation: showContent 0.5s 1s linear 1 forwards;
        }

        @keyframes showContent {
          to {
            transform: translateY(0px);
            filter: blur(0px);
            opacity: 1;
          }
        }

        .background-carousel .list .item:nth-child(1) .content .title {
          animation-delay: 1.2s !important;
        }

        .background-carousel .list .item:nth-child(1) .content .topic {
          animation-delay: 1.4s !important;
        }

        .background-carousel .list .item:nth-child(1) .content .description {
          animation-delay: 1.6s !important;
        }

        .background-carousel .list .item:nth-child(1) .content .buttons {
          animation-delay: 1.8s !important;
        }

        /* Enhanced thumbnail expansion effect */
        .background-carousel.next .list .item:nth-child(1) iframe,
        .background-carousel.next .list .item:nth-child(1) img {
          width: 150px;
          height: 220px;
          position: absolute;
          bottom: 50px;
          left: 50%;
          border-radius: 30px;
          animation: expandThumbnail 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          transform: translateX(-50%);
          z-index: 1000;
        }

        @keyframes expandThumbnail {
          0% {
            width: 150px;
            height: 220px;
            bottom: 50px;
            left: 50%;
            border-radius: 30px;
            transform: translateX(-50%) scale(1);
          }
          50% {
            transform: translateX(-50%) scale(1.1);
          }
          100% {
            bottom: 0;
            left: 0;
            width: 100vw;
            height: 100%;
            border-radius: 0;
            transform: translateX(0) scale(1);
          }
        }

        .background-carousel.next .thumbnail .item:nth-last-child(1) {
          overflow: hidden;
          animation: showThumbnail 0.5s linear 1 forwards;
        }

        .background-carousel.prev .list .item iframe,
        .background-carousel.prev .list .item img {
          z-index: 100;
        }

        @keyframes showThumbnail {
          from {
            width: 0;
            opacity: 0;
          }
        }

        .background-carousel.next .thumbnail {
          animation: effectNext 0.5s linear 1 forwards;
        }

        @keyframes effectNext {
          from {
            transform: translateX(150px);
          }
        }

        /* Running time */
        .background-carousel .time {
          position: absolute;
          z-index: 1000;
          width: 0%;
          height: 3px;
          background-color: #A259FF;
          left: 0;
          top: 0;
        }

        .background-carousel.next .time,
        .background-carousel.prev .time {
          animation: runningTime 3s linear 1 forwards;
        }

        @keyframes runningTime {
          from { width: 100% }
          to { width: 0 }
        }

        /* Prev click */
        .background-carousel.prev .list .item:nth-child(2) {
          z-index: 2;
        }

        .background-carousel.prev .list .item:nth-child(2) iframe,
        .background-carousel.prev .list .item:nth-child(2) img {
          animation: shrinkToThumbnail 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          position: absolute;
          bottom: 0;
          left: 0;
        }

        @keyframes shrinkToThumbnail {
          0% {
            width: 100vw;
            height: 100%;
            bottom: 0;
            left: 0;
            border-radius: 0;
            transform: scale(1);
          }
          50% {
            transform: scale(0.9);
          }
          100% {
            width: 150px;
            height: 220px;
            bottom: 50px;
            left: 50%;
            border-radius: 20px;
            transform: translateX(-50%) scale(1);
          }
        }

        .background-carousel.prev .thumbnail .item:nth-child(1) {
          overflow: hidden;
          opacity: 0;
          animation: showThumbnail 0.5s linear 1 forwards;
        }

        .background-carousel.prev .list .item:nth-child(2) .content .author,
        .background-carousel.prev .list .item:nth-child(2) .content .title,
        .background-carousel.prev .list .item:nth-child(2) .content .topic,
        .background-carousel.prev .list .item:nth-child(2) .content .description,
        .background-carousel.prev .list .item:nth-child(2) .content .buttons {
          animation: contentOut 1.5s linear 1 forwards !important;
        }

        @keyframes contentOut {
          to {
            transform: translateY(-150px);
            filter: blur(20px);
            opacity: 0;
          }
        }

        @media screen and (max-width: 678px) {
          .background-carousel .list .item .content {
            padding-right: 0;
          }
          .background-carousel .list .item .content .title {
            font-size: 30px;
          }
          .background-carousel .list .item .content .topic {
            font-size: 30px;
          }
          .thumbnail {
            display: none;
          }
        }
      `}</style>

      <div className="background-carousel" ref={carouselRef}>
        {/* Time indicator */}
        <div className="time"></div>

        {/* Volume Control */}
        <button 
          className="volume-control"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        {/* Main slides */}
        <div className="list">
          {slides.map((slide, index) => (
            <div 
              key={slide.id} 
              className="item"
              style={{ 
                zIndex: index === currentSlide ? 1 : 0,
                opacity: index === currentSlide ? 1 : 0
              }}
            >
              {index === currentSlide ? (
                <iframe
                  key={`${slide.id}-${muted}`}
                  src={getVideoUrl(slide)}
                  title={slide.title}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{
                    pointerEvents: 'none'
                  }}
                />
              ) : (
                <img src={slide.image} alt={slide.title} />
              )}
              <div className="content">
                <div className="author">{slide.author}</div>
                <div className="title">{slide.title}</div>
                <div className="topic">{slide.topic}</div>
                <div className="description">{slide.description}</div>
                <div className="buttons">
                  {slide.buttons.map((button, btnIndex) => (
                    <button key={btnIndex}>{button}</button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Thumbnail */}
        <div className="thumbnail">
          {thumbnails.map((thumb, index) => (
            <div 
              key={thumb.id} 
              className="item"
              onClick={() => {
                setCurrentSlide(index);
                if (autoNextRef.current) clearTimeout(autoNextRef.current);
                autoNextRef.current = setTimeout(() => showSlider('next'), timeAutoNext);
              }}
            >
              <img src={thumb.thumbnail} alt={thumb.title} />
              <div className="content">
                <div className="title">{thumb.title}</div>
                <div className="description">{thumb.topic}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BackgroundCarousel;
