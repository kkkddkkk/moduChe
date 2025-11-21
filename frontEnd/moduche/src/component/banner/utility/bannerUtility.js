
export const getBannerSize = (banner) => {
    if(banner === 2){
        return "1600 * 200";
    }else if(banner === 3){
        return "150 * 250";
    }else if(banner === 1){
        return "1600 * 800";
    }else{
        return "UNDEFINED"
    }
}
