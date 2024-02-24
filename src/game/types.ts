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
  OPEN = "OPEN",
  VS_FOLLOWERS = "VS_FOLLOWERS",
  VS_FOLLOWINGS = "VS_FOLLOWINGS",
  VS_PLAYER_WITH_FOLLOWERS = "VS_PLAYER_WITH_FOLLOWERS",
  VS_PLAYER_WITH_FOLLOWINGS = "VS_PLAYER_WITH_FOLLOWINGS",
}

export type State = {
  id: string;
  gameMode: GameMode;
  boardSize: number;
  actions: Action[];

  moves: Move[];
  nextPossibleMoves: Move[];

  /**
   * Teams and member fids
   */
  team: {
    A: { [fid: number]: { username: string } };
    B: { [fid: number]: { username: string } };
  };

  activeTeamId: TeamId;
};

export type TeamId = keyof State["team"];
