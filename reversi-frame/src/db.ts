import { connectMongo, MangoRepo } from "./deps.ts";
import { State } from "./game/types.ts";

const connectionString = Deno.env.get("MONGO_CONNECTION_STRING");

const { db: mongoDb } = await connectMongo(connectionString!);

export const db = {
  games: new MangoRepo<RoomDb>(mongoDb, "games", {
    idTransformation: false,
  }),
};

export type RoomDb = {
  id: string;
  state: State;
};
