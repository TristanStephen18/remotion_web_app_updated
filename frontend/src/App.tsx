import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Homepage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUp";

import Dashboard from "./pages/user/D2.tsx";

import { TypingEditor } from "./components/editors/TextTypingTemplate/holder.tsx";
// import FactsCardPage from "./pages/SecondPage.tsx";
import { FactCardsEditor } from "./components/editors/FactCardsTemplate/holder.tsx";
import { QuoteTemplateEditor } from "./components/editors/QuoteTemplate/holder.tsx";
import { BarGraphEditor } from "./components/editors/BarGraph/holder.tsx";
import GraphEditor from "./components/editors/trials/clt.tsx";
import { SplitScreenEditor } from "./components/editors/SplitScreen/holder.tsx";
import { KpiFlipCardEditor } from "./components/editors/KpiFlipCards/holder.tsx";
import { KernBurnsEditor } from "./components/editors/KenBurnsCarousel/holder.tsx";
import { Fakeconvo } from "./components/editors/trials/fconvo.tsx";
import { FakeTextConversationEditor } from "./components/editors/FakeTextConversation/holder.tsx";
import { RedditVideoEditor } from "./components/editors/RedditTemplate/holder.tsx";
import { StoryTellingVideoEditor } from "./components/editors/StoryTellingVideo/holder.tsx";
import { CurveLineTrendEditor } from "./components/editors/CurveLineTrend/holder.tsx";
import { NewTypingEditor } from "./components/editors/NewTextTypingEditor/holder.tsx";
import QuoteGenerator from "./trials/geminischematester.tsx";
import QuoteTester from "./trials/quotesapitester.tsx";
import { QuoteSpotlightBatchRendering } from "./pages/batchrendering/QuoteSpotlight.tsx";
import { TextTypingTemplateBatchRendering } from "./pages/batchrendering/TextTyping.tsx";
import { BarGraphBatchRendering } from "./pages/batchrendering/BarGraph.tsx";
import { CurveLineTrendBatchRendering } from "./pages/batchrendering/CurveLineTrend.tsx";
import { KenBurnsSwipeBatchRendering } from "./pages/batchrendering/KenburnsStack.tsx";
import { FactCardsBatchRendering } from "./pages/batchrendering/FactCardsTemplate.tsx";
import { KpiFlipBatchRendering } from "./pages/batchrendering/KpilipCards.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/gedit" element={<GraphEditor />} />
        <Route
          path="/template/quotetemplate"
          element={<QuoteTemplateEditor />}
        />
        <Route
          path="/template/quotetemplate/mode/batchrendering"
          element={<QuoteSpotlightBatchRendering />}
        />
        <Route path="/template/splitscreen" element={<SplitScreenEditor />} />
        <Route path="/template/texttypingtemplate" element={<TypingEditor />} />
        <Route
          path="/template/newtexttyping/mode/batchrendering"
          element={<TextTypingTemplateBatchRendering />}
        />

        <Route path="/template/factcards" element={<FactCardsEditor />} />
        <Route path="/template/factcards/mode/batchrendering" element={<FactCardsBatchRendering />} />

        <Route path="/template/bargraph" element={<BarGraphEditor />} />
        <Route path="/template/bargraph/mode/batchrendering" element={<BarGraphBatchRendering />} />

        <Route path="/template/kpiflipcards" element={<KpiFlipCardEditor />} />
        <Route path="/template/kpiflipcards/mode/batchrendering" element={<KpiFlipBatchRendering />} />
        <Route
          path="/template/kenburnscarousel"
          element={<KernBurnsEditor />}
        />
        <Route
          path="/template/kenburnscarousel/mode/batchrendering"
          element={<KenBurnsSwipeBatchRendering />}
        />
        <Route
          path="/template/curvelinetrend"
          element={<CurveLineTrendEditor />}
        />
        <Route
          path="/template/curvelinetrend/mode/batchrendering"
          element={<CurveLineTrendBatchRendering />}
        />

        <Route
          path="/template/faketextconversation"
          element={<FakeTextConversationEditor />}
        />
        <Route path="/template/redditvideo" element={<RedditVideoEditor />} />
        <Route
          path="/template/storytelling"
          element={<StoryTellingVideoEditor />}
        />
        <Route path="/template/newtexttyping" element={<NewTypingEditor />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/sound" element={<Fakeconvo />} />

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/tester" element={<QuoteGenerator />} />
        <Route path="/qtester" element={<QuoteTester />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
