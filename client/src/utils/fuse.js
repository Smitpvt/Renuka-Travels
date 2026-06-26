import Fuse from "fuse.js";
import { locations } from "../data/locations.js";

export const fuse = new Fuse(locations, {
  threshold: 0.3,
});