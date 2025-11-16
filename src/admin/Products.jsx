import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../utils/api';
import AdminNavbar from './AdminNavbar';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/');
      setProducts(res.data);
    } catch (error) {
      console.error('Fetch products failed', error);
      toast.error('Failed to fetch products');
    }
  };

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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <AdminNavbar />

      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Products</h2>
          <Link
            to="/admin/products/add"
            className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-xl"
          >
            + Add Product
          </Link>
        </div>

        <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-xl">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-700 text-gray-300 text-xs uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-400">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="border-t border-gray-700">
                    <td className="p-4">{product.name}</td>
                    <td className="p-4 text-green-300 font-semibold">₹{product.price}</td>
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
    </div>
  );
};

export default AdminProducts;
