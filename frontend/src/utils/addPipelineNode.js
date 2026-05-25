import { getDefaultNodeData } from '../nodes/nodeConfigs';

export const createPipelineNode = (type, position, getNodeID) => {
  const nodeID = getNodeID(type);
  return {
    id: nodeID,
    type,
    position,
    data: getDefaultNodeData(type, nodeID),
  };
};
