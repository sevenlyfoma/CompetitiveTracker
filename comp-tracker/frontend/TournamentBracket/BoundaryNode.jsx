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


export default BoundaryNode;