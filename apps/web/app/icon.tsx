import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: "#CC0000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="0" x2="200" y2="0" stroke="white" strokeWidth="8" />
        <line x1="0" y1="0" x2="200" y2="57" stroke="white" strokeWidth="8" />
        <line x1="0" y1="0" x2="200" y2="120" stroke="white" strokeWidth="8" />
        <line x1="0" y1="0" x2="200" y2="200" stroke="white" strokeWidth="8" />
        <line x1="0" y1="0" x2="120" y2="200" stroke="white" strokeWidth="8" />
        <line x1="0" y1="0" x2="57" y2="200" stroke="white" strokeWidth="8" />
        <line x1="0" y1="0" x2="0" y2="200" stroke="white" strokeWidth="8" />
        <path
          d="M 38,0 Q 19,19 0,38"
          stroke="white"
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M 76,0 Q 38,38 0,76"
          stroke="white"
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M 114,0 Q 57,57 0,114"
          stroke="white"
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M 152,0 Q 76,76 0,152"
          stroke="white"
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M 200,0 Q 100,100 0,200"
          stroke="white"
          strokeWidth="8"
          fill="none"
        />
      </svg>
    </div>,
    { ...size }
  )
}
