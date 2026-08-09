import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  EndpointBuilder,
  EndpointAddr,
  EndpointId,
  type EndpointLike,
} from 'react-native-iroh-spike';

const ALPN = 'iroh-spike/echo/0';
// ASCII-only helpers (Hermes lacks TextDecoder)
const toBuf = (s: string) => Uint8Array.from(s, (c) => c.charCodeAt(0)).buffer;
const fromBuf = (b: ArrayBuffer) =>
  String.fromCharCode(...Array.from(new Uint8Array(b)));

export default function App() {
  const [status, setStatus] = useState('binding endpoint…');
  const [endpointId, setEndpointId] = useState<string | null>(null);
  const [peerId, setPeerId] = useState(
    '46fbdd40255ca2f136838a99dd20326ba39d5c8f7a48236458ce760929f6ec3a'
  );
  const [echoLog, setEchoLog] = useState<string[]>([]);
  const epRef = useRef<EndpointLike | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const builder = new EndpointBuilder();
        builder.applyN0();
        const endpoint = await builder.bind();
        epRef.current = endpoint;
        const id = endpoint.id().toString();
        if (!cancelled) {
          setEndpointId(id);
          setStatus('iroh endpoint bound ✅ (Expo 57 / RN 0.86)');
        }
      } catch (e) {
        if (!cancelled) setStatus(`FAILED: ${String(e)}`);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const runEcho = async () => {
    const ep = epRef.current;
    if (!ep) return;
    const log = (line: string) => setEchoLog((prev) => [...prev, line]);
    setEchoLog([]);
    try {
      const remote = EndpointId.fromString(peerId.trim());
      const addr = new EndpointAddr(remote, undefined, []);
      log('connecting…');
      const t0 = Date.now();
      const conn = await ep.connect(addr, toBuf(ALPN));
      log(`connected in ${Date.now() - t0}ms`);
      const bi = await conn.openBi();
      const msg = `ping from RN @${new Date().toISOString()}`;
      const send = bi.send();
      await send.writeAll(toBuf(msg));
      await send.finish();
      log(`sent: ${msg}`);
      const echoed = await bi.recv().readToEnd(65536);
      log(`recv: ${fromBuf(echoed)}`);
      log('echo roundtrip ✅');
    } catch (e) {
      log(`FAILED: ${String(e)}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>iroh × RN spike</Text>
      <Text style={styles.status}>{status}</Text>
      {endpointId && <Text style={styles.id}>EndpointId: {endpointId}</Text>}
      <TextInput
        style={styles.input}
        value={peerId}
        onChangeText={setPeerId}
        placeholder="desktop peer EndpointId"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable
        style={styles.button}
        onPress={runEcho}
        disabled={!endpointId}
      >
        <Text style={styles.buttonText}>Connect & Echo</Text>
      </Pressable>
      {echoLog.map((line, i) => (
        <Text key={i} style={styles.log}>
          {line}
        </Text>
      ))}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
  },
  title: { fontSize: 22, fontWeight: '600' },
  status: { fontSize: 15, textAlign: 'center' },
  id: { fontSize: 11, fontFamily: 'Menlo' },
  input: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 11,
    fontFamily: 'Menlo',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  log: { fontSize: 12, fontFamily: 'Menlo', textAlign: 'center' },
});
