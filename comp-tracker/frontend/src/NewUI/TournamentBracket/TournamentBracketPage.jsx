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

function makeNodes(topMatch, canvasDimensions){

    const {width, height} = canvasDimensions;

    let nHeight = height;

    let {nodes, edges, lossLinkMarks, roundTitlesAndPositions} = makeNodesRecursive(topMatch, roundLabelHeight, nHeight, width-200, topMatch?.tournament?.style, 0, 0)

    const seen = new Set();

    const uniqueTitlesAndPositions = roundTitlesAndPositions.filter(item => {
    // Create a unique key for the pair
    const key = `${item.title}|${item.positionX}`;
    
        if (seen.has(key)) {
        return false;
        } else {
        seen.add(key); 
        return true; 
    }
    });

    for (let i = 0; i < uniqueTitlesAndPositions.length; i++){
        let item  = uniqueTitlesAndPositions[i];

        nodes.push({id: "title_"+item.title, type: 'roundTitle', position: { x: item.positionX, y: item.positionY}, style: { width: 100, height: 100}, data: { roundTitle: item.title }})



    }

    let lossNodes = [];

    for (let i = 0; i < lossLinkMarks.length; i++) {
        let mark = lossLinkMarks[i].id;
        let match = lossLinkMarks[i].match;

        let id = "match_"+mark

        let node = nodes.find(x => {return x.id === id})

        let lossNodeId = "sendLoss"+node.id;
        let lossNode = {id: lossNodeId, type: 'loss', position: { x: node.position.x+160, y: node.position.y+12.5}, style: { width: 25, height: 25}, data: { label: match.matchNumber, showLeftHandle: true }}
        edges.push({id: "e-"+lossNodeId+"-"+node.id, target: node.id, source: lossNodeId, type: "step", style : {stroke: "red", strokeWidth: 3,},})
        lossNodes.push(lossNode);
    }

    return {nodes: nodes.concat(lossNodes), edges: edges}
}

function makeNodesRecursive(match, minY, maxY, x, style, depth, titleY){

  if (match !== undefined && match !== null){

    let nodes =[]
    let edges = []
    let lossLinkMarks = []
    let roundTitlesAndPositions = []

    roundTitlesAndPositions.push({title: match.matchTitle, positionX: x, positionY: titleY})
    
    let height = 25
    let width = 100

    let nx = x;

    let splitpoint = 0.5;
    if (match.inheritsParentMatch1Winner == true && match.inheritsParentMatch2Winner == true){
      splitpoint = match.parentMatch1.height / (match.parentMatch1.height + match.parentMatch2.height)
    }
    
    


    let y = minY + ((maxY -minY) * splitpoint)

    let node_id = "match_"+match.id
    nodes.push({id: node_id, type: 'matchUser', position: { x: nx, y: y-25}, style: { width: width, height: height*2}, data: { match: match, showLeftHandle: true, showRightHandle: true }})
    
    
    let topNodesAndEdges = {nodes: [], edges: [], lossLinkMarks: [], roundTitlesAndPositions : []};
    let botNodesAndEdges = {nodes: [], edges: [], lossLinkMarks: [], roundTitlesAndPositions : []};


    let nMinY = minY;
    let nMaxY = maxY
    
    if (match.inheritsParentMatch1Winner == true){
      nMinY = y;
    }
    if (match.inheritsParentMatch2Winner == true){
      nMaxY = y;
    }

    let topnx = x - 200;
    let botnx = x - 200

    let nTitleY = titleY;

    if(match.matchNumber == 0 && style === "double"){
      let p1Depth = match.parentMatch1.depth;
      let p2Depth = match.parentMatch2.depth;
      if (p2Depth > p1Depth)  {
           topnx -= (p2Depth - p1Depth) * 200
      } 
      if (p1Depth > p2Depth) {
        botnx -= (p1Depth - p2Depth) * 200
      }

      nMinY += roundLabelHeight * (1-splitpoint)
      nMaxY -= roundLabelHeight * splitpoint

      nTitleY = nMaxY
     
    }
    
    if (match.inheritsParentMatch1Winner == true) {
      topNodesAndEdges = makeNodesRecursive(match.parentMatch1, minY, nMaxY, topnx, style, depth +1, titleY)
    }
    if (match.inheritsParentMatch2Winner == true) {
      botNodesAndEdges = makeNodesRecursive(match.parentMatch2, nMinY, maxY, botnx, style, depth +1, nTitleY)
    }

    let lossNodes = []

    
    if (match.parentMatch1 !== null){
      let parent1_node_id = "match_"+match.parentMatch1.id
      let col = match.inheritsParentMatch1Winner == true ? 'green' : 'red';
      if (match.inheritsParentMatch1Winner == true) {
        edges.push({id: "e-"+match.parentMatch1.id+"-"+match.id,  data: {dist:50}, target: parent1_node_id, source: node_id, type: "fcddse", style : {stroke: col, strokeWidth: 3,},})
      }
      else if (match.inheritsParentMatch1Winner == false){
        let lossNodeId = "receiveLoss1"+node_id;
        let receiveLossNode = {id: lossNodeId, type: 'loss', position: { x: nx-75, y: y-40}, style: { width: 25, height: 25}, data: { label: match.parentMatch1.matchNumber, showRightHandle: true }}
        edges.push({id: "e-"+lossNodeId+"-"+match.id, target: lossNodeId, source: node_id, type: "step", style : {stroke: col, strokeWidth: 3,},})
        lossNodes.push(receiveLossNode);

        lossLinkMarks.push({id: match.parentMatch1.id, match: match.parentMatch1});
      }
    }
    if (match.parentMatch2 !== null){
      let parent2_node_id = "match_"+match.parentMatch2.id
      let col = match.inheritsParentMatch2Winner == true ? 'green' : 'red';
      if (match.inheritsParentMatch2Winner == true) {
        edges.push({id: "e-"+match.parentMatch2.id+"-"+match.id, data: {dist:50} , target:parent2_node_id, source: node_id, type: "fcddse", style : {stroke: col, strokeWidth: 3,},})
      }
      else if (match.inheritsParentMatch2Winner == false){
        let lossNodeId = "receiveLoss2"+node_id;
        let receiveLossNode = {id: lossNodeId, type: 'loss', position: { x: nx-75, y: y+15}, style: { width: 25, height: 25}, data: { label: match.parentMatch2.matchNumber, showRightHandle: true }}
        edges.push({id: "e-"+lossNodeId+"-"+match.id, target: lossNodeId, source: node_id, type: "step", style : {stroke: col, strokeWidth: 3,},})
        lossNodes.push(receiveLossNode);

        lossLinkMarks.push({id: match.parentMatch2.id, match: match.parentMatch2});
      }
    } 

    return {
      nodes: nodes.concat(topNodesAndEdges.nodes).concat(botNodesAndEdges.nodes).concat(lossNodes), 
      edges: edges.concat(topNodesAndEdges.edges).concat(botNodesAndEdges.edges),
      lossLinkMarks: lossLinkMarks.concat(topNodesAndEdges.lossLinkMarks).concat(botNodesAndEdges.lossLinkMarks),
      roundTitlesAndPositions: roundTitlesAndPositions.concat(topNodesAndEdges.roundTitlesAndPositions).concat(botNodesAndEdges.roundTitlesAndPositions)
    }
  }

  
 


  return {nodes: [], edges: [], lossLinkMarks: [], roundTitlesAndPositions: []};
}

