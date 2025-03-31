declare module 'simple-peer' {
  import { EventEmitter } from 'events';
  
  interface SimplePeerData {
    type: string;
    sdp: string;
  }
  
  interface SimplePeerOptions {
    initiator?: boolean;
    stream?: MediaStream;
    trickle?: boolean;
    config?: RTCConfiguration;
  }
  
  class Peer extends EventEmitter {
    constructor(opts?: SimplePeerOptions);
    signal(data: any): void;
    destroy(): void;
    _connected?: boolean;
  }
  
  namespace Peer {
    interface Instance extends Peer {}
  }
  
  export = Peer;
} 