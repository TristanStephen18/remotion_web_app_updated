// import React, { useState } from "react";
// import { FacstCardPreview } from "../components/layout/EditorPreviews/FacstCardTemplate";
// const FactsCardPage: React.FC = () => {
//   const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");

//   const cycleBg = () => {
//     setPreviewBg((prev) =>
//       prev === "dark" ? "light" : prev === "light" ? "grey" : "dark"
//     );
//   };

//   // Dummy props
//   const intro = { title: "Amazing Facts", subtitle: "You Should Know" };
//   const outro = { title: "Learn More", subtitle: "Follow for More" };
//   const facts = [
//     {
//       title: "Skyscrapers can sway safely",
//       description: "Designed to move up to 3 feet in high winds",
//     },
//     { title: "Bananas are berries", description: "But strawberries are not!" },
//     {
//       title: "Sharks existed before trees",
//       description: "Over 400 million years ago",
//     },
//   ];

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background: "#111",
//       }}
//     >
//       <FacstCardPreview
//         intro={intro}
//         outro={outro}
//         facts={facts}
//         backgroundImage="https://picsum.photos/1080/1920?blur=3"
//         fontSizeTitle={48}
//         fontSizeSubtitle={24}
//         fontFamily="sans-serif"
//         fontColor="white"
//         previewBg={previewBg}
//         cycleBg={cycleBg}
//       />
//     </div>
//   );
// };

// export default FactsCardPage;
