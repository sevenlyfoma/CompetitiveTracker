import { useNavigate} from 'react-router-dom';
import { Position, Handle } from 'reactflow';

const MatchNode = ({ data }) => {
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