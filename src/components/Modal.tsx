import { ReactNode, RefObject } from "react";

type Props = {
  children: ReactNode;
  ref: RefObject<HTMLDialogElement | null>;
};

function Modal({ children, ref }: Props) {
  return (
    <dialog
      ref={ref}
      onCancel={() => ref.current?.close()}
      className="relative top-[50%] left-[50%] translate-[-50%] px-4 py-2 mb-2 text-sm border rounded text-black  bg-amber-400 text-center"
    >
      <button onClick={() => ref.current?.close()} className="absolute top-2 right-2 cursor-pointer text-black">✖</button>

      <div className="m-5">
        {children}
      </div>

      <button
        autoFocus
        onClick={() => ref.current?.close()}
        className="font-semibold px-2 py-1 border-2 rounded bg-amber-500 cursor-pointer"
      >
        Close
      </button>
    </dialog>
  );
}

export default Modal;