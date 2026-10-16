import "./navigation.js";
import {
  animals,
  coats,
  sizes,
  servicesFor,
  athensDate,
  validPhone,
} from "./care-data.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const form = $("#appointment-form");
const careForm = $("#care-selector");
const serviceList = $("#service-list");
const params = new URLSearchParams(location.search);

function updateQuery(key, value, defaultValue) {
  const url = new URL(location.href);
  if (value === defaultValue) url.searchParams.delete(key);
  else url.searchParams.set(key, value);
  history.replaceState(null, "", url);
}

function setAnimalFields(prefix, animal) {
  const cat = animal === "cat";
  $(`#${prefix}-size-field`).hidden = cat;
  $(`#${prefix}-size`).disabled = cat;
  $(`#${prefix}-breed`).setAttribute("list", cat ? "cat-breeds" : "dog-breeds");
  const coat = $(`#${prefix}-coat`);
  coat.querySelector('[value="curly"]').hidden = cat;
  coat.querySelector('[value="curly"]').disabled = cat;
  if (cat && coat.value === "curly") coat.value = "unknown";
}

function renderCare() {
  const animal = careForm.elements["care-animal"].value;
  setAnimalFields("care", animal);
  const coat = $("#care-coat").value;
  const size = $("#care-size").value;
  const services = servicesFor(animal, coat);
  serviceList.replaceChildren(
    ...services.map((service) => {
      const article = document.createElement("article");
      article.className = "service";
      // Markup below is authored content only. User-entered text uses textContent.
      article.innerHTML = `<svg class="service-icon" aria-hidden="true"><use href="#i-${service.icon}"/></svg><h3>${service.title}</h3><p>${service.description}</p><button type="button" class="text-link" data-service="${service.id}">Ενδιαφέρομαι<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></button>`;
      article
        .querySelector("button")
        .setAttribute("aria-label", `Ενδιαφέρομαι: ${service.title}`);
      return article;
    }),
  );
  serviceList.classList.toggle("two-services", services.length === 2);
  $("#care-context").textContent = [
    animals[animal],
    animal === "dog" ? sizes[size] : "",
    coats[coat],
  ]
    .filter(Boolean)
    .join(" · ");
  updateQuery("animal", animal, "dog");
  updateQuery("coat", coat, "unknown");
  updateQuery("size", animal === "dog" ? size : "unknown", "unknown");
}

careForm.addEventListener("change", (event) => {
  if (event.target.name === "care-animal") $("#care-breed").value = "";
  renderCare();
});
careForm.addEventListener("submit", (event) => event.preventDefault());
if (Object.hasOwn(animals, params.get("animal")))
  careForm.elements["care-animal"].value = params.get("animal");
if (Object.hasOwn(coats, params.get("coat")))
  $("#care-coat").value = params.get("coat");
if (Object.hasOwn(sizes, params.get("size")))
  $("#care-size").value = params.get("size");
renderCare();

function renderFormServices() {
  const previous = $("#service").value;
  setAnimalFields("pet", $("#pet-type").value);
  const options = servicesFor($("#pet-type").value, $("#pet-coat").value).map(
    (service) => new Option(service.title, service.id),
  );
  $("#service").replaceChildren(
    new Option("Θέλω τη συμβουλή σας", "advice"),
    ...options,
  );
  if (options.some((option) => option.value === previous))
    $("#service").value = previous;
}

serviceList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-service]");
  if (!button) return;
  $("#pet-type").value = careForm.elements["care-animal"].value;
  $("#pet-breed").value = $("#care-breed").value;
  $("#pet-size").value = $("#care-size").value;
  $("#pet-coat").value = $("#care-coat").value;
  renderFormServices();
  $("#service").value = button.dataset.service;
  clearResult();
  location.hash = "appointment";
  $("#owner-name").focus({ preventScroll: true });
});
$("#pet-type").addEventListener("change", () => {
  $("#pet-breed").value = "";
  renderFormServices();
});
$("#pet-coat").addEventListener("change", renderFormServices);
renderFormServices();

const dateInput = $("#preferred-date");
dateInput.min = athensDate();
dateInput.addEventListener("focus", () => {
  dateInput.min = athensDate();
});
function setError(input, message) {
  const error = $(`#${input.id}-error`);
  if (error) error.textContent = message;
  if (message) input.setAttribute("aria-invalid", "true");
  else input.removeAttribute("aria-invalid");
}
function clearResult() {
  $("#form-result").hidden = true;
  $("#request-summary").textContent = "";
}
form.addEventListener("input", (event) => {
  setError(event.target, "");
  clearResult();
});
form.addEventListener("change", clearResult);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearResult();
  const errors = [];
  const check = (id, invalid, message) => {
    const input = $(id);
    setError(input, invalid ? message : "");
    if (invalid) errors.push(input);
  };
  check(
    "#owner-name",
    !$("#owner-name").value.trim(),
    "Συμπληρώστε το όνομά σας.",
  );
  check(
    "#phone",
    !validPhone($("#phone").value),
    "Συμπληρώστε έγκυρο τηλέφωνο με 10–15 ψηφία.",
  );
  check(
    "#pet-type",
    !Object.hasOwn(animals, $("#pet-type").value),
    "Επιλέξτε σκύλο ή γάτα.",
  );
  check(
    "#service",
    !$("#service").value,
    "Επιλέξτε τη φροντίδα που σας ενδιαφέρει.",
  );
  dateInput.min = athensDate();
  check(
    "#preferred-date",
    dateInput.validity.badInput ||
      (dateInput.value && dateInput.value < dateInput.min),
    "Επιλέξτε τη σημερινή ή μια μελλοντική ημερομηνία.",
  );
  if (errors.length) {
    errors[0].focus();
    return;
  }

  const animal = animals[$("#pet-type").value];
  const service = $("#service").selectedOptions[0].textContent;
  let date = "ημέρα κατόπιν συνεννόησης";
  if (dateInput.value)
    date = new Intl.DateTimeFormat("el-GR", { dateStyle: "long" }).format(
      new Date(`${dateInput.value}T12:00:00`),
    );
  $("#request-summary").textContent =
    `${$("#owner-name").value.trim()} · ${animal} · ${service} · ${date}. Προτίμηση ώρας: ${$("#preferred-time").selectedOptions[0].textContent}.`;
  $("#form-result").hidden = false;
  $("#form-result").focus({ preventScroll: true });
  $("#form-result").scrollIntoView({
    block: "nearest",
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
});

$("#clear-request").addEventListener("click", () => {
  form.reset();
  $$("[aria-invalid]").forEach((input) => setError(input, ""));
  clearResult();
  renderFormServices();
  $("#owner-name").focus();
});
// Preview only: no fetch, email, localStorage, analytics, or background submission.
$("#demo-fields").disabled = false;
