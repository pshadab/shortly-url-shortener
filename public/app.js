const form = document.querySelector("#shorten-form");
const message = document.querySelector("#message");
const result = document.querySelector("#result");
const linksEl = document.querySelector("#links");

async function loadLinks() {
  const response = await fetch("/api/links");
  const links = await response.json();
  const items = Object.entries(links).reverse();
  linksEl.innerHTML = items.length ? items.map(([code, link]) => `
    <article class="link-row"><div><a href="/s/${code}" target="_blank">${location.origin}/s/${code}</a><p>${link.url}</p></div><span>${link.clicks} clicks</span></article>`).join("") : '<p class="empty">No links yet. Create your first one above.</p>';
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  result.hidden = true;
  const button = form.querySelector("button");
  button.disabled = true;
  button.textContent = "Creating…";
  try {
    const response = await fetch("/api/links", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    result.hidden = false;
    result.innerHTML = `<span>Your short link</span><a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a><button type="button" id="copy">Copy</button>`;
    document.querySelector("#copy").onclick = async () => { await navigator.clipboard.writeText(data.shortUrl); document.querySelector("#copy").textContent = "Copied!"; };
    form.reset();
    loadLinks();
  } catch (error) { message.textContent = error.message || "Something went wrong."; }
  finally { button.disabled = false; button.innerHTML = "Shorten URL <span>→</span>"; }
});

document.querySelector("#refresh").addEventListener("click", loadLinks);
loadLinks();
