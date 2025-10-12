export const formatted = (date: string | Date) => {
  if (date instanceof Date) {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } else {
    const newDate = new Date(date)
    return newDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }
}
