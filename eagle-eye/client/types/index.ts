export interface GeneralData {
  title: string;
  description: string;
  logo: string;
  version: string;
}

export enum Provider {
  Instagram = "Instagram",
  // Facebook = "Facebook",
  // Twitter = "Twitter",
  // LinkedIn = "LinkedIn",
  // Telegram = "Telegram",
}

export interface SystemData {
  cpu: number;
  memory: {
    total: number;
    used: number;
    percent: number;
  };
  network: {
    rx: number;
    tx: number;
  };
}
