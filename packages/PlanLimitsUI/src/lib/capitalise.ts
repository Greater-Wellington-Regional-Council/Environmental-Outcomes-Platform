function capitalize(str: string): string {
  // Remove underscores and dashes, replacing them with spaces
  str = str.replace(/[_-]/g, ' ');

  return str.replace(/\b\w+\b/g, (word) => {
    // Check if the word is fully consonants OR contains a non-English letter
    if (/^[b-df-hj-np-tv-z]+$/i.test(word) || /[^a-zA-Z]/.test(word)) {
      return word.toUpperCase(); // Fully capitalize these words
    }

    // Otherwise, capitalize only the first letter
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

function toSentenceCase(str: string): string {
  str = str.replace(/[_-]/g, ' ');

  return str.replace(/\b\w+\b/g, (word, index) => {
    if (/^[b-df-hj-np-tv-z]+$/i.test(word) || /[^a-zA-Z]/.test(word)) {
      return word.toUpperCase(); // Fully capitalize these words
    }

    if (index === 0) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    } else {
      return word.toLowerCase();
    }
  });
}

export default capitalize;
