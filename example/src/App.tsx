import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EndpointBuilder } from 'react-native-iroh-spike';

export default function App() {
  const [status, setStatus] = useState('binding endpoint…');
  const [endpointId, setEndpointId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const builder = new EndpointBuilder();
        builder.applyN0();
        const endpoint = await builder.bind();
        const id = endpoint.id().toString();
        if (!cancelled) {
          setEndpointId(id);
          setStatus('iroh endpoint bound ✅');
        }
      } catch (e) {
        if (!cancelled) setStatus(`FAILED: ${String(e)}`);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>iroh × RN spike</Text>
      <Text style={styles.status}>{status}</Text>
      {endpointId && <Text style={styles.id}>EndpointId: {endpointId}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  title: { fontSize: 22, fontWeight: '600' },
  status: { fontSize: 16 },
  id: { fontSize: 12, fontFamily: 'Menlo' },
});
