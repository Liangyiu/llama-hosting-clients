/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	DeployedVms = "deployed_vms",
	HostSystemsVps = "host_systems_vps",
	Invoices = "invoices",
	Orders = "orders",
	ProductConfigVps = "product_config_vps",
	Products = "products",
	Services = "services",
	SshKeys = "ssh_keys",
	TicketMessages = "ticket_messages",
	Tickets = "tickets",
	UserDetails = "user_details",
	UserDetailsAdmin = "user_details_admin",
	UserMfaTotpSecrets = "user_mfa_totp_secrets",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
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

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type DeployedVmsRecord<Tipv4 = unknown, Tipv6 = unknown> = {
	created?: IsoDateString
	id: string
	ipv4: null | Tipv4
	ipv6: null | Tipv6
	node?: string
	product: RecordIdString
	updated?: IsoDateString
	user: RecordIdString
	vmid_24fire: string
}

export type HostSystemsVpsRecord = {
	city?: string
	country?: string
	cpu?: string
	created?: IsoDateString
	datacenter?: string
	drives?: string
	id: string
	identifier?: string
	ram?: string
	updated?: IsoDateString
}

export enum InvoicesStatusOptions {
	"sent" = "sent",
	"paid" = "paid",
	"refunded" = "refunded",
}
export type InvoicesRecord = {
	created?: IsoDateString
	id: string
	order?: RecordIdString
	status?: InvoicesStatusOptions
	updated?: IsoDateString
	user?: RecordIdString
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
	created?: IsoDateString
	id: string
	order_details?: HTMLString
	order_total: number
	product: RecordIdString
	status: OrdersStatusOptions
	updated?: IsoDateString
	user: RecordIdString
}

export type ProductConfigVpsRecord = {
	backup_slots: number
	cores: number
	created?: IsoDateString
	disk: number
	id: string
	ips: number
	name: string
	network_speed: number
	ram: number
	storage?: number
	traffic?: number
	updated?: IsoDateString
}

export enum ProductsTypeOptions {
	"vps" = "vps",
	"webhosting" = "webhosting",
	"clouddrive" = "clouddrive",
}

export enum ProductsStatusOptions {
	"active" = "active",
	"archived" = "archived",
	"deleted" = "deleted",
	"draft" = "draft",
	"sale" = "sale",
	"promo" = "promo",
}
export type ProductsRecord = {
	available_from?: IsoDateString
	available_until?: IsoDateString
	config_vps?: RecordIdString
	created?: IsoDateString
	host_vps?: RecordIdString
	id: string
	product_key: string
	product_name?: string
	status: ProductsStatusOptions
	type: ProductsTypeOptions
	unit_price: number
	updated?: IsoDateString
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
	created?: IsoDateString
	custom_name?: string
	id: string
	invoice: RecordIdString
	product: RecordIdString
	status: ServicesStatusOptions
	type: ServicesTypeOptions
	updated?: IsoDateString
	user: RecordIdString
}

export type SshKeysRecord = {
	created?: IsoDateString
	id: string
	is_default?: boolean
	key_name?: string
	public_key: string
	updated?: IsoDateString
	user: RecordIdString
}

export type TicketMessagesRecord = {
	created?: IsoDateString
	id: string
	message: HTMLString
	ticket: RecordIdString
	updated?: IsoDateString
	user: RecordIdString
}

export enum TicketsCategoryOptions {
	"product-information" = "product-information",
	"technical" = "technical",
	"outage" = "outage",
	"billing" = "billing",
	"other" = "other",
}

export enum TicketsPriorityOptions {
	"1-high" = "1-high",
	"2-medium" = "2-medium",
	"3-low" = "3-low",
}

export enum TicketsStatusOptions {
	"closed" = "closed",
	"open" = "open",
	"answered" = "answered",
	"customer-reply" = "customer-reply",
}
export type TicketsRecord = {
	category: TicketsCategoryOptions
	created?: IsoDateString
	id: string
	priority: TicketsPriorityOptions
	readable_id: string
	service?: RecordIdString
	status: TicketsStatusOptions
	subject: string
	updated?: IsoDateString
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
	created?: IsoDateString
	default_ssh_keys?: RecordIdString[]
	id: string
	phone_number?: string
	updated?: IsoDateString
	user: RecordIdString
	vat_id?: string
}

export type UserDetailsAdminRecord = {
	balance?: number
	created?: IsoDateString
	id: string
	is_admin?: boolean
	is_support?: boolean
	updated?: IsoDateString
	user?: RecordIdString
}

