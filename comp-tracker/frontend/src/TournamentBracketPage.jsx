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

const LossNode = ({data}) =>{
  const {label, showLeftHandle=false, showRightHandle=false} = data;
  // console.log("lossnode: " + label)
  return (
  <div className="lossNode" style={{width: '100%', height: '100%',}}>
    {showLeftHandle && (<Handle className='matchUserNodeHandle' type="target" position={Position.Left} />)}

    <p>{label}</p>

    {showRightHandle && (<Handle className='matchUserNodeHandle' type="source" position={Position.Right} />)}
  </div>)
}

const nodeTypes = {boundary: BoundaryNode, matchUser: MatchUserNode, loss: LossNode};

function makeNodes(topMatch, canvasDimensions){

  // console.log("topmatchL:")
  // console.log(topMatch)

  const {width, height} = canvasDimensions;

  // console.log("height " + height)

  let {nodes, edges, lossLinkMarks} = makeNodesRecursive(topMatch, 0, height, width-200, topMatch?.tournament?.style, 0)

  let lossNodes = [];

  for (let i = 0; i < lossLinkMarks.length; i++) {
    let mark = lossLinkMarks[i].id;
    let match = lossLinkMarks[i].match;

    let id = "match_"+mark

    let node = nodes.find(x => {return x.id === id})

    let lossNodeId = "sendLoss"+node.id;
    let lossNode = {id: lossNodeId, type: 'loss', position: { x: node.position.x+160, y: node.position.y+12.5}, style: { width: 25, height: 25}, data: { label: match.matchNumber, showLeftHandle: true }}
    edges.push({id: "e-"+lossNodeId+"-"+node.id, source: node.id, target: lossNodeId, type: "step", style : {stroke: "red", strokeWidth: 3,},})
    lossNodes.push(lossNode);
  }

  return {nodes: nodes.concat(lossNodes), edges: edges}
}

function makeNodesRecursive(match, minY, maxY, x, style, depth){

  // console.log(match)


  if (match !== undefined && match !== null){

    let nodes =[]
    let edges = []
    let lossLinkMarks = []
  
    let height = 25
    let width = 100

    let nx = x;
    // console.log(match);
    // if (match.inheritsParentMatch1Winner == false || match.inheritsParentMatch2Winner == false) {nx += 50;}

    let splitpoint = 0.5;
    if (match.inheritsParentMatch1Winner == true && match.inheritsParentMatch2Winner == true){
      splitpoint = match.parentMatch1.height / (match.parentMatch1.height + match.parentMatch2.height)
    }
    // console.log("Split-point: " + splitpoint)
    
    


    let y = minY + ((maxY -minY) * splitpoint)

    // console.log(match.id + " " + minY + " " + maxY + " " + splitpoint + " " + y)

    let node_id = "match_"+match.id
    nodes.push({id: node_id, type: 'matchUser', position: { x: nx, y: y-25}, style: { width: width, height: height*2}, data: { match: match, showLeftHandle: true, showRightHandle: true }})
    
    
    
    let topNodesAndEdges = {nodes: [], edges: [], lossLinkMarks: []};
    let botNodesAndEdges = {nodes: [], edges: [], lossLinkMarks: []};


    //Makes it so if only one parent is a winner, then we dont brach, we draw in a straight line
    let nMinY = minY;
    let nMaxY = maxY
    
    if (match.inheritsParentMatch1Winner == true){
      nMinY = y;
    }
    if (match.inheritsParentMatch2Winner == true){
      nMaxY = y;
    }

    // if (match.id == 46){console.log(nMinY + " " + nMaxY)}

    
    
    if (match.inheritsParentMatch1Winner == true) {
      topNodesAndEdges = makeNodesRecursive(match.parentMatch1, minY, nMaxY, x - 200, style, depth +1)
    }
    if (match.inheritsParentMatch2Winner == true) {
      botNodesAndEdges = makeNodesRecursive(match.parentMatch2, nMinY, maxY, x - 200, style, depth +1)
    }

    let lossNodes = []

    if (match.parentMatch1 !== null){
      let parent1_node_id = "match_"+match.parentMatch1.id
      let col = match.inheritsParentMatch1Winner == true ? 'green' : 'red';
      if (match.inheritsParentMatch1Winner == true) {
        edges.push({id: "e-"+match.parentMatch1.id+"-"+match.id, source: parent1_node_id, target: node_id, type: "step", style : {stroke: col, strokeWidth: 3,},})
      }
      else if (match.inheritsParentMatch1Winner == false){
        let lossNodeId = "receiveLoss1"+node_id;
        let receiveLossNode = {id: lossNodeId, type: 'loss', position: { x: nx-75, y: y-40}, style: { width: 25, height: 25}, data: { label: match.parentMatch1.matchNumber, showRightHandle: true }}
        edges.push({id: "e-"+lossNodeId+"-"+match.id, source: lossNodeId, target: node_id, type: "step", style : {stroke: col, strokeWidth: 3,},})
        lossNodes.push(receiveLossNode);

        lossLinkMarks.push({id: match.parentMatch1.id, match: match.parentMatch1});
      }
    }
    if (match.parentMatch2 !== null){
      let parent2_node_id = "match_"+match.parentMatch2.id
      let col = match.inheritsParentMatch2Winner == true ? 'green' : 'red';
      if (match.inheritsParentMatch2Winner == true) {
        edges.push({id: "e-"+match.parentMatch2.id+"-"+match.id, source:parent2_node_id, target: node_id, type: "step", style : {stroke: col, strokeWidth: 3,},})
      }
      else if (match.inheritsParentMatch2Winner == false){
        let lossNodeId = "receiveLoss2"+node_id;
        let receiveLossNode = {id: lossNodeId, type: 'loss', position: { x: nx-75, y: y+15}, style: { width: 25, height: 25}, data: { label: match.parentMatch2.matchNumber, showRightHandle: true }}
        edges.push({id: "e-"+lossNodeId+"-"+match.id, source: lossNodeId, target: node_id, type: "smoothstep", style : {stroke: col, strokeWidth: 3,},})
        lossNodes.push(receiveLossNode);

        lossLinkMarks.push({id: match.parentMatch2.id, match: match.parentMatch2});
      }
    } 
      
  
    // console.log(lossLinkMarks)
    


    return {
      nodes: nodes.concat(topNodesAndEdges.nodes).concat(botNodesAndEdges.nodes).concat(lossNodes), 
      edges: edges.concat(topNodesAndEdges.edges).concat(botNodesAndEdges.edges),
      lossLinkMarks: lossLinkMarks.concat(topNodesAndEdges.lossLinkMarks).concat(botNodesAndEdges.lossLinkMarks)
    
    }
  }

  
 


  return {nodes: [], edges: [], lossLinkMarks: []};
}

