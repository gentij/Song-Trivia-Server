export const getRandomUniqueItems = <T>(array: T[], count: number) => {
  // Create a copy of the original array
  var shuffledArray = array.slice();

  // Fisher-Yates shuffle algorithm
  for (var i = shuffledArray.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = shuffledArray[i];
    shuffledArray[i] = shuffledArray[j];
    shuffledArray[j] = temp;
  }

  // Return the first 'count' elements from the shuffled array
  return shuffledArray.slice(0, count);
};