export type UserMfaTotpSecretsRecord = {
	created?: IsoDateString
	id: string
	secret: string
	updated?: IsoDateString
	user: RecordIdString
}

export type UsersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	first_name: string
	id: string
	last_name: string
	mfa_totp?: boolean
	mfa_totp_secret_id?: RecordIdString
	password: string
	tokenKey: string
	updated?: IsoDateString
	user_details?: RecordIdString
	username: string
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type DeployedVmsResponse<Tipv4 = unknown, Tipv6 = unknown, Texpand = unknown> = Required<DeployedVmsRecord<Tipv4, Tipv6>> & BaseSystemFields<Texpand>
export type HostSystemsVpsResponse<Texpand = unknown> = Required<HostSystemsVpsRecord> & BaseSystemFields<Texpand>
export type InvoicesResponse<Texpand = unknown> = Required<InvoicesRecord> & BaseSystemFields<Texpand>
export type OrdersResponse<Texpand = unknown> = Required<OrdersRecord> & BaseSystemFields<Texpand>
export type ProductConfigVpsResponse<Texpand = unknown> = Required<ProductConfigVpsRecord> & BaseSystemFields<Texpand>
export type ProductsResponse<Texpand = unknown> = Required<ProductsRecord> & BaseSystemFields<Texpand>
export type ServicesResponse<Texpand = unknown> = Required<ServicesRecord> & BaseSystemFields<Texpand>
export type SshKeysResponse<Texpand = unknown> = Required<SshKeysRecord> & BaseSystemFields<Texpand>
export type TicketMessagesResponse<Texpand = unknown> = Required<TicketMessagesRecord> & BaseSystemFields<Texpand>
export type TicketsResponse<Texpand = unknown> = Required<TicketsRecord> & BaseSystemFields<Texpand>
export type UserDetailsResponse<Texpand = unknown> = Required<UserDetailsRecord> & BaseSystemFields<Texpand>
export type UserDetailsAdminResponse<Texpand = unknown> = Required<UserDetailsAdminRecord> & BaseSystemFields<Texpand>
export type UserMfaTotpSecretsResponse<Texpand = unknown> = Required<UserMfaTotpSecretsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	deployed_vms: DeployedVmsRecord
	host_systems_vps: HostSystemsVpsRecord
	invoices: InvoicesRecord
	orders: OrdersRecord
	product_config_vps: ProductConfigVpsRecord
	products: ProductsRecord
	services: ServicesRecord
	ssh_keys: SshKeysRecord
	ticket_messages: TicketMessagesRecord
	tickets: TicketsRecord
	user_details: UserDetailsRecord
	user_details_admin: UserDetailsAdminRecord
	user_mfa_totp_secrets: UserMfaTotpSecretsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	deployed_vms: DeployedVmsResponse
	host_systems_vps: HostSystemsVpsResponse
	invoices: InvoicesResponse
	orders: OrdersResponse
	product_config_vps: ProductConfigVpsResponse
	products: ProductsResponse
	services: ServicesResponse
	ssh_keys: SshKeysResponse
	ticket_messages: TicketMessagesResponse
	tickets: TicketsResponse
	user_details: UserDetailsResponse
	user_details_admin: UserDetailsAdminResponse
	user_mfa_totp_secrets: UserMfaTotpSecretsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'deployed_vms'): RecordService<DeployedVmsResponse>
	collection(idOrName: 'host_systems_vps'): RecordService<HostSystemsVpsResponse>
	collection(idOrName: 'invoices'): RecordService<InvoicesResponse>
	collection(idOrName: 'orders'): RecordService<OrdersResponse>
	collection(idOrName: 'product_config_vps'): RecordService<ProductConfigVpsResponse>
	collection(idOrName: 'products'): RecordService<ProductsResponse>
	collection(idOrName: 'services'): RecordService<ServicesResponse>
	collection(idOrName: 'ssh_keys'): RecordService<SshKeysResponse>
	collection(idOrName: 'ticket_messages'): RecordService<TicketMessagesResponse>
	collection(idOrName: 'tickets'): RecordService<TicketsResponse>
	collection(idOrName: 'user_details'): RecordService<UserDetailsResponse>
	collection(idOrName: 'user_details_admin'): RecordService<UserDetailsAdminResponse>
	collection(idOrName: 'user_mfa_totp_secrets'): RecordService<UserMfaTotpSecretsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
