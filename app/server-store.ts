import { Company, Location, Order, OrderItem, Product, Sku, User, Group } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { create } from "zustand";
import prisma from "../constants/prisma";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export type OrderWithItems = Order & {
  items: OrderItem[];
};

export type SkuWithProduct = Sku & {
  product: Product;
};

interface ServerStore {
  sessionLastUpdated: Date;
  _user: User | null;
  _company: Company | null;
  getUser: (refresh?: boolean, redirectUrl?: string) => Promise<User>;
  getCompany: () => Promise<Company>;
  getLocations: (owned: boolean) => Promise<Location[]>;
  getLocationUsers: (locationId: string, owned: boolean) => Promise<User[]>;
  getLocationUserEmails: (locationId: string, owned: boolean) => Promise<string[]>;
  getGroupMemberEmails: (groupId: string) => Promise<string[]>;
  getLocationById: (locationId: string) => Promise<Location>;
  getOrders: () => Promise<OrderWithItems[]>;
  getSkus: () => Promise<SkuWithProduct[]>;
  getOrderItems: (orderId: string) => Promise<OrderItem[]>;
  getGroups: (created: boolean) => Promise<Group[]>;
  getGroupLocations: (groupId: string) => Promise<Location[]>;
  getGroupById: (groupId: string) => Promise<Group>;
}

export const useServerStore = create<ServerStore>((set, get) => ({
  _user: null,
  _company: null,
  sessionLastUpdated: new Date(1 - 1 - 1970),
  getUser: async (refresh?: boolean, redirectUrl?: string) => {
    const user = get()._user;
    if (user) {
      return user;
    } else if (
      refresh ||
      get().sessionLastUpdated.getTime() <
      new Date().getTime() - 1000 * 60 * 60 * 24
    ) {
      // If the session is older than 24 hours, refresh it
      const session = await unstable_getServerSession(authOptions);
      if (session) {
        set({ _user: session.user as User, sessionLastUpdated: new Date() });
        return session.user as User;
      }
    }
    redirect(redirectUrl ?? "/signin");
  },
  getLocationById: async (locationId: string) => {
    const location = await prisma.location.findUnique({
      where: {
        id: locationId
      },
    });
    return location as Location;
  },
  getGroupById: async (groupId: string) => {
    const group = await prisma.group.findUnique({
      where: {
        id: groupId
      },
      include: {
        locations: true,
        members: true,
      }
    });
    return group as Group;
  },
  getCompany: async () => {
    const company = get()._company;
    if (company) {
      return company;
    }
    const _company = await prisma.company.findUnique({
      where: {
        id: get()._user?.companyId
      },
    });
    set({ _company: _company });
    return _company ?? {} as Company;
  },
  getLocations: async (owned: boolean) => {
    const user = await prisma.user.findUnique({
      where: {
        id: get()._user?.id
      },
      include: {
        ownedLocations: true,
        viewableLocations: true,
      }
    });
    if (!user) return [];
    return owned ? [...user.ownedLocations] : [...user.viewableLocations];
  },
  getLocationUsers: async (locationdId: string, owned: boolean) => {
    const location = await prisma.location.findUnique({
      where: {
        id: locationdId,
      },
      include: {
        owners: true,
        viewers: true,
      }
    });
    if (!location) return [];
    return owned ? [...location.owners] : [...location.viewers];
  },
  getLocationUserEmails: async (locationdId: string, owned: boolean) => {
    const location = await prisma.location.findUnique({
      where: {
        id: locationdId,
      },
      include: {
        owners: true,
        viewers: true,
      }
    });
    if (!location) return [];
    let ownerEmails: string[] = [];
    let viewerEmails: string[] = [];
    (location.owners).forEach(owner => {
      ownerEmails.push(owner.email);
    });
    (location.viewers).forEach(viewer => {
      viewerEmails.push(viewer.email);
    });
    return owned ? ownerEmails : viewerEmails;
  },
  getGroupMemberEmails: async (groupId: string) => {
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        members: true,
      }
    });
    if (!group) return [];
    let groupMemberEmails: string[] = [];
    (group.members).forEach(member => {
      groupMemberEmails.push(member.email);
    });
    return groupMemberEmails;
  },
  getSkus: async () => {
    return await prisma.sku.findMany({
      include: {
        product: true,
      },
    });
  },
  getOrders: async () => {
    const user = await prisma.user.findUnique({
      where: {
        id: get()._user?.id ?? "616"
      },
      include: {
        ownedLocations: {
          include: {
            orders: {
              include: {
                items: true
              }
            }
          }
        },
        viewableLocations: {
          include: {
            orders: {
              include: {
                items: true
              }
            }
          }
        }
      }
    });
    if (!user) return [];
    const ownedOrders = user.ownedLocations.flatMap(location => location.orders);
    const viewableOrders = user.viewableLocations.flatMap(location => location.orders);
    return [...ownedOrders, ...viewableOrders];
  },
  getOrderItems: async (orderId: string) => {
    return await prisma.orderItem.findMany({
      where: {
        orderId: orderId
      },
    });
  },
  getGroupLocations: async (groupId: string) => {
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        locations: true,
      }
    });
    if (!group) return [];
    return group.locations;
  },
  getGroups: async (created: boolean) => {
    if (created) {
      // Groups that were created by the user
      const createdGroups = await prisma.group.findMany({
        where: {
          userId: get()._user?.id, // .. with an ID that matches one of the following.
        },
      });
      if (!createdGroups) return [];
      return createdGroups;
    } else {
      // Groups of which the user is a member
      const user = await prisma.user.findUnique({
        where: {
          id: get()._user?.id, // .. with an ID that matches one of the following.
        },
        include: {
          memberGroups: true,
        }
      });
      if (!user || !user.memberGroups) return [];
      return user.memberGroups;
    }
  },
}));
