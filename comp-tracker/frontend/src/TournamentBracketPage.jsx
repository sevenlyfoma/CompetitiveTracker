// import { SingleEliminationBracket, DoubleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';

//https://www.npmjs.com/package/@g-loot/react-tournament-brackets

// import { Bracket, RoundProps } from 'react-brackets';
import React from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';

function TournamentBracketPage() {
  const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Match 1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Match 2' } },
  ];
  const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

  return (
    <>
    <h1>Hello</h1>
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} />
    </div>
    </>
  );
}

export default TournamentBracketPage