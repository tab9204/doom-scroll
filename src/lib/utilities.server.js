import {environment, twitchParent} from "$lib/config.server.js";
//post => reddit post data
//width => width of the client screen
//height => height of the client screen
export const extract_image_data = (post,width,height)=>{
    let images = []; 
    //metadata means the post contains a gallery of images
    if(post.data?.media_metadata){
        const metadata = post.data.media_metadata;
        for (const media in metadata) {
            try{
                
                const media_id = metadata[media]["id"];
                const file_type = metadata[media]?.["m"].substring(metadata[media]["m"].indexOf("/") + 1);
                const full_image = `https://i.redd.it/${media_id}.${file_type}`;

                let imageData = {url: null,w: 0, h: 0, s: Number.MAX_SAFE_INTEGER};

                metadata[media].p.forEach((image)=>{
                    imageData = closestSize(image.x,image.y,image.u,width,height,imageData);
                });
                if(imageData.url){
                    //https://preview.redd.it/afhemm1k98qb1.jpg?width=320&crop=smart&auto=webp&s=f3d080c800be8d03a99b74d2ea39deafb5d54015
                    //take out the amp; from the url
                    //if left in the url gets mangled when its added to the html
                    const cleanURL = imageData.url.replace(/amp;/g, "");
                    images.push({
                        src: post.data.url.includes(".gif") ? post.data.url : cleanURL,
                        big:full_image,
                        width:imageData.w,
                        height:imageData.h
                    });
                }

            }
            catch(e){
                console.log(e)
                //just skip the image if we encountered an error 
                continue;
            }
        }
    }
    //only 1 image in the post
    else if(post.data?.preview && post.data?.preview?.images[0]?.resolutions.length >= 1){
        //check if the post url contains an image file extension 
        //at the moment these are the only types of images we want to display
        const imageTypes = [".jpg", ".jpeg", ".png", ".gif", ".svg"];
        const isImage = imageTypes.some(type => post.data.url.match(new RegExp(`\\${type}\\b`,"i")));
        if(isImage){
            let imageData = {url: null,w: 0, h: 0, s: Number.MAX_SAFE_INTEGER};
            post.data.preview.images[0].resolutions.forEach(image =>{
                if(image.width <= width && image.height <= height){
                    imageData = closestSize(image.width,image.height,image.url,width,height,imageData);
                }
            })
            if(imageData.url){
                //https://preview.redd.it/afhemm1k98qb1.jpg?width=320&crop=smart&auto=webp&s=f3d080c800be8d03a99b74d2ea39deafb5d54015
                //take out the amp; from the url
                //if left in the url gets mangled when its added to the html
                const cleanURL = imageData.url.replace(/amp;/g, "");
                images.push({
                    //the preview images for gifs and gifvs are pngs so use the main post url as the image src 
                    src:post.data.url.includes(".gif") ? post.data.url : cleanURL,
                    big:post.data.url,
                    width:imageData.w,
                    height:imageData.h
                });
            }
        }

    }
    return images;
}

//returnData => object to hold the image data that is returned from the function 
//currentSize => image size closest to the size of the user's device size that has been found so far
const closestSize = (imageW, imageH, imageURL, screenW, screenH, returnData)=>{
    const wDelta = Math.abs(imageW - screenW);
    const hDelta = Math.abs(imageH - screenH);
    if((wDelta + hDelta) < returnData.s){
        returnData.url = imageURL;
        returnData.w = imageW;
        returnData.h = imageH;
        returnData.s = wDelta + hDelta;

    }
    return returnData;
}

export const extract_video_data = (post)=>{
    //video data could be in different places depending on if it is an mp4 or a gifv
    //reddit_video_preview => gifv
    //reddit_video => mp4
    const video = post.data?.preview?.reddit_video_preview ? post.data.preview.reddit_video_preview : post.data?.secure_media?.reddit_video;

    if(!video){
        return false;
    }

    const url = video.fallback_url;
    const height = video.height;
    const width = video.width;
    const audio = video.fallback_url.match(new RegExp(/\/([^/]+)\/DASH_/));
    const hls = video.hls_url;
    const data = {
        url:url,
        audio: `https://v.redd.it/${audio[1]}/DASH_audio.mp4`,
        height:height,
        width:width,
        hls: hls
    }
    return data;
}

export const extract_embed_data = (post)=>{
    //the twitch.tv content url returned by reddit only works on reddit
    //so we must build site specific urls for twitch clips and vods 
    if(post.data.url.includes("twitch.tv")){
        //twitch clip
        //only showing twitch clips but could also show vods and livestream embeds 
        if(post.data.url.match(new RegExp(`\\https://clips.twitch.tv/\\b`,"i"))){
            const clipID = post.data.url.split("https://clips.twitch.tv/")[1];
            //overwrite the reddit url with our custom one
            post.data.secure_media_embed.media_domain_url = `https://clips.twitch.tv/embed?clip=${clipID}&parent=${twitchParent[environment]}`
        }
        else{
            return false;
        }
    }
    else if(!post.data?.secure_media_embed?.media_domain_url){
        return false;
    }

    const embed = post.data.secure_media_embed;

    const url = embed.media_domain_url;
    const width = embed.width;
    const height = embed.height;
    const iframe = embed.content;
    const data = {
        url:url,
        height:height,
        width:width,
        iframe:iframe
    }
    return data;
}