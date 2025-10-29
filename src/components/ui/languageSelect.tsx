import React from "react";

const languageMap: { [key: string]: string } = {
  en: "English",
  es: "Spanish",
  ja: "Japanese",
  // ar: "Arabic",
  // zh: "Chinese (Simplified)",
  // cs: "Czech",
  // da: "Danish",
  // nl: "Dutch",
  // fi: "Finnish",
  // fr: "French",
  // de: "German",
  // el: "Greek",
  // he: "Hebrew",
  // hi: "Hindi",
  // hu: "Hungarian",
  // ig: "Igbo",
  // it: "Italian",
  // ja: "Japanese",
  // ko: "Korean",
  // no: "Norwegian",
  // pl: "Polish",
  // pt: "Portuguese",
  // ro: "Romanian",
  // ru: "Russian",
  // es: "Spanish",
  // sv: "Swedish",
  // th: "Thai",
  // tr: "Turkish",
  // vi: "Vietnamese",
  // yor: "Yoruba",
};

interface LanguageSelectProps {
  code: string;
  onChange: (value: string) => void;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  code,
  onChange,
}) => {
  return (
    <select
      className="w-full px-5 py-3 bg-[#111111] border border-white/10 rounded-xl 
                 focus:outline-none focus:border-white/20 text-white/90 
                 appearance-none cursor-pointer hover:border-white/20 
                 transition-colors font-light"
      value={code}
      onChange={(e) => onChange(e.target.value)}
    >
      {Object.entries(languageMap).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelect;
