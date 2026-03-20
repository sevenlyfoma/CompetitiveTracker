// import { SingleEliminationBracket, DoubleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';

//https://www.npmjs.com/package/@g-loot/react-tournament-brackets

// import { Bracket, RoundProps } from 'react-brackets';
import React from 'react';
import ReactFlow, { Position } from 'reactflow';
import { useParams, useNavigate } from 'react-router-dom';
import 'reactflow/dist/style.css';

import './TournamentBracketPage.css'

function TournamentBracketPage() {


  const navigate = useNavigate();
  const { tournament } = useParams();
      
  
  const tournament_json = JSON.parse(tournament)

  console.log(tournament_json)


  const initialNodes = [
  { id: '1', position: { x: 0, y: 0}, data: { label: 'Match 1' }, sourcePosition: Position.Right, },
  { id: '2', position: { x: 200, y: 200}, data: { label: 'Match 2' },targetPosition: Position.Left, },

  { id: '3', position: { x: 1000, y: 1000}, data: { label: 'Match 2' },targetPosition: Position.Left, },
  ];
  const initialEdges = [{ id: 'e1-2', source: '1', target: '2', type: "step"}];

  const translateLimit = [
    [0, 0],
    [2000, 2000],
  ];


return (
  <div id="hell" style={{ 
    display: 'flex', 
    flexDirection: 'column',
    height: '100vh', 
    width: '100vw', 
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    boxSizing: 'border-box'
  }}>
    
    <div style={{ 
      display: 'flex', 
      flexDirection: 'row',  
      alignItems: 'center', 
      // justifyContent: 'space-between', 
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

    <div style={{ flexGrow: 1, width: '100%' }}>
      <ReactFlow 
      nodes={initialNodes} 
      edges={initialEdges} 
      translateExtent={translateLimit}
      >

        </ReactFlow>
    </div>

  </div>
);
}

export default TournamentBracketPage