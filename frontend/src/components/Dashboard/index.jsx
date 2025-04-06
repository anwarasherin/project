import { useState } from "react";
import { MdOutlineAdd } from "react-icons/md";
import { FaUpload } from "react-icons/fa6";
import Select from "react-select";

import Button from "../common/Button";
import PageTitle from "../common/PageTitle";
import Modal from "../common/Modal";
import useFetch from "../../hooks/useFetch";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

function Dashboard() {
  const { data: files = [], loading, error } = useFetch("/api/courses");
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  const handleAddNewFileClick = () => {
    setUploadModalOpen(true);
  };

  const handleOnCancel = () => {
    setUploadModalOpen(false);
    setSelectedFile(null);
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
        selectedFile={selectedFile}
        onCancel={handleOnCancel}
        handleFileChange={handleFileChange}
      />
    </div>
  );
}

const UploadFileModal = ({
  isOpen,
  setOpen,
  onProceed,
  onCancel,
  selectedFile,
  handleFileChange,
}) => {
  return (
    <Modal isOpen={isOpen} close={onCancel}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center text-black">
          Upload File
        </h2>

        <div className="flex flex-col p-4 border-1 gap-1 justify-center items-center border-dashed border-gray-500 border-spacing-1">
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            accept=".jpg, .jpeg, .png, .pdf"
            onChange={handleFileChange}
          />
          <label
            htmlFor="fileUpload"
            className="flex flex-col items-center justify-center"
          >
            <FaUpload className="text-2xl text-gray-500" />
            <div className="text-gray-500">Upload</div>
            {selectedFile && (
              <div className="text-base text-gray-500">{selectedFile.name}</div>
            )}
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-semibold">Share To Multiple Users</div>
          <Select
            isMulti
            name="options"
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        <div className="flex flex-row justify-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Proceed
          </button>
        </div>
      </div>
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
