import "./navigation.js";

const buttons = [...document.querySelectorAll("[data-work-filter]")];
const entries = [...document.querySelectorAll("[data-work-entry]")];
const status = document.querySelector("#work-status");

function showWork(filter) {
  const selected = buttons.some(
    (button) => button.dataset.workFilter === filter,
  )
    ? filter
    : "all";
  buttons.forEach((button) =>
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.workFilter === selected),
    ),
  );
  entries.forEach((entry) => {
    entry.hidden =
      selected !== "all" &&
      !entry.dataset.workEntry.split(" ").includes(selected);
  });
  const count = entries.filter((entry) => !entry.hidden).length;
  status.textContent = `${count} ${count === 1 ? "ιστορία περιποίησης" : "ιστορίες περιποίησης"}`;
}

function restoreSelection() {
  const params = new URLSearchParams(location.search);
  const target = entries.find((entry) => `#${entry.id}` === location.hash);
  // A direct link always reveals its case, even with a stale filter in the URL.
  showWork(target ? "all" : params.get("filter"));
}

buttons.forEach((button) =>
  button.addEventListener("click", () => {
    const filter = button.dataset.workFilter;
    showWork(filter);
    const url = new URL(location.href);
    if (filter === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", filter);
    url.hash = "";
    history.replaceState(null, "", url);
  }),
);
window.addEventListener("popstate", restoreSelection);
window.addEventListener("hashchange", restoreSelection);
document.querySelector(".work-toolbar").hidden = false;
restoreSelection();
