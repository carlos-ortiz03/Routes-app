import React from "react";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white text-black p-8 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
        <p className="mb-4">
          This app generates routes for your activities. Please be aware that
          the generated routes are suggestions and may not always be safe or
          accessible. Always use caution and check the route conditions before
          starting your activity.
        </p>
        <button
          onClick={onClose}
          className="bg-[#298B45] text-white px-4 py-2 rounded-md hover:bg-[#2B2929] transition duration-300"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default DisclaimerModal;
