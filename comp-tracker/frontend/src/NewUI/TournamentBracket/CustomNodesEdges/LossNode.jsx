import { Position, Handle } from 'reactflow';


const LossNode = ({data}) =>{
  const {label, showLeftHandle=false, showRightHandle=false} = data;
  // console.log("lossnode: " + label)
  return (
  <div className="lossNode" style={{width: '100%', height: '100%',}}>
    {showLeftHandle && (<Handle className='matchUserNodeHandle' type="source" position={Position.Left} />)}

    <p>{label}</p>

    {showRightHandle && (<Handle className='matchUserNodeHandle' type="target" position={Position.Right} />)}
  </div>)
}

export default LossNode