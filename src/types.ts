export interface OverviewData {
  date: string;
  videoViews: number;
  profileViews: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface ContentData {
  postDay: string;
  videoTitle: string;
  totalVideoTime: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  avgWatchTime: number;
  fullWatchPercentage: number;
  newFollowers: number;
}