import { getStudy } from "../dicom";
import { getProject } from "../projects";
import { getUserProps } from "../authUsers";
import { list as uploadList } from "../upload";

export default async ({ studyUID = 0 }) => {
  const { ...study } = await getStudy({ studyUID });
  const project = await getProject({ studyUID });
  const uploadedFiles = await uploadList({ studyUID });

  // Merge project and study table
  return {
    ...project,
    ...study,
    studyUID,
    uploadedFiles
  };
};
