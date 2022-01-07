import React from 'react';

import {showCustomAlert} from '../app/CustomAlertProvider';
import {TextInput} from '../ui/TextInput';

export const PartitionRangeInput: React.FC<{
  value: string[];
  onChange: (partitionNames: string[]) => void;
  partitionNames: string[];
}> = ({value, onChange, partitionNames}) => {
  const [valueString, setValueString] = React.useState('');

  React.useEffect(() => {
    setValueString(partitionsToText(value, partitionNames));
  }, [value, partitionNames]);

  const placeholder = React.useMemo(() => {
    return placeholderForPartitions(partitionNames);
  }, [partitionNames]);

  return (
    <TextInput
      placeholder={placeholder}
      value={valueString}
      style={{display: 'flex', width: '100%', flex: 1, flexGrow: 1}}
      onChange={(e) => setValueString(e.currentTarget.value)}
      onBlur={(e) => {
        try {
          onChange(textToPartitions(e.target.value, partitionNames));
        } catch (err: any) {
          e.preventDefault();
          showCustomAlert({body: err.message});
        }
      }}
    />
  );
};

export function assembleIntoSpans(keys: string[], keyTestFn: (key: string) => boolean) {
  const spans: {startIdx: number; endIdx: number; status: boolean}[] = [];

  for (let ii = 0; ii < keys.length; ii++) {
    const status = keyTestFn(keys[ii]);
    if (!spans.length || spans[spans.length - 1].status !== status) {
      spans.push({startIdx: ii, endIdx: ii, status: status});
    } else {
      spans[spans.length - 1].endIdx = ii;
    }
  }

  return spans;
}

function placeholderForPartitions(names: string[]) {
  if (names.length < 4) {
    return `ex: ${names[0]}, ${names[1]}`;
  }
  return `ex: ${names[0]}, ${names[1]}, [${names[2]}...${names[names.length - 1]}]`;
}

function textToPartitions(selected: string, all: string[]) {
  const terms = selected.split(',').map((s) => s.trim());
  const result = [];
  for (const term of terms) {
    if (term.length === 0) {
      continue;
    }
    const rangeMatch = /^\[(.*)\.\.\.(.*)\]$/g.exec(term);
    if (rangeMatch) {
      const [, start, end] = rangeMatch;
      const allStartIdx = all.indexOf(start);
      const allEndIdx = all.indexOf(end);
      if (allStartIdx === -1 || allEndIdx === -1) {
        throw new Error(`Could not find partitions for provided range: ${start}...${end}`);
      }
      result.push(...all.slice(allStartIdx, allEndIdx + 1));
    } else if (term.includes('*')) {
      const [prefix, suffix] = term.split('*');
      result.push(...all.filter((p) => p.startsWith(prefix) && p.endsWith(suffix)));
    } else {
      const idx = all.indexOf(term);
      if (idx === -1) {
        throw new Error(`Could not find partition: ${term}`);
      }
      result.push(term);
    }
  }
  return result.sort((a, b) => all.indexOf(a) - all.indexOf(b));
}

function partitionsToText(selected: string[], all: string[]) {
  const spans = assembleIntoSpans(all, (key) => selected.includes(key));
  const spanStrings = [];
  for (const {startIdx, endIdx, status} of spans) {
    if (status) {
      spanStrings.push(startIdx === endIdx ? all[startIdx] : `[${all[startIdx]}...${all[endIdx]}]`);
    }
  }
  return spanStrings.join(', ');
}
