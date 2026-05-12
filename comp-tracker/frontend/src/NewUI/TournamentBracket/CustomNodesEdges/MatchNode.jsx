import { useNavigate} from 'react-router-dom';
import { Position, Handle } from 'reactflow';

const MatchNode = ({ data }) => {
  const navigate = useNavigate();

  const {match, showLeftHandle, showRightHandle} = data;

  let label1 = "n/a";
  let label2 = "n/a";
  if (match.parents[0]?.user != null){
    label1 =match.parents[0]?.user?.name
  }
  if (match.parents[1]?.user != null){
    label2 =match.parents[1]?.user?.name
  }

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
    <div className="matchUserNodeOuter" 
      style={{
        width: '100%', height: '100%',
        cursor: 'pointer',
      
      }}

      onClick={() => navigate(`/tournaments/matches/${match.tournament.id}/${match.id}`)}
    
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