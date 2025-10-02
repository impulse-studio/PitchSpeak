export interface Transcript {
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}
