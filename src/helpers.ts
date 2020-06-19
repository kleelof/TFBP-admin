class Helpers {

    private days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    private months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    public formatDate = (rawDate: string): string => {console.log(rawDate)
        const date: Date = new Date(rawDate);
        return `${this.days[date.getDay()]} ${this.months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    }
}

export default new Helpers();