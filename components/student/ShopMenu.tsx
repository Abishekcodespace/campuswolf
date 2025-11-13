import React, { useState, useEffect } from 'react';
import { Shop, Product, CartItem } from '../../types';
import * as api from '../../services/api';
import { Spinner } from '../shared/Spinner';
import { Button } from '../shared/Button';
import useOperatingHours from '../../hooks/useOperatingHours';

interface ShopMenuProps {
  shopId: string;
  addToCart: (item: CartItem) => void;
}

const ProductCard: React.FC<{product: Product, onAddToCart: () => void, disabled: boolean}> = ({ product, onAddToCart, disabled }) => (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center space-x-4">
        <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-lg"/>
        <div className="flex-1">
            <h4 className="font-bold text-white">{product.name}</h4>
            <p className="text-sm text-gray-400 mb-2">{product.description}</p>
            <p className="font-semibold text-white">{product.price ? `₹${product.price}` : 'Price on request'}</p>
        </div>
        <Button onClick={onAddToCart} disabled={disabled} className="px-4 py-2 text-sm">Add</Button>
    </div>
);

const ShopMenu: React.FC<ShopMenuProps> = ({ shopId, addToCart }) => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen } = useOperatingHours();

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const { shop: fetchedShop, products: fetchedProducts } = await api.getShopDetails(shopId);
        setShop(fetchedShop);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch shop menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [shopId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  if (!shop) {
    return <p className="text-center text-gray-400">Shop not found.</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <img src={shop.imageUrl} alt={shop.name} className="w-full h-48 object-cover rounded-2xl mb-4"/>
        <h2 className="text-4xl font-extrabold tracking-tighter text-white">{shop.name}</h2>
        <p className="text-gray-400">{shop.categories.join(' • ')}</p>
      </div>
      
      <div className="space-y-4">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={() => addToCart({ productId: product.id, name: product.name, price: product.price, quantity: 1 })}
            disabled={!isOpen}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopMenu;