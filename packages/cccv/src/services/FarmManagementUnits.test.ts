import service from '@services/FarmManagementUnits';

describe('FarmManagementUnits service', () => {
  it('should return a FarmManagementUnits service with required functions', () => {
    expect(service.getByLngAndLat).toBeDefined();
  });
});