import '@testing-library/jest-dom';

vi.mock('react-map-gl');

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: unknown) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
      useTranslation: vi.fn(),
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  }
}));