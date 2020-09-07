const camelCaseToSeparatedString = camelCaseString =>
    camelCaseString
        .split(/(?=[A-Z])/)
        .map(stringPart => stringPart.toLowerCase())
        .join(' ');

export default camelCaseToSeparatedString;
