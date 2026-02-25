import { useAccountStore } from "@/store/useAccountStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useMarketingStore } from "@/store/useMarketingStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useProductStore } from "@/store/useProductStore";
import { useRolesStore } from "@/store/useRolesStore";
import { useSupportStore } from "@/store/useSupportStore";
import { useSystemConfigStore } from "@/store/useSystemConfigStore";
import { useTransfersStore } from "@/store/useTransfersStore";
import { useUserStore } from "@/store/useUserStore";

type ResettableStore = {
  getInitialState: () => object;
  setState: (nextState: object) => void;
};

const STORES: ResettableStore[] = [
  useAuthStore,
  useAccountStore,
  useDashboardStore,
  useFinanceStore,
  useInventoryStore,
  useMarketingStore,
  useOrderStore,
  useProductStore,
  useRolesStore,
  useSupportStore,
  useSystemConfigStore,
  useTransfersStore,
  useUserStore,
];

export function resetAllStores() {
  STORES.forEach((store) => {
    store.setState(store.getInitialState());
  });
}
