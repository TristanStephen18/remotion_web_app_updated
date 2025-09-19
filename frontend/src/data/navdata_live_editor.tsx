import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ImageIcon from "@mui/icons-material/Image";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
// import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
// import SettingsIcon from "@mui/icons-material/Settings";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TextFieldsSharpIcon from "@mui/icons-material/TextFieldsSharp";
import MusicNoteSharpIcon from "@mui/icons-material/MusicNoteSharp";
import TimerIcon from "@mui/icons-material/Timer";
import TitleIcon from "@mui/icons-material/Title";
import BarChartIcon from "@mui/icons-material/BarChart";
import DataArrayIcon from "@mui/icons-material/DataArray";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import AnimationIcon from "@mui/icons-material/Animation";
import BurstModeIcon from "@mui/icons-material/BurstMode";
import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ForumIcon from "@mui/icons-material/Forum";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import RedditIcon from "@mui/icons-material/Reddit";
// import addtopho
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
// import StartIcon from '@mui/icons-material/Start';
import PanoramaWideAngleIcon from "@mui/icons-material/PanoramaWideAngle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import GridViewIcon from "@mui/icons-material/GridView";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
// import TimerSharpIcon from '@mui/icons-material/TimerSharp';

export const quoteeditornavs = [
  { key: "quote", label: "Quote", icon: <FormatQuoteIcon /> },
  { key: "background", label: "Background", icon: <ImageIcon /> },
  { key: "typography", label: "Typography", icon: <TextFieldsIcon /> },
  {
    key: "ai",
    label: "Ai",
    icon: <AutoAwesomeIcon />,
  },

];

export const typingtemplatenavs = [
  { key: "text", label: "Text", icon: <TextFieldsSharpIcon /> },
  { key: "sound", label: "Sound and Duration", icon: <MusicNoteSharpIcon /> },
  { key: "background", label: "Background", icon: <ImageIcon /> },
  { key: "typography", label: "Typography", icon: <TextFieldsIcon /> },
  // { key: "options", label: "Options", icon: <SettingsIcon /> },
  { key: "export", label: "Export", icon: <FileDownloadIcon /> },
];

export const factCardsnavitems = [
  {
    key: "endpoints",
    label: "Intro and Outro",
    icon: <PanoramaWideAngleIcon />,
  },
  { key: "facts", label: "Facts", icon: <AddToPhotosIcon /> },
  { key: "background", label: "Background", icon: <ImageIcon /> },
  { key: "typography", label: "Typography", icon: <TextFieldsIcon /> },
  { key: "duration", label: "Duration", icon: <TimerIcon /> },
];

export const BarChartNavItems = [
  { key: "title", label: "Title", icon: <TitleIcon /> },
  { key: "data", label: "Data", icon: <DataArrayIcon /> },
  { key: "graph", label: "Bar Graph", icon: <BarChartIcon /> },
  { key: "background", label: "Background", icon: <ImageIcon /> },
];

export const SplitScreenNavs = [
  { key: "upload", label: "Upload video", icon: <CloudUploadIcon /> },
  {
    key: "bottomvid",
    label: "Choose Bottom Video",
    icon: <VideoLibraryIcon />,
  },
  { key: "settings", label: "Video Settings", icon: <VideoSettingsIcon /> },
];

export const KpiFlipCardsNavs = [
  { key: "text", label: "Text", icon: <TextFieldsSharpIcon /> },
  { key: "layout", label: "Layout", icon: <GridViewIcon /> },
  { key: "style", label: "Card Style", icon: <EditSquareIcon /> },
  { key: "data", label: "Card Data", icon: <DataArrayIcon /> },
  { key: "animation", label: "Animation", icon: <AnimationIcon /> },
  { key: "background", label: "Background", icon: <ImageIcon /> },
];

export const KenBurnsNav = [
  { key: "images", label: "Your Images", icon: <BurstModeIcon /> },
  {
    key: "proportions",
    label: "Proportions",
    icon: <PhotoSizeSelectLargeIcon />,
  },
];

export const CurveLineTrendNavs = [
  { key: "text", label: "Title & Subtitle", icon: <TextFieldsSharpIcon /> },
  { key: "data", label: "Data", icon: <DataArrayIcon /> },
  { key: "background", label: "Themes", icon: <DarkModeIcon /> },
  { key: "animation", label: "Animarion & Timing", icon: <AnimationIcon /> },
];

export const FakeTextSideNavs = [
  { key: "messages", label: "Messages", icon: <ForumIcon /> },
  { key: "voice", label: "Voices", icon: <InterpreterModeIcon /> },
  { key: "avatar", label: "Chat Avatars", icon: <AccountCircleIcon /> },
  { key: "display", label: "Theme & Fonts", icon: <DarkModeIcon /> },
  { key: "background", label: "Background Video", icon: <VideoLibraryIcon /> },
  { key: "music", label: "Background Music", icon: <LibraryMusicIcon /> },
];

export const RedditVideoNavs = [
  { key: "post", label: "Reddit Post", icon: <RedditIcon /> },
  { key: "voice", label: "Voices", icon: <InterpreterModeIcon /> },
  { key: "text", label: "Text", icon: <TextFieldsSharpIcon /> },
  { key: "background", label: "Background Video", icon: <VideoLibraryIcon /> },
  { key: "music", label: "Background Music", icon: <LibraryMusicIcon /> },
];

export const StoryTellingNavs = [
  { key: "story", label: "Story", icon: <AutoStoriesIcon /> },
  { key: "voice", label: "Voices", icon: <InterpreterModeIcon /> },
  { key: "text", label: "Text", icon: <TextFieldsSharpIcon /> },
  { key: "background", label: "Background Video", icon: <VideoLibraryIcon /> },
  { key: "music", label: "Background Music", icon: <LibraryMusicIcon /> },
];

export const NewTextTypingNavs = [
  { key: "phrase", label: "Phrase", icon: <TextSnippetIcon /> },
  { key: "fonts", label: "Fonts", icon: <TextFieldsSharpIcon /> },
  { key: "background", label: "Themes", icon: <DarkModeIcon /> },
  { key: "sound", label: "Audio", icon: <LibraryMusicIcon /> },
];
