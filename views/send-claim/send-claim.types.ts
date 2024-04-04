import { ZkSendLink } from '@mysten/zksend';

export interface SendClaimProps {
  id: string;
}

export type ZkSendLinkWithUrl =
  | {
      url: string;
      link: ZkSendLink;
    }
  | { url: undefined; link: null };
