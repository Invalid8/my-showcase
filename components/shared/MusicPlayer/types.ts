export type Track = {
  id?: string;
  url: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  year?: string;
  duration?: number;
  artwork?: string;
};

export type Playlist = {
  name: string;
  tracks: Track[];
};
