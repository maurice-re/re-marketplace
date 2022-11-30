import { User } from ".prisma/client";
import create from "zustand";

interface AuthStore {
    user: User | undefined,
    setUser: (user: User) => void,
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: undefined,
    setUser: (user: User) => set({ user }),
}));