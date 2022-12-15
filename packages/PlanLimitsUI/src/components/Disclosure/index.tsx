import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import Button from '../Button';

export default function Disclosure() {
  let [isOpen, setIsOpen] = useState(true);

  return (
    <Dialog
      open={isOpen}
      // onClose is a required prop of Dialog, but we don't want to take any
      // action, so make it a no-op
      onClose={() => {}}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="mx-auto max-w-xl rounded bg-white p-6">
          <Dialog.Title className="text-xl mb-4">
            Greater Wellington Freshwater Plan Limits Viewer
          </Dialog.Title>

          <p className="mb-2 uppercase">Conditions of use</p>
          <p className="mb-4">
            Greater Wellington Regional Council's mapping service provides many
            layers of regional data and information, as compiled by Greater
            Wellington Regional Council and/or supplied by various government
            and utility agencies. All reasonable efforts are made to ensure the
            currency and accuracy of the information contained in this viewer.
            Whilst due care has been taken in providing this website, all
            information should be considered as being illustrative and
            indicative only. Your use of information from this website is
            entirely at your own risk.
          </p>
          <div className="flex justify-end">
            <Button
              onClick={() => setIsOpen(false)}
              text={'Agree and continue'}
            ></Button>
          </div>
        </Dialog.Panel>
         
      </div>
    </Dialog>
  );
}
