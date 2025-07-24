import { Fragment } from "@/generated/prisma";
import { create } from "zustand";

export const fragmentStore = create<{
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}>((set) => ({
  activeFragment: null,
  setActiveFragment: (fragment) => set({ activeFragment: fragment }),
}));
