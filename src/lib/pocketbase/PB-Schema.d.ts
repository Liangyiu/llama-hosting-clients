/**
 * This file was @generated using typed-pocketbase
 */

// https://pocketbase.io/docs/collections/#base-collection
export interface BaseCollectionResponse {
	/**
	 * 15 characters string to store as record ID.
	 */
	id: string;
	/**
	 * Date string representation for the creation date.
	 */
	created: string;
	/**
	 * Date string representation for the creation date.
	 */
	updated: string;
	/**
	 * The collection id.
	 */
	collectionId: string;
	/**
	 * The collection name.
	 */
	collectionName: string;
}

// https://pocketbase.io/docs/api-records/#create-record
export interface BaseCollectionCreate {
	/**
	 * 15 characters string to store as record ID.
	 * If not set, it will be auto generated.
	 */
	id?: string;
}

// https://pocketbase.io/docs/api-records/#update-record
export interface BaseCollectionUpdate {}

// https://pocketbase.io/docs/collections/#auth-collection
export interface AuthCollectionResponse extends BaseCollectionResponse {
	/**
	 * The username of the auth record.
	 */
	username: string;
	/**
	 * Auth record email address.
	 */
	email: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility: boolean;
	/**
	 * Indicates whether the auth record is verified or not.
	 */
	verified: boolean;
}

// https://pocketbase.io/docs/api-records/#create-record
export interface AuthCollectionCreate extends BaseCollectionCreate {
	/**
	 * The username of the auth record.
	 * If not set, it will be auto generated.
	 */
	username?: string;
	/**
	 * Auth record email address.
	 */
	email?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility?: boolean;
	/**
	 * Auth record password.
	 */
	password: string;
	/**
	 * Auth record password confirmation.
	 */
	passwordConfirm: string;
	/**
	 * Indicates whether the auth record is verified or not.
	 * This field can be set only by admins or auth records with "Manage" access.
	 */
	verified?: boolean;
}

// https://pocketbase.io/docs/api-records/#update-record
export interface AuthCollectionUpdate {
	/**
	 * The username of the auth record.
	 */
	username?: string;
	/**
	 * The auth record email address.
	 * This field can be updated only by admins or auth records with "Manage" access.
	 * Regular accounts can update their email by calling "Request email change".
	 */
	email?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility?: boolean;
	/**
	 * Old auth record password.
	 * This field is required only when changing the record password. Admins and auth records with "Manage" access can skip this field.
	 */
	oldPassword?: string;
	/**
	 * New auth record password.
	 */
	password?: string;
	/**
	 * New auth record password confirmation.
	 */
	passwordConfirm?: string;
	/**
	 * Indicates whether the auth record is verified or not.
	 * This field can be set only by admins or auth records with "Manage" access.
	 */
	verified?: boolean;
}

// https://pocketbase.io/docs/collections/#view-collection
export interface ViewCollectionRecord {
	id: string;
}

// utilities

type MaybeArray<T> = T | T[];

// ===== users =====

export interface UsersResponse extends AuthCollectionResponse {
	collectionName: 'users';
	first_name: string;
	last_name: string;
	user_details: string;
	mfa_totp: boolean;
	mfa_totp_secret_id: string;
}

export interface UsersCreate extends AuthCollectionCreate {
	first_name: string;
	last_name: string;
	user_details?: string;
	mfa_totp?: boolean;
	mfa_totp_secret_id?: string;
}

export interface UsersUpdate extends AuthCollectionUpdate {
	first_name?: string;
	last_name?: string;
	user_details?: string;
	mfa_totp?: boolean;
	mfa_totp_secret_id?: string;
}

export interface UsersCollection {
	type: 'auth';
	collectionId: string;
	collectionName: 'users';
	response: UsersResponse;
	create: UsersCreate;
	update: UsersUpdate;
	relations: {
		user_details: UserDetailsCollection;
		mfa_totp_secret_id: UserMfaTotpSecretsCollection;
		'invoices(user)': InvoicesCollection[];
		'orders(user)': OrdersCollection[];
		'ssh_keys(user)': SshKeysCollection[];
		'user_details_admin(user)': UserDetailsAdminCollection;
		'user_details(user)': UserDetailsCollection;
		'services(user)': ServicesCollection[];
		'deployed_vms(user)': DeployedVmsCollection[];
		'user_mfa_totp_secrets(user)': UserMfaTotpSecretsCollection;
	};
}

