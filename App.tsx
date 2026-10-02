import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ProductCard, { Product } from './components/ProductCard';

const API_URL = 'https://68e3a2368e14f4523dae221b.mockapi.io/products';

type ApiProduct = {
  id?: string | number;
  name?: string;
  description?: string;
  category?: string;
  price?: number | string;
  rating?: number | string;
  image?: string;
  inStock?: boolean;
};

const normalizeProduct = (item: ApiProduct): Product => ({
  id: String(item.id ?? `${Date.now()}-${Math.random()}`),
  name: item.name ?? 'Unnamed product',
  category: item.category ?? item.description ?? 'General',
  price: Number(item.price ?? 0),
  rating: Number(item.rating ?? 4.5),
  image: item.image ?? 'https://placehold.co/600x900/png',
  inStock: typeof item.inStock === 'boolean' ? item.inStock : true,
});

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isTile, setIsTile] = useState<boolean>(false);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`Failed to fetch products (${res.status})`);
      }

      const data: ApiProduct[] = await res.json();
      setProducts(Array.isArray(data) ? data.map(normalizeProduct) : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    })();
  }, [fetchProducts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  const handleSelect = useCallback(
    (id: string) => {
      const found = products.find((p) => p.id === id);
      if (found) Alert.alert('Sản phẩm', found.name);
    },
    [products]
  );

  const numColumns = isTile ? 2 : 1; 

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Product App</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Dạng lưới</Text>
              <Switch value={isTile} onValueChange={setIsTile} />
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              key={String(numColumns)}
              data={products}
              keyExtractor={(item) => item.id}
              numColumns={numColumns}
              columnWrapperStyle={isTile ? styles.columnWrapper : undefined}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  layout={isTile ? 'tile' : 'row'}
                  onSelect={handleSelect}
                />
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{ padding: 12 }}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: { fontSize: 14, color: '#333' },
  columnWrapper: { gap: 12 },
});