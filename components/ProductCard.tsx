import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number; // 0 - 10
  image: string;
  inStock: boolean;
};

export type ProductCardProps = {
  product: Product;
  layout?: 'row' | 'tile';
  onSelect: (id: string) => void;
};
//const ProductCard= ({product, layout = 'row', onSelect}: ProductCardProps) => {
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = 'row',
  onSelect,
}) => {
  const isTile = layout === 'tile';
  const ratingValue = Number(product.rating ?? 0);
  const ratingText = `⭐ ${ratingValue.toFixed(1)}`;
  const stockIcon = product.inStock === false ? '❌' : '✅';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onSelect(product.id)}
      style={[styles.card, isTile && styles.cardTile]}
    >
      <View style={isTile ? styles.imageWrapperTile : styles.imageWrapperRow}>
        <Image
          source={{ uri: product.image }}
          style={isTile ? styles.imageTile : styles.imageRow}
        />
        {isTile && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingBadgeText}>{ratingText}</Text>
          </View>
        )}
      </View>

      <View style={isTile ? styles.infoTile : styles.infoRow}>
        <Text
          style={[styles.name, isTile && styles.nameTile]}
          numberOfLines={1}
        >
          {product.name}
        </Text>

        {!isTile && (
          <>
            <Text style={styles.category}>{product.category}</Text>
            <Text style={styles.price}>
              {product.price.toLocaleString('vi-VN')} đ
            </Text>
            <Text style={styles.rating}>{ratingText}</Text>
          </>
        )}

        <Text style={styles.stock}>{stockIcon}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Card base
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    // shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTile: {
    flex: 1,
    marginHorizontal: 6,
  },

  // Row layout (1 cột)
  imageWrapperRow: {},
  imageRow: {
    width: 70,
    height: 100,
  },
  infoRow: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },

  // Tile layout (2 cột)
  imageWrapperTile: { position: 'relative' },
  imageTile: {
    width: '100%',
    aspectRatio: 2 / 3,
  },
  infoTile: {
    padding: 8,
  },
  nameTile: {
    fontSize: 13,
  },
  ratingBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  // Text
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '600',
    marginBottom: 2,
  },
  rating: {
    fontSize: 13,
    color: '#333',
  },
  stock: {
    fontSize: 14,
    marginTop: 2,
  },
});

// ❗ Câu 4a: card row phải flexDirection: 'row' — áp dụng qua style động
const RowCardOverride = StyleSheet.create({
  row: { flexDirection: 'row' },
});

// Export với React.memo (Câu 3d)
export default React.memo(ProductCard);