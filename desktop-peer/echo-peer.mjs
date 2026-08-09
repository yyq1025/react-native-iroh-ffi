// Desktop echo peer: accepts iroh connections on ALPN iroh-ffi/echo/0,
// reads one message per bi-stream, writes back `echo:<msg>`.
import { Endpoint } from '@number0/iroh';
import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ALPN = Array.from(Buffer.from('iroh-ffi/echo/0'));

// Persist the secret key so the EndpointId is stable across restarts.
const keyPath = join(dirname(fileURLToPath(import.meta.url)), '.peer-key');
let secret;
try {
  secret = Buffer.from(readFileSync(keyPath, 'utf8').trim(), 'hex');
} catch {
  secret = randomBytes(32);
  writeFileSync(keyPath, secret.toString('hex') + '\n', { mode: 0o600 });
}

const b = Endpoint.builder();
b.applyN0();
b.secretKey(Array.from(secret));
b.alpns([ALPN]);
const ep = await b.bind();

console.log(`[peer] EndpointId: ${ep.id().toString()}`);
console.log('[peer] waiting for connections…');

let n = 0;
for (;;) {
  const incoming = await ep.acceptNext();
  if (!incoming) break;
  const i = ++n;
  (async () => {
    const accepting = await incoming.accept();
    const conn = await accepting.connect();
    console.log(`[peer] #${i} connection accepted`);
    const bi = await conn.acceptBi();
    const data = await bi.recv.readToEnd(65536);
    const text = Buffer.from(data).toString('utf8');
    console.log(`[peer] #${i} recv: ${JSON.stringify(text)}`);
    await bi.send.writeAll(Array.from(Buffer.from(`echo:${text}`)));
    await bi.send.finish();
    console.log(`[peer] #${i} echoed, waiting for remote close`);
    await conn.closed();
    console.log(`[peer] #${i} closed`);
  })().catch((e) => console.error(`[peer] #${i} error:`, e));
}
