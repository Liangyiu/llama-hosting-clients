<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
</script>

<Card.Root class="mx-auto w-full max-w-4xl">
	<Card.Header>
		<Card.Title>Account Settings</Card.Title>
		<Card.Description>Update your personal information and address details.</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="space-y-8">
			<div class="grid gap-6 sm:grid-cols-2">
				<div>
					<Label for="first_name">First name</Label>
					<Input id="first_name" placeholder="Max" type="text" autocomplete="given-name" />
				</div>
				<div>
					<Label for="last_name">Last name</Label>
					<Input id="last_name" placeholder="Robinson" type="text" autocomplete="family-name" />
				</div>
			</div>
			<div class="space-y-4">
				<h3 class="text-lg font-medium">Address Information</h3>
				<div class="grid gap-4">
					<div>
						<Label for="address_line_1">Address Line 1</Label>
						<Input
							id="address_line_1"
							type="text"
							autocomplete="address-line1"
							placeholder="123 Main Street"
						/>
					</div>
					<div>
						<Label for="address_line_2">Address Line 2</Label>
						<Input
							id="address_line_2"
							type="text"
							autocomplete="address-line2"
							placeholder="Suite 123"
						/>
					</div>
				</div>

				<div class="grid gap-6 sm:grid-cols-2">
					<div>
						<Label for="city">City</Label>
						<Input id="city" type="text" placeholder="New Jersey" />
					</div>
					<div>
						<Label for="state">State/Province</Label>
						<Input id="state" type="text" placeholder="New York" />
					</div>
				</div>

				<div class="grid gap-6 sm:grid-cols-2">
					<div>
						<Label for="postal_code">Postal Code</Label>
						<Input id="postal_code" type="text" autocomplete="postal-code" placeholder="A1A 1A1" />
					</div>
					<div>
						<Label for="country">Country</Label>
						<Input id="country" type="text" autocomplete="country" placeholder="United States" />
					</div>
				</div>
			</div>

			<div class="space-y-4">
				<h3 class="text-lg font-medium">Additional Information</h3>
				<div class="grid gap-6 sm:grid-cols-2">
					<div>
						<Label for="vat-id">VAT ID (optional)</Label>
						<Input id="vat-id" type="text" placeholder="DE123812039809" />
					</div>

					<div>
						<Label for="phone-no">Phone Number</Label>
						<Input id="phone-no" type="text" placeholder="+1 (555) 123-4567" />
					</div>
				</div>
			</div>
		</div>
	</Card.Content>
	<Card.Footer>
		<Button variant="outline"
			><span class="flex items-center gap-2">
				<span
					class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
				>
				</span>
				Saving...
			</span></Button
		>
	</Card.Footer>
</Card.Root>
