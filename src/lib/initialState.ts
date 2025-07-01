import { Checker } from "../hooks/useGame";

export const initialBoard: Checker[][] = Array(24)
  .fill(null)
  .map(() => []);

initialBoard[0] = Array(2).fill({ color: "black" });
initialBoard[5] = Array(5).fill({ color: "white" });
initialBoard[7] = Array(3).fill({ color: "white" });
initialBoard[11] = Array(5).fill({ color: "black" });
initialBoard[12] = Array(5).fill({ color: "white" });
initialBoard[16] = Array(3).fill({ color: "black" });
initialBoard[18] = Array(5).fill({ color: "black" });
initialBoard[23] = Array(2).fill({ color: "white" });

//test bearing off
// initialBoard[5] = Array(7).fill({ color: "white" });
// initialBoard[3] = Array(2).fill({ color: "white" });
// initialBoard[2] = Array(3).fill({ color: "white" });
// initialBoard[1] = Array(3).fill({ color: "black" });
// initialBoard[0] = Array(3).fill({ color: "white" });

// initialBoard[11] = Array(5).fill({ color: "black" });
// initialBoard[16] = Array(2).fill({ color: "black" });
// initialBoard[18] = Array(5).fill({ color: "black" });