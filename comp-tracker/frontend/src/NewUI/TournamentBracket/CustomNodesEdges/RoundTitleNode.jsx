import { useNavigate} from 'react-router-dom';
import { Position, Handle } from 'reactflow';

const RoundTitleNode = ({ data }) => {

  const {roundTitle} = data;


  return (
    <div className="roundTitleNode" style={{width: '100%', height: '100%',}}>
      <p>{roundTitle}</p>
    </div>
  );
};

export default RoundTitleNode;