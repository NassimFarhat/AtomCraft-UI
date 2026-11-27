import { cn, dataAttr } from "@atomscraft/core";
import { useId, useState } from "react";
import type { ChangeEvent, DragEvent, ReactNode } from "react";
import { IconButton } from "../../atoms/button";
import { IconX } from "../../icons";
import { formatMessage, useAtomCraft } from "../../provider";
import { useControllableState } from "../../hooks";

export type FileUploadProps = {
  label: string;
  description?: ReactNode;
  value?: readonly File[] | undefined;
  defaultValue?: readonly File[];
  onValueChange?: ((files: File[]) => void) | undefined;
  onChange?: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined;
  name?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

function matchesAccept(file: File, accept: string | undefined): boolean {
  if (!accept) return true;
  const rules = accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);
  return rules.some((rule) => {
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule);
    if (rule.endsWith("/*")) return file.type.toLowerCase().startsWith(rule.slice(0, -1));
    return file.type.toLowerCase() === rule;
  });
}

function sameFile(left: File, right: File): boolean {
  return (
    left.name === right.name && left.size === right.size && left.lastModified === right.lastModified
  );
}

/** File selection and drop surface; it reports files but leaves upload/network work to the app. */
export function FileUpload({
  label,
  description,
  value,
  defaultValue = [],
  onValueChange,
  onChange,
  name,
  accept,
  multiple = true,
  maxFiles = Infinity,
  disabled = false,
  required = false,
  className,
}: FileUploadProps) {
  const inputId = useId();
  const descriptionId = useId();
  const [files, setFiles] = useControllableState({
    value: value === undefined ? undefined : [...value],
    defaultValue: [...defaultValue],
    onChange: onValueChange,
  });
  const [dragging, setDragging] = useState(false);
  const { messages } = useAtomCraft();
  const limit = Math.max(0, Math.trunc(maxFiles));

  const addFiles = (incoming: Iterable<File>) => {
    const accepted = [...incoming].filter((file) => matchesAccept(file, accept));
    const combined = multiple ? [...files, ...accepted] : accepted.slice(0, 1);
    const unique = combined.filter(
      (file, index, all) => all.findIndex((candidate) => sameFile(candidate, file)) === index,
    );
    setFiles(unique.slice(0, limit));
  };

  const removeFile = (file: File) => setFiles((current) => current.filter((item) => item !== file));
  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (!disabled) setDragging(true);
  };
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    if (!disabled) addFiles(event.dataTransfer.files);
  };

  return (
    <div
      data-slot="file-upload"
      data-disabled={dataAttr(disabled)}
      className={cn("ac-file-upload", className)}
    >
      <label
        htmlFor={inputId}
        data-slot="file-upload-dropzone"
        data-dragging={dataAttr(dragging)}
        className="ac-file-upload__dropzone"
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <span className="ac-file-upload__label">{label}</span>
        {description && (
          <span id={descriptionId} className="ac-file-upload__description">
            {description}
          </span>
        )}
        <input
          id={inputId}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={required}
          aria-label={label}
          aria-describedby={description ? descriptionId : undefined}
          className="ac-file-upload__input"
          onChange={(event) => {
            addFiles(event.currentTarget.files ?? []);
            onChange?.(event);
            event.currentTarget.value = "";
          }}
        />
      </label>
      {files.length > 0 && (
        <ul data-slot="file-upload-list" className="ac-file-upload__list">
          {files.map((file, index) => (
            <li key={`${file.name}-${file.lastModified}-${index}`} className="ac-file-upload__item">
              <bdi className="ac-file-upload__name">{file.name}</bdi>
              <span className="ac-file-upload__size">{file.size.toLocaleString()} B</span>
              <IconButton
                label={formatMessage(messages.removeOption, { option: file.name })}
                size="xs"
                disabled={disabled}
                onClick={() => removeFile(file)}
              >
                <IconX />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
