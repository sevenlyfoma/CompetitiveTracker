// import { SingleEliminationBracket, DoubleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';

//https://www.npmjs.com/package/@g-loot/react-tournament-brackets

// import { Bracket, RoundProps } from 'react-brackets';
import React, {useCallback, useState, useEffect} from 'react';
import ReactFlow, { Position, useReactFlow, ReactFlowProvider, useStore, Handle } from 'reactflow';
// import { useViewportHelper } from 'reactflow';
import { useParams, useNavigate, redirect } from 'react-router-dom';
import 'reactflow/dist/style.css';

import './TournamentBracketPage.css'


//TODO logic for resolving tournament matches
 
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

const MatchUserNode = ({ data }) => {
  const navigate = useNavigate();

  const {match, showLeftHandle, showRightHandle} = data;

  let label1 = "n/a";
  let label2 = "n/a";
  if (match.user1 !== null){label1 = match.user1.name}
  if (match.user2 !== null){label2 = match.user2.name}

  let user1BgColor = null;
  let user2BgColor = null;

  if (match?.matchRecord != null){
    if (match?.matchRecord?.winner?.id == match?.user1?.id){
      user1BgColor = "lightgreen";
      user2BgColor = "red";
    }
    else {
      user1BgColor = "red";
      user2BgColor = "lightgreen";
    }
  }


  return (
    <div className="matchUserNodeOuter" style={{width: '100%', height: '100%',}}>
      <button 
        style={{width: '20%', height: '100%',}} 
        onClick={() => navigate(`/tournaments/matches/${match.tournament.id}/${match.id}`)}>

      </button>
      
      <div className="matchUserNodeDiv" style={{width: '80%', height: '100%',}}>
        
        {showLeftHandle && (<Handle className='matchUserNodeHandle' type="target" position={Position.Left} />)}
        
        <div className="matchUserNodeInner" style={{width: '100%', height: '50%', backgroundColor: user1BgColor}}>
          <p>{label1}</p>
        </div>

        <div className="matchUserNodeInner" style={{width: '100%', height: '50%', backgroundColor: user2BgColor}}>
          <p>{label2}</p>
        </div>
        
        {showRightHandle && (<Handle className='matchUserNodeHandle' type="source" position={Position.Right} />)}
      </div>
    </div>
  );
};

const nodeTypes = {boundary: BoundaryNode, matchUser: MatchUserNode};

function makeNodes(tournament_matches, canvasDimensions){

  const {width, height} = canvasDimensions;

  let topMatch = tournament_matches[0];

  let nodesAndEdges = makeNodesRecursive(topMatch, 0, height, width-200)

  return nodesAndEdges
}

function makeNodesRecursive(match, minY, maxY, x){


  if (match !== undefined && match !== null){

    let nodes =[]
    let edges = []
  
    let height = 25
    let width = 100

    let nx = x;
    // console.log(match);
    if (match.inheritsParentMatch1Winner == false || match.inheritsParentMatch2Winner == false) {nx += 50;}
    let y = ((minY + maxY) / 2)

    let node_id = "match_"+match.id
    nodes.push({id: node_id, type: 'matchUser', position: { x: nx, y: y-25}, style: { width: width, height: height*2}, data: { match: match, showLeftHandle: true, showRightHandle: true }})
    
    let topNodesAndEdges = {nodes: [], edges: []};
    let botNodesAndEdges = {nodes: [], edges: []};
    if (match.inheritsParentMatch1Winner == true) {
      topNodesAndEdges = makeNodesRecursive(match.parentMatch1, minY, y, x - 200)
    }
    if (match.inheritsParentMatch2Winner == true) {
      botNodesAndEdges = makeNodesRecursive(match.parentMatch2, y, maxY, x - 200)
    }

    if (match.parentMatch1 !== null){
      let parent1_node_id = "match_"+match.parentMatch1.id
      let col = match.inheritsParentMatch1Winner == true ? 'green' : 'red';
      edges.push({id: "e-"+match.parentMatch1.id+"-"+match.id, source: parent1_node_id, target: node_id, type: "step", style : {stroke: col, namestrokeWidth: 5,},})
    }
    if (match.parentMatch2 !== null){
      let parent2_node_id = "match_"+match.parentMatch2.id
      let col = match.inheritsParentMatch2Winner == true ? 'green' : 'red';
      edges.push({id: "e-"+match.parentMatch2.id+"-"+match.id, source:parent2_node_id, target: node_id, type: "step", style : {stroke: col, namestrokeWidth: 5,},})
    }
    


    return {nodes: nodes.concat(topNodesAndEdges.nodes).concat(botNodesAndEdges.nodes), edges: edges.concat(topNodesAndEdges.edges).concat(botNodesAndEdges.edges)}
  }

  
 


  return {nodes: [], edges: []};
}

