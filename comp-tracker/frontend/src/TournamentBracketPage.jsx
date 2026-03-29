// import { SingleEliminationBracket, DoubleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';

//https://www.npmjs.com/package/@g-loot/react-tournament-brackets

// import { Bracket, RoundProps } from 'react-brackets';
import React, {useCallback, useState, useEffect} from 'react';
import ReactFlow, { Position, useReactFlow, ReactFlowProvider, useStore } from 'reactflow';
// import { useViewportHelper } from 'reactflow';
import { useParams, useNavigate } from 'react-router-dom';
import 'reactflow/dist/style.css';

import './TournamentBracketPage.css'



 
const edgeTypes = {};

const BoundaryNode = ({ data }) => {

  const { colorStart = 'red', colorEnd = 'blue', degree = 90, label } = data;
  
  return (
    <div style={{
      width: '100%', 
      height: '100%',
      background: `linear-gradient(${degree}deg, ${colorStart} 0%, ${colorEnd} 100%)`,}}>
    </div>
  );
};

const boundaryBoxes = [
    { id: 'bb-n', type: 'boundary', position: { x: 0, y: 0}, style: { width: 2000, height: 10,}, data: { 
      label: 'North', 
      colorStart: 'red', 
      colorEnd: 'blue', 
      degree: 90
    }},
    { id: 'bb-s', type: 'boundary', position: { x: 0, y: 1900}, style: { width: 2000, height: 10,}, data: { 
      label: 'North', 
      colorStart: 'blue', 
      colorEnd: 'red', 
      degree: 90
    }},
    { id: 'bb-w', type: 'boundary', position: { x: 0, y: 10}, style: { width: 10, height: 1890,}, data: { 
      label: 'North', 
      colorStart: 'red', 
      colorEnd: 'blue', 
      degree: 180
    }},
    { id: 'bb-e', type: 'boundary', position: { x: 1990, y: 10}, style: { width: 10, height: 1890,}, data: { 
      label: 'North', 
      colorStart: 'blue', 
      colorEnd: 'red', 
      degree: 180
    }},
  ]

const nodeTypes = {boundary: BoundaryNode};

function makeNodes(tournament_matches){
  let x = 100
  let y = 100
  let height = 25
  let width = 100
  let nodes =[]
  for (let i = 0; i < tournament_matches.length; i++){
    let match = tournament_matches[i]

    console.log(match)

    let label1 = "n/a";
    let label2 = "n/a";

    if (match.user1 !== null){
      label1 = match.user1.name
    }

    if (match.user2 !== null){
      label2 = match.user2.name
    }



    nodes.push({id: ("match_"+i+"_1"), position: { x: x, y: y}, style: { width: width, height: height}, data: { label: label1 }})
    nodes.push({id: ("match_"+i+"_2"), position: { x: x, y: y+25}, style: { width: width, height: height}, data: { label: label2 }})
  
    y += 100
  }

  return nodes
}

const initialNodes = [];

function find_canvas_size(tournament_matches){
  let level_1_match_count = 0;
  let highest_level = 1;
  
  for (let i = 0; i < tournament_matches.length; i++){
      let match = tournament_matches[i]

    if (match.matchNumber < 2) {
      level_1_match_count += 1;
    }

    if (match.matchNumber > highest_level) {
      highest_level = match.matchNumber;
    }
  }

  l

  height = level_1_match_count * 300
  width = highest_level * 500

  return (height, width)


}


function TournamentBracketPageInner() {


  const navigate = useNavigate();
  const { tournament } = useParams();
      
  
  const tournament_json = JSON.parse(tournament)


  const [tournamentMatchList, setTournamentMatchList] = useState([]);
  
  const fetchMatches = async () => {
      try {
          const response = await fetch(`/api/tournament_matches/${tournament_json.id}`);
          if (!response.ok){
              throw new Error(`Server responded with status: ${response.status}`)
          }
          const matchesJson = await response.json();
          console.log(matchesJson);
          setTournamentMatchList(matchesJson);


      } catch (error) {
          console.error('Error fetching data:', error);
          setUser({}) ;
      }
  }

  useEffect(() => {
      fetchMatches();
  }, []);

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


  const matchNodes = makeNodes(tournamentMatchList);

  const totalNodes = initialNodes.concat(boundaryBoxes).concat(matchNodes)

  const initialEdges = [{ id: 'e1-2', source: '1', target: '2', type: "step"}];

  const translateLimit = [
    [-1000, -1000],
    [2300, 2300],
  ];


return (
  
  <div style={{ height: '100vh', width: '100vw', }}>

    <div style={{ width: '100%', height: '100%' }}>
        <ReactFlow 
          nodes = {totalNodes} 
          edges={initialEdges} 
          translateExtent={translateLimit}
          onMove={handleMove}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          minZoom={0.1}
          ></ReactFlow>
    </div>

  </div>

);
}

function TournamentBracketPage() {

  const { tournament } = useParams();

  return (
   <ReactFlowProvider>
      <TournamentBracketPageInner tournament={tournament}/>


   </ReactFlowProvider> 
  )
      

}



export default TournamentBracketPage



/* 
<div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    height: '100vh', 
    width: '100vw', 
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    boxSizing: 'border-box',
  }}>
    
    <div style={{ 
      display: 'flex', 
      flexDirection: 'row',  
      alignItems: 'center', 
      justifyContent: 'left',
      gap: '20px',
      height: '10vh', 
      padding: '0 20px',
      // backgroundColor: '#f8f9fa',
      boxSizing: 'border-box'
    }}>
      
      <h1 style={{ 
        margin: 0, 
        fontSize: '1.5rem' 
      }}>
        Bracket for {tournament_json.tournamentName}
      </h1>

      <button style={{ 
        height: '5vh',   
        padding: '0 15px',
        cursor: 'pointer',
        // backgroundColor: '#007bff',
        // color: 'white',
        // border: 'none',
        // borderRadius: '4px'
      }} onClick={() => navigate(`/tournaments`)}>
        Back
      </button>
    </div>

    <div style={{ flexGrow: 1, width: '100%', height: '100%' }}>
        <ReactFlow 
          nodes = {totalNodes} 
          edges={initialEdges} 
          translateExtent={translateLimit}
          onMove={handleMove}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          minZoom={0.1}
          ></ReactFlow>
    </div>

  </div>
*/