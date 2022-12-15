import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import Button from '../Button';

export default function Disclosure() {
  let [isOpen, setIsOpen] = useState(true);

  return (
    <Dialog
      open={isOpen}
      // onClose is a required prop of Dialog to handle a user pressing escape or
      // clicking outside the dialog. We don't want to take any, so it's no-op.
      onClose={() => {}}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="mx-auto max-w-2xl rounded bg-white p-6">
          <Dialog.Title className="text-xl mb-4">
            Greater Wellington Freshwater Plan Limits Viewer
          </Dialog.Title>
          <h3 className="mb-2 uppercase">Conditions of use</h3>
          <p className="mb-4">
            Your use of this website is subject to the following conditions and
            all applicable laws. By accessing and browsing this website you
            accept, without limitation or qualifications, that you have read,
            understood and agree to these terms below:
          </p>
          <div className="mb-4 h-80 overflow-scroll border rounded p-2">
            <ol className="list-decimal list-inside">
              <li className="mb-2 text-sm">
                Wellington Regional Council aims for information in this website
                to be accurate, however we do not warranty the information is
                error-free or up-to-date. We do not accept any responsibility of
                liability for any action taken or omission made as a result of
                reliance placed on the Council because of having read part or
                all of this website or any linked sites or for any error or
                inadequacy in the information contain in this website.
              </li>
              <li className="mb-2 text-sm">
                Where appropriate, external links have been provided for your
                convenience. The Council does not accept any responsibility for
                the content or condition of any external links on this site.
              </li>
              <li className="mb-2 text-sm">
                Information contained in the website cannot be used in legal
                disputes.
              </li>
              <li className="mb-2 text-sm">
                Whilst due care had been taken in providing this website, all
                information should be considered as being illustrative and
                indicative only. Your use of information from this website is
                entirely at your own risk and we recommend that information be
                interdependently verified before any action is taken in reliance
                on it.
              </li>
              <li className="mb-2 text-sm">
                The Council may modify, alter or otherwise update the terms
                applicable to this website from time to time. You agree to check
                these terms and conditions regularly and be bound by such terms
                as are in effect at the time you access this website.
              </li>
              <li className="mb-2 text-sm">
                Your use of this website and the terms shall be governed by the
                laws of New Zealand without reference to principles of conflict
                laws.
              </li>
            </ol>
          </div>
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
