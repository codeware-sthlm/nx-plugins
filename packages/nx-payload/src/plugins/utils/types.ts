export type PayloadPluginOptions = {
  buildTargetName?: string;
  dockerBuildTargetName?: string;
  dockerRunTargetName?: string;
  mongodbTargetName?: string;
  payloadBuildTargetName?: string;
  payloadCliTargetName?: string;
  postgresTargetName?: string;
  startTargetName?: string;
  stopTargetName?: string;
};

export type NormalizedOptions = Required<PayloadPluginOptions>;
