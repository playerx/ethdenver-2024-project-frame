export const DRAW = "DRAW";

export type Move = [
  /**
   * for a default state it will have a placeholder
   * -1 for player1
   * -2 for player2
   */
  team: TeamId,
  /**
   * y coordinat
   */
  y: number,
  /**
   * x coordinat
   */
  x: number
];

export type Action = [
  /**
   * for a default state it will have a placeholder
   * -1 for player1
   * -2 for player2
   */
  fid: number,
  /**
   * y coordinat
   */
  y: number,
  /**
   * x coordinat
   */
  x: number,
  /**
   * Proof for the move
   */
  signature: string
];

export type Point = {
  x: number;
  y: number;
};

export enum GameMode {
  OPEN = 1,
  VS_FOLLOWERS = 2,
  VS_FOLLOWINGS = 3,
  VS_PLAYER_WITH_FOLLOWERS = 4,
  VS_PLAYER_WITH_FOLLOWINGS = 5,
}

export type State = {
  id: string;
  gameHashtag: string;
  gameMode: GameMode;
  boardSize: number;
  actions: Action[];

  cells: (TeamId | null)[][];
  nextPossibleMoves: Move[];

  lastMove?: Move;
  lastPlayerFid?: number;

  /**
   * Teams and member fids
   */
  team: {
    A: { [fid: number]: { username: string } };
    B: { [fid: number]: { username: string } };
  };

  activeTeamId: TeamId;

  winnerTeamId: TeamId | typeof DRAW | null;
};

export type TeamId = keyof State["team"];
