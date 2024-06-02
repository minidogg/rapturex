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

    //get the pages data
    let index = await fetchData(url)

    //turn the html into a good boy.
    index = convertHtmlToGood(index,tab)
    console.log(index)

    tab.iframe.contentWindow.document.write(index) 

    let defaultStyle = tab.iframe.contentWindow.document.createElement("style")
    defaultStyle.innerHTML = defaultCss
    tab.iframe.contentWindow.document.body.appendChild(defaultStyle)
}

//convert bad html to good html
function convertHtmlToGood(html,tab){
    let newLineReplacer = "new_line_replacer_"+qquery.random.hex(16)
    html = html.replaceAll("\n",newLineReplacer)  

    while(/<link href="(.*?[^.css])">/.test(html)){
        let hrefLink = /<link\s+href="?(.*[^.css])"?>/.exec(html)
        // tab.tab.querySelector("img").src=hrefLink[0]
        html = html.replace(/<link href="(.*?[^.css])">/,"")
    }

    return html.replaceAll(newLineReplacer,"\n")
}