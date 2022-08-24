export interface Transaction {
  id: string;
  date: string;
  from: string;
  action: string;
}

export interface OwnedEthereumName {
  ens: string;
  expiration: string;
}

export interface SearchResult {
  found: boolean;
  ens?: string;
  address?: string;

  controller?: string;
  registrant?: string;
  tokenId?: string;

  expiration?: string;

  transactions?: Transaction[];

  ownedEns?: OwnedEthereumName[];

  forwardedEns?: string[];
}
