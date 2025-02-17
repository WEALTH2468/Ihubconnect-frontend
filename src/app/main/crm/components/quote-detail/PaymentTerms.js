import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useEffect, useState } from 'react';
import { convertToHTML } from 'draft-convert';
import { useDispatch } from 'react-redux';
import { setHasUpdatedTerms } from '../../store/quotesSlice';

export default function PaymentTerms({
  convertedContent,
  setConvertedContent,
  quote,
}) {
  const dispatch = useDispatch();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(quote.paymentTerms || '')
      )
    )
  );

  useEffect(() => {
    const html = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(html);
    dispatch(setHasUpdatedTerms(true));
  }, [editorState]);

  return (
    <Editor editorState={editorState} onEditorStateChange={setEditorState} />
  );
}
