import { Link } from "react-router-dom";
import { MdOutlineAdd } from "react-icons/md";

import Button from "../common/Button";
import PageTitle from "../common/PageTitle";
import Modal from "../common/Modal";
import useFetch from "../../hooks/useFetch";
import { useState } from "react";

function Dashboard() {
  const { data: files = [], loading, error } = useFetch("/api/courses");
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  const handleAddNewFileClick = () => {
    setUploadModalOpen(true);
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <PageTitle title="Dashboard" />
      <ActionButtons onClick={handleAddNewFileClick} />
      <div className="flex flex-row flex-wrap gap-2">
        {!files?.length && (
          <div className="flex flex-col flex-grow justify-center items-center h-[50vh]">
            <div className="text-3xl font-bold text-gray-600">
              No Files Found
            </div>
          </div>
        )}
      </div>
      <UploadFileModal
        isOpen={isUploadModalOpen}
        setOpen={setUploadModalOpen}
      />
    </div>
  );
}

const UploadFileModal = ({ isOpen, setOpen }) => {
  return (
    <Modal isOpen={isOpen} close={setOpen}>
      Meow meow
    </Modal>
  );
};

const ActionButtons = ({ onClick }) => {
  return (
    <div className="flex flex-row justify-end">
      <Button onClick={onClick}>
        <MdOutlineAdd size="24" color="white" />
        <span>New File</span>
      </Button>
    </div>
  );
};

export default Dashboard;
