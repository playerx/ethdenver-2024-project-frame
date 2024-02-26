import {
  connectMongo,
  MangoRepo,
} from "https://deno.land/x/jok_mango@v2.1.1/mod.ts";
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
