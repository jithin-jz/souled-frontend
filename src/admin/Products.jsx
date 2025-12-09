import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../utils/api';
import AdminNavbar from './AdminNavbar';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchProducts = async (query = "", cat = "") => {
    try {
      let url = `/products/?search=${query}`;
      if (cat) url += `&category=${cat}`;
      
      const res = await api.get(url);
      setProducts(res.data);
    } catch (error) {
      console.error('Fetch products failed', error);
      toast.error('Failed to fetch products');
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(search, category);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Delete this product?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}/`);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <AdminNavbar />

      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Manage Products</h2>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-pink-500 outline-none"
            >
              <option value="">All Categories</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 p-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-pink-500 outline-none"
            />
            <Link
              to="/admin/products/add"
              className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-xl whitespace-nowrap"
            >
              + Add Product
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-xl">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-700 text-slate-300 text-xs uppercase">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-400">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="border-t border-slate-700">
                    <td className="p-4">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded-md border border-slate-600"
                      />
                    </td>
                    <td className="p-4">{product.name}</td>
                    <td className="p-4 text-green-300 font-semibold">₹{product.price}</td>
                    <td className={`p-4 font-semibold ${
                      product.stock < 10 ? "text-red-500" : 
                      product.stock < 20 ? "text-yellow-500" : "text-green-500"
                    }`}>
                      {product.stock}
                    </td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4 flex justify-center gap-4">
                      <Link to={`/admin/products/edit/${product.id}`} className="text-blue-400">
                        <FiEdit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-400"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="text-center text-sm p-4 bg-slate-900 text-slate-400 border-t border-slate-800">
        © {new Date().getFullYear()}{' '}
        <span className="text-white font-semibold">Souled Admin</span>. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminProducts;


