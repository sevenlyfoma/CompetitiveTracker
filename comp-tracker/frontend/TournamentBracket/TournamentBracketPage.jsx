import React, {useCallback, useState, useEffect} from 'react';
import ReactFlow, { Position, useReactFlow, ReactFlowProvider, useStore, Handle } from 'reactflow';
// import { useViewportHelper } from 'reactflow';
import { useParams, useNavigate, redirect } from 'react-router-dom';
import 'reactflow/dist/style.css';


// import './TournamentBracketPage.css'

import BoundaryNode from './BoundaryNode';

import MatchNode from './MatchNode';

import LossNode from './LossNode';

import FirstCornerDefinedDistanceStepEdge from './FirstCornerDefinedDistanceStepEdge';

import RoundTitleNode from './RoundTitleNode';
import toast from 'react-hot-toast';

// import LinkNode from './LinkNode';
const roundLabelHeight = 100;

function hackFields(match){
    if (match === undefined || match === null){
        return null;
    }
    let sorted = match.parents;
    sorted = match.parents.sort((a, b) => {
        const numA = a.parentMatch?.matchNumber ?? 0;
        const numB = b.parentMatch?.matchNumber ?? 0;
        return numA - numB;
    });

    match.inheritsParentMatch1Winner = sorted[0].inheritsParentMatchWinner;
    match.inheritsParentMatch2Winner = sorted[1].inheritsParentMatchWinner;

    match.parentMatch1 = sorted[0].parentMatch;
    match.parentMatch2 = sorted[1].parentMatch;

    match.user1 = sorted[0].user;
    match.user2 = sorted[1].user;

    if (match.matchRecord != null && match.matchRecord != undefined){
        let participants = match.matchRecord.participants;

        match.matchRecord.user1 = participants[0].user;
        match.matchRecord.user1RatingBefore = participants[0].ratingBefore;
        match.matchRecord.user1RatingAfter = participants[0].ratingAfter;


        match.matchRecord.user2 = participants[1].user;
        match.matchRecord.user2RatingBefore = participants[1].ratingBefore;
        match.matchRecord.user2RatingAfter = participants[1].ratingAfter;

        if (participants[0].points == 1){
            match.matchRecord.winner = participants[0].user;
        }
        else {
            match.matchRecord.winner = participants[1].user;
        }



    }

    return match;
}
 


const nodeTypes = {boundary: BoundaryNode, matchUser: MatchNode, loss: LossNode, roundTitle: RoundTitleNode};

const edgeTypes = {fcddse: FirstCornerDefinedDistanceStepEdge};

function makeNodes(topMatch, canvasDimensions){

  // console.log("topmatchL:")
  // console.log(topMatch)

  const {width, height} = canvasDimensions;

  // console.log("height " + height)

  let nHeight = height;
  // if (topMatch?.tournament?.style === "double") {nHeight -= roundLabelHeight}

  let {nodes, edges, lossLinkMarks, roundTitlesAndPositions} = makeNodesRecursive(topMatch, roundLabelHeight, nHeight, width-200, topMatch?.tournament?.style, 0, 0)

  // console.log(roundTitlesAndPositions.filter(function(value, index, array) {return array.indexOf(value) == index;}));
  // let uniqueTitles = roundTitlesAndPositions.map(x => x.title).filter(function(value, index, array) {return array.indexOf(value) == index;});

  // let uniqueTitlesAndPositions = uniqueTitles.map(t => {return ({title: t, position: roundTitlesAndPositions.findIndex(item => item.title === t).position})} )

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

  console.log(uniqueTitlesAndPositions); 

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

  // console.log(match)

  


  if (match !== undefined && match !== null){

    // let sorted = match.parents.sort((a, b) => {
    //   return a.parentMatch.matchNumber - b.parentMatch.matchNumber;
    // });#

    


    let nodes =[]
    let edges = []
    let lossLinkMarks = []
    let roundTitlesAndPositions = []

    roundTitlesAndPositions.push({title: match.matchTitle, positionX: x, positionY: titleY})
    
  
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
    
    
    let topNodesAndEdges = {nodes: [], edges: [], lossLinkMarks: [], roundTitlesAndPositions : []};
    let botNodesAndEdges = {nodes: [], edges: [], lossLinkMarks: [], roundTitlesAndPositions : []};


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

      
  
    // console.log(lossLinkMarks)
    


    return {
      nodes: nodes.concat(topNodesAndEdges.nodes).concat(botNodesAndEdges.nodes).concat(lossNodes), 
      edges: edges.concat(topNodesAndEdges.edges).concat(botNodesAndEdges.edges),
      lossLinkMarks: lossLinkMarks.concat(topNodesAndEdges.lossLinkMarks).concat(botNodesAndEdges.lossLinkMarks),
      roundTitlesAndPositions: roundTitlesAndPositions.concat(topNodesAndEdges.roundTitlesAndPositions).concat(botNodesAndEdges.roundTitlesAndPositions)
    }
  }

  
 


  return {nodes: [], edges: [], lossLinkMarks: [], roundTitlesAndPositions: []};
}

