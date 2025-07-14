import { DEFAULT_ROOM_ID } from "@/lib/constants";
import { initialState } from "@/lib/initialState";
import { Rooms } from "@/lib/types";

export const rooms: Rooms = { [DEFAULT_ROOM_ID]: {visitors: [], state: initialState} };
