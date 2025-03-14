export const parseTextAsLinkIfURL = (text) => {
  const textArray = text.split(' ');
  const urlRegex =
    /^((https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(:\d+)?(\/[^\s]*)?)$/i;

  const parsedText = textArray.map((word, index) => {
    if (urlRegex.test(word)) {
      // Ensure URL has 'http' or 'https' prefix
      const href = word.startsWith('http') ? word : `https://${word}`;
      return (
        <>
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#f17e44',
              textDecoration: 'underline',
              cursor: 'pointer',
              backgroundColor: 'transparent',
            }}
          >
            {word}
          </a>{' '}
        </>
      );
    }
    return word + ' ';
  });

  return parsedText;
};

export const parseTextAsLinkIfURLC = (text) => {
  const textArray = text.split(' ');
  const urlRegex =
    /^((https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(:\d+)?(\/[^\s]*)?)$/i;

  const parsedText = textArray.map((word, index) => {
    if (urlRegex.test(word)) {
      // Ensure URL has 'http' or 'https' prefix
      const href = word.startsWith('http') ? word : `https://${word}`;
      return (
        <>
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'white',
              cursor: 'pointer',
              backgroundColor: 'transparent',
            }}
          >
            {word}
          </a>{' '}
        </>
      );
    }
    return word + ' ';
  });

  return parsedText;
};