const initialNodes = [];

function appened_tourney_dimensions(match){
  if (match === undefined || match === null){
    return null;
  }

  match = hackFields(match);

  if (match.parentMatch1 == null && match.parentMatch2 == null
      ||match.inheritsParentMatch1Winner != true && match.inheritsParentMatch2Winner != true
  ){
    match.height = 1;
    match.depth = 1;
    return match;
  }

  let p1 = null
  let p2 = null

  let p1D = 0;
  let p1H = 0;
  
  let p2D = 0;
  let p2H = 0;


  if (match.inheritsParentMatch1Winner == true){
    p1 = appened_tourney_dimensions(match.parentMatch1);
    if (p1 != null){
        p1D = p1.depth;
      p1H = p1.height;
    }
    
  }
   
 if (match.inheritsParentMatch2Winner == true){
    p2 = appened_tourney_dimensions(match.parentMatch2);
    if (p2 != null){
      p2D = p2.depth;
      p2H = p2.height;
    }
   
  } 
  

  match.height = p1H + p2H;

  if (p1D > p2D) {
    match.depth = p1D + 1;
  }
  else  {
    match.depth = p2D + 1;
  }

  return match;

    
}

function find_canvas_size(topMatch, setCanvasDimensions, setTopTournamentMatch){

  // let depth = find_tourney_depth(topMatch); //Added 2 to see a graph TODO FIX
  // console.log("Find tourney height:")
  // let newTopMatch = find_tourney_height(topMatch);

  // console.log("Height:" + newTopMatch?.height)

  // console.log("depth: " + depth)

  let height = topMatch?.height;
  let depth = topMatch?.depth;

  let bracketNo = 1;
  if (topMatch?.tournament?.style === "double") {console.log("yes"); bracketNo = 2;}

  let dimensions = {height: 100 + (100 * height) + (bracketNo * roundLabelHeight), width: 100 + 200 * depth};

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
          const data = await response.json()
          if (!response.ok){
              throw new Error(data.message)
          }
          const topMatchJson = data;
          // console.log(matchesJson);

          // let newTopMatch = find_tourney_height(topMatchJson);

          let newTopMatch = appened_tourney_dimensions(topMatchJson);

          console.log("New top match")
          console.log(newTopMatch);



          setTopTournamentMatch(newTopMatch);

          const response2 = await fetch(`/api/tournaments/${tournamentID}`);
          const data2 = await response2.json()
          if (!response2.ok){
              throw new Error(data2.message)
          }
          const tournamentJson = data2;
          // console.log(tournamentJson);
          setTournament(tournamentJson);


      } catch (error) {
        toast.error('Error fetching data:' + error.message)
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