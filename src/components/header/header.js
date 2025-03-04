export default function createHeader({ title }) {
  const header = createElement("header", { className: "gnb" });
  header.innerHTML = `
    <h1 class="gnb__title text-title">${title}</h1>
      <button type="button" class="gnb__button" aria-label="음식점 추가">
        <img src="./add-button.png" alt="음식점 추가" />
      </button>
  `;

  return header;
}
