import { Note } from "@/lib/types";
import { useState } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Note[]>([]);

  function visitorsUpdateNote(visitors: string[], newVisitors: string[]) {
    const newNotes: Note[] = [];
    newVisitors.forEach((id, index) => {
      if(newVisitors[index] === visitors[index]) return;
      
      if(newVisitors[index] && !visitors[index]) {
        const note: Note = { id: crypto.randomUUID(), text: "" };

        switch (index) {
          case 0:
            note.text = "White connected";
            break;
          case 1:
            note.text = "Black connected";
            break;
          default:
            note.text = `User ${id} watching the game`;
            break;
          }
        newNotes.push(note);
      }

      if (!newVisitors[index] && visitors[index]) {
        const note: Note = { id: crypto.randomUUID(), text: "" };
        switch (index) {
          case 0:
            note.text = "White disconnected";
            break;
          case 1:
            note.text = "Black disconnected";
            break;
          default:
            note.text = `User ${id} left the room`;
            break;
        }
        newNotes.push(note);
      }
    })
    setNotifications((prev) => [...prev, ...newNotes]);
  }

  return { notifications, visitorsUpdateNote };
}