// ===== host_systems_vps =====

export interface HostSystemsVpsResponse extends BaseCollectionResponse {
	collectionName: 'host_systems_vps';
	identifier: string;
	cpu: string;
	ram: string;
	drives: string;
	datacenter: string;
	country: string;
	city: string;
}

export interface HostSystemsVpsCreate extends BaseCollectionCreate {
	identifier?: string;
	cpu?: string;
	ram?: string;
	drives?: string;
	datacenter?: string;
	country?: string;
	city?: string;
}

export interface HostSystemsVpsUpdate extends BaseCollectionUpdate {
	identifier?: string;
	cpu?: string;
	ram?: string;
	drives?: string;
	datacenter?: string;
	country?: string;
	city?: string;
}

export interface HostSystemsVpsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'host_systems_vps';
	response: HostSystemsVpsResponse;
	create: HostSystemsVpsCreate;
	update: HostSystemsVpsUpdate;
	relations: {
		'products(host_vps)': ProductsCollection[];
	};
}

// ===== invoices =====

export interface InvoicesResponse extends BaseCollectionResponse {
	collectionName: 'invoices';
	user: string;
	order: string;
	status: '' | 'sent' | 'paid' | 'refunded';
}

export interface InvoicesCreate extends BaseCollectionCreate {
	user?: string;
	order?: string;
	status?: '' | 'sent' | 'paid' | 'refunded';
}

export interface InvoicesUpdate extends BaseCollectionUpdate {
	user?: string;
	order?: string;
	status?: '' | 'sent' | 'paid' | 'refunded';
}

export interface InvoicesCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'invoices';
	response: InvoicesResponse;
	create: InvoicesCreate;
	update: InvoicesUpdate;
	relations: {
		user: UsersCollection;
		order: OrdersCollection;
		'services(invoice)': ServicesCollection[];
	};
}

// ===== orders =====

export interface OrdersResponse extends BaseCollectionResponse {
	collectionName: 'orders';
	user: string;
	status:
		| 'pending'
		| 'awaiting-payment'
		| 'completed'
		| 'cancelled'
		| 'declined'
		| 'refunded'
		| 'partially-refunded';
	product: string;
	order_details: string;
	order_total: number;
}

export interface OrdersCreate extends BaseCollectionCreate {
	user: string;
	status:
		| 'pending'
		| 'awaiting-payment'
		| 'completed'
		| 'cancelled'
		| 'declined'
		| 'refunded'
		| 'partially-refunded';
	product: string;
	order_details?: string;
	order_total: number;
}

export interface OrdersUpdate extends BaseCollectionUpdate {
	user?: string;
	status?:
		| 'pending'
		| 'awaiting-payment'
		| 'completed'
		| 'cancelled'
		| 'declined'
		| 'refunded'
		| 'partially-refunded';
	product?: string;
	order_details?: string;
	order_total?: number;
	'order_total+'?: number;
	'order_total-'?: number;
}

export interface OrdersCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'orders';
	response: OrdersResponse;
	create: OrdersCreate;
	update: OrdersUpdate;
	relations: {
		'invoices(order)': InvoicesCollection[];
		user: UsersCollection;
		product: ProductsCollection;
	};
}

// ===== products =====

export interface ProductsResponse extends BaseCollectionResponse {
	collectionName: 'products';
	product_key: string;
	product_name: string;
	type: 'vps' | 'webhosting' | 'clouddrive';
	unit_price: number;
	status: 'active' | 'archived' | 'deleted' | 'draft' | 'sale' | 'promo';
	config_vps: string;
	host_vps: string;
	available_from: string;
	available_until: string;
}

export interface ProductsCreate extends BaseCollectionCreate {
	product_key: string;
	product_name?: string;
	type: 'vps' | 'webhosting' | 'clouddrive';
	unit_price: number;
	status: 'active' | 'archived' | 'deleted' | 'draft' | 'sale' | 'promo';
	config_vps?: string;
	host_vps?: string;
	available_from?: string | Date;
	available_until?: string | Date;
}

export interface ProductsUpdate extends BaseCollectionUpdate {
	product_key?: string;
	product_name?: string;
	type?: 'vps' | 'webhosting' | 'clouddrive';
	unit_price?: number;
	'unit_price+'?: number;
	'unit_price-'?: number;
	status?: 'active' | 'archived' | 'deleted' | 'draft' | 'sale' | 'promo';
	config_vps?: string;
	host_vps?: string;
	available_from?: string | Date;
	available_until?: string | Date;
}