const initialNodes = [];

function find_tourney_depth(match){
  //ONLY ONE PARENT = DONT COUNT THE DEPTH???

  if (match !== undefined && match !== null){
    if (match.parentMatch1 == null && match.parentMatch2 == null){
      return 1;
    }
    else{
      //Hack to avoid double counting of depth on double elim brackets
      if (match.inheritsParentMatch1Winner == false || match.inheritsParentMatch2Winner == false){
        return 0
      }
      let p1Depth = find_tourney_depth(match.parentMatch1)
      let p2Depth = find_tourney_depth(match.parentMatch2)

      if (p1Depth >= p2Depth){
        return p1Depth + 1;
      }
      else {
        return p2Depth + 1;
      }
    }
  }
  return 0;
}

function find_canvas_size(tournament_matches, setCanvasDimensions){

  let topMatch = tournament_matches[0];

  let depth = find_tourney_depth(topMatch);

  // console.log("depth: " + depth)

  let maxBotMatches = 2 ** (depth - 1)

  let dimensions = {height: 100 + 100 * maxBotMatches, width: 100 + 200 * depth};

  // console.log("dimensions {height : " + dimensions.height + ", width : " + dimensions.width + "}")
  //return dimensions
  setCanvasDimensions(dimensions)
}

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


function TournamentBracketPageInner() {


  const navigate = useNavigate();
  const { tournamentID } = useParams();
      

  const [tournamentMatchList, setTournamentMatchList] = useState([]);
  const [tournament, setTournament] = useState({})

  // const [matchNodes, setMatchNodes] = useState([]);
  
  const fetchMatches = async () => {
      try {
          console.log("fetch Matches")
          const response = await fetch(`/api/tournament_matches/top/${tournamentID}`);
          if (!response.ok){
              throw new Error(`Server responded with status: ${response.status}`)
          }
          const matchesJson = await response.json();
          console.log(matchesJson);
          setTournamentMatchList(matchesJson);

          const response2 = await fetch(`/api/tournaments/${tournamentID}`);
          if (!response2.ok){
              throw new Error(`Server responded with status: ${response2.status}`)
          }
          const tournamentJson = await response2.json();
          console.log(tournamentJson);
          setTournament(tournamentJson);


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


  // useEffect(() => {
  //   if (tournamentMatchList.length > 0) {
  //     window.requestAnimationFrame(() => {
  //       setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 0 });
  //     });
  //   }
  // }, [tournamentMatchList, setViewport]);


   

  const initialEdges = [];

  const [canvasDimensions, setCanvasDimensions] = useState({width: 4000, height: 4000})

  useEffect(() => {
    find_canvas_size(tournamentMatchList, setCanvasDimensions)
  }, [tournamentMatchList]);

  const matchNodesAndEdges = makeNodes(tournamentMatchList, canvasDimensions);

  const boundaryBoxes = create_boundary_boxes(canvasDimensions);

  const totalNodes = initialNodes.concat(boundaryBoxes).concat(matchNodesAndEdges.nodes)

  const totalEdges = initialEdges.concat(matchNodesAndEdges.edges)

  const translateLimit = [
    [-1000, -1000],
    [canvasDimensions.width, canvasDimensions.height],
  ];


return (
  <div className='TournamentBracketPageOuterDiv'>
    
    <div className='TournamentBracketPageTitleDiv' >
      
      <h1>
        Bracket for {tournament.tournamentName}
      </h1>

      <button onClick={() => navigate(`/tournaments`)}>
        Back
      </button>
    </div>

    <div className='TournamentBracketPageCanvasDiv' style={{  }}>
        <ReactFlow 
          nodes = {totalNodes} 
          edges={totalEdges} 
          translateExtent={translateLimit}
          onMove={handleMove}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          // minZoom={0.1}
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