import { hasAnyPermission, hasAnyRole } from "@/lib/permissions";

type AccountLike = Parameters<typeof hasAnyRole>[0];

export function getSidebarPermissions(account: AccountLike) {
  return {
    canViewProductManagement:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "products.view",
        "product.view",
        "products.read",
        "product.read",
        "product-management.view",
      ]),
    canViewInventoryManagement:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "inventory.view",
        "inventories.view",
        "inventory.read",
        "inventories.read",
        "inventory-management.view",
      ]),
    canViewSalesManagement:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "sales.view",
        "sale.view",
        "sales.read",
        "sale.read",
        "sales-management.view",
      ]),
    canViewFinanceManagement:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "finance.view",
        "finances.view",
        "finance.read",
        "finances.read",
        "finance-management.view",
      ]),
    canViewOrderManagement:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "orders.view",
        "order.view",
        "orders.read",
        "order.read",
        "order-management.view",
      ]),
    canViewCustomerSupport:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "support.view",
        "customer-support.view",
        "customer.support.view",
        "support.ticket.view",
        "support.tickets.view",
        "tickets.view",
        "ticket.view",
        "support.read",
        "tickets.read",
        "ticket.read",
        "customer-support.read",
      ]),
  };
}

export function getProductPermissions(account: AccountLike) {
  return {
    canViewProducts:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "products.view",
        "product.view",
        "products.read",
        "product.read",
        "product-management.view",
      ]),
    canCreateProducts:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "products.create",
        "product.create",
        "product-management.create",
      ]),
    canEditProducts:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "products.update",
        "product.update",
        "products.edit",
        "product.edit",
        "product-management.update",
      ]),
    canDeleteProducts:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "products.delete",
        "product.delete",
        "product-management.delete",
      ]),
    canPublishProducts:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "products.publish",
        "product.publish",
        "products.unpublish",
        "product.unpublish",
        "product-management.publish",
      ]),
  };
}

export function getFinancePermissions(account: AccountLike) {
  return {
    canViewFinanceModule:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "finance.view",
        "finances.view",
        "finance.read",
        "finances.read",
        "finance-management.view",
      ]),
    canViewFinanceOverview:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "finance.overview.view",
        "finance.view.overview",
        "finances.overview.view",
      ]),
    canViewFinanceTransactions:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "finance.transactions.view",
        "finance.transaction.view",
        "finance.view.transactions",
        "finances.transactions.view",
      ]),
    canViewFinanceRefunds:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "finance.refunds.view",
        "finance.refund.view",
        "finance.view.refunds",
        "finances.refunds.view",
      ]),
  };
}

export function getSalesPermissions(account: AccountLike) {
  return {
    canViewTargets:
      hasAnyRole(account, ["sales-rep", "sales-manager", "admin"]) ||
      hasAnyPermission(account, [
        "sales.targets.view",
        "sales.target.view",
        "sales.view.targets",
      ]),
    canViewCommissions:
      hasAnyRole(account, ["sales-rep", "sales-manager", "admin"]) ||
      hasAnyPermission(account, [
        "sales.commissions.view",
        "sales.commission.view",
        "sales.view.commissions",
      ]),
    canRequestWithdrawal:
      hasAnyRole(account, ["sales-rep", "admin"]) ||
      hasAnyPermission(account, [
        "sales.withdrawals.create",
        "sales.withdrawal.create",
        "sales.request.withdrawal",
      ]),
  };
}

export function getOrderPermissions(account: AccountLike) {
  return {
    canViewOrderModule:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "orders.view",
        "order.view",
        "orders.read",
        "order.read",
        "order-management.view",
      ]),
    canViewOrderStats:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "orders.statistics.view",
        "order.statistics.view",
        "orders.stats.view",
        "order.stats.view",
        "orders.view.statistics",
        "order.view.statistics",
      ]),
    canViewOrderList:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "orders.list.view",
        "order.list.view",
        "orders.view",
        "order.view",
        "orders.read",
        "order.read",
        "order-management.view",
      ]),
    canViewOrderDetails:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "orders.details.view",
        "order.details.view",
        "orders.view.details",
        "order.view.details",
        "orders.single.view",
        "order.single.view",
      ]),
    canMarkOrderInTransit:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "orders.status.update",
        "order.status.update",
        "orders.mark-in-transit",
        "order.mark-in-transit",
        "orders.in-transit.update",
        "order.in-transit.update",
      ]),
    canIssueOrderRefund:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "orders.refund.create",
        "order.refund.create",
        "orders.issue-refund",
        "order.issue-refund",
        "orders.refund.update",
        "order.refund.update",
      ]),
    canAssignOrderRider:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "orders.rider.assign",
        "order.rider.assign",
        "orders.assign-rider",
        "order.assign-rider",
        "orders.delivery.assign",
        "order.delivery.assign",
      ]),
    canDeleteOrder:
      hasAnyRole(account, ["admin", "super-admin"]) ||
      hasAnyPermission(account, [
        "orders.delete",
        "order.delete",
        "orders.cancel",
        "order.cancel",
        "order-management.delete",
      ]),
  };
}
