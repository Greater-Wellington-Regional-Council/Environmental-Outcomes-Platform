import service from '@services/FreshwaterManagementUnits.ts';

describe('FreshwaterManagementUnits service', () => {
  it('should return a FreshwaterManagementUnits service with required functions', () => {
    expect(service.getByLngAndLat).toBeDefined();
  });
});