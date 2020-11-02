
class PrintHelper {

    public download = (fileName: string, body: any): void => {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(body));
        element.setAttribute('download', fileName);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    public print = (body: any): void => {

    }
}

export default new PrintHelper();