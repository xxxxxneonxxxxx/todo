import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Filter from "./sait/Filter";
import Add from "./sait/Add";
import TasksBar from "./sait/TasksBar";
import reportWebVitals from './reportWebVitals';
import styled from 'styled-components'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const MainContainer = styled.div`
    width: 70%;
    margin-left: 20%;
    margin-top: 5%;
    display: flex;
    flex-direction: column;
    
`
root.render(
  <React.StrictMode>
    <MainContainer>
        <Filter />
        <Add/>
        <TasksBar/>
    </MainContainer>
  </React.StrictMode>
);
reportWebVitals();
