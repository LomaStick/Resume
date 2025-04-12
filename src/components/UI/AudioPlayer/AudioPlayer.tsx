import React, { useState, useRef, useEffect } from 'react';
import { FaVolumeUp, FaVolumeMute, FaPlay, FaPause } from 'react-icons/fa';
import './AudioPlayer.scss';

interface AudioPlayerProps {
  audioSrc: string;
  startVolume?: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc, startVolume = 0.2 }) => {
  const [volume, setVolume] = useState(startVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Устанавливаем громкость и состояние mute при изменении volume или isMuted
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.volume = volume;
      audioElement.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Попытка автовоспроизведения после рендеринга
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const playAudio = async () => {
      try {
        await audioElement.play();
        setIsPlaying(true);
        setIsAutoplayBlocked(false);
      } catch (error) {
        console.error("Autoplay blocked:", error);
        setIsAutoplayBlocked(true); // Автовоспроизведение заблокировано

        // Автоматически скрыть уведомление через 5 секунд
        const timeoutId = setTimeout(() => {
          setIsAutoplayBlocked(false);
        }, 5000);

        // Очистка таймера при размонтировании компонента
        return () => clearTimeout(timeoutId);
      }
    };

    playAudio();
  }, []);

  // Обработка воспроизведения/паузы
  const togglePlay = async () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    try {
      if (isPlaying) {
        await audioElement.pause();
      } else {
        await audioElement.play();
      }
      setIsPlaying(!isPlaying);
      setIsAutoplayBlocked(false); // Скрыть уведомление после нажатия "Play"
    } catch (error) {
      console.error("Play/pause error:", error);
      setIsPlaying(false); // Останавливаем воспроизведение в случае ошибки
    }
  };

  // Обработка изменения громкости
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    setIsMuted(false);
  };

  // Переключение mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Показ/скрытие слайдера громкости
  const handleMouseEnter = () => {
    setShowVolumeSlider(true);
  };

  const handleMouseLeave = () => {
    setShowVolumeSlider(false);
  };

  return (
    <div
      className="audio-player"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <audio ref={audioRef} src={audioSrc} loop />

      <div className="audio-player__controls">
        <div className="audio-player__play-icon" onClick={togglePlay}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </div>

        <div className="audio-player__volume-icon" onClick={toggleMute}>
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </div>

        <div
          className={`audio-player__volume-slider-container ${
            showVolumeSlider ? 'audio-player__volume-slider-container--visible' : ''
          }`}
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="audio-player__volume-slider"
          />
        </div>
      </div>

      {/* Уведомление о блокировке автовоспроизведения */}
      {isAutoplayBlocked && (
        <div className="audio-player__autoplay-blocked">
          <p>Автовоспроизведение заблокировано. Нажмите "Play", чтобы начать.</p>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;