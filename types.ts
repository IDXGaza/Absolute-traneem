
export interface Timestamp {
  id: string;
  time: number;
  label: string;
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  url: string;
  coverUrl: string;
  isFavorite: boolean;
  timestamps: Timestamp[];
  duration: number;
  playbackRate: number;
  order: number;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  playbackRate: number;
  isLoading: boolean;
  isLooping: boolean;
}
