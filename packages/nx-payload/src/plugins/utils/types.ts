export type PayloadPluginOptions = {
  buildTargetName?: string;
  mongodbTargetname?: string;
  payloadTargetName?: string;
  postgresTargetName?: string;
  startTargetName?: string;
  stopTargetName?: string;
};

export type NormalizedOptions = Required<PayloadPluginOptions>;
