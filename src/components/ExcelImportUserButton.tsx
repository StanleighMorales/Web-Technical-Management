import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";
// import { usePostImportExcelUserMutation } from "../query/post/usePostImportUserMutation";
import { useImportUser } from "../hooks/userHooks";
import { showToast } from "./AppToast";

export default function ExcelImportUserButton() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileData, setFileData] = useState<File | null>(null);

  const { mutate: importUser } = useImportUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileData(file);
    console.log(fileData);

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

    importUser(form, {
      onSuccess: () => {
        showToast.success("Import Successful", "Students imported successfully!");
      },
      onError: (error: unknown) => {
        if (error instanceof Error) {
          console.log(error.message);
        }
        showToast.error("Import Failed", "Excel import failed. Please check your file.");
      },
    });
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-5 py-2.5 cursor-pointer bg-green-500 text-white font-semibold rounded-xl shadow-md hover:bg-green-600 hover:shadow-sm transition-all duration-150"
      >
        <Upload className="h-5 w-5" /> Import Students
      </button>
    </div>
  );
}