const initialNodes = [];

function find_tourney_height(match){
  if (match !== undefined && match !== null){
    if (match.parentMatch1 == null && match.parentMatch2 == null
      ||match.inheritsParentMatch1Winner == false && match.inheritsParentMatch2Winner == false
    ){
      match.height = 1;
      return match;
    }
    else{
      let p1 = find_tourney_height(match.parentMatch1);
      let p2 = find_tourney_height(match.parentMatch2);

      let p1HD;
      let p2HD;

      if (p1 == null){
        p1HD = 0;
      }
      else{
        p1HD = p1.height;
      }

      if (p2 == null){
        p2HD = 0;
      }
      else{
        p2HD = p2.height;
      }


      if (match.inheritsParentMatch1Winner == false){
        p1HD = 0;
      }
      if (match.inheritsParentMatch2Winner == false){
        p2HD = 0;
      }



      match.height = p1HD + p2HD;

      return match


    }
  }


  return null;
}

function find_tourney_depth(match){
  //ONLY ONE PARENT = DONT COUNT THE DEPTH???

  if (match !== undefined && match !== null){
    if (match.parentMatch1 == null && match.parentMatch2 == null){
      return 1;
    }
    else{
      //Hack to avoid double counting of depth on double elim brackets
      // if (match.inheritsParentMatch1Winner == false || match.inheritsParentMatch2Winner == false){
      //   return 0
      // }
      let p1Depth = find_tourney_depth(match.parentMatch1)
      let p2Depth = find_tourney_depth(match.parentMatch2)
      if (match.inheritsParentMatch1Winner == false){
        p1Depth = 0;
      }
      if (match.inheritsParentMatch2Winner == false){
        p2Depth = 0;
      }

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

function find_canvas_size(topMatch, setCanvasDimensions, setTopTournamentMatch){

  let depth = find_tourney_depth(topMatch); //Added 2 to see a graph TODO FIX
  // console.log("Find tourney height:")
  // let newTopMatch = find_tourney_height(topMatch);

  // console.log("Height:" + newTopMatch?.height)

  // console.log("depth: " + depth)

  let height = topMatch?.height;

  let maxBotMatches = 2 ** (depth - 1)
  let dimensions = {height: 100 + 100 * height, width: 100 + 200 * depth};

  // let dimensions = {height: 100 + 100 * maxBotMatches, width: 100 + 400 * depth};

  // console.log("dimensions {height : " + dimensions.height + ", width : " + dimensions.width + "}")
  //return dimensions
  // setTopTournamentMatch([newTopMatch])
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
      

  const [topTournamentMatch, setTopTournamentMatch] = useState(null);
  const [tournament, setTournament] = useState({})

  // const [matchNodes, setMatchNodes] = useState([]);
  
  const fetchMatches = async () => {
      try {
          // console.log("fetch Matches")
          const response = await fetch(`/api/tournament_matches/top/${tournamentID}`);
          if (!response.ok){
              throw new Error(`Server responded with status: ${response.status}`)
          }
          const topMatchJson = await response.json();
          // console.log(matchesJson);

          let newTopMatch = find_tourney_height(topMatchJson);

          // console.log(newTopMatch);



          setTopTournamentMatch(newTopMatch);

          const response2 = await fetch(`/api/tournaments/${tournamentID}`);
          if (!response2.ok){
              throw new Error(`Server responded with status: ${response2.status}`)
          }
          const tournamentJson = await response2.json();
          // console.log(tournamentJson);
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
  //   if (topTournamentMatch.length > 0) {
  //     window.requestAnimationFrame(() => {
  //       setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 0 });
  //     });
  //   }
  // }, [topTournamentMatch, setViewport]);


   

  const initialEdges = [];

  const [canvasDimensions, setCanvasDimensions] = useState({width: 4000, height: 4000})

  useEffect(() => {
    find_canvas_size(topTournamentMatch, setCanvasDimensions, setTopTournamentMatch)
  }, [topTournamentMatch]);

  const matchNodesAndEdges = makeNodes(topTournamentMatch, canvasDimensions);

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