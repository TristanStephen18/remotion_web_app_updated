// utils/templateUtils.ts
// import { templatedata } from "../data/templatedata";

export const getTemplateRoute = (templateId: number, projectId: number) => {
  switch (templateId) {
    case 1: // Quote Spotlight
      return `/project/${projectId}/quotetemplate`;
    case 2: // Typing Animation
      return `/project/${projectId}/texttypingtemplate`;
    case 3: // Bar Graph
      return `/project/${projectId}/bargraph`;
    case 4: // KPI Flip Cards
      return `/project/${projectId}/kpiflipcards`;
    case 5: // Curve Line Trend
      return `/project/${projectId}/curvelinetrend`;
    case 6: // Split Screen
      return `/project/${projectId}/splitscreen`;
    case 7: // Fact Cards
      return `/project/${projectId}/factcards`;
    case 8: // Ken Burns Carousel
      return `/project/${projectId}/kenburnscarousel`;
    case 9: // Fake Text Conversation
      return `/project/${projectId}/faketextconversation`;
    case 10: // Reddit Narration
      return `/project/${projectId}/redditvideo`;
    case 11: // Story Narration
      return `/project/${projectId}/storytelling`;
    default:
      return `/project/${projectId}/unknown`;
  }
};
