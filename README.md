# ENS Lookup

This is a library for looking up ENS domain for address or reverse lookup by crawling the Etherscan website.

## Install

```bash
npm install @yukaii/ens-lookup
```

## Usage

```js
import { lookup } from "@yukaii/ens-lookup";

lookup("vitalik.eth").then(console.log);

// =>
// {
//   found: true,
//   address: '0x1234123123123123123123123123123123123123',
//   controller: '0x1234123123123123123123123123123123123123',
//   registrant: '0x1234123123123123123123123123123123123123',
//   expiration: '2042.05.03 at 21:05',
//   tokenId: '0x1234123123123123123123123123123123123123 Lookup names ',
//   transactions: [
//     {
//       ...
```

Check out the [typing](./src/index.ts) and [tests](./test/lookup.test.ts) for more details.

## License

MIT
