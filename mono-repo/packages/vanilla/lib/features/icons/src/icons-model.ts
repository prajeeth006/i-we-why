export interface ImageSource {
    src: string;
}
export interface IconsModel {
    name: string;
    image: ImageSource;
    iconName: string;
    text?: string;
    parameters?: IconParameter;
    title?: string;
    size?: string;
    fillColor?: string;
    extraClass?: string;
    imageUrl?: string;
}

export interface IconParameter {
    urlId: string;
    extraClass?: string;
    size?: string;
    fillColor?: string;
    title?: string;
}
