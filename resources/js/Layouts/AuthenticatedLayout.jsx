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
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
            } flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-150 ease-in-out`}
        >
            {children}
        </Link>
    );

    const MenuSection = ({ title, children }) => (
        <div className="mb-6">
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {title}
            </h3>
            <div className="space-y-1">
                {children}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Mobile menu button */}
            <button
                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                className="fixed top-4 left-4 z-40 sm:hidden rounded-md p-2 bg-white text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-500 shadow-lg"
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
                className={`bg-white w-64 min-h-screen shadow-lg transform ${
                    showingNavigationDropdown ? 'translate-x-0' : '-translate-x-full'
                } sm:translate-x-0 transition-transform duration-300 ease-in-out fixed sm:static z-30`}
            >
                {/* Logo Section */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <Link href="/" className="flex-1 flex justify-center">
                        <ApplicationLogo className="h-9 w-auto fill-current text-gray-800" />
                    </Link>
                </div>

                {/* Navigation Menu */}
                <div className="mt-4 px-2 overflow-y-auto h-[calc(100vh-12rem)] space-y-4">
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
                <div className="border-t border-gray-200 p-4 absolute bottom-0 w-full bg-white">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 focus:outline-none">
                                <div className="flex-1 text-left">
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
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
            <div className="flex-1 flex flex-col min-w-0">
                {header && (
                    <header className="bg-white shadow-sm sm:ml-4 sm:mt-4 rounded-lg">
                        <div className="py-6 px-4 sm:px-6 lg:px-8">
                            {header}
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