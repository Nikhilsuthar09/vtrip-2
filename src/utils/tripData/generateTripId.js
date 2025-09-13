  const generateRandomId = () => {
    let str = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let id = [];
    for (let i = 0; i <= 4; i++) {
      id.push(str[Math.floor(Math.random() * str.length)]);
    }
    return id.join("");
  };
  export {generateRandomId}