function find_canvas_size(setCanvasDimensions, topMatch){
    let height = topMatch?.height;
    let depth = topMatch?.depth;

    let bracketNo = 1;
    if (topMatch?.tournament?.style === "double") {bracketNo = 2;}

    let dimensions = {height: 100 + (100 * height) + (bracketNo * roundLabelHeight), width: 100 + 200 * depth};

    setCanvasDimensions(dimensions)

}

function appendDimensions(match){
    if (match === undefined || match === null){
        return null;
    }

    if (match.parents[0]?.parentMatch == null && match.parents[1].parentMatch == null
        ||match.parents[0]?.inheritsParentMatchWinner != true && match.parents[1]?.inheritsParentMatchWinner != true
    ){
        match.height = 1;
        match.depth = 1;
        return match;
    }

    let totalHeight = 0;
    let greatestDepth = 0;
    for (let i = 0; i < match.parents?.length; i++){
        if (match.parents[i]?.inheritsParentMatchWinner == true){
            parent = appendDimensions(match.parents[i]?.parentMatch)
            if (parent != null){
                if (parent.depth > greatestDepth){
                    greatestDepth = parent.depth;
                } 
                totalHeight += parent.height;
            }
        }
    }



    match.height = totalHeight;
    match.depth = greatestDepth + 1;

    return match;
}

function TournamentBracketPageInner({selectedTournament}) {
    const [canvasDimensions, setCanvasDimensions] = useState({width: 4000, height: 4000})

    const [topTournamentMatchRaw, setTopTournamentMatchRaw] = useState(null);

    const [topTournamentMatch, setTopTournamentMatch] = useState(null);

    useEffect(() => {fetchData(`/api/tournament_matches/top/${selectedTournament.id}`, setTopTournamentMatchRaw);}, [selectedTournament]);

    useEffect(() => {
        let appended = appendDimensions(topTournamentMatchRaw);
        console.log(appended)
        setTopTournamentMatch(appended)
    
    }, [topTournamentMatchRaw]);

    useEffect(() => {find_canvas_size(setCanvasDimensions, topTournamentMatch)}, [topTournamentMatch]);

    useEffect(() => {console.log(canvasDimensions)}, [canvasDimensions]);

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