export interface ProductsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'products';
	response: ProductsResponse;
	create: ProductsCreate;
	update: ProductsUpdate;
	relations: {
		'orders(product)': OrdersCollection[];
		config_vps: ProductConfigVpsCollection;
		host_vps: HostSystemsVpsCollection;
		'services(product)': ServicesCollection[];
		'deployed_vms(product)': DeployedVmsCollection[];
	};
}

// ===== ssh_keys =====

export interface SshKeysResponse extends BaseCollectionResponse {
	collectionName: 'ssh_keys';
	user: string;
	public_key: string;
	key_name: string;
	is_default: boolean;
}

export interface SshKeysCreate extends BaseCollectionCreate {
	user: string;
	public_key: string;
	key_name?: string;
	is_default?: boolean;
}

export interface SshKeysUpdate extends BaseCollectionUpdate {
	user?: string;
	public_key?: string;
	key_name?: string;
	is_default?: boolean;
}

export interface SshKeysCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'ssh_keys';
	response: SshKeysResponse;
	create: SshKeysCreate;
	update: SshKeysUpdate;
	relations: {
		user: UsersCollection;
		'user_details(default_ssh_keys)': UserDetailsCollection[];
	};
}

// ===== user_details_admin =====

export interface UserDetailsAdminResponse extends BaseCollectionResponse {
	collectionName: 'user_details_admin';
	user: string;
	in_id: string;
	balance: number;
}

export interface UserDetailsAdminCreate extends BaseCollectionCreate {
	user?: string;
	in_id?: string;
	balance?: number;
}

export interface UserDetailsAdminUpdate extends BaseCollectionUpdate {
	user?: string;
	in_id?: string;
	balance?: number;
	'balance+'?: number;
	'balance-'?: number;
}

export interface UserDetailsAdminCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'user_details_admin';
	response: UserDetailsAdminResponse;
	create: UserDetailsAdminCreate;
	update: UserDetailsAdminUpdate;
	relations: {
		user: UsersCollection;
	};
}

// ===== user_details =====

export interface UserDetailsResponse extends BaseCollectionResponse {
	collectionName: 'user_details';
	user: string;
	address_line_one: string;
	address_line_two: string;
	address_city: string;
	address_postal_code: string;
	address_state_province: string;
	address_country: string;
	phone_number: string;
	vat_id: string;
	default_ssh_keys: Array<string>;
	avatar: string;
}

export interface UserDetailsCreate extends BaseCollectionCreate {
	user: string;
	address_line_one?: string;
	address_line_two?: string;
	address_city?: string;
	address_postal_code?: string;
	address_state_province?: string;
	address_country?: string;
	phone_number?: string;
	vat_id?: string;
	default_ssh_keys?: MaybeArray<string>;
	avatar?: File | null;
}

export interface UserDetailsUpdate extends BaseCollectionUpdate {
	user?: string;
	address_line_one?: string;
	address_line_two?: string;
	address_city?: string;
	address_postal_code?: string;
	address_state_province?: string;
	address_country?: string;
	phone_number?: string;
	vat_id?: string;
	default_ssh_keys?: MaybeArray<string>;
	'default_ssh_keys+'?: MaybeArray<string>;
	'default_ssh_keys-'?: MaybeArray<string>;
	avatar?: File | null;
}

export interface UserDetailsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'user_details';
	response: UserDetailsResponse;
	create: UserDetailsCreate;
	update: UserDetailsUpdate;
	relations: {
		'users(user_details)': UsersCollection[];
		user: UsersCollection;
		default_ssh_keys: SshKeysCollection[];
	};
}

// ===== services =====

export interface ServicesResponse extends BaseCollectionResponse {
	collectionName: 'services';
	custom_name: string;
	status: 'pending' | 'active' | 'inactive' | 'cancelled';
	product: string;
	type: 'webhosting' | 'vps' | 'dedicated' | 'mail';
	user: string;
	invoice: string;
}

export interface ServicesCreate extends BaseCollectionCreate {
	custom_name?: string;
	status: 'pending' | 'active' | 'inactive' | 'cancelled';
	product: string;
	type: 'webhosting' | 'vps' | 'dedicated' | 'mail';
	user: string;
	invoice: string;
}

