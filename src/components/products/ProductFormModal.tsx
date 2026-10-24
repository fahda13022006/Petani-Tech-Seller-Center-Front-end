import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { ProductCategory, CreateProductInput } from '@/types';
import { Image as ImageIcon } from 'lucide-react-native';

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductInput) => Promise<void>;
  initialData?: Partial<CreateProductInput>;
}

const CATEGORIES: ProductCategory[] = ['Pupuk', 'Pestisida', 'Benih', 'Alat Pertanian'];

const SAMPLE_IMAGES = [
  { label: 'Pupuk', url: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500&auto=format&fit=crop&q=80' },
  { label: 'Pestisida', url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=500&auto=format&fit=crop&q=80' },
  { label: 'Benih', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&auto=format&fit=crop&q=80' },
  { label: 'Sprayer', url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop&q=80' },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState<ProductCategory>(
    (initialData?.category as ProductCategory) || 'Pupuk'
  );
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : '');
  const [stock, setStock] = useState(initialData?.stock ? String(initialData.stock) : '');
  const [unit, setUnit] = useState(initialData?.unit || 'Sak (25kg)');
  const [description, setDescription] = useState(initialData?.description || '');
  const [minStockAlert, setMinStockAlert] = useState(
    initialData?.minStockAlert ? String(initialData.minStockAlert) : '15'
  );
  const [imageUrl, setImageUrl] = useState(initialData?.image || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !price || !stock) return;

    setIsLoading(true);
    try {
      await onSubmit({
        name,
        category,
        price: Number(price),
        stock: Number(stock),
        unit,
        description,
        minStockAlert: Number(minStockAlert),
        image: imageUrl || undefined,
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Ubah Informasi Produk' : 'Tambah Produk Pertanian'}
      description="Lengkapi detail produk pertanian untuk mulai menjual ke ribuan pembeli dan petani."
    >
      <View style={styles.formContainer}>
        {/* Foto Produk Picker */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Foto Produk Pertanian</Text>
          <View style={styles.imagePickerCard}>
            <View style={styles.previewBox}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.previewImage} />
              ) : (
                <View style={styles.previewPlaceholder}>
                  <ImageIcon size={24} color="#5A9B2E" />
                  <Text style={styles.previewText}>Preview</Text>
                </View>
              )}
            </View>

            <View style={styles.imageControls}>
              <View style={styles.sampleGrid}>
                {SAMPLE_IMAGES.map((sample) => (
                  <TouchableOpacity
                    key={sample.label}
                    onPress={() => setImageUrl(sample.url)}
                    style={[
                      styles.sampleChip,
                      imageUrl === sample.url && styles.sampleChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sampleChipText,
                        imageUrl === sample.url && styles.sampleChipTextActive,
                      ]}
                    >
                      {sample.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {imageUrl ? (
                <TouchableOpacity onPress={() => setImageUrl('')}>
                  <Text style={styles.removeImageText}>Hapus Foto</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>

        {/* Nama Produk */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nama Produk Pertanian</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Contoh: Pupuk Organik Premium Granul 25kg"
            placeholderTextColor="#A0A8A0"
          />
        </View>

        {/* Kategori Chips */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Kategori Produk</Text>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Satuan Kemasan */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Satuan Penjualan (Kemasan)</Text>
          <TextInput
            style={styles.input}
            value={unit}
            onChangeText={setUnit}
            placeholder="Sak (25kg), Botol (1L), Pcs, dll"
            placeholderTextColor="#A0A8A0"
          />
        </View>

        {/* Harga & Stok Row */}
        <View style={styles.row}>
          <View style={[styles.fieldGroup, styles.halfCol]}>
            <Text style={styles.label}>Harga Jual (Rp)</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="75000"
              keyboardType="numeric"
              placeholderTextColor="#A0A8A0"
            />
          </View>
          <View style={[styles.fieldGroup, styles.halfCol]}>
            <Text style={styles.label}>Stok Tersedia</Text>
            <TextInput
              style={styles.input}
              value={stock}
              onChangeText={setStock}
              placeholder="120"
              keyboardType="numeric"
              placeholderTextColor="#A0A8A0"
            />
          </View>
        </View>

        {/* Batas Peringatan Menipis */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Batas Peringatan Menipis</Text>
          <TextInput
            style={styles.input}
            value={minStockAlert}
            onChangeText={setMinStockAlert}
            placeholder="15"
            keyboardType="numeric"
            placeholderTextColor="#A0A8A0"
          />
        </View>

        {/* Deskripsi */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Deskripsi & Komposisi</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Jelaskan dosis penggunaan, anjuran aplikasi..."
            multiline
            numberOfLines={3}
            placeholderTextColor="#A0A8A0"
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button variant="ghost" size="md" onPress={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="primary" size="md" onPress={handleSubmit} isLoading={isLoading}>
            Simpan Produk
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#213329',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8DE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#213329',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfCol: {
    flex: 1,
  },
  imagePickerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#A9CF8C',
    borderRadius: 14,
    backgroundColor: '#F7F9F5',
  },
  previewBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8DE',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  previewText: {
    fontSize: 9,
    color: '#818981',
  },
  imageControls: {
    flex: 1,
    gap: 6,
  },
  sampleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sampleChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C6DCBE',
    backgroundColor: '#FFFFFF',
  },
  sampleChipActive: {
    backgroundColor: '#3E7821',
    borderColor: '#3E7821',
  },
  sampleChipText: {
    fontSize: 10,
    color: '#3E7821',
    fontWeight: '600',
  },
  sampleChipTextActive: {
    color: '#FFFFFF',
  },
  removeImageText: {
    fontSize: 11,
    color: '#D95757',
    fontWeight: '600',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8DE',
    backgroundColor: '#FFFFFF',
  },
  categoryChipActive: {
    backgroundColor: '#EAF4E3',
    borderColor: '#5A9B2E',
  },
  categoryText: {
    fontSize: 12,
    color: '#68746B',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#3E7821',
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F3EC',
  },
});
