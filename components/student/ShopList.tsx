import React, { useState, useEffect } from 'react';
import { Shop } from '../../types';
import * as api from '../../services/api';
import { Spinner } from '../shared/Spinner';
import { ChevronRightIcon } from '../shared/icons';
import { Input } from '../shared/Input';

interface ShopListProps {
  onSelectShop: (shopId: string) => void;
}

const ShopCard: React.FC<{ shop: Shop; onClick: () => void }> = ({ shop, onClick }) => (
    <div 
      className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 group hover:border-sky-500/50 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <img src={shop.imageUrl} alt={shop.name} className="w-full h-40 object-cover" />
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-sky-400 transition-colors">{shop.name}</h3>
        <p className="text-sm text-gray-400 mb-4">{shop.categories.join(' • ')}</p>
        <div className="flex justify-between items-center text-sm text-sky-400">
          <span>View Menu</span>
          <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
);

const ShopList: React.FC<ShopListProps> = ({ onSelectShop }) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


  useEffect(() => {
    const fetchShops = async () => {
      try {
        const fetchedShops = await api.getShops();
        setShops(fetchedShops);
      } catch (error) {
        console.error("Failed to fetch shops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const allCategories = ['All', ...new Set(shops.flatMap(shop => shop.categories))];

  const filteredShops = shops.filter(shop => {
    const categoryMatch = !selectedCategory || shop.categories.includes(selectedCategory);
    const searchMatch = shop.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tighter text-white mb-6">Explore Shops</h2>
      
      <div className="mb-8 space-y-4">
          <Input 
            type="text"
            placeholder="Search for a shop..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {allCategories.map(category => (
                <button
                    key={category}
                    onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                        (selectedCategory === category || (category === 'All' && !selectedCategory))
                        ? 'bg-sky-500 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                >
                    {category}
                </button>
            ))}
          </div>
      </div>
      
      {filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map(shop => (
            <ShopCard key={shop.id} shop={shop} onClick={() => onSelectShop(shop.id)} />
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-10">No shops found matching your criteria.</p>
      )}
    </div>
  );
};

export default ShopList;