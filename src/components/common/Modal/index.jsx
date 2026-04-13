import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-ink/45 backdrop-blur-sm" />
      <div className="fixed inset-0 overflow-y-auto p-4">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel className="w-full max-w-4xl rounded-[2rem] bg-white p-6 shadow-soft md:p-8">
            {title ? <h3 className="text-2xl font-semibold text-ink">{title}</h3> : null}
            <div className={title ? 'mt-6' : ''}>{children}</div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
