import fs from "fs";
import low from "lowdb";

import { checkExists, path } from './index';

export default  async () => {
  checkExists();
  if (path === undefined) return;

  const db = low(`${path}/projects.json`);
  db.defaults({ projects: [] }).write();
  const projects = db.get("projects").value();

  return projects;
};