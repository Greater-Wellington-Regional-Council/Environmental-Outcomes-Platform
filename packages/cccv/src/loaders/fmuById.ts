import freshwaterManagementService from "@services/FreshwaterManagementUnits.ts";

const loadFmuById = async ({ params }: never) => await freshwaterManagementService.getById((params as { id: number })?.id);

export default loadFmuById
