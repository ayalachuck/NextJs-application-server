import api from './api';
import projects from './projects';
import projectDetail from './projectDetail';
import client from './client';
import portal from './portal';
import invoice from './invoice';
import video from './video';

export default (props) => {
    api(props);
    projects(props);
    projectDetail(props);
    portal(props);
    client(props);
    invoice(props);
    video(props);
};
