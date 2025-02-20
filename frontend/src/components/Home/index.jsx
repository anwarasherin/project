import React, { useEffect, useState } from "react";
import {
  Button,
  Grid2 as Grid,
  Modal,
  Typography,
  Box,
  IconButton,
  styled,
} from "@mui/material";
import Table from "../common/Table";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const tableHeaders = ["ID", "File ID", "Filename", "Block ID", "Actions"];
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function Home() {
  const [file, setFile] = useState(null);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [allFiles, setAllFiles] = useState([]);

  const fetchFiles = async () => {
    const response = await axios.get("http://localhost:8000/files");
    setAllFiles(response.data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/upload-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("File uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed!");
    }
  };

  const handleUploadButtonClick = () => {
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setFile(null);
  };

  const handleDownloadButtonClick = async (id) => {
    try {
      const response = await axios.get("http://localhost:8000/files/" + id);
      const data = response.data;

      const text = data.content;
      const filename = data.filename;

      const blob = new Blob([text], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (ex) {}
  };

  return (
    <div>
      <Grid
        container
        flexDirection="row"
        justifyContent="space-between"
        sx={{ my: 2 }}
      >
        <Grid>
          <Typography variant="h5" component="h2">
            Files
          </Typography>
        </Grid>

        <Grid container gap={1}>
          <Grid>
            <Button variant="contained" onClick={handleUploadButtonClick}>
              Upload
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Table
        tableHeaders={tableHeaders}
        tableData={allFiles}
        handleDownloadButtonClick={handleDownloadButtonClick}
      />

      <Modal open={isUploadModalOpen} onClose={handleCloseUploadModal}>
        <Box sx={modalStyle}>
          <Grid container direction="column" alignItems="center">
            <Grid>
              <Button
                size="40"
                component="label"
                role={undefined}
                variant="text"
                tabIndex={-1}
                startIcon={<UploadFileIcon sx={{ fontSize: 40 }} />}
              >
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>
            </Grid>
            <Grid>
              <Typography component="p">
                {file ? file.name : "Select a file to Upload"}
              </Typography>
            </Grid>

            <Grid container gap={1}>
              <Button
                variant="contained"
                disabled={!file}
                onClick={handleUpload}
              >
                Upload
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}

export default Home;
