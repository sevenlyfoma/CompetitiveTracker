import React, {useCallback, useState, useEffect} from 'react';
import ReactFlow, { Position, useReactFlow, ReactFlowProvider, useStore, Handle } from 'reactflow';
import { useParams, useNavigate, redirect } from 'react-router-dom';
import 'reactflow/dist/style.css';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Stack from '@mui/material/Stack';

import Typography from '@mui/material/Typography';

import BoundaryNode from './CustomNodesEdges/BoundaryNode';
import MatchNode from './CustomNodesEdges/MatchNode';
import LossNode from './CustomNodesEdges/LossNode';
import RoundTitleNode from './CustomNodesEdges/RoundTitleNode';
import FirstCornerDefinedDistanceStepEdge from './CustomNodesEdges/FirstCornerDefinedDistanceStepEdge';

import {fetchData, sendData} from '../../helpers/Fetcher';

const nodeTypes = {boundary: BoundaryNode, matchUser: MatchNode, loss: LossNode, roundTitle: RoundTitleNode};
const edgeTypes = {fcddse: FirstCornerDefinedDistanceStepEdge};

const roundLabelHeight = 100;

function create_boundary_boxes(canvasDimensions){

    const {width, height} = canvasDimensions;

    let boundaryBoxes = [
        { id: 'bb-n', type: 'boundary', position: { x: 0, y: 0}, style: { width: width, height: 10,}, data: { 
            label: 'North', 
            colorStart: 'red', 
            colorEnd: 'blue', 
            degree: 90
        }},
        { id: 'bb-s', type: 'boundary', position: { x: 0, y: height-10}, style: { width: width, height: 10,}, data: { 
            label: 'North', 
            colorStart: 'blue', 
            colorEnd: 'red', 
            degree: 90
        }},
        { id: 'bb-w', type: 'boundary', position: { x: 0, y: 10}, style: { width: 10, height: height-10,}, data: { 
            label: 'North', 
            colorStart: 'red', 
            colorEnd: 'blue', 
            degree: 180
        }},
        { id: 'bb-e', type: 'boundary', position: { x: width-10, y: 10}, style: { width: 10, height: height-10,}, data: { 
            label: 'North', 
            colorStart: 'blue', 
            colorEnd: 'red', 
            degree: 180
        }},
    ]

    return boundaryBoxes
}

function find_canvas_size(setCanvasDimensions, topTournamentMatch){
    setCanvasDimensions({width: 400, height: 400})
}

function TournamentBracketPageInner({selectedTournament}) {
    const [canvasDimensions, setCanvasDimensions] = useState({width: 4000, height: 4000})

    const [topTournamentMatch, setTopTournamentMatch] = useState(null);

    useEffect(() => {fetchData(`/api/tournament_matches/top/${selectedTournament.id}`, setTopTournamentMatch);}, []);

    useEffect(() => {find_canvas_size(setCanvasDimensions, topTournamentMatch)}, [topTournamentMatch]);

    const boundaryBoxes = create_boundary_boxes(canvasDimensions);

    const initialNodes = [];

    const totalNodes = initialNodes.concat(boundaryBoxes)

    const translateLimit = [
        [-1000, -1000],
        [canvasDimensions.width, canvasDimensions.height],
    ];

    const { setViewport, getViewport } = useReactFlow();
      
    const handleMove = useCallback((event, viewport) => {
        if (viewport.y > 0) {
            setViewport(
            { ...viewport, y: 0 }, 
            { duration: 0 }
            );
        }
        if (viewport.x > 0) {
            setViewport(
            { ...viewport, x: 0 }, 
            { duration: 0 }
            );
        }
    }, [setViewport]);


    return (
        <Stack sx={{gap: 2, display: 'flex', bgcolor: 'blue', flexGrow: 1}}>

        <h2>Bracket for {selectedTournament.tournamentName}</h2>

        <ReactFlow 
            style={{ display: 'flex', flexGrow: 1, backgroundColor: '#ffffff' }}
            nodes={totalNodes}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            translateExtent={translateLimit}
            onMove={handleMove}
        ></ReactFlow>
        
        </Stack>
    )

}

function TournamentBracketPage({selectedTournament}) {

    return (
        <ReactFlowProvider>
            <TournamentBracketPageInner selectedTournament={selectedTournament}/>
        </ReactFlowProvider>
    )
}

export default TournamentBracketPage