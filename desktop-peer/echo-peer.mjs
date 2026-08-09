// Desktop echo peer: accepts iroh connections on ALPN iroh-ffi/echo/0,
// reads one message per bi-stream, writes back `echo:<msg>`.
import { Endpoint } from '@number0/iroh';

const ALPN = Array.from(Buffer.from('iroh-ffi/echo/0'));

const b = Endpoint.builder();
b.applyN0();
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
