import { DEFAULT_ROOM_ID } from "@/lib/constants";
import { initialState } from "@/lib/initialState";
import { Room } from "@/lib/types";

export const rooms: Record<string, Room> = { [DEFAULT_ROOM_ID]: {visitors: [], state: initialState} };
