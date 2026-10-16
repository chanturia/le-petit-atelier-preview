// Content only: these entries can become WordPress service fields later.
export const animals = { dog: "Σκύλος", cat: "Γάτα" };
export const coats = {
  unknown: "Όλοι οι τύποι τριχώματος",
  short: "Κοντό τρίχωμα",
  long: "Μακρύ τρίχωμα",
  curly: "Σγουρό τρίχωμα",
};
export const sizes = {
  unknown: "Όλα τα μεγέθη",
  small: "Μικρόσωμος",
  medium: "Μεσαίος",
  large: "Μεγαλόσωμος",
};
export const careServices = {
  dog: [
    {
      id: "bath",
      title: "Μπάνιο & περιποίηση",
      icon: "drop",
      description:
        "Καθαριότητα και φροντίδα, προσαρμοσμένες στο τρίχωμα του μικρού σας φίλου.",
      coats: ["unknown", "short", "long", "curly"],
    },
    {
      id: "haircut",
      title: "Κούρεμα & στυλ",
      icon: "scissors",
      description:
        "Συζητάμε μαζί σας το κούρεμα που ταιριάζει στο τρίχωμα και την καθημερινότητά του.",
      coats: ["unknown", "long", "curly"],
    },
    {
      id: "coat",
      title: "Φροντίδα τριχώματος",
      icon: "comb",
      description:
        "Βούρτσισμα και περιποίηση, με προσοχή στις ιδιαίτερες ανάγκες του τριχώματός του.",
      coats: ["unknown", "short", "long", "curly"],
    },
  ],
  cat: [
    {
      id: "coat",
      title: "Περιποίηση γάτας",
      icon: "comb",
      description:
        "Βούρτσισμα και φροντίδα τριχώματος, με την ιδιαίτερη προσοχή που χρειάζεται η γάτα σας.",
      coats: ["unknown", "short", "long"],
    },
    {
      id: "bath",
      title: "Μπάνιο & φροντίδα",
      icon: "drop",
      description:
        "Επικοινωνήστε μαζί μας για να συζητήσουμε τις ανάγκες της γάτας σας πριν την επίσκεψη.",
      coats: ["unknown", "short", "long"],
    },
    {
      id: "haircut",
      title: "Εξειδικευμένη περιποίηση",
      icon: "scissors",
      description:
        "Για κούρεμα ή άλλες ανάγκες περιποίησης, προηγείται συνεννόηση με το atelier.",
      coats: ["unknown", "long"],
    },
  ],
};
export function servicesFor(animal, coat = "unknown") {
  return (careServices[animal] || careServices.dog).filter((service) =>
    service.coats.includes(coat),
  );
}
export function athensDate(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Athens",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}
export function validPhone(value) {
  const phone = value.trim();
  return (
    /^\+?[\d\s().-]+$/.test(phone) &&
    phone.replace(/\D/g, "").length >= 10 &&
    phone.replace(/\D/g, "").length <= 15
  );
}
