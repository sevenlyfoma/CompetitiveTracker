import React from 'react';
import { getSmoothStepPath } from 'reactflow';

const FirstCornerDefinedDistanceStepEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
    let dist = data?.dist ?? 50;

    let distX = dist;
    if (sourceX < targetX) {distX = -dist}
    let distY = dist;
    if (sourceY < targetY) {distY = -dist}

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 0,
        centerX: sourceX - distX,
        centerY: sourceY - distY,
    });

    return (
        <>
        <path
            id={id}
            style={style}
            className="react-flow__edge-path"
            d={edgePath}
            markerEnd={markerEnd}
        />
        </>
    );
};

export default FirstCornerDefinedDistanceStepEdge;