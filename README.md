# react-native-iroh-ffi

React Native bindings for the official [iroh-ffi](https://github.com/n0-computer/iroh-ffi): the **full iroh p2p API surface** — QUIC connections, bi/uni streams, datagrams, relays, discovery, tickets — as a prebuilt Turbo Module. **No Rust toolchain required** in your app's build.

> **Status: alpha.** iOS only for now. Verified on the iOS simulator, including a live echo roundtrip against a desktop Node peer running [`@number0/iroh`](https://www.npmjs.com/package/@number0/iroh). Real-device and Android support are on the roadmap (see below). The API may change while iroh-ffi itself stabilizes.

## Why this library

- **Official surface, not a hand-picked subset.** The TypeScript API is generated directly from `n0-computer/iroh-ffi` v1.1.0 via [uniffi-bindgen-react-native](https://github.com/jhugman/uniffi-bindgen-react-native) — the same binding contract n0 ships for other languages. When upstream grows, this library regenerates; nothing is hand-wrapped.
- **Prebuilt binary.** The Rust core ships as a compiled `.xcframework` (release, ~53 MB unpacked; device arm64 + simulator arm64). Your app's Xcode build just links it — no cargo, no Rust.
- **Interops with the rest of the iroh ecosystem.** Same iroh-ffi version as `@number0/iroh` on desktop Node: dial by bare `EndpointId` via n0 discovery and exchange bytes across platforms.
- **Works in Expo.** The bundled example is an Expo SDK 57 app (`expo run:ios` / dev client; Expo Go is not supported since this is a native module).

## Install

```sh
npm install react-native-iroh-ffi@alpha
```

Then for plain React Native:

```sh
cd ios && pod install
```

or for Expo (config plugin not needed — regular autolinking):

```sh
npx expo run:ios
```

## Usage

```ts
import { EndpointBuilder, EndpointAddr, EndpointId } from 'react-native-iroh-ffi';

const ALPN = new TextEncoder().encode('my-app/my-proto/0').buffer;

// Bind an endpoint with n0's production relays + discovery
const builder = new EndpointBuilder();
builder.applyN0();
const endpoint = await builder.bind();
console.log('my id:', endpoint.id().toString());

// Dial a remote peer by bare EndpointId (resolved via discovery)
const remote = EndpointId.fromString('…64-char hex…');
const conn = await endpoint.connect(new EndpointAddr(remote, undefined, []), ALPN);

// Bidirectional stream: write, finish, read the reply
const bi = await conn.openBi();
await bi.send().writeAll(payload);
await bi.send().finish();
const reply = await bi.recv().readToEnd(65536);
```

The accept side (`endpoint.acceptNext()` → `accept()` → `connect()` → `acceptBi()`), datagrams, tickets, relay configuration, path watching and the rest of the iroh-ffi surface are all exposed — see the generated types in `src/generated/iroh_ffi.ts`.

A complete working pair lives in this repo:

- [`example-expo/`](example-expo) — Expo 57 app: bind, dial by EndpointId, echo roundtrip UI
- [`desktop-peer/`](desktop-peer) — Node echo peer on `@number0/iroh` to dial against

## Current limitations

- **Android is not wired up yet.** The Gradle/CMake scaffolding is in place but the Rust core has never been built or tested for Android. Next milestone.
- **Real iOS devices are untested.** The device (arm64) slice is included, but the Local Network permission flow has only been exercised in the simulator (which exempts it).
- **Simulator slice is arm64-only** (Apple Silicon hosts). No x86_64 simulator slice yet.
- **No mDNS discovery.** Upstream iroh-ffi does not expose mDNS ([iroh-ffi#255](https://github.com/n0-computer/iroh-ffi/issues/255)); discovery goes through n0's relay/DNS infrastructure, which also means no multicast entitlement is needed on iOS.
- **Hermes has no `TextDecoder`.** Bring a small polyfill (or `String.fromCharCode` for ASCII) when decoding received bytes.

## How it's built

`uniffi-bindgen-react-native` cross-compiles `iroh-ffi` and generates the TS/C++ JSI bindings:

```sh
bunx uniffi-bindgen-react-native build ios --and-generate --release
```

The generated bindings are committed; the `.xcframework` is shipped in the npm package.

## License

MIT © [Yueqian Yang](https://github.com/yyq1025)
