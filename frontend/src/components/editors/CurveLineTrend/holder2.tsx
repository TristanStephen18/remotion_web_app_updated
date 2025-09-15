// import React, { useState } from "react";
// import type { SimpleGraphProps } from "../../remotion_compositions/Curvelinetrend/SimplifiedTemplateHolder";
// import { SimpleTrendGraphPreview } from "../../layout/EditorPreviews/SimpleTrendMapPreview";
// // import { SimpleTrendGraphPreview } from "./SimpleTrendGraphPreview";

// // import { SimpleGraphProps } from "../../remotion_compositions/SimpleTrendGraph";

// // Example dataset
// const initialData = [
//   { label: 2015, value: 100 },
//   { label: 2016, value: 150 },
//   { label: 2017, value: 300 },
//   { label: 2018, value: 200 },
//   { label: 2019, value: 250 },
//   { label: 2020, value: 400 },
//   { label: 2021, value: 550 },
//   { label: 2022, value: 450 },
//   { label: 2023, value: 600 },
//   { label: 2024, value: 750 },
// ];

// export const SimpleGraphLiveEditor: React.FC = () => {
//   // ✅ Graph states
//   const [title, setTitle] = useState("Revenue Growth");
//   const [subtitle, setSubtitle] = useState("2015–2024 • Journey");
//   const [data, setData] = useState(initialData);
//   const [dataType, setDataType] = useState<"$" | "%" | "#" | "number">("$");
//   const [preset, setPreset] = useState<
//     "dark" | "light" | "corporate" | "playful"
//   >("corporate");
//   const [backgroundImage, setBackgroundImage] = useState(
//     "https://images.unsplash.com/photo-1536895040200-59f5d5f94c3c"
//   );
//   const [animationSpeed, setAnimationSpeed] = useState<
//     "slow" | "normal" | "fast"
//   >("normal");
//   const [minimalMode, setMinimalMode] = useState(false);

//   // ✅ Preview frame states
//   const [duration, setDuration] = useState(10);
//   const [previewBg, setPreviewBg] = useState("dark");
//   const [previewScale, setPreviewScale] = useState(1);

//   const cycleBg = () =>
//     setPreviewBg((bg) =>
//       bg === "dark" ? "light" : bg === "light" ? "grey" : "dark"
//     );

//   // ✅ Build props object for preview
//   const graphProps: SimpleGraphProps = {
//     title,
//     subtitle,
//     data,
//     dataType,
//     preset,
//     backgroundImage,
//     animationSpeed,
//     minimalMode,
//   };

//   return (
//     <div style={{ display: "flex", gap: "2rem", padding: "1rem" }}>
//       {/* ⚙️ Controls */}
//       <div style={{ flex: 1, maxWidth: "400px" }}>
//         <h2>Graph Controls</h2>

//         <label>
//           Title:
//           <input value={title} onChange={(e) => setTitle(e.target.value)} />
//         </label>
//         <br />

//         <label>
//           Subtitle:
//           <input
//             value={subtitle}
//             onChange={(e) => setSubtitle(e.target.value)}
//           />
//         </label>
//         <br />

//         <label>
//           Data Type:
//           <select
//             value={dataType}
//             onChange={(e) => setDataType(e.target.value as any)}
//           >
//             <option value="$">Dollar ($)</option>
//             <option value="%">Percent (%)</option>
//             <option value="#">Count (#)</option>
//             <option value="number">Number</option>
//           </select>
//         </label>
//         <br />

//         <label>
//           Preset:
//           <select
//             value={preset}
//             onChange={(e) => setPreset(e.target.value as any)}
//           >
//             <option value="dark">Dark</option>
//             <option value="light">Light</option>
//             <option value="corporate">Corporate</option>
//             <option value="playful">Playful</option>
//           </select>
//         </label>
//         <br />

//         <label>
//           Background Image:
//           <input
//             value={backgroundImage}
//             onChange={(e) => setBackgroundImage(e.target.value)}
//           />
//         </label>
//         <br />

//         <label>
//           Animation Speed:
//           <select
//             value={animationSpeed}
//             onChange={(e) => setAnimationSpeed(e.target.value as any)}
//           >
//             <option value="slow">Slow</option>
//             <option value="normal">Normal</option>
//             <option value="fast">Fast</option>
//           </select>
//         </label>
//         <br />

//         <label>
//           Minimal Mode:
//           <input
//             type="checkbox"
//             checked={minimalMode}
//             onChange={(e) => setMinimalMode(e.target.checked)}
//           />
//         </label>
//         <br />

//         <label>
//           Duration (sec):
//           <input
//             type="number"
//             value={duration}
//             min={3}
//             max={30}
//             onChange={(e) => setDuration(Number(e.target.value))}
//           />
//         </label>
//         <br />

//         <label>
//           Preview Scale:
//           <input
//             type="range"
//             min={0.5}
//             max={1.5}
//             step={0.1}
//             value={previewScale}
//             onChange={(e) => setPreviewScale(Number(e.target.value))}
//           />
//           {previewScale}x
//         </label>
//       </div>

//       {/* 📱 Preview */}
//       <div style={{ flex: 2 }}>
//         <SimpleTrendGraphPreview
//           {...graphProps}
//           duration={duration}
//           previewBg={previewBg}
//           cycleBg={cycleBg}
//           previewScale={previewScale}
//         />
//       </div>
//     </div>
//   );
// };
