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

    const MenuItem = ({ href, active, children }) => (
        <Link
            href={href}
            className={`${
                active
                    ? 'bg-gradient-to-r from-orange-50 to-yellow-50 text-orange-700 border-r-2 border-orange-500'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:text-orange-700'
            } flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 ease-in-out transform hover:translate-x-1`}
        >
            {children}
        </Link>
    );

    const MenuSection = ({ title, children }) => (
        <div className="mb-6">
            <h3 className="px-4 py-2 text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full mr-2"></div>
                {title}
            </h3>
            <div className="space-y-1">
                {children}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
            {/* Decorative background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200/30 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-orange-200/40 rounded-full blur-lg animate-bounce"></div>
                <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-orange-300/20 rounded-full blur-md float-animation"></div>
            </div>

            {/* Mobile menu button */}
            <button
                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                className="fixed top-4 left-4 z-50 sm:hidden rounded-xl p-3 bg-white text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-lg border border-orange-100"
            >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    {!showingNavigationDropdown ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    )}
                </svg>
            </button>

            {/* Sidebar */}
            <div
                className={`bg-gradient-to-b from-white to-orange-50/30 w-64 h-screen shadow-xl fixed left-0 top-0 ${
                    showingNavigationDropdown ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
                } transition-all duration-300 ease-in-out z-40 flex flex-col border-r border-orange-100`}
            >
                {/* Logo Section */}
                <div className="p-6 border-b border-orange-100 flex justify-between items-center bg-gradient-to-r from-orange-50 to-yellow-50">
                    <Link href="/" className="flex-1 flex justify-center">
                        <ApplicationLogo className="h-12 w-auto logo-glow" />
                    </Link>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 mt-4 px-2 overflow-y-auto space-y-4">
                    {/* Dashboard Section */}
                    <MenuSection title="Dashboard">
                        {user.role === 'admin' && (
                            <MenuItem href={route('admin.dashboard')} active={route().current('admin.dashboard')}>
                                Admin Dashboard
                            </MenuItem>
                        )}
                        {user.role === 'manager' && (
                            <MenuItem href={route('manager.dashboard')} active={route().current('manager.dashboard')}>
                                Manager Dashboard
                            </MenuItem>
                        )}
                        {user.role === 'kasir' && (
                            <MenuItem href={route('kasir.dashboard')} active={route().current('kasir.dashboard')}>
                                Kasir Dashboard
                            </MenuItem>
                        )}
                    </MenuSection>

                    {/* Main Operations */}
                    <MenuSection title="Operations">
                        <MenuItem href={route('pos.index')} active={route().current('pos.*')}>
                            POS
                        </MenuItem>
                        <MenuItem href={route('subscription.index')} active={route().current('subscription.*')}>
                            Subscription
                        </MenuItem>
                    </MenuSection>

                    {/* Manager Menu */}
                    {user.role === 'manager' && (
                        <MenuSection title="Manager">
                            <MenuItem href={route('manager.outlets.index')} active={route().current('manager.outlets.*')}>
                                Master Outlets
                            </MenuItem>
                            <MenuItem href={route('manager.users.index')} active={route().current('manager.users.*')}>
                                Master Users
                            </MenuItem>
                            <MenuItem href={route('manager.suppliers.index')} active={route().current('manager.suppliers.*')}>
                                Master Suppliers
                            </MenuItem>
                            <MenuItem href={route('manager.purchase-orders.index')} active={route().current('manager.purchase-orders.*')}>
                                Purchase Orders
                            </MenuItem>
                        </MenuSection>
                    )}

                    {/* Owner Menu */}
                    {user.role === 'owner' && (
                        <MenuSection title="Owner">
                            <MenuItem href={route('owner.outlets.index')} active={route().current('owner.outlets.*')}>
                                Manage Outlets
                            </MenuItem>
                            <MenuItem href={route('owner.users.index')} active={route().current('owner.users.*')}>
                                Manage Users
                            </MenuItem>
                            <MenuItem href={route('owner.roles.index')} active={route().current('owner.roles.*')}>
                                Manage Roles
                            </MenuItem>
                            <MenuItem href={route('owner.permissions.index')} active={route().current('owner.permissions.*')}>
                                Manage Permissions
                            </MenuItem>
                        </MenuSection>
                    )}

                    {/* Master Data */}
                    <MenuSection title="Master Data">
                        <MenuItem href={route('category.index')} active={route().current('category.*')}>
                            Kategori
                        </MenuItem>
                        <MenuItem href={route('subcategory.index')} active={route().current('subcategory.*')}>
                            Subkategori
                        </MenuItem>
                        <MenuItem href={route('product.index')} active={route().current('product.*')}>
                            Produk
                        </MenuItem>
                    </MenuSection>

                    {/* Stock Management */}
                    {(user.role === 'manager' || user.role === 'admin') && (
                        <MenuSection title="Stock">
                            <MenuItem href={route('stock.index')} active={route().current('stock.index')}>
                                Riwayat Stock
                            </MenuItem>
                            <MenuItem href={route('stock.in')} active={route().current('stock.in')}>
                                Stock In
                            </MenuItem>
                            <MenuItem href={route('stock.out')} active={route().current('stock.out')}>
                                Stock Out
                            </MenuItem>
                            <MenuItem href={route('stock.adjustment')} active={route().current('stock.adjustment')}>
                                Penyesuaian
                            </MenuItem>
                            <MenuItem href={route('stock.report')} active={route().current('stock.report')}>
                                Laporan
                            </MenuItem>
                        </MenuSection>
                    )}

                    {/* Customer Management */}
                    <MenuSection title="Customer">
                        <MenuItem href={route('customers.index')} active={route().current('customers.index')}>
                            Daftar Customer
                        </MenuItem>
                        <MenuItem href={route('customers.create')} active={route().current('customers.create')}>
                            Tambah Customer
                        </MenuItem>
                        <MenuItem href={route('customers.loyalty.report')} active={route().current('customers.loyalty.report')}>
                            Laporan Loyalti
                        </MenuItem>
                    </MenuSection>

                    {/* Debt Management */}
                    {(user.role === 'owner' || user.role === 'admin' || user.role === 'manager') && (
                        <MenuSection title="Debt">
                            <MenuItem href={route('customer-debts.index')} active={route().current('customer-debts.*')}>
                                Customer Debt
                            </MenuItem>
                            <MenuItem href={route('supplier-debts.index')} active={route().current('supplier-debts.*')}>
                                Supplier Debt
                            </MenuItem>
                        </MenuSection>
                    )}

                    {/* Shift Management */}
                    <MenuSection title="Shift">
                        <MenuItem href={route('shifts.index')} active={route().current('shifts.index')}>
                            Daftar Shift
                        </MenuItem>
                        <MenuItem href={route('shifts.open.form')} active={route().current('shifts.open.form')}>
                            Buka Shift
                        </MenuItem>
                        <MenuItem href={route('shifts.summary')} active={route().current('shifts.summary')}>
                            Summary
                        </MenuItem>
                    </MenuSection>

                    {/* Reports */}
                    {(user.role === 'manager' || user.role === 'admin') && (
                        <MenuSection title="Reports">
                            <MenuItem href={route('reports.index')} active={route().current('reports.index')}>
                                Dashboard
                            </MenuItem>
                            <MenuItem href={route('reports.sales')} active={route().current('reports.sales')}>
                                Laporan Penjualan
                            </MenuItem>
                            <MenuItem href={route('reports.products')} active={route().current('reports.products')}>
                                Laporan Produk
                            </MenuItem>
                            <MenuItem href={route('reports.analytics')} active={route().current('reports.analytics')}>
                                Analytics
                            </MenuItem>
                            <MenuItem href={route('reports.kasir')} active={route().current('reports.kasir')}>
                                Laporan Kasir
                            </MenuItem>
                        </MenuSection>
                    )}
                </div>

                {/* User Profile Section */}
                <div className="border-t border-orange-100 p-4 sticky bottom-0 left-0 right-0 w-full bg-gradient-to-r from-orange-50 to-yellow-50 mt-auto">
                    <Dropdown placement="top-start">
                        <Dropdown.Trigger>
                            <button className="flex items-center w-full px-3 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-orange-100 hover:to-yellow-100 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-semibold text-gray-800">{user.name}</div>
                                    <div className="text-xs text-orange-600 font-medium">{user.email}</div>
                                </div>
                                <svg className="w-4 h-4 ml-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content align="top" contentClasses="py-1 bg-white shadow-xs">
                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                            <Dropdown.Link href={route('subscription.index')}>Subscription</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 sm:ml-64">
                {header && (
                    <header className="bg-white/80 backdrop-blur-sm shadow-sm sm:mt-4 rounded-xl border border-orange-100 mx-4">
                        <div className="py-6 px-6 lg:px-8">
                            <div className="flex items-center">
                                <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-yellow-400 rounded-full mr-4"></div>
                                {header}
                            </div>
                        </div>
                    </header>
                )}

                <main className="flex-1 p-4 sm:p-6">
                    <div className="mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
