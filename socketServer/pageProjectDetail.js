import queryProjectDetail from "../helpers/queryProjectDetail";
import {
  payloadProjectDetail,
  setDefaultList,
  fetchAction,
  setProjectDetailSettings
} from "../actions";
import { getDefaultList } from "../defaults";
import { getSettings } from "../authUsers";

export default async ({
  socket,
  action: { studyUID = "" },
  user: { id: clientID }
}) => {
  const projectDetail = await queryProjectDetail({ studyUID });
  const defaults = await getDefaultList();
  const { projectDetailSettings } = await getSettings(clientID);

  await socket.emit("action", payloadProjectDetail(projectDetail));
  await socket.emit("action", setDefaultList(defaults));
  await socket.emit(
    "action",
    setProjectDetailSettings(projectDetailSettings)
  );

  socket.emit("action", fetchAction(false));
};
