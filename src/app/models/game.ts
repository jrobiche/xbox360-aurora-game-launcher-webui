export interface Game {
  art: {
    background: string;
    banner: string;
    boxartLarge: string;
    boxartSmall: string;
    screenshots: string[];
    tile: string;
  };
  contentGroup: number;
  directory: string;
  executable: string;
  fileUrls: string[];
  hidden: boolean;
  titleName: string;
  type: number;
}
