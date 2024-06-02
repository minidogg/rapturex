const corsProxy = "https://corsproxy.io/?"
let requestCache = {}

//get repo from url
const urlToRepo = (url)=>repo = /^https:\/\/github\.com\/([\w-]+\/[A-Za-z0-9_.-]+)$/.exec(url)[1]

//get latest commit to github repo
async function getCommitSha(url,repo){
    let repoJson = JSON.parse(await fetchData("https://api.github.com/repos/"+repo))
    let defaultBranch = repoJson["default_branch"]

    let shaJson = JSON.parse(await fetchData(`https://api.github.com/repos/${repo.split("/")[0]}/${repo.split("/")[1]}/branches/${defaultBranch}`))
    

    return shaJson.commit.sha
}
//fetch file data
async function fetchData(url,type="text",proxy=corsProxy,cache=true){
    let res;

    if(requestCache[url]&&cache==true){
        res = requestCache[url]
    }else if(/^https:\/\/github\.com\/([\w-]+\/[A-Za-z0-9_.-]+)\/?/.test(url)){
        let repo = urlToRepo(url)
        let sha = await getCommitSha(url,repo)

        let urlPath = url.replace(/^https:\/\/github\.com\/([\w-]+\/[A-Za-z0-9_.-]+)\/?/,"")
        if(urlPath=="")urlPath="index.html"
        let fileUrl = "https://raw.githubusercontent.com/"+repo.split("/")[0]+"/"+repo.split("/")[1]+"/"+sha+"/"+urlPath
        console.log("Fetching file from "+fileUrl+" via a cors proxy")
        let fileData = await fetchData(fileUrl)
        res = fileData
    }else{
        res = (await (fetch(proxy+url))).text()
    }
    if(cache==true)requestCache[url] = res

    return type=="json"?JSON.parse(res):res
}

//get ip from webx domain
async function getDomainIp(domain){
    let name = domain.split(".")[0]
    let tld = domain.split(".")[1]
    let d = await(await fetch(`https://corsproxy.io/?https://api.buss.lol/domain/${name}/${tld}`)).json()

    return d.ip
}