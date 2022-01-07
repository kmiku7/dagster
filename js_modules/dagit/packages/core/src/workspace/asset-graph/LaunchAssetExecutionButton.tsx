import React from 'react';

import {LaunchRootExecutionButton} from '../../launchpad/LaunchRootExecutionButton';
import {ButtonWIP} from '../../ui/Button';
import {IconWIP} from '../../ui/Icon';
import {Tooltip} from '../../ui/Tooltip';
import {RepoAddress} from '../types';

import {LaunchAssetChoosePartitionsDialog} from './LaunchAssetChoosePartitionsDialog';

type AssetMinimal = {
  assetKey: {path: string[]};
  opName: string | null;
  partitionDefinition: string | null;
};

export const LaunchAssetExecutionButton: React.FC<{
  repoAddress: RepoAddress;
  assetJobName: string;
  assets: AssetMinimal[];
  title?: string;
}> = ({repoAddress, assets, assetJobName, title}) => {
  const [showingPartitionDialog, setShowingPartitionDialog] = React.useState(false);

  let disabledReason = '';
  if (!assets.every((a) => a.opName)) {
    disabledReason = 'One or more foreign assets are selected and cannot be refreshed.';
  }
  const partitionDefinition = assets[0].partitionDefinition;
  if (assets.some((a) => a.partitionDefinition !== partitionDefinition)) {
    disabledReason = 'Assets refreshed together must share a partition definition.';
  }

  title = title || 'Refresh';
  if (partitionDefinition) {
    // Add ellipsis to the button title since it will open a "Choose partitions" modal
    title =
      title.indexOf(' (') !== -1
        ? title.slice(0, title.indexOf(' (')) + '...' + title.slice(title.indexOf(' ('))
        : title + '...';
  }

  return (
    <Tooltip content={disabledReason}>
      {partitionDefinition ? (
        <>
          <ButtonWIP
            icon={<IconWIP name="open_in_new" />}
            disabled={!!disabledReason}
            intent="primary"
            onClick={() => setShowingPartitionDialog(true)}
          >
            {title}
          </ButtonWIP>
          <LaunchAssetChoosePartitionsDialog
            assets={assets}
            assetJobName={assetJobName}
            repoAddress={repoAddress}
            open={showingPartitionDialog}
            setOpen={setShowingPartitionDialog}
          />
        </>
      ) : (
        <LaunchRootExecutionButton
          pipelineName={assetJobName}
          disabled={!!disabledReason}
          title={title}
          getVariables={() => ({
            executionParams: {
              mode: 'default',
              executionMetadata: {},
              runConfigData: {},
              selector: {
                repositoryLocationName: repoAddress.location,
                repositoryName: repoAddress.name,
                pipelineName: assetJobName,
                solidSelection: assets.map((o) => o.opName!),
              },
            },
          })}
        />
      )}
    </Tooltip>
  );
};
