import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdOutlineAdd, MdOutlineDownload } from "react-icons/md";
import { FaUpload } from "react-icons/fa6";
import Select from "react-select";

import Button from "../common/Button";
import PageTitle from "../common/PageTitle";
import Modal from "../common/Modal";
import TLTable from "../common/TLTable";
import useFetch from "../../hooks/useFetch";
import { initializeEC } from "../../utils";

function Dashboard() {
  const {
    data: filesData,
    loading,
    error,
  } = useFetch("http://localhost:3000/api/files");
  const {
    data: usersData,
    loading: isUsersLoading,
    error: usersError,
  } = useFetch("http://localhost:3000/api/users");
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const token = useSelector((state) => state.user.token);
  const currentUserData = useSelector((state) => state.user.user);
  const users = usersData?.data?.users || [];
  const files = filesData?.data?.files || [];

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

  const uploadEncryptedFile = async (formData) => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/files/encrypted-file/",
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        return false;
      }

      const data = await res.json();

      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleOnProceed = async () => {
    const formData = new FormData();
    const mergedUsers = selectedUsers.map((su) => {
      const match = users.find((user) => user._id === su.value);
      return match ? { ...match } : null;
    });

    formData.append("file", selectedFile);
    formData.append("shared", JSON.stringify(mergedUsers));
    const upload = await uploadEncryptedFile(formData);

    if (upload) setUploadModalOpen(false);
  };

  const handleSharedUsersChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions);
  };

  useEffect(() => {
    initializeEC();
  }, []);

  return (
    <div className="p-6 flex flex-col gap-6">
      <PageTitle title="Dashboard" />
      <ActionButtons onClick={handleAddNewFileClick} />
      <div className="flex flex-col basis-[70%] bg-white h-80 rounded-md p-4">
        {!files?.length && (
          <div className="flex flex-col flex-grow justify-center items-center h-[50vh]">
            <div className="text-3xl font-bold text-gray-600">
              No Files Found
            </div>
          </div>
        )}

        {files?.length && (
          <TLTable
            headers={["ID", "Original Filename", "Type", "Actions"]}
            rows={files.map((file) => {
              return <TableRow id={file._id} file={file} />;
            })}
          />
        )}
      </div>
      <UploadFileModal
        isOpen={isUploadModalOpen}
        selectedFile={selectedFile}
        onCancel={handleOnCancel}
        onProceed={handleOnProceed}
        handleFileChange={handleFileChange}
        handleSharedUsersChange={handleSharedUsersChange}
        users={users
          .filter((user) => user._id !== currentUserData.id)
          .map((user) => {
            return { label: user.name, value: user._id };
          })}
      />
    </div>
  );
}

const UploadFileModal = ({
  isOpen,
  onProceed,
  onCancel,
  selectedFile,
  handleFileChange,
  users,
  handleSharedUsersChange,
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
            accept=".txt .html .js .css .py .text .json"
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
            options={users}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleSharedUsersChange}
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

const TableRow = ({ file, onClick = () => {} }) => {
  const { _id: id, originalFileName, type } = file;
  const data = [
    id,
    originalFileName,
    type.toUpperCase(),
    <div onClick={onClick}>
      <MdOutlineDownload className="bg-blue-500 text-3xl text-white p-1 rounded-lg" />
    </div>,
  ];

  return (
    <tr key={id}>
      {data.map((d) => (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {d}
        </td>
      ))}
    </tr>
  );
};

export default Dashboard;
