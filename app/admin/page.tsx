'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts, getOrders, updateOrderStatus } from '@/lib/data/store';
import { Product, Order, OrderStatus } from '@/types/database';
import { AdminHeader } from '@/components/admin/admin-header';
import { StatsCard } from '@/components/admin/stats-card';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  Package,
  CheckCircle,
  FileText,
  AlertTriangle,
  DollarSign,
  ArrowRight,
  Plus,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [prods, ords] = await Promise.all([
      getProducts({ publishedOnly: false }),
      getOrders(),
    ]);
    setProducts(prods);
    setOrders(ords);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.published).length;
  const draftProducts = products.filter((p) => !p.published).length;
  const outOfStockProducts = products.filter((p) => {
    const totalStock = p.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) ?? 0;
    return totalStock === 0;
  }).length;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    loadData();
  };

  return (
    <div className="flex-1 flex flex-col font-sans">
      <AdminHeader
        title="Executive Overview"
        actionHref="/admin/products/new"
        actionLabel="Add Product"
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-7xl w-full">
        {/* KPI Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          <StatsCard
            label="Total Products"
            value={totalProducts}
            icon={Package}
            sublabel="Catalog inventory"
          />
          <StatsCard
            label="Published"
            value={publishedProducts}
            icon={CheckCircle}
            sublabel="Live on storefront"
          />
          <StatsCard
            label="Drafts"
            value={draftProducts}
            icon={FileText}
            sublabel="Hidden from public"
          />
          <StatsCard
            label="Out Of Stock"
            value={outOfStockProducts}
            icon={AlertTriangle}
            sublabel="Needs replenishment"
          />
          <StatsCard
            label="Total Revenue"
            value={formatPrice(totalRevenue)}
            icon={DollarSign}
            sublabel={`${orders.length} lifetime orders`}
          />
        </div>

        {/* Quick Actions Strip */}
        <div className="bg-white p-6 border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-900">
              Quick Management Shortcuts
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Rapidly manage your collection, review customer shipments, or update categories.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Link
              href="/admin/products/new"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Garment</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2 bg-white border border-neutral-300 text-neutral-800 text-xs uppercase tracking-widest font-medium hover:border-black hover:text-black transition-colors"
            >
              View Orders ({pendingOrders} Pending)
            </Link>
            <Link
              href="/admin/categories"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2 bg-white border border-neutral-300 text-neutral-800 text-xs uppercase tracking-widest font-medium hover:border-black hover:text-black transition-colors"
            >
              Categories
            </Link>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white border border-neutral-200 shadow-sm">
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-black">
                Recent Orders
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Latest customer acquisitions and fulfillment status.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs uppercase tracking-widest font-semibold text-neutral-900 hover:text-neutral-500 transition-colors flex items-center gap-1"
            >
              <span>All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
                <tr>
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Total</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-700">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-black uppercase">
                      {order.id.slice(0, 10)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-neutral-900">{order.customer_name}</div>
                      <div className="text-[11px] text-neutral-400">{order.customer_email}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-black">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold border ${
                          order.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : order.status === 'shipped'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : order.status === 'processing'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : order.status === 'pending'
                            ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-500">{formatDate(order.created_at)}</td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="bg-white border border-neutral-300 text-[11px] uppercase tracking-wider px-2 py-1 focus:outline-none focus:border-black"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
