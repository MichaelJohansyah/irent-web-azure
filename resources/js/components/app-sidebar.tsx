import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { Bell, LayoutGrid, ListOrdered, MessageCircle } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { props } = usePage();
    const user = props.user || {};
    const userRole = user && typeof user === 'object' && 'role' in user ? user.role : undefined;
    const isCustomer = userRole === 'customer';
    const isPartner = userRole === 'partner';
    const isAdmin = userRole === 'admin';
    const partnerNavItems = [
        { title: 'Add Product', href: '/dashboard/add-product', icon: MessageCircle },
        { title: 'Check Notification', href: '#', icon: Bell },
        { title: 'Chat', href: '/chatify', icon: MessageCircle },
        { title: 'Order List', href: '/orders/partner-list', icon: ListOrdered }, // changed link
        { title: 'Send Feedback', href: '/feedback', icon: MessageCircle },
    ];
    const adminNavItems = [
        { title: 'Manage Users', href: '/admin/users', icon: Bell },
        { title: 'Manage Order', href: '/admin/orders', icon: ListOrdered },
    ];
    const mainNavItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        ...(isCustomer
            ? [
                  { title: 'Send Feedback', href: '/feedback', icon: MessageCircle },
                  { title: 'Chat', href: '/chatify', icon: MessageCircle },
                  { title: 'Order List', href: '/orders', icon: ListOrdered },
                  { title: 'Notification', href: '#', icon: Bell },
              ]
            : []),
        ...(isAdmin
            ? [
                  { title: 'Manage Users', href: '/admin/users', icon: Bell },
                  { title: 'Manage Order', href: '/admin/orders', icon: ListOrdered },
                  { title: 'User Feedback', href: '/admin/feedback', icon: MessageCircle },
              ]
            : []),
        ...(isPartner ? partnerNavItems : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
