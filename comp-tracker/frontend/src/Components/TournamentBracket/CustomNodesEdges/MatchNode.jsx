import { useNavigate} from 'react-router-dom';
import { Position, Handle } from 'reactflow';

const MatchNode = ({ data }) => {
  const navigate = useNavigate();

  const {match, showLeftHandle, showRightHandle, setSelectedMatch} = data;

  let label1 = "n/a";
  let label2 = "n/a";

  

  let sortedParents = match?.parents?.sort((a,b) => a.id - b.id);

  if (match.parents[0]?.user != null){
    label1 = sortedParents[0]?.user?.name
  }
  if (match.parents[1]?.user != null){
    label2 = sortedParents[1]?.user?.name
  }

  let user1BgColor = null;
  let user2BgColor = null;

  if (match?.matchRecord != null){
    let sortedParticipants = match?.matchRecord?.participants?.sort((a,b) => a.id - b.id)

    let sUser1BgColor = null;
    let sUser2BgColor = null;

    if (sortedParticipants[0].points == 1){
      sUser1BgColor = "lightgreen";
      sUser2BgColor = "red";
    }
    else {
      sUser1BgColor = "red";
      sUser2BgColor = "lightgreen";
    }

    if (sortedParticipants[0].user.id == sortedParents[0].user.id){
      user1BgColor = sUser1BgColor;
      user2BgColor = sUser2BgColor;
    }
    else{
      user2BgColor = sUser1BgColor;
      user1BgColor = sUser2BgColor;
    }


  }


  return (
    <div 
      className="matchUserNodeOuter nopan"
      style={{
        width: '100%', height: '100%',
        cursor: 'pointer',
      
      }}

      onClick={() => {setSelectedMatch(match); console.log("set selected match:" + match.id)}}
    
    >
      {/* <button 
        style={{width: '20%', height: '100%',}} 
       >

      </button> */}
      
      <div className="matchUserNodeDiv" style={{width: '100%', height: '100%',}}>
        
        {showLeftHandle && (<Handle className='matchUserNodeHandle' type="source" position={Position.Left} />)}
        
        <div className="matchUserNodeInner" style={{width: '100%', height: '50%', backgroundColor: user1BgColor}}>
          <p>{label1}</p>
        </div>

        <div className="matchUserNodeInner" style={{width: '100%', height: '50%', backgroundColor: user2BgColor}}>
          <p>{label2}</p>
        </div>
        
        {showRightHandle && (<Handle className='matchUserNodeHandle' type="target" position={Position.Right} />)}
      </div>
    </div>
  );
};

export default MatchNode;