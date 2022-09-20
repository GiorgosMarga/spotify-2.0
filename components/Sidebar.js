import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingLibraryIcon,
  HeartIcon,
  RssIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useSession, signOut } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { playlistIdState } from "../atoms/playlistAtom";
import { useRecoilState } from "recoil";
const Sidebar = () => {
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistID, setPlaylistID] = useRecoilState(playlistIdState);
  const spotifyApi = useSpotify();
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getUserPlaylists()
        .then((data) => setPlaylists(data.body.items));
    }
  }, [session, spotifyApi]);
  return (
    <div className="text-gray-500 p-5 text-xs border-r border-gray-900 overflow-y-scroll scrollbar-hide lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36 h-screen">
      <div className="space-y-4">
        <button onClick={() => signOut()}>Logout</button>
        <button className="flex space-x-2 items-center hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex  space-x-2 items-center hover:text-white">
          <MagnifyingGlassIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex space-x-2 items-center hover:text-white">
          <BuildingLibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        <button className="flex space-x-2 items-center hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex space-x-2 items-center hover:text-white">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex  space-x-2 items-center hover:text-white">
          <RssIcon className="h-5 w-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        {/* Render Playlists */}
        {playlists &&
          playlists.map((playlist) => (
            <p
              onClick={() => setPlaylistID(playlist.id)}
              key={Math.random()}
              className="cursor-pointer hover:text-white"
            >
              {playlist.name}
            </p>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
