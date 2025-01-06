import type { DeedCall } from '../types';

export function createNewCall(): DeedCall {
  return {
    type: 'line',
    bearing: '',
    distance: 0,
    unit: 'feet',
    noviceBearing: {
      direction1: 'N',
      degrees: '',
      minutes: '',
      seconds: '',
      direction2: 'E'
    },
    curve: {
      radius: 0,
      length: 0,
      lengthType: 'arc',
      direction: 'clockwise',
      isTangent: true
    }
  };
}

export function createDefaultCalls(): DeedCall[] {
  return [
    {
      type: 'line',
      bearing: '1100.0000',  // N 100° 00' 00" E
      distance: 100,
      unit: 'feet',
      noviceBearing: {
        direction1: 'N',
        degrees: '100',
        minutes: '0',
        seconds: '0',
        direction2: 'E'
      },
      curve: {
        radius: 0,
        length: 0,
        lengthType: 'arc',
        direction: 'clockwise',
        isTangent: true
      }
    },
    {
      type: 'curve',
      bearing: '',
      distance: 0,
      unit: 'feet',
      noviceBearing: {
        direction1: 'N',
        degrees: '',
        minutes: '',
        seconds: '',
        direction2: 'E'
      },
      curve: {
        radius: 50,
        length: 50,
        lengthType: 'arc',
        direction: 'clockwise',
        isTangent: true
      }
    }
  ];
}