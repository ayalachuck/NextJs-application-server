import socketio from 'socket.io';
import projectState from './projectState';
import selectSeries from './selectSeries';
import selectStudy from './selectStudy';
import renderFrame from './renderFrame';
import renderDone from './renderDone';
import renderAudio from './renderAudio';
import { queryProject } from '../projects';

// TODO Works but clean this up somehow
const socketActions = {
  projectState,
  selectSeries,
  selectStudy,
  renderFrame,
  renderDone,
  renderAudio,
};

// TODO Handle internal state changes
// Implement Redux?
export default ({ server, passport, sessionMiddleWare = () => {} }) => {
  const io = socketio.listen(server);

  // Pass down session from passportjs
  io.use((socket, next) => sessionMiddleWare(socket.request, {}, next));

  // Handle socket connections
  io.on("connection", socket => {
    console.log("Connection " + socket.id);

    const { request: { session: { passport: { user } = {} } = {} } = {} } = socket;
    console.log('Socket user', user);

    // This validates user session
    // TODO Might be a more clean way to handle this
    if (user === undefined) {
      return;
    }

    // This is used for the frontend of the application
    socket.on("action", async ({ type, ...action }) => {
      const parseType = type.replace(/^(server\/)/, ""); // TODO Do we really need this. Can just leave in and rename functions?
      console.log("action.type", parseType);

      // TODO additional security check here for user at some point
      const { [parseType]: socketAction = () => { } } = socketActions;

      // TODO Handle with a return value instead
      await socketAction({ socket, action });
    });

    socket.on("disconnect", error => {
      console.log("Disconnect " + socket.id, error);
    });
  });

  return io;
};