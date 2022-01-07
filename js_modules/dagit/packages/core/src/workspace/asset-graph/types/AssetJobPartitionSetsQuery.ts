/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AssetJobPartitionSetsQuery
// ====================================================

export interface AssetJobPartitionSetsQuery_partitionSetsOrError_PipelineNotFoundError {
  __typename: "PipelineNotFoundError" | "PythonError";
}

export interface AssetJobPartitionSetsQuery_partitionSetsOrError_PartitionSets_results {
  __typename: "PartitionSet";
  id: string;
  name: string;
  mode: string;
  solidSelection: string[] | null;
}

export interface AssetJobPartitionSetsQuery_partitionSetsOrError_PartitionSets {
  __typename: "PartitionSets";
  results: AssetJobPartitionSetsQuery_partitionSetsOrError_PartitionSets_results[];
}

export type AssetJobPartitionSetsQuery_partitionSetsOrError = AssetJobPartitionSetsQuery_partitionSetsOrError_PipelineNotFoundError | AssetJobPartitionSetsQuery_partitionSetsOrError_PartitionSets;

export interface AssetJobPartitionSetsQuery {
  partitionSetsOrError: AssetJobPartitionSetsQuery_partitionSetsOrError;
}

export interface AssetJobPartitionSetsQueryVariables {
  pipelineName: string;
  repositoryName: string;
  repositoryLocationName: string;
}
