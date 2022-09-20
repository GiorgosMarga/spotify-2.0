/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import {
  ArrowsRightLeftIcon,
  BackwardIcon,
  ForwardIcon,
  ArrowUturnLeftIcon,
  PlayCircleIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  PauseCircleIcon,
} from "@heroicons/react/24/outline";
import { debounce } from "lodash";

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();

  const handlePlayPause = () => {
    spotifyApi
      .getMyCurrentPlaybackState({})
      .then((data) => {
        if (data.body?.is_playing) {
          spotifyApi.pause();
          setIsPlaying(false);
        } else {
          spotifyApi.play();
          setIsPlaying(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi
        .getMyCurrentPlayingTrack()
        .then((data) => {
          console.log(data);
          console.log("Now playing:", data.body?.item);
          setCurrentTrackId(data.body?.item?.id);
          spotifyApi.getMyCurrentPlaybackState().then((data) => {
            setIsPlaying(data.body?.is_playing);
          });
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce(
      (volume) => {
        spotifyApi.setVolume(volume).catch((err) => console.log(err));
      },
      500,
      []
    )
  );

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album?.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      {/* center */}
      <div className="flex justify-evenly items-center">
        <ArrowsRightLeftIcon className="playerIcon" />
        <BackwardIcon className="playerIcon" />
        {isPlaying ? (
          <PlayCircleIcon
            onClick={handlePlayPause}
            className="w-10 h-10 cursor-pointer"
          />
        ) : (
          <PauseCircleIcon
            onClick={handlePlayPause}
            className="w-10 h-10 cursor-pointer"
          />
        )}
        <ForwardIcon className="playerIcon" />
        <ArrowUturnLeftIcon className="playerIcon" />
      </div>
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <SpeakerXMarkIcon
          className="playerIcon"
          onClick={() =>
            volume > 10 && setVolume((prevState) => prevState - 10)
          }
        />
        <input
          type="range"
          value={volume}
          min={0}
          max={100}
          className="w-14 md:w-28"
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <SpeakerWaveIcon
          className="playerIcon"
          onClick={() =>
            volume < 100 && setVolume((prevState) => prevState + 10)
          }
        />
      </div>
    </div>
  );
};

export default Player;
