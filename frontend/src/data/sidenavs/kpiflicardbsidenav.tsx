import BurstModeIcon from "@mui/icons-material/BurstMode";
import Filter9PlusIcon from "@mui/icons-material/Filter9Plus";
import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import type { NavData } from "../../components/navigations/batchrendering/sidenavs";

export const KenburnsnavItems: NavData[] = [
  { icon: <BurstModeIcon />, label: "Images", key: "images" },
  { icon: <Filter9PlusIcon />, label: "Image Counts", key: "quantity" },
  { icon: <PhotoSizeSelectLargeIcon />, label: "Proportions", key: "proportions" },
  { icon: <ViewModuleIcon />, label: "Batch Outputs", key: "outputs" },
];


