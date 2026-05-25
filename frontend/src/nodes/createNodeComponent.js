import { BaseNode } from './BaseNode';
import { nodeConfigs } from './nodeConfigs';

export const createNodeComponent = (type) => {
  const config = nodeConfigs[type];
  if (!config) return null;

  const NodeComponent = ({ id, data }) => (
    <BaseNode id={id} data={data} config={config} />
  );
  NodeComponent.displayName = `${type}Node`;
  return NodeComponent;
};
