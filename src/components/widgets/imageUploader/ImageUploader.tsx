import React from 'react';

import './imageUploader.css';

interface IProps {
    id: string;
    imageURL: string; 
    newImageLoaded(file: File | null): void;
    uploadPrompt?: string,
    allowedFileTypes?: string,
    maximumSizeInMb?: number,
    disabled?: boolean
}

interface IState {
    hasImage: boolean,
    currentImage: File | null,
    loadingImage: boolean
}

export default class ImageUploader extends React.Component<IProps, IState> {

    private fileElement: HTMLInputElement | null = null;
    private reloadAttempted: boolean = true;

    constructor(props: IProps) {
        super(props);

        this.state = {
            hasImage: props.imageURL !== "" ? true : false,
            currentImage: null,
            loadingImage: props.imageURL !== "" ? true : false
        }
    }

    public componentDidMount = (): void => {
        if (this.props.imageURL) {
            this.loadImage(this.props.imageURL);
        }
    }

    public componentDidUpdate = (props: IProps): void => {
    }

    private toDataURL(url: any): Promise<string> {

        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (xhr.response.type !== "text/html") {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        resolve(reader.result?.toString());
                    }
                    reader.readAsDataURL(xhr.response);
                } else {
                    reject();
                } 
                
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        })
    }

    private clearImage = (e: React.MouseEvent<HTMLElement>): void => {
        if (this.props.disabled) return;

        e.preventDefault();
        this.setState({
            hasImage: false
        });

        this.props.newImageLoaded(null);
    }

    private loadImage = (url: string): void => {console.log(url);
        this.toDataURL(url)
            .then( (data: string) => {
                (window.document.getElementById(this.props.id) as HTMLImageElement).src=data;
                this.setState({loadingImage: false})
            })
            .catch( err => {
                window.setTimeout(()=>{
                    if (this.reloadAttempted) {
                        this.setState({
                            loadingImage: false,
                            hasImage: false
                        })
                    } else {
                        this.reloadAttempted = true;
                        this.loadImage(url);
                    }
                }, 3000);
            })
    }

    private onInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            this.readFile(e.target.files[0])
            .then((resp: any) => {
                console.log(resp.file.size);
                const maxSizeInMb: number = this.props.maximumSizeInMb ? this.props.maximumSizeInMb : 2;
                if (resp.file.size > maxSizeInMb * 1048576) {
                    window.alert(`Maximum File Size is ${maxSizeInMb}Mb`);
                    return;
                } else {
                    console.log(resp);
                    (window.document.getElementById(this.props.id) as HTMLImageElement).src=resp.result;
                    this.setState({currentImage: resp.dataURL, hasImage: true})
                    this.props.newImageLoaded(resp.file)
                }
                
            }) 
        }
    }

    private open = () => {
        if (!this.props.disabled)
            this.fileElement?.click();
    }

    private readFile= (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                let dataURL = e.target.result;
                dataURL = dataURL.replace(";base64", `;name=${file.name};base64`);
                resolve({file, dataURL, result:e.target.result});
            };
          reader.readAsDataURL(file);
        });
    }

    public render() {
        return(
            <div className={`image-uploader ${this.props.disabled ? '' : 'image-uploader-active'}`}>
                <div 
                    className="inner"
                    onClick={this.open}
                    > 
                    <img 
                        src={""}
                        alt="question"
                        id={this.props.id}
                        className={this.state.hasImage? "" : "hidden"}
                        />
                    <input
                        type="file"
                        id="xxx"
                        ref={input => this.fileElement = input}
                        onChange={this.onInputChanged}
                        accept={this.props.allowedFileTypes ? this.props.allowedFileTypes : ""}
                    >
                    </input>
                    {(!this.state.hasImage && !this.props.disabled) &&
                        <div className={`no-image image-uploader-overlay`}>
                            <span>{ this.props.uploadPrompt || "Click to  Upload Image"}</span>
                        </div>
                    }
                </div>
                {(this.state.hasImage && !this.props.disabled) &&
                    <div 
                        className="remove-btn"
                        onClick={this.clearImage}
                        >X</div>
                }
                {this.state.loadingImage &&
                    <div className="loading-image image-uploader-overlay">
                        <span>Loading Image...</span>
                    </div>
                }
            </div>
        )
    }
}