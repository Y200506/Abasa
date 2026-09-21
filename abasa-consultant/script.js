// ---------------------------------------------------------------
// Settings you can change
// ---------------------------------------------------------------
// Once your site is live on GitHub Pages, paste its address here,
// for example: "https://yourusername.github.io/abasa-consultant/"
// If you leave it empty, the QR code uses whatever address the page is on.
const SITE_URL = "";

const SHARE_TITLE = "Olivia Sigamoney | Absa Consultant";
const SHARE_TEXT = "Contact Olivia Sigamoney, an Absa consultant.";
const QR_FILE_NAME = "olivia-sigamoney-qr.png";

// ---------------------------------------------------------------
// Grab the bits of the page we need
// ---------------------------------------------------------------
const qrBox = document.getElementById("qr");
const qrNote = document.getElementById("qr-note");
const downloadBtn = document.getElementById("download-qr");
const shareBtn = document.getElementById("share-link");
const toast = document.getElementById("toast");

// ---------------------------------------------------------------
// Work out which address the QR code should point to
// ---------------------------------------------------------------
function getPageUrl() {
  if (SITE_URL) return SITE_URL;
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  return url.toString();
}

// ---------------------------------------------------------------
// Build the QR code
// ---------------------------------------------------------------
function buildQR() {
  const openedFromComputer = window.location.protocol === "file:" && !SITE_URL;

  if (openedFromComputer) {
    qrNote.textContent = "The QR code shows up once the site is live online.";
    qrBox.hidden = true;
    downloadBtn.disabled = true;
    return;
  }

  if (typeof QRCode === "undefined") {
    qrNote.textContent = "The QR code could not load. Check your internet connection and refresh the page.";
    qrBox.hidden = true;
    downloadBtn.disabled = true;
    return;
  }

  new QRCode(qrBox, {
    text: getPageUrl(),
    width: 512,
    height: 512,
    colorDark: "#3A1450",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M,
  });
}

// ---------------------------------------------------------------
// Download the QR code as a PNG (with a white border so it scans well when printed)
// ---------------------------------------------------------------
function downloadQR() {
  const qrCanvas = qrBox.querySelector("canvas");
  if (!qrCanvas) return;

  const border = 48;
  const out = document.createElement("canvas");
  out.width = qrCanvas.width + border * 2;
  out.height = qrCanvas.height + border * 2;

  const ctx = out.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(qrCanvas, border, border);

  const link = document.createElement("a");
  link.href = out.toDataURL("image/png");
  link.download = QR_FILE_NAME;
  link.click();
}

// ---------------------------------------------------------------
// Share the page link (opens the phone's share sheet, or copies the link)
// ---------------------------------------------------------------
function showToast(message) {
  toast.textContent = message;
  setTimeout(() => { toast.textContent = ""; }, 2800);
}

async function sharePage() {
  const url = getPageUrl();
  try {
    if (navigator.share) {
      await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    showToast("Link copied");
  } catch (error) {
    if (error.name !== "AbortError") {
      showToast("Could not copy the link. Copy the address from your browser instead.");
    }
  }
}

// ---------------------------------------------------------------
// Start everything
// ---------------------------------------------------------------
buildQR();
downloadBtn.addEventListener("click", downloadQR);
shareBtn.addEventListener("click", sharePage);
