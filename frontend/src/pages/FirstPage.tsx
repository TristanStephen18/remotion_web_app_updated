// import { useState } from "react";
// import { QuoteComposition } from "../components/remotion_compositions/QuoteTemplate";
// import { QuoteEditor } from "./editors/QuoteTemplateEditor";
import { QuoteEditorSideNav } from "./editors/SideNavVersion";
// import { QuoteEditorTabs } from "./editors/TabsEditor";

function FirstPage() {
  // const [data, setData] = useState("");

  // const getData = async () => {
  //   const res = await fetch("http://localhost:3000/api/generate-content", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   const data = await res.json();

  //   setData(data.message);
  // };

  // getData();

  // return <h1>{data}</h1>;
  return (
    <QuoteEditorSideNav/>
  );
}

export default FirstPage;
