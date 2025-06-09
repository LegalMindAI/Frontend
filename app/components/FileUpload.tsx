import React from "react";

interface FileUploadProps {
  onExtractedText: (text: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onExtractedText }) => {
  const handleExportPDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await fetch("http://127.0.0.1:8000/pdf-upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      onExtractedText(data.extracted_text);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <input
      type="file"
      accept=".pdf,.doc,.txt,.docx"
      onChange={handleExportPDF}
      name="FileInput"
      id="FileInput"
      title="Export PDF"
      className="hidden"
    />
  );
};

export default FileUpload;
