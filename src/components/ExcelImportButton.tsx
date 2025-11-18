import { useRef, useState } from "react";
import { FaFileImport } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { usePostImportMutation } from "../query/post/usePostImportMutation";
import { SuccessAlert } from "./SuccessAlert";
import { ErrorAlert } from "./ErrorAlert";

export default function ExcelImportButton() {
  const [showAlertSuccess, setShowAlertSuccess] = useState<boolean>(false);
  const [showAlertFailed, setShowAlertFailed] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileData, setFileData] = useState<File | null>(null);

  const { mutate: importItem } = usePostImportMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileData(file);
    console.log(fileData)

    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target?.result;
      if (!arrayBuffer) return;

      const data = new Uint8Array(arrayBuffer as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      XLSX.utils.sheet_to_json(worksheet);

    };

    reader.readAsArrayBuffer(file);

    const form = new FormData();
    form.append("file", file);

    importItem(form, {
      onSuccess: () => {
         setShowAlertSuccess(true);
          setTimeout(() => {
            setShowAlertSuccess(false);
          }, 1500);
      },
      onError: (error) => {
        console.error(error.message);
        setShowAlertFailed(true);
          setTimeout(() => {
            setShowAlertFailed(false);
          }, 3000);
      },
    });
  };

  return (
    <div>
      {showAlertSuccess && <SuccessAlert message="Excel imported successfully!" />}
      {showAlertFailed && <ErrorAlert message="Excel imported failed" />}

      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-5 py-2.5 cursor-pointer bg-green-500 text-white font-semibold rounded-md shadow-md hover:scale-100 hover:shadow-sm transition-all duration-150"
      >
        <FaFileImport className="text-md font-bold mr-1" /> Import Item
      </button>
    </div>
  );
}
