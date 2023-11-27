
export class DateExtensions {

  private formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public toLocaleDateString(dateValue: Date): string {
    let date: string = new Date(dateValue.toString() + "Z").toLocaleDateString();
    console.log(dateValue + " => (LOCALE) " + date);
    return date;
  }

  public toUtcDateString(dateValue: Date): string {
    let date: string = this.formatDateToYYYYMMDD(new Date(dateValue.toString() + "Z"));
    console.log(dateValue + " => (UTC) " + date);
    return date;
  }

  public toLocaleDateTimeString(dateValue: Date): string {
    let date: string = new Date(dateValue.toString() + "Z").toLocaleString();
    console.log(dateValue + " => (LOCAL DATETIME) " + date);
    return date;
  }

}
