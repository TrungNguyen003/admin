import React from "react";

const QuillViewOnly = ({ content }) => {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

export default QuillViewOnly;
