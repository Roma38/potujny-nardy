import { DEFAULT_ROOM_ID } from "@/lib/constants";
import { initialState } from "@/lib/initialState";
import { TRooms } from "@/lib/types";

export const rooms: TRooms = { [DEFAULT_ROOM_ID]: {visitors: [], state: initialState} };
