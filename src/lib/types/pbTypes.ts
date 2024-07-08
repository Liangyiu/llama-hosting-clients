/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	HostSystems = "host_systems",
	Invoices = "invoices",
	OrderItems = "order_items",
	Orders = "orders",
	Products = "products",
	Services = "services",
	SshKeys = "ssh_keys",
	UserDetails = "user_details",
	UserDetailsAdmin = "user_details_admin",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type HostSystemsRecord = {
	city?: string
	country?: string
	cpu?: string
	datacenter?: string
	drives?: string
	identifier?: string
	ram?: string
}

export enum InvoicesStatusOptions {
	"sent" = "sent",
	"paid" = "paid",
	"refunded" = "refunded",
}
export type InvoicesRecord = {
	order?: RecordIdString
	status?: InvoicesStatusOptions
	user?: RecordIdString
}

export type OrderItemsRecord = {
	amount: number
	order: RecordIdString
	product: RecordIdString
}

export enum OrdersStatusOptions {
	"pending" = "pending",
	"awaiting-payment" = "awaiting-payment",
	"completed" = "completed",
	"cancelled" = "cancelled",
	"declined" = "declined",
	"refunded" = "refunded",
	"partially-refunded" = "partially-refunded",
}
export type OrdersRecord = {
	order_details?: HTMLString
	order_total: number
	status: OrdersStatusOptions
	user: RecordIdString
}

export enum ProductsStatusOptions {
	"active" = "active",
	"archived" = "archived",
	"deleted" = "deleted",
	"draft" = "draft",
}
export type ProductsRecord = {
	custom_value1: string
	product_details?: string
	product_key: string
	status: ProductsStatusOptions
	unit_price: number
}

export enum ServicesStatusOptions {
	"pending" = "pending",
	"active" = "active",
	"inactive" = "inactive",
	"cancelled" = "cancelled",
}

export enum ServicesTypeOptions {
	"webhosting" = "webhosting",
	"vps" = "vps",
	"dedicated" = "dedicated",
	"mail" = "mail",
}
export type ServicesRecord = {
	custom_name?: string
	invoice: RecordIdString
	product: RecordIdString
	status: ServicesStatusOptions
	type: ServicesTypeOptions
	user: RecordIdString
}

export type SshKeysRecord = {
	key_name?: string
	public_key: string
	user: RecordIdString
}

export type UserDetailsRecord = {
	address_city?: string
	address_country?: string
	address_line_one?: string
	address_line_two?: string
	address_postal_code?: string
	address_state_province?: string
	avatar?: string
	default_ssh_keys?: RecordIdString[]
	phone_number?: string
	user: RecordIdString
	vat_id?: string
}

export type UserDetailsAdminRecord = {
	balance?: number
	in_id?: string
	user?: RecordIdString
}

export type UsersRecord = {
	first_name: string
	last_name: string
	user_details?: RecordIdString
}

// Response types include system fields and match responses from the PocketBase API
export type HostSystemsResponse<Texpand = unknown> = Required<HostSystemsRecord> & BaseSystemFields<Texpand>
export type InvoicesResponse<Texpand = unknown> = Required<InvoicesRecord> & BaseSystemFields<Texpand>
export type OrderItemsResponse<Texpand = unknown> = Required<OrderItemsRecord> & BaseSystemFields<Texpand>
export type OrdersResponse<Texpand = unknown> = Required<OrdersRecord> & BaseSystemFields<Texpand>
export type ProductsResponse<Texpand = unknown> = Required<ProductsRecord> & BaseSystemFields<Texpand>
export type ServicesResponse<Texpand = unknown> = Required<ServicesRecord> & BaseSystemFields<Texpand>
export type SshKeysResponse<Texpand = unknown> = Required<SshKeysRecord> & BaseSystemFields<Texpand>
export type UserDetailsResponse<Texpand = unknown> = Required<UserDetailsRecord> & BaseSystemFields<Texpand>
export type UserDetailsAdminResponse<Texpand = unknown> = Required<UserDetailsAdminRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	host_systems: HostSystemsRecord
	invoices: InvoicesRecord
	order_items: OrderItemsRecord
	orders: OrdersRecord
	products: ProductsRecord
	services: ServicesRecord
	ssh_keys: SshKeysRecord
	user_details: UserDetailsRecord
	user_details_admin: UserDetailsAdminRecord
	users: UsersRecord
}

export type CollectionResponses = {
	host_systems: HostSystemsResponse
	invoices: InvoicesResponse
	order_items: OrderItemsResponse
	orders: OrdersResponse
	products: ProductsResponse
	services: ServicesResponse
	ssh_keys: SshKeysResponse
	user_details: UserDetailsResponse
	user_details_admin: UserDetailsAdminResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'host_systems'): RecordService<HostSystemsResponse>
	collection(idOrName: 'invoices'): RecordService<InvoicesResponse>
	collection(idOrName: 'order_items'): RecordService<OrderItemsResponse>
	collection(idOrName: 'orders'): RecordService<OrdersResponse>
	collection(idOrName: 'products'): RecordService<ProductsResponse>
	collection(idOrName: 'services'): RecordService<ServicesResponse>
	collection(idOrName: 'ssh_keys'): RecordService<SshKeysResponse>
	collection(idOrName: 'user_details'): RecordService<UserDetailsResponse>
	collection(idOrName: 'user_details_admin'): RecordService<UserDetailsAdminResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
