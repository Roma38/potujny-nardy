'use client';

import { Note } from "@/lib/types";

type Props = {
  notifications: Note[];
};

export default function Notifications({ notifications }: Props) {
  return (
    <div className="absolute w-[200px] top-5 right-5">
      {notifications.map(({ id, text }) => (
        <div 
          key={id} 
          className="px-4 py-2 mb-2 text-sm border rounded text-black font-semibold bg-amber-500 opacity-90 overflow-clip fadeout"
          onAnimationEnd={e => (e.target as HTMLElement).style.display="none"}
        >
          {text}
        </div>
      ))}
    </div>
  );
}