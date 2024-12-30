class SidebarStore {
	visible: boolean = $state(false);

	getVisibility() {
		return this.visible;
	}

	close() {
		this.visible = false;
	}

	setVisibility(state: boolean) {
		this.visible = state;
	}
}

export const createSidebarStore = () => new SidebarStore();
