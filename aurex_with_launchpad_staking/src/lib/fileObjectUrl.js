import isEmpty from "./isEmpty"

const fileObjectUrl = (fileImage) => {
    try {
        return URL.createObjectURL(fileImage)
    }
    catch (err) {
        return fileImage
    }
}

export const objectUrl = (fileImage, defaultFile = '') => {
    try {
        return URL.createObjectURL(fileImage)
    }
    catch (err) {
        if (isEmpty(fileImage)) {
            return defaultFile
        }
        return fileImage
    }
}


export default fileObjectUrl;