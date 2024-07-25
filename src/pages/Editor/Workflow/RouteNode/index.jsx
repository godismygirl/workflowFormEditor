import React from 'react';
import AddNodeBtn from '../AddNodeBtn';

const RouteNode = ({ nodeId }) => {
  return <AddNodeBtn nodeId={nodeId} />;
};

export default React.memo(RouteNode);
