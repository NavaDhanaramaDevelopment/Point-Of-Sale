import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth: { user } } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState(null);

    const toggleMenu = (menu) => {
        setExpandedMenu(prev => prev === menu ? null : menu);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <nav className="border-b border-blue-100 bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">

                                {/* Role-based Dashboard */}
                                {user.role === 'admin' && (
                                    <NavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')}>
                                        Admin Dashboard
                                    </NavLink>
                                )}
                                {user.role === 'manager' && (
                                    <NavLink href={route('manager.dashboard')} active={route().current('manager.dashboard')}>
                                        Manager Dashboard
                                    </NavLink>
                                )}

                                {/* Manager Master Menu */}
                                {user.role === 'manager' && (
                                    <div className={`relative group flex items-center ${route().current('manager.outlets.*') || route().current('manager.users.*') || route().current('manager.suppliers.*') || route().current('manager.purchase-orders.*') ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
                                        <button className="inline-flex items-center px-3 py-2 text-sm font-medium focus:outline-none">
                                            Manager
                                            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div className="absolute left-0 z-10 mt-[200px] w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                                            <div className="py-1">
                                                <Link href={route('manager.outlets.index')} className={`block px-4 py-2 text-sm ${route().current('manager.outlets.*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Master Outlets</Link>
                                                <Link href={route('manager.users.index')} className={`block px-4 py-2 text-sm ${route().current('manager.users.*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Master Users</Link>
                                                <Link href={route('manager.suppliers.index')} className={`block px-4 py-2 text-sm ${route().current('manager.suppliers.*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Master Suppliers</Link>
                                                <Link href={route('manager.purchase-orders.index')} className={`block px-4 py-2 text-sm ${route().current('manager.purchase-orders.*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Purchase Orders</Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {user.role === 'owner' && (
                                    <>
                                        <NavLink href={route('owner.outlets.index')} active={route().current('owner.outlets.*')}>
                                            Manage Outlets
                                        </NavLink>
                                        <NavLink href={route('owner.users.index')} active={route().current('owner.users.*')}>
                                            Manage Users
                                        </NavLink>
                                        <NavLink href={route('owner.roles.index')} active={route().current('owner.roles.*')}>
                                            Manage Roles
                                        </NavLink>
                                        <NavLink href={route('owner.permissions.index')} active={route().current('owner.permissions.*')}>
                                            Manage Permissions
                                        </NavLink>
                                    </>
                                )}

                                {/* Debt Management Menu */}
                                {(user.role === 'owner' || user.role === 'admin' || user.role === 'manager') && (

                                    <>
                                        <div className={`relative group flex items-center ${route().current('customer-debts.*') || route().current('supplier-debts.*') ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
                                            <button className="inline-flex items-center px-3 py-2 text-sm font-medium focus:outline-none">
                                                Debt
                                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <div className="absolute left-0 z-10 mt-[140px] w-44 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                                                <div className="py-1">
                                                    <Link href={route('customer-debts.index')} className={`block px-4 py-2 text-sm ${route().current('customer-debts.*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Customer</Link>
                                                    <Link href={route('supplier-debts.index')} className={`block px-4 py-2 text-sm ${route().current('supplier-debts.*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Supplier</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Transfer Management Menu */}
                                {(user.role === 'owner' || user.role === 'admin' || user.role === 'manager') && (
                                    <NavLink href={route('transfers.index')} active={route().current('transfers.*')}>
                                        Outlet Transfers
                                    </NavLink>
                                )}

                                {user.role === 'kasir' && (
                                    <NavLink href={route('kasir.dashboard')} active={route().current('kasir.dashboard')}>
                                        Kasir Dashboard
                                    </NavLink>
                                )}

                                <NavLink href={route('subscription.index')} active={route().current('subscription.*')}>
                                    Subscription
                                </NavLink>

                                {/* Master Dropdown */}
                                <div className={`relative group flex items-center ${route().current('category.*') || route().current('subcategory.*') || route().current('product.*') ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
                                    <button className="inline-flex items-center px-3 py-2 text-sm font-medium focus:outline-none">
                                        Master
                                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 z-10 mt-[180px] w-44 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                                        <div className="py-1">
                                            <Link href={route('category.index')} className={`block px-4 py-2 text-sm ${route().current('category.*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Kategori</Link>
                                            <Link href={route('subcategory.index')} className={`block px-4 py-2 text-sm ${route().current('subcategory.*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Subkategori</Link>
                                            <Link href={route('product.index')} className={`block px-4 py-2 text-sm ${route().current('product.*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Produk</Link>
                                        </div>
                                    </div>
                                </div>

                                <NavLink href={route('pos.index')} active={route().current('pos.*')}>
                                    POS
                                </NavLink>

                                {/* Stock Management - Manager/Admin Only */}
                                {(user.role === 'manager' || user.role === 'admin') && (
                                    <div className={`relative group flex items-center ${route().current('stock.*') ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
                                        <button className="inline-flex items-center px-3 py-2 text-sm font-medium focus:outline-none">
                                            Stock
                                            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div className="absolute left-0 z-10 mt-[240px] w-44 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                                            <div className="py-1">
                                                <Link href={route('stock.index')} className={`block px-4 py-2 text-sm ${route().current('stock.index') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Riwayat Stock</Link>
                                                <Link href={route('stock.in')} className={`block px-4 py-2 text-sm ${route().current('stock.in') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Stock In</Link>
                                                <Link href={route('stock.out')} className={`block px-4 py-2 text-sm ${route().current('stock.out') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Stock Out</Link>
                                                <Link href={route('stock.adjustment')} className={`block px-4 py-2 text-sm ${route().current('stock.adjustment') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Penyesuaian</Link>
                                                <Link href={route('stock.report')} className={`block px-4 py-2 text-sm ${route().current('stock.report') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Laporan</Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Customer Management */}
                                <div className={`relative group flex items-center ${route().current('customers.*') ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
                                    <button className="inline-flex items-center px-3 py-2 text-sm font-medium focus:outline-none">
                                        Customer
                                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 z-10 mt-[180px] w-44 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                                        <div className="py-1">
                                            <Link href={route('customers.index')} className={`block px-4 py-2 text-sm ${route().current('customers.index') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Daftar Customer</Link>
                                            <Link href={route('customers.create')} className={`block px-4 py-2 text-sm ${route().current('customers.create') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Tambah Customer</Link>
                                            <Link href={route('customers.loyalty.report')} className={`block px-4 py-2 text-sm ${route().current('customers.loyalty.report') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Laporan Loyalti</Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Shift Management */}
                                <div className={`relative group flex items-center ${route().current('shifts.*') ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
                                    <button className="inline-flex items-center px-3 py-2 text-sm font-medium focus:outline-none">
                                        Shift
                                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 z-10 mt-[180px] w-44 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                                        <div className="py-1">
                                            <Link href={route('shifts.index')} className={`block px-4 py-2 text-sm ${route().current('shifts.index') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Daftar Shift</Link>
                                            <Link href={route('shifts.open.form')} className={`block px-4 py-2 text-sm ${route().current('shifts.open.form') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Buka Shift</Link>
                                            <Link href={route('shifts.summary')} className={`block px-4 py-2 text-sm ${route().current('shifts.summary') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Summary</Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Reports - Manager/Admin Only */}
                                {(user.role === 'manager' || user.role === 'admin') && (
                                    <div className={`relative group flex items-center ${route().current('reports.*') ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
                                        <button className="inline-flex items-center px-3 py-2 text-sm font-medium focus:outline-none">
                                            Reports
                                            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div className="absolute left-0 z-10 mt-[240px] w-44 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                                            <div className="py-1">
                                                <Link href={route('reports.index')} className={`block px-4 py-2 text-sm ${route().current('reports.index') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Dashboard</Link>
                                                <Link href={route('reports.sales')} className={`block px-4 py-2 text-sm ${route().current('reports.sales') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Laporan Penjualan</Link>
                                                <Link href={route('reports.products')} className={`block px-4 py-2 text-sm ${route().current('reports.products') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Laporan Produk</Link>
                                                <Link href={route('reports.analytics')} className={`block px-4 py-2 text-sm ${route().current('reports.analytics') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Analytics</Link>
                                                <Link href={route('reports.kasir')} className={`block px-4 py-2 text-sm ${route().current('reports.kasir') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}>Laporan Kasir</Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* User Dropdown */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    {!showingNavigationDropdown ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden`}>
                    <div className="space-y-1 pb-3 pt-2">

                        {user.role === 'admin' && (
                            <ResponsiveNavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')}>
                                Admin Dashboard
                            </ResponsiveNavLink>
                        )}
                        {user.role === 'manager' && (
                            <ResponsiveNavLink href={route('manager.dashboard')} active={route().current('manager.dashboard')}>
                                Manager Dashboard
                            </ResponsiveNavLink>
                        )}

                        {/* Manager Menu Mobile */}
                        {user.role === 'manager' && (
                            <div className="border rounded-lg my-2">
                                <button type="button" className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700" onClick={() => toggleMenu('manager-menu')}>
                                    <span>Manager</span>
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {expandedMenu === 'manager-menu' && (
                                    <div className="bg-white border-t">
                                        <ResponsiveNavLink href={route('manager.outlets.index')} active={route().current('manager.outlets.*')} className="pl-8">Master Outlets</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('manager.users.index')} active={route().current('manager.users.*')} className="pl-8">Master Users</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('manager.suppliers.index')} active={route().current('manager.suppliers.*')} className="pl-8">Master Suppliers</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('manager.purchase-orders.index')} active={route().current('manager.purchase-orders.*')} className="pl-8">Purchase Orders</ResponsiveNavLink>
                                    </div>
                                )}
                            </div>
                        )}
                        {user.role === 'kasir' && (
                            <ResponsiveNavLink href={route('kasir.dashboard')} active={route().current('kasir.dashboard')}>
                                Kasir Dashboard
                            </ResponsiveNavLink>
                        )}

                        <ResponsiveNavLink href={route('subscription.index')} active={route().current('subscription.*')}>
                            Subscription
                        </ResponsiveNavLink>


                        {(user.role === 'owner' || user.role === 'admin' || user.role === 'manager') && (

                            <>
                            <div className="border rounded-lg my-2">
                                <button type="button" className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700" onClick={() => toggleMenu('debt')}>
                                    <span>Master</span>
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {expandedMenu === 'debt' && (
                                    <div className="bg-white border-t">
                                        <ResponsiveNavLink href={route('customer-debts.index')} active={route().current('customer-debts.*')} className="pl-8">Kategori</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('supplier-debts.index')} active={route().current('supplier-debts.*')} className="pl-8">Subkategori</ResponsiveNavLink>
                                    </div>
                                )}
                            </div>
                            </>
                        )}

                        {/* Master Dropdown Mobile */}
                        <div className="border rounded-lg my-2">
                            <button type="button" className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700" onClick={() => toggleMenu('master')}>
                                <span>Master</span>
                                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {expandedMenu === 'master' && (
                                <div className="bg-white border-t">
                                    <ResponsiveNavLink href={route('category.index')} active={route().current('category.*')} className="pl-8">Kategori</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('subcategory.index')} active={route().current('subcategory.*')} className="pl-8">Subkategori</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('product.index')} active={route().current('product.*')} className="pl-8">Produk</ResponsiveNavLink>
                                </div>
                            )}
                        </div>

                        <ResponsiveNavLink href={route('pos.index')} active={route().current('pos.*')}>POS</ResponsiveNavLink>

                        {/* Stock Management Mobile - Manager/Admin Only */}
                        {(user.role === 'manager' || user.role === 'admin') && (
                            <div className="border rounded-lg my-2">
                                <button type="button" className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700" onClick={() => toggleMenu('stock')}>
                                    <span>Stock</span>
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {expandedMenu === 'stock' && (
                                    <div className="bg-white border-t">
                                        <ResponsiveNavLink href={route('stock.index')} active={route().current('stock.index')} className="pl-8">Riwayat Stock</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('stock.in')} active={route().current('stock.in')} className="pl-8">Stock In</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('stock.out')} active={route().current('stock.out')} className="pl-8">Stock Out</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('stock.adjustment')} active={route().current('stock.adjustment')} className="pl-8">Penyesuaian</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('stock.report')} active={route().current('stock.report')} className="pl-8">Laporan</ResponsiveNavLink>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Customer Management Mobile */}
                        <div className="border rounded-lg my-2">
                            <button type="button" className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700" onClick={() => toggleMenu('customer')}>
                                <span>Customer</span>
                                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {expandedMenu === 'customer' && (
                                <div className="bg-white border-t">
                                    <ResponsiveNavLink href={route('customers.index')} active={route().current('customers.index')} className="pl-8">Daftar Customer</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('customers.create')} active={route().current('customers.create')} className="pl-8">Tambah Customer</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('customers.loyalty.report')} active={route().current('customers.loyalty.report')} className="pl-8">Laporan Loyalti</ResponsiveNavLink>
                                </div>
                            )}
                        </div>

                        {/* Shift Management Mobile */}
                        <div className="border rounded-lg my-2">
                            <button type="button" className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700" onClick={() => toggleMenu('shift')}>
                                <span>Shift</span>
                                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {expandedMenu === 'shift' && (
                                <div className="bg-white border-t">
                                    <ResponsiveNavLink href={route('shifts.index')} active={route().current('shifts.index')} className="pl-8">Daftar Shift</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('shifts.open.form')} active={route().current('shifts.open.form')} className="pl-8">Buka Shift</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('shifts.summary')} active={route().current('shifts.summary')} className="pl-8">Summary</ResponsiveNavLink>
                                </div>
                            )}
                        </div>

                        {/* Reports Mobile - Manager/Admin Only */}
                        {(user.role === 'manager' || user.role === 'admin') && (
                            <div className="border rounded-lg my-2">
                                <button type="button" className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700" onClick={() => toggleMenu('reports')}>
                                    <span>Reports</span>
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {expandedMenu === 'reports' && (
                                    <div className="bg-white border-t">
                                        <ResponsiveNavLink href={route('reports.index')} active={route().current('reports.index')} className="pl-8">Dashboard</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('reports.sales')} active={route().current('reports.sales')} className="pl-8">Laporan Penjualan</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('reports.products')} active={route().current('reports.products')} className="pl-8">Laporan Produk</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('reports.analytics')} active={route().current('reports.analytics')} className="pl-8">Analytics</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('reports.kasir')} active={route().current('reports.kasir')} className="pl-8">Laporan Kasir</ResponsiveNavLink>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink href={route('subscription.index')}>Subscription Plans</ResponsiveNavLink>
                            <ResponsiveNavLink href={route('subscription.history')}>Subscription History</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">Log Out</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
