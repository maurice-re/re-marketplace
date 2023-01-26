import { Company, Location, Order, OrderItem, Product, Sku, User } from "@prisma/client";
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

interface serverStore {
  sessionLastUpdated: Date;
  _user: User | null;
  getUser: (refresh?: boolean, redirectUrl?: string) => Promise<User>;
  getCompany: (companyId: string) => Promise<Company | null>;
  getLocations: (userId: string) => Promise<Location[]>;
  getOrders: (userId: string) => Promise<OrderWithItems[]>;
  getSkus: () => Promise<SkuWithProduct[]>;
  
}

export const useServerStore = create<serverStore>((set, get) => ({
  _user: null,
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
  getCompany: async (companyId: string) => {
    return await prisma.company.findUnique({
      where: {
        id: companyId
      },
    });
  },
  getLocations: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        ownedLocations: true,
        viewableLocations: true,
      }
    });
    if (!user) return [];
    return [...user.ownedLocations, ...user.viewableLocations];
  },
  getOrders: async (userId) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
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
  getSkus: async () => {
    return await prisma.sku.findMany({
      include: {
        product: true,
      }
    });
  }
}));
