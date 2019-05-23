export interface IAnswer {
  title: string;
  voted: string[];
  totalVotes: number;
}
export interface IQuestion {
  title: string;
  description: string;
  imageUrl?: string;
  answers?: IAnswer[];
}
