const supportedTags = [
    /*rapturex supported tags: */ "*",
    /*normal webX tags: */ "body","a","head", "title", "link", "meta", "script", "h1","h2","h3","h4","h5","h6", "div", "p", "ul", "ol", "li", "div", "button", "hr", "img", "input", "textarea", "button", "select", "option"
]

//default css
let defaultCss = ""
async function getDefaultCss(){
    if(defaultCss!="")return defaultCss
    defaultCss = await(await fetch("/default.css")).text()
    return defaultCss
}

//elements
const pagesEl = q("#pages");

//load tab contents
async function loadTab(tab){
    //regenerate iframe
    tab.iframe.remove()
    tab.iframe = document.createElement("iframe")
    tab.iframe.classList.add("page")
    pagesEl.appendChild(tab.iframe)

    //get the pages actual ip
    let url = await getDomainIp(tab.url)
    tab.trueUrl = url

    //get the pages data
    let index = await fetchData(url)
    console.log(index)

    //turn the html into a good boy.
    index = await convertHtmlToGood(index,tab)
    console.log(index)

    tab.iframe.contentWindow.document.write(index) 

    // let defaultStyle = tab.iframe.contentWindow.document.createElement("style")
    // defaultStyle.innerHTML = defaultCss
    // tab.iframe.contentWindow.document.body.appendChild(defaultStyle)
}

//convert bad html to good html
async function convertHtmlToGood(html,tab){
    let hasUsedDefaultCss = false;
    if(/<[\s\S]*?title*?[\s\S]*?>(.*?)<[\s\S]*\/[\s\S]*?title*?[\s\S]*?>/.test(html)){
        tab.tab.querySelector("span").textContent = /<[\s\S]*?title*?[\s\S]*?>(.*?)<[\s\S]*\/[\s\S]*?title*?[\s\S]*?>/.exec(html)[1]
    }

    //get favicon and load css
    while(/<link\s+href="?(.*\..+?)"?>/.test(html)){
        let link = /<link\s+href="?(.*\..+?)"?>/.exec(html)[1]
        let fileExt = /<link\s+href="?.*\.(.+?)"?>/.exec(html)[1]
        let replacer = ""
        switch(fileExt){
            case("css"):
            console.log(tab.trueUrl+"/"+link)
                let css = await fetchData(tab.trueUrl+"/"+ link)
                if(hasUsedDefaultCss==false){
                    hasUsedDefaultCss=true
                    let css2 = await(getDefaultCss())
                    replacer += `<style>${convertCssToGood(css2)}</style>`
                    console.log("loaded default css")
                }
                replacer += `<style>${convertCssToGood(css)}</style>`
                break;
            default:
                console.log("unrecognized link href file extension. rapturex is assuming it is a favicon.")
                tab.tab.querySelector("img").src=link
                break;
        }
        html = html.replace(/<link\s+href="?(.*\..+?)"?>/,replacer)
    }

    if(hasUsedDefaultCss==false){
        hasUsedDefaultCss=true
        let css2 = await(getDefaultCss())
        html.replace(/<[\s\S]*?body*?[\s\S]*?>/,`<body><style>${css2}</style>`)
    }

    return html.replace(`<script src="main.lua" />`,"")
}
function convertCssToGood(cssMinus){
    let css = cssMinus.replace(/\/\*[\s\S]*?\*\//g,"").replaceAll("\n"," ").split("")
    let resultCss = []
    let inRules = false
    while(typeof(css[0])!="undefined"){
        let char = css.shift()
        if(/[^\s\{\}]/.test(char)&&inRules==false){
            let chars = []
            chars.push(char)
            while(/[^\s\{\}]/.test(css[0])){
                chars.push(css.shift())
                if(css.length==0){
                    alert("Something went wrong when parsing CSS")
                    break
                }
            }
            if(!supportedTags.includes(chars.join("")))chars.unshift(".")
            chars.forEach(e=>resultCss.push(e))
            continue
        }

        resultCss.push(char)
        if(char=="{"){
            inRules = true;
            continue
        }
        if(char=="}"){
            inRules = false;
            continue
        }
    }


    return resultCss.join("");
}