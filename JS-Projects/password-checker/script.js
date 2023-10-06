const inputs = document.querySelector(".inputs");
const result = document.querySelector(".result");
const textInput = document.querySelector("#text-input");
const btnSubmit = document.querySelector("#submit");

const passwordData = [];

const requestApiData = async function (query_char) {
  const URL = "https://api.pwnedpasswords.com/range/" + query_char; // C6008F9CAB4083784CBD1874F76618D2A97

  const response = await fetch(URL);
  const data = await response.text();

  return data.split(/\r?\n/);
};

const pwnedApiCheck = async function (password) {
  const sha1Password = CryptoJS.SHA1(password).toString().toUpperCase();
  const first5Chars = sha1Password.slice(0, 5);
  const tail = sha1Password.slice(5);

  const hashes = await requestApiData(first5Chars);

  const filteredHash = hashes.filter((hash) => hash.split(":")[0] === tail);

  if (filteredHash.length !== 0) {
    result.textContent = `Your password has breached ${
      filteredHash[0].split(":")[1]
    } times.`;

    if (result.classList.contains("success")) {
      result.classList.remove("success");
    }
    result.classList.add("error");

    result.style.opacity = 1;
  } else {
    result.textContent = `Your password was never breached.`;

    if (result.classList.contains("error")) {
      result.classList.remove("error");
    }
    result.classList.add("success");

    result.style.opacity = 1;
  }
};

const getInputValue = function (event) {
  event.preventDefault();
  const inputValue = textInput.value;

  if (inputValue) {
    pwnedApiCheck(inputValue);
  }
};

inputs.addEventListener("submit", getInputValue);
