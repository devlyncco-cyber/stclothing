'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getOrders, updateOrderStatus } from '@/lib/data/store';
import { Order, OrderStatus } from '@/types/database';
import { AdminHeader } from '@/components/admin/admin-header';
import { formatPrice, formatDate } from '@/lib/utils';
import { Search, ChevronDown, ChevronUp, MapPin, Mail, Phone } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const ords = await getOrders();
    setOrders(ords);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const ok = await updateOrderStatus(orderId, newStatus);
    if (ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col font-sans">
      <AdminHeader title="Customer Orders" />

      <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 border border-neutral-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID, customer name or email..."
              className="w-full bg-neutral-50 border border-neutral-300 pl-10 pr-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-neutral-300 text-xs uppercase tracking-wider px-3 py-2.5 focus:outline-none focus:border-black"
            >
              <option value="all">All Statuses ({orders.length})</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table & Detail Accordion */}
        <div className="bg-white border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
                <tr>
                  <th className="py-3 px-4">Order Reference</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-700">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-400">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;
                    const itemsCount =
                      order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

                    return (
                      <React.Fragment key={order.id}>
                        <tr
                          className={`hover:bg-neutral-50/60 transition-colors ${
                            isExpanded ? 'bg-neutral-50/70' : ''
                          }`}
                        >
                          <td className="py-4 px-4 font-mono font-bold text-black uppercase">
                            {order.id}
                          </td>

                          <td className="py-4 px-4">
                            <div className="font-semibold text-neutral-900">{order.customer_name}</div>
                            <div className="text-[11px] text-neutral-400 font-mono">
                              {order.customer_email}
                            </div>
                          </td>

                          <td className="py-4 px-4 text-neutral-600">
                            <span>{order.city || 'Domestic'}, </span>
                            <span className="text-neutral-400">{order.country || 'USA'}</span>
                          </td>

                          <td className="py-4 px-4 font-mono">
                            {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                          </td>

                          <td className="py-4 px-4 font-bold text-neutral-900">
                            {formatPrice(order.total_amount)}
                          </td>

                          <td className="py-4 px-4">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value as OrderStatus)
                              }
                              className={`text-[11px] uppercase tracking-wider font-semibold px-2 py-1 border transition-colors focus:outline-none focus:border-black ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                                  : order.status === 'processing'
                                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                                  : order.status === 'pending'
                                  ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                                  : 'bg-red-50 text-red-700 border-red-300'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td className="py-4 px-4 text-neutral-500 whitespace-nowrap">
                            {formatDate(order.created_at)}
                          </td>

                          <td className="py-4 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => toggleExpand(order.id)}
                              className="p-1.5 text-neutral-500 hover:text-black transition-colors"
                              title="Toggle Order Details"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-neutral-50/90 border-b border-neutral-200">
                            <td colSpan={8} className="p-6">
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                <div className="md:col-span-4 bg-white p-4 border border-neutral-200 space-y-3">
                                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-black border-b border-neutral-100 pb-2">
                                    Delivery Address & Contact
                                  </h4>
                                  <div className="space-y-2 text-xs text-neutral-600">
                                    <div className="flex items-start gap-2">
                                      <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5" />
                                      <div>
                                        <p className="font-semibold text-neutral-900">{order.customer_name}</p>
                                        <p>{order.delivery_address}</p>
                                        <p>
                                          {order.city} {order.postal_code}, {order.country}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                                      <span>{order.customer_email}</span>
                                    </div>
                                    {order.customer_phone && (
                                      <div className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                                        <span>{order.customer_phone}</span>
                                      </div>
                                    )}
                                    {order.notes && (
                                      <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-500">
                                        <strong>Notes:</strong> {order.notes}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="md:col-span-8 bg-white p-4 border border-neutral-200 space-y-3">
                                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-black border-b border-neutral-100 pb-2">
                                    Purchased Line Items
                                  </h4>
                                  <div className="divide-y divide-neutral-100">
                                    {order.items?.map((item) => (
                                      <div
                                        key={item.id}
                                        className="py-2.5 flex items-center justify-between text-xs"
                                      >
                                        <div className="flex items-center gap-3">
                                          {item.image_url && (
                                            <div className="relative w-10 h-12 bg-neutral-100 border border-neutral-200 flex-shrink-0">
                                              <Image
                                                src={item.image_url}
                                                alt={item.product_name}
                                                fill
                                                className="object-cover object-center"
                                                sizes="40px"
                                              />
                                            </div>
                                          )}
                                          <div>
                                            <p className="font-bold uppercase text-neutral-900">
                                              {item.product_name}
                                            </p>
                                            <p className="text-[11px] text-neutral-400">
                                              Size: {item.size} • Color: {item.color}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="text-right">
                                          <p className="font-semibold text-neutral-900">
                                            {item.quantity} × {formatPrice(item.price)}
                                          </p>
                                          <p className="text-[11px] text-neutral-500 font-mono">
                                            {formatPrice(item.quantity * item.price)}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
