//decodes an html string and returns an html object
export const decodeHTML = (str)=>{
    if(str && typeof str === 'string') {
        str = new DOMParser().parseFromString(str, "text/html");
        const content = new DOMParser().parseFromString(str.body.textContent, "text/html");
        //any links in the html need to open in a new window
        const links = content.querySelectorAll("a");
        if(links.length >= 1){
            links.forEach((link)=>{
                link.setAttribute("target", "_blank");
            })
        }
        return content.body.innerHTML;
    }
}

//attemps to call a function multiple times should it fail
export const retry = async (callback, attemps = 0)=>{
    try{
        await callback();
    }
    catch(error){
        if(attemps <= 3){
            retry(callback, attemps+=1);
        }
        else{
             throw error;
        }
    }
}