export interface ServicesUpdate extends BaseCollectionUpdate {
	custom_name?: string;
	status?: 'pending' | 'active' | 'inactive' | 'cancelled';
	product?: string;
	type?: 'webhosting' | 'vps' | 'dedicated' | 'mail';
	user?: string;
	invoice?: string;
}

export interface ServicesCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'services';
	response: ServicesResponse;
	create: ServicesCreate;
	update: ServicesUpdate;
	relations: {
		product: ProductsCollection;
		user: UsersCollection;
		invoice: InvoicesCollection;
	};
}

// ===== product_config_vps =====

export interface ProductConfigVpsResponse extends BaseCollectionResponse {
	collectionName: 'product_config_vps';
	name: string;
	cores: number;
	ram: number;
	disk: number;
	ips: number;
	network_speed: number;
	backup_slots: number;
	storage: number;
	traffic: number;
}

export interface ProductConfigVpsCreate extends BaseCollectionCreate {
	name: string;
	cores: number;
	ram: number;
	disk: number;
	ips: number;
	network_speed: number;
	backup_slots: number;
	storage?: number;
	traffic?: number;
}

export interface ProductConfigVpsUpdate extends BaseCollectionUpdate {
	name?: string;
	cores?: number;
	'cores+'?: number;
	'cores-'?: number;
	ram?: number;
	'ram+'?: number;
	'ram-'?: number;
	disk?: number;
	'disk+'?: number;
	'disk-'?: number;
	ips?: number;
	'ips+'?: number;
	'ips-'?: number;
	network_speed?: number;
	'network_speed+'?: number;
	'network_speed-'?: number;
	backup_slots?: number;
	'backup_slots+'?: number;
	'backup_slots-'?: number;
	storage?: number;
	'storage+'?: number;
	'storage-'?: number;
	traffic?: number;
	'traffic+'?: number;
	'traffic-'?: number;
}

export interface ProductConfigVpsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'product_config_vps';
	response: ProductConfigVpsResponse;
	create: ProductConfigVpsCreate;
	update: ProductConfigVpsUpdate;
	relations: {
		'products(config_vps)': ProductsCollection[];
	};
}

// ===== deployed_vms =====

export interface DeployedVmsResponse extends BaseCollectionResponse {
	collectionName: 'deployed_vms';
	vmid_24fire: string;
	product: string;
	node: string;
	ipv4: any;
	ipv6: any;
	user: string;
}

export interface DeployedVmsCreate extends BaseCollectionCreate {
	vmid_24fire: string;
	product: string;
	node?: string;
	ipv4: any;
	ipv6: any;
	user: string;
}

export interface DeployedVmsUpdate extends BaseCollectionUpdate {
	vmid_24fire?: string;
	product?: string;
	node?: string;
	ipv4?: any;
	ipv6?: any;
	user?: string;
}

export interface DeployedVmsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'deployed_vms';
	response: DeployedVmsResponse;
	create: DeployedVmsCreate;
	update: DeployedVmsUpdate;
	relations: {
		product: ProductsCollection;
		user: UsersCollection;
	};
}

// ===== user_mfa_totp_secrets =====

export interface UserMfaTotpSecretsResponse extends BaseCollectionResponse {
	collectionName: 'user_mfa_totp_secrets';
	user: string;
	secret: string;
}

export interface UserMfaTotpSecretsCreate extends BaseCollectionCreate {
	user: string;
	secret: string;
}

export interface UserMfaTotpSecretsUpdate extends BaseCollectionUpdate {
	user?: string;
	secret?: string;
}

export interface UserMfaTotpSecretsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'user_mfa_totp_secrets';
	response: UserMfaTotpSecretsResponse;
	create: UserMfaTotpSecretsCreate;
	update: UserMfaTotpSecretsUpdate;
	relations: {
		'users(mfa_totp_secret_id)': UsersCollection[];
		user: UsersCollection;
	};
}

// ===== Schema =====

export type Schema = {
	users: UsersCollection;
	host_systems_vps: HostSystemsVpsCollection;
	invoices: InvoicesCollection;
	orders: OrdersCollection;
	products: ProductsCollection;
	ssh_keys: SshKeysCollection;
	user_details_admin: UserDetailsAdminCollection;
	user_details: UserDetailsCollection;
	services: ServicesCollection;
	product_config_vps: ProductConfigVpsCollection;
	deployed_vms: DeployedVmsCollection;
	user_mfa_totp_secrets: UserMfaTotpSecretsCollection;
};
