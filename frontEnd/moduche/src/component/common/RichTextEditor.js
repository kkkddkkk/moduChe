// import { useEffect } from "react";
// import { useQuill } from "react-quilljs";

// const RichTextEditor = ({ value, onChange, defaultTemplate }) => {
//     const { quill, quillRef } = useQuill({
//         theme: "snow",
//         modules: {
//             toolbar: [
//                 // 제목.
//                 [{ header: [1, 2, 3, 4, 5, 6, false] }],

//                 // 기본 텍스트 서식(굵게, 기울이기, 밑줄, 중줄).
//                 ["bold", "italic", "underline", "strike"],

//                 // 색상 관련(문자색, 배경색).
//                 [{ color: [] }, { background: [] }],

//                 // 목록 및 들여쓰기.
//                 [{ list: "ordered" }, { list: "bullet" }],
//                 [{ indent: "-1" }, { indent: "+1" }],

//                 // 링크 (이미지는 따로 마련).
//                 ["link"],

//                 // 서식 초기화.
//                 ["clean"],
//             ],
//         },
//     });

//     useEffect(() => {
//         if (quill) {
//             const initialContent = value || defaultTemplate || "";
//             quill.clipboard.dangerouslyPasteHTML(initialContent);

//             //초기 로딩 시 기본 템플릿 저장.
//             if (!value && defaultTemplate) {
//                 onChange(defaultTemplate);
//             }

//             quill.on("text-change", () => {
//                 onChange(quill.root.innerHTML);
//             });
//         }
//     }, [quill]);

//     return <div ref={quillRef} style={{ height: 250 }} />;
// };

// export default RichTextEditor;
import { useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import Quill from "quill";

// HTML → Delta 변환 함수
const htmlToDelta = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const quill = new Quill(document.createElement("div"));
    quill.clipboard.dangerouslyPasteHTML(html);
    return quill.getContents();
};

const RichTextEditor = ({ value, onChange, defaultTemplate }) => {
    const editorRef = useRef(null);

    const { quill, quillRef } = useQuill({
        theme: "snow",
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ color: [] }, { background: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ indent: "-1" }, { indent: "+1" }],
                ["link"],
                ["clean"],
            ],
        },
    });

    // 🔥 Quill 초기화 — Dialog가 완전히 열린 뒤 적용
    useEffect(() => {
        if (quill) {
            const initialContent = value || defaultTemplate || "";

            setTimeout(() => {
                quill.setContents(htmlToDelta(initialContent));
            }, 30); // ← 핵심: 모달 transition 후 초기화

            // 최초 설정
            editorRef.current = initialContent;

            quill.on("text-change", () => {
                editorRef.current = quill.root.innerHTML;
                onChange(editorRef.current);
            });
        }
    }, [quill]);

    return (
        <div
            ref={quillRef}
            style={{
                height: 300,
                maxHeight: 300,
                overflow: "auto",
            }}
        />
    );
};

export default RichTextEditor;
