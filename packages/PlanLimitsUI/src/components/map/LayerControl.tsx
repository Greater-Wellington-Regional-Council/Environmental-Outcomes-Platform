import { memo, cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { useControl, type IControl } from 'react-map-gl/maplibre';

class OverlayControl implements IControl {
  _container: HTMLElement;

  constructor(container: HTMLDivElement) {
    this._container = container;
  }

  onAdd() {
    return this._container;
  }

  onRemove() {
    this._container.remove();
  }

  getElement() {
    return this._container;
  }
}

function CustomOverlay(props: { children: React.ReactElement }) {
  const ctrl = useControl<OverlayControl>(
    () => {
      const container = document.createElement('div');
      container.className = 'float-left mb-2.5 ml-2.5';

      return new OverlayControl(container);
    },
    { position: 'bottom-left' },
  );

  return createPortal(cloneElement(props.children), ctrl.getElement());
}

export default memo(CustomOverlay);
