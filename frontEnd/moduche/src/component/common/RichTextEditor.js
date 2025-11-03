import { useEffect } from "react";
import { useQuill } from "react-quilljs";

const RichTextEditor = ({ value, onChange }) => {
    const { quill, quillRef } = useQuill({
        theme: "snow",
        modules: {
            toolbar: [
                // 제목.
                [{ header: [1, 2, 3, 4, 5, 6, false] }],

                // 기본 텍스트 서식(굵게, 기울이기, 밑줄, 중줄).
                ["bold", "italic", "underline", "strike"],

                // 색상 관련(문자색, 배경색).
                [{ color: [] }, { background: [] }],

                // 목록 및 들여쓰기.
                [{ list: "ordered" }, { list: "bullet" }],
                [{ indent: "-1" }, { indent: "+1" }],

                // 링크 (이미지는 따로 마련).
                ["link"],

                // 서식 초기화.
                ["clean"],
            ],
        },
    });

    useEffect(() => {
        if (quill) {
            quill.root.innerHTML = value || "";
            quill.on("text-change", () => {
                onChange(quill.root.innerHTML);
            });
        }
    }, [quill]);

    return <div ref={quillRef} style={{ height: 250 }} />;
};

export default RichTextEditor;
