export const toDateString = (date: any) => {
    const today = new Date(date)
    const dd = String(today.getDate()).padStart(2, "0")
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const yyyy = today.getFullYear()
  
    return `${dd}/${mm}/${yyyy}`
  }
  
