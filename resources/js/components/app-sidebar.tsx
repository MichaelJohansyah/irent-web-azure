import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { Bell, LayoutGrid, ListOrdered, MessageCircle, Repeat } from 'lucide-react';
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
        { title: 'Chat', href: '#', icon: MessageCircle },
        { title: 'Order List', href: '#', icon: ListOrdered },
        { title: 'Switch to Customer', href: '#', icon: Repeat },
    ];
    const adminNavItems = [{ title: 'Manage Unverified Users', href: '/admin/users', icon: Bell }];
    const mainNavItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        ...(isCustomer
            ? [
                  { title: 'Chat', href: '#', icon: MessageCircle },
                  { title: 'Order List', href: '#', icon: ListOrdered },
                  { title: 'Notification', href: '#', icon: Bell },
                  { title: 'Switch to Partner', href: '#', icon: Repeat },
              ]
            : []),
        ...(isPartner ? partnerNavItems : []),
        ...(isAdmin ? adminNavItems : []),
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
