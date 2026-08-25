const generateBtn = document.getElementById("generateBtn");
const signBtn = document.getElementById("signBtn");

const didOutput = document.getElementById("did");
const publicKeyOutput = document.getElementById("publicKey");
const messageInput = document.getElementById("message");
const proofOutput = document.getElementById("proof");

let identity = null;

function randomHex(length) {
  const array = new Uint8Array(length);

  crypto.getRandomValues(array);

  return Array.from(array)
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

generateBtn.addEventListener("click", () => {
  const id = randomHex(16);
  const publicKey = randomHex(32);

  identity = {
    did: `did:proofmesh:${id}`,
    publicKey
  };

  didOutput.textContent = identity.did;
  publicKeyOutput.textContent = identity.publicKey;

  proofOutput.textContent = "Identity generated successfully.";
});

signBtn.addEventListener("click", async () => {
  const message = messageInput.value.trim();

  if (!identity) {
    proofOutput.textContent =
      "Please generate an identity first.";
    return;
  }

  if (!message) {
    proofOutput.textContent =
      "Please enter a message to sign.";
    return;
  }

  const encoder = new TextEncoder();

  const data = encoder.encode(
    message + identity.did + identity.publicKey
  );

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  const hashArray = Array.from(
    new Uint8Array(hashBuffer)
  );

  const proof = hashArray
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");

  proofOutput.textContent = proof;
});
