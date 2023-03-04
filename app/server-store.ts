import { Company, Location, Order, OrderItem, Product, Sku, User, Group, Settings, Event } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { create } from "zustand";
import { prisma } from "../constants/prisma";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export type OrderWithItems = Order & {
  items: OrderItem[];
};

export type SkuWithProduct = Sku & {
  product: Product;
};

/* Location with all required additional fields. */
export type FullLocation = Location & {
  settings: Settings | null;
  events: Event[];
  orders: OrderWithItems[];
  groups: FullGroup[];
  viewers: User[];
  owners: User[];
};

/* Location with all required additional fields. */
export type FullGroup = Group & {
  locations: FullLocation[];
  members: User[];
};

interface ServerStore {
  sessionLastUpdated: Date;
  _user: User | null;
  _company: Company | null;
  getUser: (refresh?: boolean, redirectUrl?: string) => Promise<User>;
  getCompany: () => Promise<Company>;
  getLocations: (owned: boolean) => Promise<FullLocation[]>;
  getLocationUsers: (locationId: string, owned: boolean) => Promise<User[]>;
  getLocationUserEmails: (locationId: string, owned: boolean) => Promise<string[]>;
  getGroupMemberEmails: (groupId: string) => Promise<string[]>;
  getLocationById: (locationId: string) => Promise<FullLocation>;
  getOrders: () => Promise<OrderWithItems[]>;
  getSkus: () => Promise<SkuWithProduct[]>;
  getOrderItems: (orderId: string) => Promise<OrderItem[]>;
  getGroups: (created: boolean) => Promise<Group[]>;
  getGroupLocations: (groupId: string) => Promise<FullLocation[]>;
  getGroupById: (groupId: string) => Promise<FullGroup>;
}

export const useServerStore = create<ServerStore>((set, get) => ({
  _user: null,
  _company: null,
  sessionLastUpdated: new Date(1, 1, 1970),
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
      include: {
        settings: true,
        events: true,
        orders: true
      }
    });
    return location as FullLocation;
  },
  getGroupById: async (groupId: string) => {
    const group = await prisma.group.findUnique({
      where: {
        id: groupId
      },
      include: {
        locations: {
          include: {
            orders: {
              include: {
                items: true
              }
            },
            settings: true,
            events: true,
          },
        },
        members: true,
      }
    });
    return group as FullGroup;
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
        ownedLocations: {
          include: {
            orders: {
              include: {
                items: true
              }
            },
            settings: true,
            events: true,
          },
        },
        viewableLocations: {
          include: {
            orders: {
              include: {
                items: true
              }
            },
            settings: true,
            events: true,
          },
        },
      }
    });
    if (!user) return [];
    return owned ? [...user.ownedLocations as FullLocation[]] : [...user.viewableLocations as FullLocation[]];
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
    const ownerEmails: string[] = [];
    const viewerEmails: string[] = [];
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
    const groupMemberEmails: string[] = [];
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
    const user = await get().getUser();
    if (!user) return [];
    const orders = await prisma.user.findUnique({
      where: {
        id: user.id
      },
      include: {
        ownedLocations: {
          include: {
            orders: {
              include: {
                items: true
              }
            },
            settings: true,
            events: true,
          },
        },
        viewableLocations: {
          include: {
            orders: {
              include: {
                items: true
              }
            },
            settings: true,
            events: true,
          }
        }
      }
    });
    if (!orders) return [];
    const ownedOrders = orders.ownedLocations.flatMap(location => location.orders);
    const viewableOrders = orders.viewableLocations.flatMap(location => location.orders);
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
        locations: {
          include: {
            orders: {
              include: {
                items: true
              }
            },
            settings: true,
            events: true,
          },
        },
      }
    });
    if (!group) return [];
    return group.locations as FullLocation[];
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
