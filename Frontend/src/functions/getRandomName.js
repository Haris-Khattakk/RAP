const getRandomName = (string) => {
  let str = "";
  for (let i = 0; i < string.split("").length; i++) {
    str += Math.floor(Math.random() * 10);
  }
  return str;
};


export default getRandomName;
