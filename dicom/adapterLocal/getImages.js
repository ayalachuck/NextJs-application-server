import { images } from "./";
import parseRaw from "../parseRaw";

export default async ({ seriesUID }) => {
  return Object.values(images)
    .filter(f => f.seriesUID === seriesUID)
    .sort((a, b) => a.imageNumber - b.imageNumber)
    .map(
      ({
        instanceUID,
        bitsAllocated,
        bitsStored,
        highbit,
        columns,
        rows,
        imageNumber,
        imageOrientation,
        imagePosition,
        pixelAspectRatio,
        pixelSpacing,
        sliceThickness,
        windowCenter,
        windowWidth
      }) => ({
        instanceUID,
        bitsAllocated,
        bitsStored,
        highbit,
        columns,
        rows,
        imageNumber,
        imageOrientation,
        imagePosition,
        pixelAspectRatio,
        pixelSpacing,
        sliceThickness,
        windowCenter,
        windowWidth
      })
    );
};
